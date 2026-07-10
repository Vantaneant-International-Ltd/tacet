// ActivityPub as the first adapter behind the contract. It does NOT reimplement anything:
// it maps the existing, untouched reader in src/openweb/ (the generic ActivityPub core +
// its normalizer) onto the SourceAdapter interface. ActivityPub is read LIVE per request
// through that reader, so this adapter is the contract-conformant face of it — used for
// health checks and to prove the boundary is uniform, while the live Today path keeps
// flowing through the same underlying code. Covers Mastodon, Pixelfed, PeerTube, Lemmy,
// Friendica, Misskey, WriteFreely, BookWyrm, AP-enabled WordPress/Ghost, and federating
// Threads accounts.

import type { SourceAdapter, NormalizedPost, HealthReport, CollectContext } from "../contract";
import { nowIso } from "../contract";
import { buildSources, type OpenWebConfig } from "../../openweb";
import type { DiscoverySource } from "../../openweb/types";

function fulfilled<T>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> {
  return r.status === "fulfilled";
}

export class ActivityPubAdapter implements SourceAdapter<NormalizedPost> {
  readonly id = "activitypub";
  readonly transport = "pull" as const;
  readonly label = "the open social web";
  private readonly sources: DiscoverySource[];
  private readonly healthHost: string;

  constructor(cfg: OpenWebConfig = {}) {
    // Reuse the exact discovery sources the live reader uses — nothing new, nothing forked.
    this.sources = buildSources(cfg);
    this.healthHost = cfg.instance || "mastodon.social";
  }

  // The reader already returns normalized Moments, so "raw" here IS a NormalizedPost. We
  // still route it through normalize() to stamp adapter provenance, keeping the contract
  // honest (fetchLatest → normalize → post).
  async fetchLatest(ctx: CollectContext): Promise<NormalizedPost[]> {
    const per = Math.max(4, Math.ceil(ctx.limitPerSource));
    const settled = await Promise.allSettled(this.sources.map((s) => s.today(per)));
    return settled.filter(fulfilled).flatMap((r) => r.value);
  }

  normalize(raw: NormalizedPost): NormalizedPost | null {
    if (!raw || (!raw.text && raw.media.length === 0)) return null;
    // Tag provenance without disturbing the reader's own attribution (home + software).
    raw.source.adapter = this.id;
    if (raw.author?.source) raw.author.source.adapter = this.id;
    return raw;
  }

  async healthcheck(): Promise<HealthReport> {
    const at = nowIso(Date.now());
    try {
      const res = await fetch(`https://${this.healthHost}/.well-known/nodeinfo`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(6000),
      });
      return { ok: res.ok, detail: `${this.healthHost} nodeinfo → ${res.status}`, checkedAt: at };
    } catch (e) {
      return { ok: false, detail: `${this.healthHost} unreachable: ${e instanceof Error ? e.message : String(e)}`, checkedAt: at };
    }
  }
}
