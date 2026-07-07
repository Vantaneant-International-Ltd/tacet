import { fetchAp } from "./fetch";
import { resolveActorUrl, looksLikeUrl } from "./webfinger";
import { parseActor, parseObject, parseOutboxItem } from "./parse";
import { fetchCollectionItems } from "./collection";
import type { APActor, APObject, APActivity } from "./apmodel";
import type { RequestSigner } from "./signing";

// The generic ActivityPub client: resolve, fetch, and PARSE into canonical AP objects.
// It never produces Tacet domain objects — that is the normalize/ layer's job. Works
// against any ActivityPub implementation (Mastodon, Pixelfed, PeerTube, Lemmy, Misskey,
// Friendica, GoToSocial, Akkoma, BookWyrm, …) because it speaks only the protocol.
// Read-only. An optional server signer widens access to stricter homes (authorized
// fetch); WebFinger stays unsigned (it is a public discovery endpoint).
export class ApClient {
  constructor(private readonly signer?: RequestSigner) {}

  async getActor(handleOrUrl: string): Promise<APActor> {
    const url = looksLikeUrl(handleOrUrl) ? handleOrUrl : await resolveActorUrl(handleOrUrl);
    return parseActor(await fetchAp(url, { signer: this.signer }));
  }

  async getOutbox(actor: APActor, limit: number): Promise<APActivity[]> {
    if (!actor.outbox) return [];
    const items = await fetchCollectionItems(actor.outbox, limit, 3, this.signer);
    return items.map(parseOutboxItem);
  }

  async getObject(url: string): Promise<APObject> {
    return parseObject(await fetchAp(url, { signer: this.signer }));
  }

  // Raw items of any Collection (e.g. a post's `replies`). Items may be URLs or embedded
  // objects — the caller decides how to interpret them.
  async getCollectionItems(url: string, limit: number): Promise<unknown[]> {
    return fetchCollectionItems(url, limit, 2, this.signer);
  }
}
