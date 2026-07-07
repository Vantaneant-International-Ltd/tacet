import type { DiscoverySource } from "./types";
import { MastodonSource } from "./sources/mastodon";
import { SeedSource } from "./sources/seed";

// Which discovery sources feed the product. Order matters only for merge preference.
// The generic SeedSource proves cross-implementation reading; the Mastodon shim keeps
// discovery lively. Remove either and the adapter still returns results (or degrades).
export interface OpenWebConfig {
  instance?: string; // Mastodon-compatible home for the REST discovery shim
  seed?: string[]; // handles for the generic ActivityPub seed source
}

export function buildSources(cfg: OpenWebConfig = {}): DiscoverySource[] {
  return [new MastodonSource(cfg.instance || "mastodon.social"), new SeedSource(cfg.seed)];
}
