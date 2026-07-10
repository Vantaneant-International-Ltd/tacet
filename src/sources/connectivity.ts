// "Your home is connected" — live, world-directed context about how this home touches the
// open web. Reads REAL adapter state (the source registry + the collected item cache), never
// hardcoded numbers. World-directed only (ADR-011/012): it describes the open web reachable
// from here, never the user's own activity — no personal analytics, no self-directed counts.
// Human labels only (W5): product/medium names, never protocol words.

import type { D1Database } from "@cloudflare/workers-types";
import { getState } from "./store";
import { DEFAULT_SEED } from "../openweb/sources/seed";
import atprotoSeeds from "./atproto/seeds.json";
import nostrRelays from "./nostr/relays.json";
import nostrSeeds from "./nostr/seeds.json";
import feedSeeds from "./feeds/seeds.json";

export interface ConnectivityFamily {
  adapter: string; // internal id (never shown)
  label: string; // human label shown in the UI
  watching: number; // how many places/accounts/relays this home watches
  collected: number; // recent posts gathered from this family (0 for the live-read family)
}

export interface Connectivity {
  families: ConnectivityFamily[];
  placesWatched: number; // total doorways watched across all families
  serversSeen: number; // distinct homes/servers present in the collected cache
  postsGathered: number; // recent posts currently held
  lastRefreshed: string | null; // ISO — when the home last looked
}

export async function getConnectivity(db?: D1Database): Promise<Connectivity> {
  let perAdapter = new Map<string, { posts: number }>();
  let feedsWatched = feedSeeds.length;
  let serversSeen = 0;
  let lastRefreshed: string | null = null;

  if (db) {
    try {
      const res = await db
        .prepare(`SELECT adapter, COUNT(*) AS posts FROM source_items GROUP BY adapter`)
        .all<{ adapter: string; posts: number }>();
      perAdapter = new Map((res.results ?? []).map((r) => [r.adapter, { posts: Number(r.posts) || 0 }]));
      const servers = await db.prepare(`SELECT COUNT(DISTINCT origin_id) AS n FROM source_items`).first<{ n: number }>();
      serversSeen = servers ? Number(servers.n) || 0 : 0;
      const fe = await db.prepare(`SELECT COUNT(*) AS n FROM feeds WHERE enabled = 1`).first<{ n: number }>();
      if (fe && Number(fe.n) > 0) feedsWatched = Number(fe.n);
      lastRefreshed = await getState(db, "last_refresh_at");
    } catch {
      /* an empty or missing store just yields zeros — the panel degrades calmly */
    }
  }

  const collected = (a: string) => perAdapter.get(a)?.posts ?? 0;
  const families: ConnectivityFamily[] = [
    { adapter: "activitypub", label: "Mastodon, Pixelfed & more", watching: DEFAULT_SEED.length, collected: collected("activitypub") },
    { adapter: "feeds", label: "Blogs, podcasts & video", watching: feedsWatched, collected: collected("feeds") },
    { adapter: "atproto", label: "Bluesky", watching: (atprotoSeeds as string[]).length, collected: collected("atproto") },
    { adapter: "nostr", label: "Nostr", watching: (nostrSeeds as string[]).length, collected: collected("nostr") },
  ];

  return {
    families,
    placesWatched: families.reduce((s, f) => s + f.watching, 0),
    serversSeen: serversSeen || (nostrRelays as string[]).length, // at minimum the relays we reach
    postsGathered: families.reduce((s, f) => s + f.collected, 0),
    lastRefreshed,
  };
}
