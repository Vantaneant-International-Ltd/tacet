// The shared D1 item store behind the collectors (feeds, AT Protocol, Nostr). Collectors
// write NormalizedPosts here; Today reads them back and merges with the live ActivityPub
// reader. One store, one schema, dedup by canonical key — see ADR-017.

import type { NormalizedPost } from "./contract";
import { dedupeKey, canonicalUrl, nowIso } from "./contract";

const MAX_AGE_DAYS = 30; // items older than this are pruned on refresh
const READ_CAP = 400; // hard ceiling on rows Today ever pulls back

// Persist a batch of normalized posts. Keyed by canonical dedup key, so the same content
// arriving from two sources (or twice) collapses. An existing item's snapshot is refreshed
// (post_json, fetched_at) but its original created_at is preserved so recency stays stable.
export async function writeItems(db: D1Database, adapter: string, posts: NormalizedPost[], now: number): Promise<number> {
  const fetchedAt = nowIso(now);
  const seen = new Set<string>();
  const rows = posts
    .map((p) => {
      const key = dedupeKey(p);
      if (!key || seen.has(key)) return null;
      seen.add(key);
      const url = canonicalUrl(p.url) || p.url || p.id;
      const createdAt = normalizeTs(p.createdAt, fetchedAt);
      const origin = p.source?.id ?? null;
      // Store the post with its canonical URL so every card links to a clean permalink and
      // the stored url matches the dedup key.
      return { key, url, createdAt, origin, json: JSON.stringify({ ...p, url }) };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  if (rows.length === 0) return 0;

  const stmt = db.prepare(
    `INSERT INTO source_items (key, adapter, origin_id, url, created_at, fetched_at, post_json)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT(key) DO UPDATE SET
       post_json = excluded.post_json,
       fetched_at = excluded.fetched_at,
       url = excluded.url`,
  );
  await db.batch(rows.map((r) => stmt.bind(r.key, adapter, r.origin, r.url, r.createdAt, fetchedAt, r.json)));
  return rows.length;
}

// Recent items across all collectors (or a subset), newest first, ready for the UI.
export async function readRecent(db: D1Database, opts: { limit: number; adapters?: string[] } = { limit: 60 }): Promise<NormalizedPost[]> {
  const limit = Math.min(READ_CAP, Math.max(1, opts.limit));
  let sql = `SELECT post_json FROM source_items`;
  const binds: unknown[] = [];
  if (opts.adapters && opts.adapters.length) {
    sql += ` WHERE adapter IN (${opts.adapters.map(() => "?").join(",")})`;
    binds.push(...opts.adapters);
  }
  sql += ` ORDER BY created_at DESC LIMIT ?`;
  binds.push(limit);
  const res = await db.prepare(sql).bind(...binds).all<{ post_json: string }>();
  const out: NormalizedPost[] = [];
  for (const row of res.results ?? []) {
    try {
      out.push(JSON.parse(row.post_json) as NormalizedPost);
    } catch {
      /* skip a corrupt row rather than fail the read */
    }
  }
  return out;
}

// Drop items older than the retention window. Keeps the store bounded; called on refresh.
export async function pruneOld(db: D1Database, now: number): Promise<void> {
  const cutoff = nowIso(now - MAX_AGE_DAYS * 86_400_000);
  await db.prepare(`DELETE FROM source_items WHERE created_at < ?`).bind(cutoff).run();
}

// ── refresh coordination (key/value) ────────────────────────────────────────

export async function getState(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare(`SELECT value FROM source_state WHERE key = ?`).bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

export async function setState(db: D1Database, key: string, value: string, now: number): Promise<void> {
  await db
    .prepare(`INSERT INTO source_state (key, value, updated_at) VALUES (?1, ?2, ?3)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
    .bind(key, value, nowIso(now))
    .run();
}

// A crude single-flight lock so overlapping lazy refreshes don't stampede the sources.
// Returns true if the caller acquired the lock (i.e. no refresh ran within `windowMs`).
export async function tryAcquireRefreshLock(db: D1Database, now: number, windowMs: number): Promise<boolean> {
  const last = await getState(db, "last_refresh_at");
  if (last) {
    const t = Date.parse(last);
    if (Number.isFinite(t) && now - t < windowMs) return false;
  }
  await setState(db, "last_refresh_at", nowIso(now), now);
  return true;
}

// Coerce a timestamp to ISO-8601 UTC, falling back to `fallback` when unparseable.
function normalizeTs(ts: string | undefined, fallback: string): string {
  if (!ts) return fallback;
  const t = Date.parse(ts);
  if (!Number.isFinite(t)) return fallback;
  return new Date(t).toISOString();
}
