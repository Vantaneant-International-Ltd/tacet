import type { AdapterResult, Moment, Person, OpenWebSource, AdapterError } from "./types";
import { MastodonSource } from "./mastodon";
import { mockMoments, mockPeople } from "./mock";

// The read-only open-web adapter facade. Responsibilities: pick a source, fetch,
// normalize (done by the source), cache briefly, and ALWAYS return a domain result —
// degrading live → cached → mock so the product never shows an error page. The UI
// renders the result and honestly labels its `mode`.

const DEFAULT_HOME = "mastodon.social";
const CACHE_TTL_MS = 60_000; // brief, best-effort per-isolate cache

// Choose the source. Today this is a Mastodon-compatible home; it is the only place
// the concrete protocol is named. `OPENWEB_INSTANCE` can point at another home.
export function makeSource(instance?: string): OpenWebSource {
  return new MastodonSource(instance || DEFAULT_HOME);
}

type Entry<T> = { data: T; at: number };
const cache = new Map<string, Entry<unknown>>();

function nowIso(ts: number): string {
  return new Date(ts).toISOString();
}

function toAdapterError(e: unknown): AdapterError {
  const msg = e instanceof Error ? e.message : String(e);
  if (/abort|timeout/i.test(msg)) return { code: "timeout", message: "the open web took too long to answer" };
  if (/unexpected shape|json|parse/i.test(msg)) return { code: "parse", message: "unrecognized data from the open web" };
  return { code: "network", message: "couldn't reach the open web" };
}

// Generic live→cached→mock resolver, timestamped by an injected clock so it is
// deterministic in tests (Workers/Date usage stays explicit).
async function resolve<T>(
  key: string,
  fetcher: () => Promise<T>,
  fallback: T,
  source: OpenWebSource | null,
  now: number,
): Promise<AdapterResult<T>> {
  const cached = cache.get(key) as Entry<T> | undefined;
  if (cached && now - cached.at < CACHE_TTL_MS) {
    return { data: cached.data, mode: "cached", source: source?.source ?? null, fetchedAt: nowIso(cached.at) };
  }
  try {
    const data = await fetcher();
    if (!data || (Array.isArray(data) && data.length === 0)) throw new Error("unavailable: empty");
    cache.set(key, { data, at: now });
    return { data, mode: "live", source: source?.source ?? null, fetchedAt: nowIso(now) };
  } catch (e) {
    if (cached) {
      return {
        data: cached.data,
        mode: "cached",
        source: source?.source ?? null,
        fetchedAt: nowIso(cached.at),
        error: toAdapterError(e),
      };
    }
    return { data: fallback, mode: "mock", source: null, fetchedAt: nowIso(now), error: toAdapterError(e) };
  }
}

export function getToday(source: OpenWebSource, limit: number, now: number): Promise<AdapterResult<Moment[]>> {
  return resolve(`today:${source.source.id}`, () => source.fetchToday(limit), mockMoments, source, now);
}

export function getPeople(source: OpenWebSource, limit: number, now: number): Promise<AdapterResult<Person[]>> {
  return resolve(`people:${source.source.id}`, () => source.discoverPeople(limit), mockPeople, source, now);
}
