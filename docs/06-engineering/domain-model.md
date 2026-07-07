# Domain model

This is the most important file in engineering. It defines *what Tacet is made of*, independent of any database, protocol, or framework. Everything else — routes, tables, ActivityPub — is a projection of this model.

**Governing rule: ActivityPub is an adapter layer, not the core business model.** The domain is people and relationships. Federation maps onto it and never dictates it. Below, the concepts split cleanly into a **local domain** (the real model) and a **federation edge** (translation objects that exist only to talk to other servers).

## Local domain

These are the concepts the product is actually about. They would be correct even if federation never existed.

### Account

The credential and ownership root. One human's control point: passphrase, session, invite lineage, admin flag, privacy flag. An `Account` *has* exactly one `Profile` and *is* one `Person`. It is the thing you log into, not the thing others see.

### Profile

The presentable face of an account: display name, bio, avatar, handle. Handle (`@you@tacet.social`) is the permanent identity; display name and bio are editable presentation. A `Profile` is what renders on a page.

### Person

The domain's centre of gravity. A `Person` is an account-as-social-being: the node that *has* connections, authors moments and posts, joins communities, and holds conversations. When the rest of the model says "who," it means `Person`. *People before posts* is literally the shape of the graph — posts hang off people.

### Connection

A directed relationship between two `Person` nodes (today: a follow). Connections are the relationship graph. Crucially, **a connection has no public count** — the act is real, the tally does not exist as a ranking signal. *Relationships before engagement* lives here.

### Moment

A casual, ephemeral expression by a `Person` that fades (today: a 24-hour story). No view count, no "seen by," no nagging ring. A `Moment` is the low-stakes register of presence — distinct from a `Post`, which is durable.

### Post

A durable expression authored by a `Person`, of a `kind` (text or image), optionally carrying `Media`, living in a `Community` or on a profile. Ordered only by chronology. Posts may receive reactions and acknowledgments and be *kept* privately, but none of these reorder anything. This is the canonical unit of the public record.

### Media

An image (today) attached to a `Post`, `Moment`, or `Profile` (avatar). Stored as an object with variants (original + rendered). `Media` is content, addressed by a stable key, never inlined into the domain object beyond a reference.

### Conversation

The reply structure attached to a `Post`: an ordered, chronological set of replies by `Person`s. A `Conversation` is where relationship happens around a post. It is not a thread-ranking engine; it is people talking, in order.

### Community

A space people join and post into (today: a room, which also expresses brands and public archives). A `Community` has members, may be public (a permanent readable archive) or private, and may suggest a viewing lens. Following a community routes its posts into a person's feed. Brands and communities are the same shape.

## Federation edge

These exist **only** to translate between our domain and other servers. They are not the model; they are the model's passport control. They must never leak inward.

### RemoteAccount

A `Person` who lives on another server (`@anna@pixelfed.social`). It mirrors just enough of a `Profile` to show them honestly in Tacet, with the source server always visible. A local `Connection` may point at a `RemoteAccount`; the address book is one book across homes.

### RemoteObject

A post-like or activity-like thing that originated elsewhere, cached faithfully. It is *projected* into a `Post`-shaped view for display — rendered faithfully, source shown, limits stated plainly — but it is never confused with a native `Post`. This projection is one-directional and lossy on purpose.

### Activity

An ActivityPub message (`Create`, `Follow`, `Like`, `Announce`, `Accept`…). It is the *wire format* of federation. Activities are translated **to and from** domain operations at the edge; the domain core never handles an `Activity` directly. A `Like` maps to a reaction; a `Follow` maps to a `Connection` request; a `Create` maps to a `RemoteObject`.

### FederationInbox

The intake point for inbound `Activity` objects addressed to a local `Person`. It verifies, dedupes, and hands off to translation. Nothing arrives in the domain without passing through here.

### FederationOutbox

The staging point for outbound `Activity` objects: local domain events (a new `Post`, a new `Connection`) are translated into activities and delivered to remote inboxes, asynchronously. See [events and jobs](events-and-jobs.md).

## Relationships at a glance

```
Account 1—1 Profile
Account 1—1 Person
Person  *—* Person          (via Connection)
Person  1—* Post            (author)
Person  1—* Moment          (author, ephemeral)
Post    1—* Media
Post    1—1 Conversation    (its replies)
Community *—* Person        (membership)
Community 1—* Post
Connection ──▶ Person | RemoteAccount

--- edge (adapter) ---
FederationInbox  ─▶ Activity ─▶ RemoteObject ─▶ (projected) Post-view
FederationOutbox ◀─ Activity ◀─ domain event (Post / Connection / reaction)
RemoteAccount ≈ Profile-of-a-Person-elsewhere
```

Read the diagram inward: the top block is Tacet. The bottom block is the edge that lets Tacet reach the open social web without letting the open social web reshape Tacet. See the [ActivityPub adapter](activitypub-adapter.md) for how the edge is wired.
