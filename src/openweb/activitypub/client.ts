import { fetchAp } from "./fetch";
import { resolveActorUrl, looksLikeUrl } from "./webfinger";
import { parseActor, parseObject, parseOutboxItem } from "./parse";
import { fetchCollectionItems } from "./collection";
import type { APActor, APObject, APActivity } from "./apmodel";

// The generic ActivityPub client: resolve, fetch, and PARSE into canonical AP objects.
// It never produces Tacet domain objects — that is the normalize/ layer's job. Works
// against any ActivityPub implementation (Mastodon, Pixelfed, PeerTube, Lemmy, Misskey,
// Friendica, …) because it speaks only the protocol. Read-only, unauthenticated.
export class ApClient {
  // Resolve a handle (@user@home) or an actor URL to a parsed actor.
  async getActor(handleOrUrl: string): Promise<APActor> {
    const url = looksLikeUrl(handleOrUrl) ? handleOrUrl : await resolveActorUrl(handleOrUrl);
    return parseActor(await fetchAp(url));
  }

  // A finite slice of an actor's outbox as parsed activities (Create/Announce/…).
  async getOutbox(actor: APActor, limit: number): Promise<APActivity[]> {
    if (!actor.outbox) return [];
    const items = await fetchCollectionItems(actor.outbox, limit);
    return items.map(parseOutboxItem);
  }

  // Fetch and parse a single content object by URL.
  async getObject(url: string): Promise<APObject> {
    return parseObject(await fetchAp(url));
  }
}
