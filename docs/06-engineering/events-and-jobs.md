# Events and jobs

Some work must not happen on the request path. Delivering a post to a hundred remote inboxes, generating image variants, assembling a daily digest — none of these should make a person wait, and none should let the protocol reach into the domain. The answer is an **event boundary**: the domain emits events; asynchronous jobs react to them.

## Why an event boundary

- **It keeps the domain calm.** When a `Person` authors a `Post`, the domain records it and emits `PostCreated`. It does not know about federation delivery, thumbnails, or digests. Those are consequences handled elsewhere. The domain stays small and honest ([architecture principles](architecture-principles.md)).
- **It keeps the protocol at the edge.** Federation delivery is a *reaction* to a domain event, translated by the [ActivityPub adapter](activitypub-adapter.md). The domain emits `ConnectionOpened`; the federation worker turns that into a `Follow` `Activity` and delivers it. The domain never touches `Activity`.
- **It keeps the request fast and honest.** The user's action completes when the durable fact is written. Fan-out, retries, and slow servers happen after, invisibly. A failed delivery to one remote server never breaks the local experience.

## The events (first pass)

Domain operations emit plain events — no protocol, no I/O:

- `PostCreated`, `PostDeleted`
- `ReplyCreated`
- `ConnectionOpened`, `ConnectionClosed`
- `ReactionRecorded`, `AcknowledgmentRecorded`
- `MomentCreated` (and its scheduled expiry)
- `MediaUploaded`

Each is a fact about the [domain](domain-model.md), stated in domain language.

## The jobs

Async consumers, living in `apps/workers` ([folder structure](folder-structure.md)):

- **Federation delivery** — consumes outbound events, translates to `Activity`, delivers to remote inboxes with signing, retry, and backoff via the `federation_outbox` queue. The slowest, flakiest work; the most important to keep off the request path.
- **Federation intake** — drains the `federation_inbox` queue: verify, dedupe, translate inbound activities into domain operations.
- **Media processing** — consumes `MediaUploaded`, generates rendered variants into R2, updates the reference. Today image handling is inline in the Worker (`src/lib/images.ts`); moving it behind an event is the calm version.
- **Moment expiry** — `Moment`s (stories) fade after 24h. A scheduled sweep expires them by `expires_at`. No "seen by," no ring — the sweep is the whole mechanism.
- **Digests** — assembles periodic, gentle summaries (*calm before addiction*: digests over pings). Batched, chronological, never an engagement-bait notification.

## Delivery discipline

- **At-least-once, idempotent.** Jobs may run twice; effects must be safe to repeat (dedupe by activity id, upsert by ULID). See [database model](database-model.md).
- **Retry with backoff, then park.** Remote servers go down. Failed federation deliveries retry with backoff and, after a ceiling, park for inspection rather than spinning forever.
- **Durable queues.** `federation_inbox` / `federation_outbox` are persisted state, so a Worker restart loses nothing in flight.

## Where this sits today

The current repo does all work **synchronously** inside the single Hono Worker — image storage, post creation, everything happens in the request. There is **no queue, no scheduled job, no worker split** yet, and no federation to deliver. That is correct for Phase 1. The event boundary is introduced when the first genuinely async need arrives — which is federation delivery. Until then, adding queues would be cleverness without a customer. Build it when federation does.
