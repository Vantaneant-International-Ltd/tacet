import type { Moment, Person } from "./types";
import type { APObject, APActivity, APActor } from "./activitypub/apmodel";
import { normalizeObject, normalizePerson } from "./normalize";

// Turn outbox ACTIVITIES into a complete, authoritative timeline. Unlike the cheap feed
// path, this RESOLVES what's missing: a Create/Announce whose object is a bare URL is
// fetched, and each post's real author is resolved (not assumed to be the outbox owner) —
// so boosts and non-embedded posts appear correctly. Bounded network resolution keeps it
// fast; embedded objects cost nothing. Read-only, generic across implementations.

// The client surface this needs — typed structurally so it's testable with a fake.
export interface ResolveSource {
  getObject(url: string): Promise<APObject>;
  getActor(handleOrUrl: string): Promise<APActor>;
}

export interface TimelineOptions {
  cap: number; // max posts to return
  netBudget: number; // max reference-only object fetches (latency guard)
}

async function resolveAuthoredMoment(client: ResolveSource, obj: APObject, actorCache: Map<string, Person>): Promise<Moment | null> {
  let fallback: Person | undefined;
  if (typeof obj.attributedTo === "string" && obj.attributedTo) {
    fallback = actorCache.get(obj.attributedTo);
    if (!fallback) {
      try {
        fallback = normalizePerson(await client.getActor(obj.attributedTo));
        actorCache.set(obj.attributedTo, fallback);
      } catch {
        /* author unresolved — normalizeObject may still succeed if embedded */
      }
    }
  }
  return normalizeObject(obj, fallback);
}

export async function assembleTimeline(
  client: ResolveSource,
  activities: APActivity[],
  owner: APActor,
  opts: TimelineOptions,
): Promise<Moment[]> {
  const actorCache = new Map<string, Person>();
  const objCache = new Map<string, APObject>();
  // Seed the owner so their own embedded posts never trigger an author fetch.
  const ownerPerson = normalizePerson(owner);
  if (owner.id) actorCache.set(owner.id, ownerPerson);
  if (owner.url) actorCache.set(owner.url, ownerPerson);

  let net = opts.netBudget;
  const out: Moment[] = [];

  for (const act of activities) {
    if (out.length >= opts.cap) break;

    // Resolve the activity's object (embedded, cached, or fetched within budget).
    let obj: APObject | null = null;
    if (act.object && typeof act.object !== "string") {
      obj = act.object;
    } else if (typeof act.object === "string") {
      obj = objCache.get(act.object) ?? null;
      if (!obj) {
        if (net <= 0) continue; // over the fetch budget — skip reference-only
        try {
          obj = await client.getObject(act.object);
          objCache.set(act.object, obj);
          net--;
        } catch {
          continue;
        }
      }
    }
    if (!obj) continue;

    if (act.types.includes("Announce")) {
      const m = await resolveAuthoredMoment(client, obj, actorCache);
      if (m) {
        m.sharedBy = ownerPerson; // reached us because the profile's owner shared it
        out.push(m);
      }
    } else if (act.types.includes("Create") || act.types.includes("Update")) {
      const m = await resolveAuthoredMoment(client, obj, actorCache);
      if (m) out.push(m);
    }
  }
  return out;
}
