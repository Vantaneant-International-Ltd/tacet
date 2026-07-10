// The source-adapter contract. One normalization schema that every open-web source emits,
// and one interface every adapter implements — so ActivityPub, feeds, AT Protocol, and
// Nostr all reach Today the same way. See docs/06-decisions/ADR-017-source-adapters.md.
//
// Two hard laws hold at this boundary:
//   1. Protocol language never crosses it. The domain objects below carry human labels
//      only ("on Bluesky", "on Mastodon", a publication name) — never "ActivityPub",
//      "RSS", "relay", "AT-URI". The one internal exception is `Source.adapter`, a
//      provenance tag the UI never renders.
//   2. Everything is normalized to the SAME shape. Today merges NormalizedPost[] without
//      knowing or caring which adapter produced each item.

import type { Moment, Person, Source } from "../openweb/types";

// The normalized post every adapter emits. It IS the product's Moment: id, author (Person),
// text, media[], a canonical link (`url`), timestamps (ISO-8601 UTC), an optional
// conversation reference, and a Source describing where it lives. Reusing Moment means
// live ActivityPub content and cron-collected feed/Bluesky/Nostr content are
// indistinguishable to the UI — exactly the point.
export type NormalizedPost = Moment;
export type { Person, Source };

// Pull sources poll over HTTP; push sources open a socket. On Workers a cron cannot hold a
// long-lived subscription, so push adapters (Nostr) implement `fetchLatest` as a
// short-lived window: open, request since the cursor, collect, close.
export type Transport = "pull" | "push";

export interface HealthReport {
  ok: boolean;
  // Calm, human, developer-facing detail. This never reaches product UI, so protocol
  // words are fine here.
  detail: string;
  checkedAt: string; // ISO-8601 UTC
}

// Passed into a collection run. `now` is an injected clock (deterministic in tests); `db`
// is present when the adapter persists into the shared item store; `signal` bounds slow
// sources.
export interface CollectContext {
  now: number; // ms since epoch
  limitPerSource: number; // soft cap of items to pull per underlying seed/feed/account
  db?: D1Database;
  signal?: AbortSignal;
}

// The contract. `Raw` is the adapter's private, source-shaped item — it never escapes the
// module; `normalize` is the only thing that turns it into a NormalizedPost.
export interface SourceAdapter<Raw = unknown> {
  readonly id: string; // "activitypub" | "feeds" | "atproto" | "nostr"
  readonly transport: Transport;
  // A friendly, human network label for this adapter's content ("Mastodon" family sources
  // set their own per-home label; feeds use the publication name; Bluesky → "Bluesky";
  // Nostr → "Nostr"). Used as a default when a per-item label isn't more specific.
  readonly label: string;

  // Pull the latest raw items from every underlying source this adapter knows about.
  fetchLatest(ctx: CollectContext): Promise<Raw[]>;
  // Map one raw item to a NormalizedPost, or null to drop it (unrenderable/malformed).
  normalize(raw: Raw): NormalizedPost | null;
  // Is the source reachable right now? Best-effort, never throws.
  healthcheck(): Promise<HealthReport>;
}

// ── Shared helpers ───────────────────────────────────────────────────────────

// A canonical URL for dedup: lowercase host, no trailing slash, common tracking params
// stripped. Falls back to the raw string when it isn't a URL (e.g. a Nostr event id).
export function canonicalUrl(u: string): string {
  if (!u) return "";
  try {
    const url = new URL(u.trim());
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    for (const p of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|mc_|ref$|ref_src$|s$)/i.test(p)) url.searchParams.delete(p);
    }
    let out = url.toString();
    out = out.replace(/\/$/, "");
    return out;
  } catch {
    return u.trim();
  }
}

// The dedup key per the ADR: canonical URL first, then the item id. Same content reaching
// us from two sources (a boost, a cross-post, the same event on two relays) collapses.
export function dedupeKey(p: NormalizedPost): string {
  return (canonicalUrl(p.url) || p.id || "").toLowerCase();
}

export function dedupePosts(posts: NormalizedPost[]): NormalizedPost[] {
  const seen = new Set<string>();
  const out: NormalizedPost[] = [];
  for (const p of posts) {
    const k = dedupeKey(p);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

export function nowIso(now: number): string {
  return new Date(now).toISOString();
}

// Calm interleave for Today: recency-forward, but never a long run from one source. The only
// ranking signal is time — there is NO engagement weighting (ADR-011/012). Variety is a
// tiebreak that breaks up clusters, so a burst from one home doesn't crowd out the rest.
// Deterministic and finite: Today ENDS at `limit`, never an infinite feed.
export function calmInterleave(posts: NormalizedPost[], limit: number): NormalizedPost[] {
  const pool = [...posts].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const bucket = (p: NormalizedPost) => p.source?.adapter || p.source?.id || "";
  const out: NormalizedPost[] = [];
  let last = "";
  while (out.length < limit && pool.length > 0) {
    // Prefer the most-recent remaining item from a different source than the last one.
    let idx = pool.findIndex((p) => bucket(p) !== last);
    if (idx === -1) idx = 0; // only one source left — take it in order
    const [picked] = pool.splice(idx, 1);
    out.push(picked);
    last = bucket(picked);
  }
  return out;
}
