// The refresh cycle: run every collector adapter, normalize what it pulled, and write it to
// the shared D1 store. Driven by a cron trigger (scheduled handler) and, lazily, by the
// first Today read after the store goes stale. Idempotent and single-flight-guarded so
// overlapping triggers don't stampede the sources. Never throws — a bad source is reported
// and skipped, never allowed to block the others (a hard rule for Nostr especially).

import { collectorAdapters, type SourcesConfig } from "./registry";
import { writeItems, pruneOld, tryAcquireRefreshLock, setState } from "./store";
import { nowIso } from "./contract";

export interface AdapterOutcome {
  fetched: number;
  stored: number;
  error?: string;
}
export interface RefreshReport {
  ran: boolean;
  at: string;
  perAdapter: Record<string, AdapterOutcome>;
}

const LOCK_WINDOW_MS = 60_000; // don't start a fresh cycle within a minute of the last
const PER_SOURCE = 8;

export async function refreshAllSources(cfg: SourcesConfig, now: number, opts: { force?: boolean } = {}): Promise<RefreshReport> {
  const db = cfg.db;
  const at = nowIso(now);
  if (!db) return { ran: false, at, perAdapter: {} };

  if (opts.force) {
    await setState(db, "last_refresh_at", at, now);
  } else if (!(await tryAcquireRefreshLock(db, now, LOCK_WINDOW_MS))) {
    return { ran: false, at, perAdapter: {} };
  }

  const adapters = collectorAdapters(cfg);
  const perAdapter: Record<string, AdapterOutcome> = {};
  await Promise.all(
    adapters.map(async (a) => {
      try {
        const raw = await a.fetchLatest({ now, limitPerSource: PER_SOURCE, db });
        const posts = raw.map((r) => a.normalize(r)).filter((p): p is NonNullable<typeof p> => p !== null);
        const stored = await writeItems(db, a.id, posts, now);
        perAdapter[a.id] = { fetched: raw.length, stored };
      } catch (e) {
        perAdapter[a.id] = { fetched: 0, stored: 0, error: e instanceof Error ? e.message : String(e) };
      }
    }),
  );

  try { await pruneOld(db, now); } catch { /* pruning is housekeeping; never fail the cycle */ }
  return { ran: true, at, perAdapter };
}
