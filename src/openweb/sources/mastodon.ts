import type { DiscoverySource, Source, Person, Moment, OpenWebProfile, OpenWebContent } from "../types";
import { toPlainText } from "../text";

// A vendor discovery SHIM, quarantined here. ActivityPub has no discovery, and Mastodon
// exposes lively public discovery via its own REST API (trending posts, a profile
// directory). This source uses that REST API and maps its responses to Tacet domain
// objects — its Mastodon-specific field knowledge never escapes this file. It is
// optional: remove it and the generic SeedSource still works everywhere.
export { toPlainText };

const TIMEOUT_MS = 8000;

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
    verified: false,
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
    counts: raw.counts,
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

export class MastodonSource implements DiscoverySource {
  readonly id = "mastodon";
  readonly source: Source;
  private readonly host: string;

  constructor(host: string) {
    this.host = host.replace(/^https?:\/\//, "").replace(/\/$/, "");
    this.source = { id: this.host, name: this.host, url: `https://${this.host}` };
  }

  async today(limit: number): Promise<Moment[]> {
    // Trending posts — a curated, calm, public set. Fall back to the public timeline.
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
        const status = s.reblog ?? s;
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
          counts: {
            reactions: typeof status.favourites_count === "number" ? status.favourites_count : undefined,
            replies: typeof status.replies_count === "number" ? status.replies_count : undefined,
            shares: typeof status.reblogs_count === "number" ? status.reblogs_count : undefined,
          },
        };
        return mapContent(content, this.source, this.host);
      })
      .filter((m) => m.text.length > 0 || m.media.length > 0);
  }

  async people(limit: number): Promise<Person[]> {
    const url = `${this.source.url}/api/v1/directory?limit=${limit}&order=active&local=false`;
    const raw = (await getJson(url)) as any[];
    if (!Array.isArray(raw)) throw new Error("unexpected shape from source");
    return raw.filter((a) => a && !a.bot).map((a) => mapProfile(toProfile(a), this.source, this.host));
  }
}
