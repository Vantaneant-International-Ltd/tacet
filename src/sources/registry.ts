// Which source adapters are wired in, and how they split into two roles:
//   • live readers   — read at request time (ActivityPub, through the untouched reader);
//   • collectors     — cron-refreshed into the shared D1 item store (feeds, AT Protocol,
//                      Nostr), because polling many HTTP feeds / relays per request is slow.
// Both roles emit the SAME NormalizedPost, so Today merges them without caring which is
// which. See docs/06-decisions/ADR-017-source-adapters.md.

import type { SourceAdapter } from "./contract";
import { ActivityPubAdapter } from "./activitypub/adapter";
import { FeedsAdapter } from "./feeds/adapter";
import type { OpenWebConfig } from "../openweb";

export interface SourcesConfig extends OpenWebConfig {
  db?: D1Database;
}

// Every adapter, for diagnostics / health checks.
export function allAdapters(cfg: SourcesConfig = {}): SourceAdapter[] {
  return [new ActivityPubAdapter(cfg), ...collectorAdapters(cfg)];
}

// The adapters the cron refresh collects into D1. ActivityPub is deliberately NOT here —
// it is read live per request so its existing behaviour is never disturbed. AT Protocol and
// Nostr are added by their stages.
export function collectorAdapters(_cfg: SourcesConfig = {}): SourceAdapter[] {
  return [new FeedsAdapter()];
}
