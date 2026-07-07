import type { AdapterResult, Moment, Person, DiscoverySource, AdapterError } from "./types";
import { mockMoments, mockPeople } from "./mock";

// The read-only open-web adapter facade. It fans out to the configured discovery
// sources, merges their DOMAIN objects (they never leak protocol shapes), and ALWAYS
// returns an AdapterResult — degrading live → cached → mock so the product never shows
// an error page. The UI renders the result and honestly labels its `mode`.
export { buildSources } from "./registry";
export type { OpenWebConfig } from "./registry";

const CACHE_TTL_MS = 60_000; // brief, best-effort per-isolate cache

type Entry<T> = { data: T; at: number };
const cache = new Map<string, Entry<unknown>>();

// Test-only: clear the best-effort cache so degradation tests start from a clean slate.
export function __resetOpenWebCache() {
  cache.clear();
}

function nowIso(ts: number): string {
  return new Date(ts).toISOString();
}

function toAdapterError(e: unknown): AdapterError {
  const msg = e instanceof Error ? e.message : String(e);
  if (/abort|timeout/i.test(msg)) return { code: "timeout", message: "the open web took too long to answer" };
  if (/unexpected shape|json|parse/i.test(msg)) return { code: "parse", message: "unrecognized data from the open web" };
  if (/unavailable/i.test(msg)) return { code: "unavailable", message: "no content available right now" };
  return { code: "network", message: "couldn't reach the open web" };
}

function fulfilled<T>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> {
  return r.status === "fulfilled";
}

function dedupe<T>(items: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    const k = key(it);
    if (k && !seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
}

// Generic live→cached→mock resolver, timestamped by an injected clock (deterministic in
// tests). Fetcher throws on total failure; we then serve cached, else labelled mock.
async function resolve<T>(key: string, fetcher: () => Promise<T>, fallback: T, now: number): Promise<AdapterResult<T>> {
  const cached = cache.get(key) as Entry<T> | undefined;
  if (cached && now - cached.at < CACHE_TTL_MS) {
    return { data: cached.data, mode: "cached", source: null, fetchedAt: nowIso(cached.at) };
  }
  try {
    const data = await fetcher();
    cache.set(key, { data, at: now });
    return { data, mode: "live", source: null, fetchedAt: nowIso(now) };
  } catch (e) {
    if (cached) {
      return { data: cached.data, mode: "cached", source: null, fetchedAt: nowIso(cached.at), error: toAdapterError(e) };
    }
    return { data: fallback, mode: "mock", source: null, fetchedAt: nowIso(now), error: toAdapterError(e) };
  }
}

export function getToday(sources: DiscoverySource[], limit: number, now: number): Promise<AdapterResult<Moment[]>> {
  return resolve(
    "today",
    async () => {
      const per = Math.max(6, Math.ceil(limit / Math.max(1, sources.length)) + 4);
      const settled = await Promise.allSettled(sources.map((s) => s.today(per)));
      const merged = dedupe(
        settled.filter(fulfilled).flatMap((r) => r.value),
        (m) => m.id || m.url,
      );
      merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      if (merged.length === 0) throw new Error("unavailable");
      return merged.slice(0, limit);
    },
    mockMoments,
    now,
  );
}

export function getPeople(sources: DiscoverySource[], limit: number, now: number): Promise<AdapterResult<Person[]>> {
  return resolve(
    "people",
    async () => {
      const per = Math.max(8, Math.ceil(limit / Math.max(1, sources.length)) + 4);
      const settled = await Promise.allSettled(sources.map((s) => s.people(per)));
      const merged = dedupe(
        settled.filter(fulfilled).flatMap((r) => r.value),
        (p) => p.id || p.handle,
      );
      if (merged.length === 0) throw new Error("unavailable");
      return merged.slice(0, limit);
    },
    mockPeople,
    now,
  );
}
