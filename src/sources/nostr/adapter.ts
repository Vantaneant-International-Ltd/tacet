// The Nostr adapter. Read-only across a few large public relays — no keys, no writes. Nostr
// is a "push" source (relay sockets), but a Worker on a cron cannot hold a long-lived
// subscription, so each refresh opens a SHORT-LIVED window per relay: connect, REQ since the
// last cursor, collect until EOSE (or a timeout), close. Event signatures are verified
// (Schnorr/secp256k1); identical events across relays are deduped by id. A misbehaving relay
// is skipped and reported — never allowed to block the cycle. Human label: "on Nostr". See
// ADR-017.

import { schnorr } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import type { SourceAdapter, NormalizedPost, HealthReport, CollectContext, Person, Source } from "../contract";
import { nowIso } from "../contract";
import { getState, setState } from "../store";
import { npubToHex, hexToBech32, noteId } from "./bech32";
import relayData from "./relays.json";
import seedData from "./seeds.json";

const RELAYS = relayData as string[];
const SEEDS = seedData as string[];
const WINDOW_MS = 4_000; // per-relay socket window
const MAX_NOTES = 40; // newest N verified notes per refresh
const DEFAULT_LOOKBACK_S = 3 * 86_400; // first run: last 3 days

const SOURCE_BASE: Source = { id: "nostr", name: "Nostr", url: "https://njump.me", software: "Nostr", adapter: "nostr", iconUrl: "https://njump.me/favicon.ico" };

interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number; // unix seconds
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}
interface ProfileMeta {
  name?: string;
  picture?: string;
  about?: string;
  nip05?: string;
  at: number;
}
export interface NostrRaw {
  event: NostrEvent;
  profile?: ProfileMeta;
}

// NIP-01 event id = sha256 of the canonical serialization; verify the Schnorr signature over
// it with the author's x-only pubkey. Any malformed field → not verified.
export function verifyEvent(e: NostrEvent): boolean {
  try {
    if (!e || typeof e.id !== "string" || typeof e.sig !== "string" || typeof e.pubkey !== "string") return false;
    const serialized = JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags ?? [], e.content ?? ""]);
    const id = bytesToHex(sha256(utf8ToBytes(serialized)));
    if (id !== e.id) return false;
    return schnorr.verify(e.sig, e.id, e.pubkey);
  } catch {
    return false;
  }
}

function parseProfile(content: string): Omit<ProfileMeta, "at"> {
  try {
    const j = JSON.parse(content) as Record<string, unknown>;
    return {
      name: (j.display_name as string) || (j.name as string) || undefined,
      picture: (j.picture as string) || undefined,
      about: (j.about as string) || undefined,
      nip05: (j.nip05 as string) || undefined,
    };
  } catch {
    return {};
  }
}

// Protocol tokens never reach rendered text: nostr: URIs and bare bech32 references fold
// away (the permalink already carries the reference). Media URLs are extracted separately.
const PROTOCOL_TOKEN_RE = /(?:\bnostr:[a-z0-9]+\b|\b(?:npub|note|nevent|naddr|nprofile)1[02-9ac-hj-np-z]{8,}\b)/gi;
export function stripProtocolTokens(text: string): string {
  return text.replace(PROTOCOL_TOKEN_RE, "").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

const MEDIA_RE = /(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif|webp|mp4|webm|mov|mp3|m4a|ogg))(?:\?[^\s]*)?/gi;
function extractMedia(text: string): NormalizedPost["media"] {
  const out: NormalizedPost["media"] = [];
  const seen = new Set<string>();
  for (const m of text.matchAll(MEDIA_RE)) {
    const url = m[0];
    if (seen.has(url)) continue;
    seen.add(url);
    const ext = m[1].split(".").pop()!.toLowerCase();
    const kind = /jpg|jpeg|png|gif|webp/.test(ext) ? "image" : /mp3|m4a|ogg/.test(ext) ? "audio" : "video";
    out.push({ url, kind, alt: "" });
  }
  return out;
}

// One short-lived relay window. Resolves with whatever arrived before EOSE or the timeout;
// never rejects for a slow/rude relay (it just yields fewer events).
async function fetchWindow(relayUrl: string, filters: unknown[], timeoutMs: number): Promise<NostrEvent[]> {
  const httpUrl = relayUrl.replace(/^ws:/i, "http:").replace(/^wss:/i, "https:");
  // Bound the UPGRADE handshake itself — without this, a stalled relay connection hangs the
  // whole refresh (the collect window's timer only starts after the socket opens).
  const resp = await fetch(httpUrl, { headers: { Upgrade: "websocket" }, signal: AbortSignal.timeout(timeoutMs) });
  const ws = resp.webSocket;
  if (!ws) throw new Error(`relay did not upgrade (status ${resp.status})`);
  ws.accept();
  const events: NostrEvent[] = [];
  const sub = "t";
  await new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      try { ws.close(); } catch { /* already closed */ }
      resolve();
    };
    const timer = setTimeout(finish, timeoutMs);
    ws.addEventListener("message", (ev: MessageEvent) => {
      try {
        const raw = typeof ev.data === "string" ? ev.data : ev.data instanceof ArrayBuffer ? new TextDecoder().decode(ev.data) : "";
        if (!raw) return;
        const msg = JSON.parse(raw);
        if (!Array.isArray(msg)) return;
        if (msg[0] === "EVENT" && msg[1] === sub && msg[2]) events.push(msg[2] as NostrEvent);
        else if (msg[0] === "EOSE") { clearTimeout(timer); finish(); }
      } catch { /* ignore a malformed frame */ }
    });
    ws.addEventListener("close", () => { clearTimeout(timer); finish(); });
    ws.addEventListener("error", () => { clearTimeout(timer); finish(); });
    try { ws.send(JSON.stringify(["REQ", sub, ...filters])); } catch { clearTimeout(timer); finish(); }
  });
  return events;
}

