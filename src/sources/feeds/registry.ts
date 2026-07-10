// The feed registry in D1: which feeds we poll, and the conditional-fetch + backoff state
// that keeps polling cheap and polite. Seeded once from seeds.json; thereafter self-editing
// (a feed the operator adds to the DB is polled like any other).

import { nowIso } from "../contract";

export interface FeedSeed {
  url: string;
  title?: string;
  kind?: string; // blog | news | podcast | video | forum
  site?: string;
}

export interface FeedRow {
  id: string;
  url: string;
  title: string | null;
  site_url: string | null;
  icon_url: string | null;
  kind: string;
  etag: string | null;
  last_modified: string | null;
}

const BASE_INTERVAL_MS = 30 * 60_000; // healthy feeds are polled at most every ~30 min
const MAX_BACKOFF_MS = 24 * 60 * 60_000; // failing feeds back off to at most once a day

// A short, stable id derived from the URL (djb2), so re-seeding is idempotent.
export function feedId(url: string): string {
  let h = 5381;
  for (let i = 0; i < url.length; i++) h = ((h << 5) + h + url.charCodeAt(i)) >>> 0;
  return "f_" + h.toString(16).padStart(8, "0");
}

// Insert any seed feeds not already present. Never overwrites live registry state.
export async function ensureSeeded(db: D1Database, seeds: FeedSeed[], now: number): Promise<void> {
  const at = nowIso(now);
  const stmt = db.prepare(
    `INSERT INTO feeds (id, url, title, site_url, kind, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6)
     ON CONFLICT(url) DO NOTHING`,
  );
  await db.batch(seeds.filter((s) => s.url).map((s) => stmt.bind(feedId(s.url), s.url, s.title ?? null, s.site ?? null, s.kind ?? "blog", at)));
}

// Feeds that are enabled and due (backoff window elapsed), newest-failing last.
export async function listDueFeeds(db: D1Database, now: number, cap: number): Promise<FeedRow[]> {
  const at = nowIso(now);
  const res = await db
    .prepare(
      `SELECT id, url, title, site_url, icon_url, kind, etag, last_modified
       FROM feeds
       WHERE enabled = 1 AND (next_earliest_at IS NULL OR next_earliest_at <= ?1)
       ORDER BY failure_count ASC, last_fetched_at ASC NULLS FIRST
       LIMIT ?2`,
    )
    .bind(at, cap)
    .all<FeedRow>();
  return res.results ?? [];
}

// Record a successful poll: refresh conditional-fetch headers + discovered metadata, reset
// backoff, schedule the next poll one base interval out.
export async function recordSuccess(
  db: D1Database,
  id: string,
  fields: { etag?: string | null; lastModified?: string | null; title?: string | null; iconUrl?: string | null; siteUrl?: string | null; status: number },
  now: number,
): Promise<void> {
  await db
    .prepare(
      `UPDATE feeds SET
         etag = ?2, last_modified = ?3,
         title = COALESCE(?4, title), icon_url = COALESCE(?5, icon_url), site_url = COALESCE(?6, site_url),
         last_fetched_at = ?7, last_status = ?8, failure_count = 0, next_earliest_at = ?9
       WHERE id = ?1`,
    )
    .bind(
      id,
      fields.etag ?? null,
      fields.lastModified ?? null,
      fields.title ?? null,
      fields.iconUrl ?? null,
      fields.siteUrl ?? null,
      nowIso(now),
      fields.status,
      nowIso(now + BASE_INTERVAL_MS),
    )
    .run();
}

// Record a 304 Not Modified: nothing changed, just push the next poll out one interval.
export async function recordNotModified(db: D1Database, id: string, now: number): Promise<void> {
  await db
    .prepare(`UPDATE feeds SET last_fetched_at = ?2, last_status = 304, failure_count = 0, next_earliest_at = ?3 WHERE id = ?1`)
    .bind(id, nowIso(now), nowIso(now + BASE_INTERVAL_MS))
    .run();
}

// Record a failure: exponential backoff on next_earliest_at, capped.
export async function recordFailure(db: D1Database, id: string, status: number, failureCount: number, now: number): Promise<void> {
  const backoff = Math.min(BASE_INTERVAL_MS * Math.pow(2, failureCount), MAX_BACKOFF_MS);
  await db
    .prepare(`UPDATE feeds SET last_fetched_at = ?2, last_status = ?3, failure_count = failure_count + 1, next_earliest_at = ?4 WHERE id = ?1`)
    .bind(id, nowIso(now), status, nowIso(now + backoff))
    .run();
}
