import type { AdapterResult, Moment, Person, Source, DiscoverySource, AdapterError } from "./types";
import { mockMoments, mockPeople } from "./mock";
import { softwareOf } from "./activitypub/nodeinfo";
import { ApClient } from "./activitypub/client";
import { normalizePerson } from "./normalize";
import type { RequestSigner } from "./activitypub/signing";
import { buildConversation } from "./conversation";
import { assembleTimeline } from "./resolve";
import type { Conversation, ConversationNode } from "./types";

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

// Attribute where content lives by resolving each home's software (nodeinfo), then
// stamping it onto the Source objects the UI already carries. Best-effort and graceful:
// unknown homes simply get no badge. This is the ONLY place attribution is computed —
// the UI just reads `source.software`.
async function enrichSoftware(sourcesPerItem: Source[][]): Promise<void> {
  const hosts = new Set<string>();
  for (const group of sourcesPerItem) for (const s of group) if (s.id) hosts.add(s.id);
  const labels = new Map<string, string | undefined>();
  await Promise.all([...hosts].map(async (h) => labels.set(h, await softwareOf(h))));
  for (const group of sourcesPerItem) {
    for (const s of group) {
      const sw = labels.get(s.id);
      if (sw) s.software = sw;
    }
  }
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
      const top = merged.slice(0, limit);
      try {
        await enrichSoftware(top.map((m) => [m.source, m.author.source, ...(m.sharedBy ? [m.sharedBy.source] : [])]));
      } catch {
        /* attribution is best-effort; never fail the result */
      }
      return top;
    },
    mockMoments,
    now,
  );
}

// A single person's profile: their canonical actor plus recent public posts, all read
// through the generic ActivityPub core and normalized to domain objects. Read-only. The
// caller passes an actor URL or an @user@home handle. Never throws — a failure yields a
// null profile the UI shows as a calm error state (no mock person makes sense here).
export interface ProfileResult {
  profile: Person | null;
  posts: Moment[];
  source: Source | null;
  error?: AdapterError;
}

const profileCache = new Map<string, Entry<ProfileResult>>();
const PROFILE_TTL_MS = 90_000;

export async function getProfile(actorRef: string, signer?: RequestSigner, now: number = Date.now()): Promise<ProfileResult> {
  const cached = profileCache.get(actorRef);
  if (cached && now - cached.at < PROFILE_TTL_MS) return cached.data;
  try {
    const client = new ApClient(signer);
    const actor = await client.getActor(actorRef);
    const profile = normalizePerson(actor);

    // Public counts + the timeline, in parallel. Each degrades independently: a home that
    // hides a collection simply leaves that count unknown (never fabricated as zero).
    const [followers, following, posts, timeline] = await Promise.all([
      actor.followers ? client.getCollectionTotal(actor.followers).catch(() => undefined) : Promise.resolve(undefined),
      actor.following ? client.getCollectionTotal(actor.following).catch(() => undefined) : Promise.resolve(undefined),
      actor.outbox ? client.getCollectionTotal(actor.outbox).catch(() => undefined) : Promise.resolve(undefined),
      (async () => {
        try {
          const activities = await client.getOutbox(actor, 40);
          return await assembleTimeline(client, activities, actor, { cap: 30, netBudget: 14 });
        } catch {
          return [] as Moment[];
        }
      })(),
    ]);
    const c: NonNullable<Person["counts"]> = {};
    if (typeof followers === "number") c.followers = followers;
    if (typeof following === "number") c.following = following;
    if (typeof posts === "number") c.posts = posts;
    if (Object.keys(c).length) profile.counts = c;

    try {
      const sw = await softwareOf(profile.source.id);
      if (sw) {
        profile.source.software = sw;
        for (const p of timeline) {
          if (p.source.id === profile.source.id) p.source.software = sw;
          if (p.author.source.id === profile.source.id) p.author.source.software = sw;
        }
      }
    } catch {
      /* attribution is best-effort */
    }
    const result: ProfileResult = { profile, posts: timeline, source: profile.source };
    profileCache.set(actorRef, { data: result, at: now });
    return result;
  } catch (e) {
    return { profile: null, posts: [], source: null, error: toAdapterError(e) };
  }
}

// A read conversation around a post. Reuses the generic ActivityPub core to assemble a
// threaded domain object, then attributes each home's software. Read-only; never throws
// (a failure yields a null conversation the UI shows calmly).
export interface ConversationResult {
  conversation: Conversation | null;
  error?: AdapterError;
}

export async function getConversation(postRef: string, signer?: RequestSigner): Promise<ConversationResult> {
  try {
    const conversation = await buildConversation(new ApClient(signer), postRef);
    if (!conversation) return { conversation: null, error: { code: "unavailable", message: "this conversation couldn't be read" } };
    // Attribute software for every home that appears (best-effort).
    const groups: Source[][] = [];
    const push = (m: Moment) => groups.push([m.source, m.author.source]);
    conversation.ancestors.forEach(push);
    push(conversation.focus);
    const walk = (nodes: ConversationNode[]) => nodes.forEach((n) => { push(n.post); walk(n.replies); });
    walk(conversation.replies);
    groups.push(conversation.participants.map((p) => p.source));
    try {
      await enrichSoftware(groups);
    } catch {
      /* attribution best-effort */
    }
    return { conversation };
  } catch (e) {
    return { conversation: null, error: toAdapterError(e) };
  }
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
      const top = merged.slice(0, limit);
      try {
        await enrichSoftware(top.map((p) => [p.source]));
      } catch {
        /* attribution is best-effort; never fail the result */
      }
      return top;
    },
    mockPeople,
    now,
  );
}
