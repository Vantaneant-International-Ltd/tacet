# API design

The API is a **transport adapter**, not the model. It turns HTTP into domain calls and domain results into honest JSON. Its resources are shaped around the [domain model](domain-model.md) — people, connections, posts, conversations, communities — not around database tables or ActivityPub verbs.

## Shape: domain resources, calm verbs

Resources map to domain concepts. Verbs are the ordinary HTTP set, used honestly:

```
GET    /api/me                         current Person (or null)
GET    /api/people/:handle             a Profile
POST   /api/people/:handle/connect     open a Connection (follow)
DELETE /api/people/:handle/connect     close it

GET    /api/communities                communities you can see / are in
GET    /api/communities/:slug          one community
GET    /api/communities/:slug/posts    its posts (chronological)
POST   /api/communities/:slug/posts    author a Post

GET    /api/posts/:id                   one Post
DELETE /api/posts/:id                   remove your Post
GET    /api/posts/:id/conversation      its replies
POST   /api/posts/:id/replies           reply
POST   /api/posts/:id/acknowledge       one word, one per person
POST   /api/posts/:id/react             like / dislike, toggled
POST   /api/posts/:id/keep              private keep (author told THAT, never who)

GET    /api/moments                      active (unexpired) moments
POST   /api/moments                      post a fading moment

GET    /api/feed                         your chronological feed
GET    /api/discover                     find people & communities
```

Ordering is always `created_at DESC, id DESC`. There is no `?sort=engagement`. Chronology is the only order the API offers, because *relationships before engagement* is a constraint, not a preference.

## Calm, honest responses

- **Say what's true, including limits.** A 403 means "you can't do this," stated plainly, not a silent empty list. A private account's posts return an honest "not available to you," not a fabricated blank.
- **No hidden scoreboards.** Reaction counts that are *public by design* (like/dislike) are returned; counts that must not become ranking signals (connection counts, keep counts) are simply not in the payload. The API cannot leak a number the domain refuses to expose.
- **Federated content is labelled.** When a post is a projection of a `RemoteObject`, the response says so: the source server is present, and the client renders it faithfully but never disguises it as native. Honesty over hype — see [ActivityPub as infrastructure](../05-federation/activitypub-as-infrastructure.md).

## Versioning

The API is versioned at the edge so the domain can evolve without breaking clients. Introduce `/api/v1/*` at the first external consumer (the mobile app, or a federated integration). Until then the un-versioned `/api/*` is treated as v0 — internal, movable. Breaking changes get a new version; within a version, we only add. ActivityPub endpoints (webfinger, actor, inbox, outbox) are **separate** from the product API and versioned by the protocol, not by us.

## Current Hono routes (accurate) and how they evolve

Today `src/index.ts` mounts a single `/api` Hono app with `sessionMiddleware` on every request (each request carries `c.var.user`, a `SessionUser` or `null`), plus `/api/health` and `/api/config` (public Turnstile site key). Routers are:

| Current router | Domain resource it becomes |
| --- | --- |
| `routes/auth.ts` (`/me`, `/register`, login, logout, avatar) | `Account` + `Profile`; `/me` → current `Person` |
| `routes/rooms.ts` | `Community` (`/communities`) |
| `routes/posts.ts` (posts, replies, acks, reactions, keeps, lens) | `Post`, `Conversation`, reactions/acks/keeps as sub-resources |
| `routes/collections.ts` | curated `Post` sets on a `Profile` |
| `routes/invites.ts` | `Account` provisioning (invite lineage) |
| `routes/public.ts` | public `Community` archives (unauthenticated read) |

Evolution is renaming toward the domain and lifting the inline shaping (e.g. `posts.ts` folds acks/reactions/keeps into each row today) into `packages/domain` calls, with the route left thin. See [folder structure](folder-structure.md). Errors already funnel through a typed `HttpError` → JSON mapping in `index.ts`; unknown `/api/*` stays JSON, and everything else falls back to the SPA shell. That split — **API is JSON, the rest is the app** — stays.

## Auth

Invite-code registration (bootstrap: first user needs no invite and becomes admin) plus an httpOnly session cookie. The cookie is the transport of identity; the identity itself is the `Account`/`Person`. When federation arrives, the same `Person` is addressable as `@you@tacet.social` — the API identity and the federated identity are one. See [ActivityPub adapter](activitypub-adapter.md).
