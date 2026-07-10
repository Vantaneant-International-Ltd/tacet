// The Today merge: blend the live ActivityPub result (untouched reader) with the
// cron-collected items (feeds, Bluesky, Nostr) read from D1 — all one NormalizedPost shape,
// so they dedupe by canonical URL and interleave calmly (recency + source variety, never
// engagement). Pure and deterministic, so it's unit-tested without any network.

import type { AdapterResult, Moment } from "../openweb/types";
import { dedupePosts, calmInterleave } from "./contract";

// Tag live ActivityPub moments with their adapter so the interleave treats "the open social
// web" as one source bucket (varied against feeds / Bluesky / Nostr), and so provenance is
// uniform across every card.
export function stampActivityPub(m: Moment): Moment {
  if (m.source && !m.source.adapter) m.source.adapter = "activitypub";
  if (m.author?.source && !m.author.source.adapter) m.author.source.adapter = "activitypub";
  return m;
}

export function mergeTodayResult(apResult: AdapterResult<Moment[]>, collected: Moment[], limit: number): AdapterResult<Moment[]> {
  // If ActivityPub degraded to sample content and nothing was collected, keep the honest
  // mock result. Otherwise blend only real content.
  const apReal = apResult.mode === "mock" ? [] : apResult.data.map(stampActivityPub);
  const merged = calmInterleave(dedupePosts([...apReal, ...collected]), limit);
  if (merged.length === 0) return apResult;
  const mode: AdapterResult<Moment[]>["mode"] = apResult.mode === "live" || collected.length > 0 ? "live" : apResult.mode;
  return { data: merged, mode, source: apResult.source, fetchedAt: apResult.fetchedAt, error: apResult.error };
}
