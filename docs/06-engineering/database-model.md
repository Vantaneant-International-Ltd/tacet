# Database model

Storage is an **adapter**. D1 (SQLite) and R2 persist domain objects; nothing outside the storage layer should know a table name. This file states the current schema accurately (from `migrations/`), maps the [domain model](domain-model.md) onto it, and sets the portability and federation-edge direction.

## Current D1 schema (accurate to `migrations/`)

Conventions, set in `0001_init.sql`: IDs are **ULIDs** (text, time-sortable); timestamps are **ISO-8601 UTC strings**; ordering is `created_at DESC, id DESC`; **no counts are stored against people or posts** as ranking signals. Foreign keys on.

| Table (migration) | Holds |
| --- | --- |
| `users` (0001; +`is_private` 0005; +`display_name`,`bio` 0007; +`avatar_key` 0008) | `Account` + `Profile`: handle, passphrase hash, admin, privacy, presentation |
| `invites` (0001) | invite lineage: created_by / used_by |
| `rooms` (0001; +`default_lens` 0002; +`is_public` 0003) | `Community`: slug, name, description, public flag, suggested lens |
| `memberships` (0001) | `Person` ↔ `Community` membership |
| `posts` (0001) | `Post`: room, author, kind (text/image), body, image_key |
| `replies` (0001) | `Conversation`: replies under a post (ordered ASC) |
| `keeps` (0001) | private keep — author told THAT, never by whom; no display count |
| `lens_prefs` (0001) | per-person per-community viewing lens override |
| `acknowledgments` (0002) | one word (`seen`/`with_you`/`more`), one per person per post; never counted or ranked |
| `follows` (0004) | `Connection`: person → community; **no follower count exists** |
| `reactions` (0006) | like/dislike, one per person per post, toggled; public counts allowed here |
| `collections` + `collection_items` (0009) | curated pinned sets of your own posts on your profile |
| `stories` (0010) | `Moment`: ephemeral, `expires_at`, no view/"seen by" |

Media (images) live in **R2** under stable keys (originals + rendered variants; avatars under `avatars/<user id>/variant`); the DB stores only the `image_key`/`avatar_key` reference. This is the right split — the domain holds a reference, the object store holds the bytes.

## Domain → storage mapping

- **Account + Profile** → one `users` row today. When these separate in the domain, they can stay one table or split; the domain doesn't care which.
- **Person** → the same `users` identity, viewed as a social node; its edges are `follows`, `memberships`, authored `posts`/`stories`.
- **Connection** → `follows`. The deliberate absence of a count column *is* the model: *relationships before engagement* enforced in DDL.
- **Post / Media** → `posts` + R2 object. **Conversation** → `replies`. **Moment** → `stories`. **Community** → `rooms` + `memberships`.
- Reactions, acknowledgments, keeps, collections are **relationships around a post**, never re-orderings of it — the schema stores no derived rank.

## Portability and export

*Open before closed* is a storage requirement. Because every object is a ULID-keyed row with ISO timestamps and no proprietary encoding, a person's data is straightforwardly serializable: their `Account`/`Profile`, their `Post`s and `Moment`s, their `Connection`s, their `Community` memberships, and their `Media` (R2 objects by key). Export must be a designed path — a person leaving takes their identity and their people. Account **migration** (moving `@you@tacet.social` to another home, or accepting one moving in) is a first-class flow the schema must not obstruct: keep identity durable and references stable so a `Person` can be reconstituted elsewhere.

## Where federation-edge data lives

Federation objects are **new tables in the storage adapter, kept off the core tables** so the protocol never contaminates the domain schema:

- **`remote_accounts`** — cached `RemoteAccount` (remote actor URI, handle, display, avatar, source server). A `follows` row may target one of these, or use a parallel `remote_follows` — the address book is one book across homes.
- **`remote_objects`** — cached `RemoteObject` (source URI, raw activity, fetched-at), projected into a `Post`-shaped view for display, never merged into `posts`.
- **`federation_inbox` / `federation_outbox`** — durable queues of `Activity` objects in/out, with delivery state and retry bookkeeping. See [events and jobs](events-and-jobs.md).
- **actor keys** — each local `Person` needs a keypair for HTTP-signature signing; store the private key server-side, publish the public key on the actor document.

These tables are additive and isolated. The core schema above does not change to accommodate ActivityPub — that is the whole point of the adapter. See [ActivityPub adapter](activitypub-adapter.md).