export class NostrAdapter implements SourceAdapter<NostrRaw> {
  readonly id = "nostr";
  readonly transport = "push" as const;
  readonly label = "Nostr";

  async fetchLatest(ctx: CollectContext): Promise<NostrRaw[]> {
    const authors = SEEDS.map(npubToHex).filter((h): h is string => !!h);
    if (authors.length === 0) return [];
    const since = await this.readSince(ctx.db, ctx.now);
    const filters = [
      { authors, kinds: [1], since, limit: 80 },
      { authors, kinds: [0], limit: authors.length * 2 }, // latest profile metadata (no `since`)
    ];

    const settled = await Promise.allSettled(RELAYS.map((r) => fetchWindow(r, filters, WINDOW_MS)));
    const all: NostrEvent[] = [];
    settled.forEach((s, i) => {
      if (s.status === "fulfilled") all.push(...s.value);
      // A bad relay must never block the cycle — skip it, but surface why in the logs.
      else console.warn(`[nostr] relay ${RELAYS[i]} skipped: ${s.reason instanceof Error ? s.reason.message : String(s.reason)}`);
    });

    // Dedup identical events across relays by id.
    const byId = new Map<string, NostrEvent>();
    for (const e of all) if (e && typeof e.id === "string" && !byId.has(e.id)) byId.set(e.id, e);
    const events = [...byId.values()];

    // Profiles: latest kind-0 per author.
    const profiles = new Map<string, ProfileMeta>();
    for (const e of events) {
      if (e.kind !== 0) continue;
      const prev = profiles.get(e.pubkey);
      if (!prev || e.created_at > prev.at) profiles.set(e.pubkey, { ...parseProfile(e.content), at: e.created_at });
    }

    // Verified kind-1 notes, newest first, capped.
    const notes = events
      .filter((e) => e.kind === 1 && verifyEvent(e))
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, MAX_NOTES);

    // Advance the cursor to the newest note we accepted.
    const maxTs = notes.reduce((m, e) => Math.max(m, e.created_at), since);
    if (ctx.db && maxTs > since) await setState(ctx.db, "nostr_since", String(maxTs), ctx.now);

    return notes.map((e) => ({ event: e, profile: profiles.get(e.pubkey) }));
  }

  normalize(raw: NostrRaw): NormalizedPost | null {
    const e = raw.event;
    const rawText = (e.content ?? "").trim();
    if (!rawText) return null;
    // Media extraction sees the original text; the rendered body is cleaned of protocol
    // tokens (nostr: URIs, bare bech32 strings) — the permalink carries the reference.
    const media = extractMedia(rawText);
    const text = stripProtocolTokens(rawText);
    if (!text && media.length === 0) return null;
    const npub = safeNpub(e.pubkey);
    const note = safeNote(e.id);
    const url = note ? `https://njump.me/${note}` : `https://njump.me/${e.id}`;
    const profileUrl = npub ? `https://njump.me/${npub}` : SOURCE_BASE.url;
    const p = raw.profile;
    // NIP-05 "_@domain" is the domain-identity convention — display as "@domain".
    const nip05 = p?.nip05?.replace(/^_@/, "");
    const author: Person = {
      id: profileUrl,
      name: p?.name || (npub ? npub.slice(0, 12) + "…" : "Someone on Nostr"),
      handle: nip05 ? `@${nip05}` : npub ? npub.slice(0, 12) + "…" : "nostr",
      avatarUrl: p?.picture ?? null,
      bio: p?.about ?? "",
      url: profileUrl,
      source: { ...SOURCE_BASE },
      verified: false,
    };
    return {
      id: e.id,
      author,
      text,
      createdAt: new Date(e.created_at * 1000).toISOString(),
      url,
      media,
      source: { ...SOURCE_BASE },
    };
  }

  async healthcheck(): Promise<HealthReport> {
    const at = nowIso(Date.now());
    const authors = SEEDS.map(npubToHex).filter((h): h is string => !!h);
    try {
      const events = await fetchWindow(RELAYS[0], [{ authors, kinds: [1], limit: 1 }], WINDOW_MS);
      return { ok: events.length > 0, detail: `${RELAYS[0]} → ${events.length} event(s)`, checkedAt: at };
    } catch (e) {
      return { ok: false, detail: `${RELAYS[0]} unreachable: ${e instanceof Error ? e.message : String(e)}`, checkedAt: at };
    }
  }

  private async readSince(db: D1Database | undefined, now: number): Promise<number> {
    const floor = Math.floor(now / 1000) - DEFAULT_LOOKBACK_S;
    if (!db) return floor;
    const raw = await getState(db, "nostr_since");
    const stored = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(stored) ? Math.max(stored, floor) : floor;
  }
}

function safeNpub(pubkeyHex: string): string | null {
  try { return hexToBech32("npub", pubkeyHex); } catch { return null; }
}
function safeNote(idHex: string): string | null {
  try { return noteId(idHex); } catch { return null; }
}
