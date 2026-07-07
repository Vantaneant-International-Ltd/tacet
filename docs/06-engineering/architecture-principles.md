# Architecture principles

Tacet's architecture has one shape: **a domain core, with adapters at every edge.** The core knows about people and relationships. The edges know about HTTP, SQLite, R2, sessions, and ActivityPub. Dependencies point inward — the core never imports an edge.

## 1. Domain at the core

The business model is `Person`, `Connection`, `Moment`, `Post`, `Media`, `Conversation`, `Community`. These are defined once, in one place (`packages/domain` in the [target layout](folder-structure.md)), in plain TypeScript with no framework and no I/O. If you deleted Cloudflare, D1, Hono, React, and ActivityPub, the domain concepts would still be correct. That is the test.

## 2. Adapters at the edges

Everything that touches the outside world is an adapter that translates between the domain and some protocol:

- **Transport adapter** — Hono routes. HTTP shapes in, domain calls out, domain results shaped back to JSON. See [API design](api-design.md).
- **Storage adapter** — D1 and R2. Domain objects persisted to tables and object keys; nothing else knows the schema. See [database model](database-model.md).
- **Federation adapter** — ActivityPub. Inbox/outbox, `Activity` translation, `RemoteAccount`/`RemoteObject` mapping. See [ActivityPub adapter](activitypub-adapter.md).

An adapter can be rewritten without touching the domain. That is the point.

## 3. Federation is an adapter, never the model

**ActivityPub does not get to define what a person or a post is.** Our `Person` is richer and calmer than an AP `Actor`; our `Post` carries no engagement scoreboard. The federation edge *maps onto* the domain: an inbound `Create` activity becomes a `RemoteObject` and, where it makes sense, is projected into a local `Post`-shaped view. The domain stays clean; the protocol stays at the door. Federation, done right, disappears — see [ActivityPub as infrastructure](../05-federation/activitypub-as-infrastructure.md).

## 4. Portability and openness are structural

*Open before closed* is not a settings toggle. A person owns their identity (`@you@tacet.social`) and their people. Export must be a first-class path: the domain must be serializable to portable formats, and account migration must be a designed flow, not a data-recovery incident. If a decision makes leaving harder, it is the wrong decision.

## 5. Calm and simple over clever

- **No stored scoreboards.** The schema already refuses to store follower counts and keeps counts as ranking signals — the act is real, the number does not drive the feed. Architecture preserves this: no derived-count denormalization that would tempt a growth loop.
- **Chronology is the only ordering.** `ORDER BY created_at DESC, id DESC`. No engagement ranking lives in the core.
- **Honest responses.** APIs return what is true, including "you can't do this" and "this came from another server, faithfully rendered but not native."
- **Boring where boring is right.** ULIDs, ISO-8601 UTC, httpOnly cookies, plain CSS tokens. Cleverness is spent on the domain, not the plumbing.

## How the five product principles constrain the build

| Product principle | Architectural constraint |
| --- | --- |
| People before posts | `Person`/`Connection` are core; `Post` hangs off people, not the reverse. |
| Relationships before engagement | No count-as-signal in the domain; chronology only; reactions never reorder. |
| Identity before platforms | Handle is the durable identity; federation and migration map onto it. |
| Calm before addiction | No infinite-engagement machinery; stories fade with no "seen by"; digests over pings. |
| Open before closed | Export and account portability are designed paths in the domain, not afterthoughts. |

These are not aspirations. They are the acceptance criteria for any change to the core.
