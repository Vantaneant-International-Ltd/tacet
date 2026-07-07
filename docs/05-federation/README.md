# Federation

**Tacet is your home on the open social web.** Federation is how one identity you own reaches people who live on many different servers — the same way email lets one account reach the whole world. This is the load-bearing idea of the whole section: **ActivityPub is infrastructure, not the product.** A person should never need to understand ActivityPub, "instances," or "the Fediverse" to use Tacet, any more than they need to understand SMTP to send an email. You just email `anna@gmail.com` from `you@fastmail.com` and it works; you just follow `@anna@pixelfed.social` from `@you@tacet.social` and it works. We are honest about the edges of this: Tacet is the best home for the *open* social web — the ActivityPub-compatible platforms like Mastodon, Pixelfed, PeerTube, WriteFreely and Friendica. We do not pretend to reach inside closed platforms that keep their doors locked. Federation, done right, disappears. What's left is people.

## In this section

- **[Federation principles](federation-principles.md)** — how Tacet federates: protocol invisible, honesty over hype, calm across servers, portability. What we will and won't claim.
- **[ActivityPub as infrastructure](activitypub-as-infrastructure.md)** — the core essay. The email analogy in full, and why "infrastructure not product" shapes every design decision.
- **[Remote accounts](remote-accounts.md)** — following and talking to people whose home is another server. One address book, identity across homes.
- **[Remote content](remote-content.md)** — how posts from other servers appear in Tacet honestly: rendered faithfully, source shown, limits stated plainly.
- **[Discovery across the fediverse](discovery-across-fediverse.md)** — finding people and communities on the open social web, and how this ties to [Discover](../01-product/discover.md).
- **[Portability](portability.md)** — Open before closed made real: owning and moving your identity, and taking your people with you.

## Where this sits

This section is about the **meaning** of federation — the principled, human, founder-level view. The wiring — the adapter layer, inbox/outbox, Activity objects — lives in engineering. See the [engineering adapter](../06-engineering/activitypub-adapter.md) when you need the code.
