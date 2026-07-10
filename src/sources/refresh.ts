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
const ADAPTER_BUDGET_MS = 25_000; // hard cap per adapter — one slow source can't hang the cycle

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)),
  ]);
}

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
        const raw = await withTimeout(a.fetchLatest({ now, limitPerSource: PER_SOURCE, db }), ADAPTER_BUDGET_MS, a.id);
        const posts = raw.map((r) => a.normalize(r)).filter((p): p is NonNullable<typeof p> => p !== null);
        const stored = await writeItems(db, a.id, posts, now);
        perAdapter[a.id] = { fetched: raw.length, stored };
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        perAdapter[a.id] = { fetched: 0, stored: 0, error };
        console.warn(`[sources] ${a.id} refresh failed: ${error}`);
      }
    }),
  );

  try { await pruneOld(db, now); } catch { /* pruning is housekeeping; never fail the cycle */ }
  const report: RefreshReport = { ran: true, at, perAdapter };
  // Persist the last report for durable diagnostics (readable via D1; never user-facing).
  try { await setState(db, "last_refresh_report", JSON.stringify(perAdapter), now); } catch { /* diagnostics only */ }
  return report;
}
