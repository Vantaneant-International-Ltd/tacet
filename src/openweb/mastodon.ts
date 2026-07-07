import type {
  OpenWebSource,
  Source,
  Person,
  Moment,
  OpenWebProfile,
  OpenWebContent,
} from "./types";

// The one place that knows an actual open-web protocol/API. It speaks the public,
// unauthenticated read endpoints of a Mastodon-compatible home and normalizes them
// into Tacet domain types. Swapping this class for another `OpenWebSource` (a
// different protocol) would change nothing above it — that is the point.

const TIMEOUT_MS = 8000;

// Strip markup to calm plain text. We never render source HTML; we show words.
export function toPlainText(html: string): string {
  return html
    .replace(/<\/(p|br|div)>/gi, "\n")
    .replace(/<br\s*\/?>(?=)/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Build a full @user@home handle from what the source reports (which may be a bare
// username for a local person, or user@home for someone whose home is elsewhere).
export function normalizeHandle(acct: string, host: string): string {
  const a = acct.replace(/^@/, "");
  return a.includes("@") ? `@${a}` : `@${a}@${host}`;
}

export function mapProfile(raw: OpenWebProfile, source: Source, host: string): Person {
  return {
    id: raw.url || raw.id,
    name: raw.displayName?.trim() || raw.acct,
    handle: normalizeHandle(raw.acct, host),
    avatarUrl: raw.avatar || null,
    bio: toPlainText(raw.note || ""),
    url: raw.url,
    source,
    verified: false, // we do not assert identity verification for external people
  };
}

export function mapContent(raw: OpenWebContent, source: Source, host: string): Moment {
  return {
    id: raw.url || raw.id,
    author: mapProfile(raw.account, source, host),
    text: toPlainText(raw.contentHtml || ""),
    createdAt: raw.createdAt,
    url: raw.url,
    media: (raw.attachments || []).map((m) => ({
      url: m.url,
      kind: m.type === "image" ? "image" : m.type === "video" || m.type === "gifv" ? "video" : "other",
      alt: m.description || "",
    })),
    source,
  };
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "Tacet (+https://tacet.social)" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cf: { cacheTtl: 60, cacheEverything: true },
  } as RequestInit);
  if (!res.ok) throw new Error(`source responded ${res.status}`);
  return res.json();
}

export class MastodonSource implements OpenWebSource {
  readonly source: Source;
  private readonly host: string;

  constructor(host: string) {
    this.host = host.replace(/^https?:\/\//, "").replace(/\/$/, "");
    this.source = { id: this.host, name: this.host, url: `https://${this.host}` };
  }

  async fetchToday(limit: number): Promise<Moment[]> {
    // Prefer trending posts — a curated, calm, finite set that feels human, and a
    // public endpoint. Fall back to the public timeline where a home exposes it.
    let raw: any[] = [];
    try {
      raw = (await getJson(`${this.source.url}/api/v1/trends/statuses?limit=${limit}`)) as any[];
    } catch {
      raw = [];
    }
    if (!Array.isArray(raw) || raw.length === 0) {
      raw = (await getJson(`${this.source.url}/api/v1/timelines/public?limit=${limit}&local=false`)) as any[];
    }
    if (!Array.isArray(raw)) throw new Error("unexpected shape from source");
    return raw
      .filter((s) => s && s.account && !s.account.bot && (s.content || s.reblog))
      .map((s) => {
        const status = s.reblog ?? s; // surface the underlying post for boosts
        const content: OpenWebContent = {
          id: String(status.id),
          contentHtml: status.content ?? "",
          createdAt: status.created_at ?? new Date(0).toISOString(),
          url: status.url ?? status.uri ?? "",
          account: toProfile(status.account),
          attachments: (status.media_attachments ?? []).map((m: any) => ({
            url: m.preview_url || m.url,
            type: m.type,
            description: m.description ?? null,
          })),
        };
        return mapContent(content, this.source, this.host);
      })
      .filter((m) => m.text.length > 0 || m.media.length > 0);
  }

  async discoverPeople(limit: number): Promise<Person[]> {
    const url = `${this.source.url}/api/v1/directory?limit=${limit}&order=active&local=false`;
    const raw = (await getJson(url)) as any[];
    if (!Array.isArray(raw)) throw new Error("unexpected shape from source");
    return raw.filter((a) => a && !a.bot).map((a) => mapProfile(toProfile(a), this.source, this.host));
  }
}

function toProfile(a: any): OpenWebProfile {
  return {
    id: String(a.id),
    displayName: a.display_name ?? "",
    acct: a.acct ?? a.username ?? "",
    avatar: a.avatar ?? a.avatar_static ?? null,
    note: a.note ?? "",
    url: a.url ?? "",
    bot: !!a.bot,
  };
}
