import type { DiscoverySource, Moment, Person } from "../types";
import { ApClient } from "../activitypub/client";
import { normalizePerson, normalizeActivity } from "../normalize";
import type { RequestSigner } from "../activitypub/signing";

// The universal discovery source. ActivityPub has no native discovery, so we seed a
// small, tunable set of handles spanning DIFFERENT implementations and read them
// entirely through the generic ActivityPub core. This is what proves the adapter is
// genuinely cross-implementation — the same code path reads Mastodon, Pixelfed,
// PeerTube, Lemmy, Misskey, etc. Unreachable or secure-mode homes are skipped.
//
// Tune with the OPENWEB_SEED env (comma-separated @user@home handles).
export const DEFAULT_SEED = [
  "@Gargron@mastodon.social", // Mastodon (person)
  "@dansup@pixelfed.social", // Pixelfed
  "@nutomic@lemmy.ml", // Lemmy
  "@syuilo@misskey.io", // Misskey
  "@Mastodon@mastodon.social", // Mastodon (organization)
  "@pixelfed@mastodon.social", // cross-posted account
  "@thelinuxexperiment@tilvids.com", // PeerTube (best-effort)
  "@bookwyrm@tech.lgbt", // BookWyrm project (best-effort)
];

function fulfilled<T>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> {
  return r.status === "fulfilled";
}

export class SeedSource implements DiscoverySource {
  readonly id = "seed";
  private client: ApClient;
  private seed: string[];

  constructor(seed?: string[], signer?: RequestSigner) {
    this.seed = seed && seed.length ? seed : DEFAULT_SEED;
    this.client = new ApClient(signer);
  }

  async people(limit: number): Promise<Person[]> {
    const handles = this.seed.slice(0, Math.max(limit, this.seed.length));
    const settled = await Promise.allSettled(handles.map((h) => this.client.getActor(h)));
    return settled
      .filter(fulfilled)
      .map((r) => normalizePerson(r.value))
      .filter((p) => p.id)
      .slice(0, limit);
  }

  async today(limit: number): Promise<Moment[]> {
    const n = Math.min(this.seed.length, 6);
    const per = Math.max(2, Math.ceil(limit / n));
    const settled = await Promise.allSettled(
      this.seed.slice(0, n).map(async (h) => {
        const actor = await this.client.getActor(h);
        const activities = await this.client.getOutbox(actor, per + 3);
        return activities
          .map((a) => normalizeActivity(a, actor))
          .filter((m): m is Moment => !!m)
          .slice(0, per);
      }),
    );
    return settled.filter(fulfilled).flatMap((r) => r.value);
  }
}
