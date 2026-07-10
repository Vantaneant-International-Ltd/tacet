# Folder structure

This describes the **target** shape of the codebase and compares it honestly to what exists today. **Do not move files yet.** This is direction, not a migration order. We refactor toward this when the domain package earns its keep — not before.

## Target layout

```
apps/
  web/          # the React SPA (people-facing client)
  api/          # the HTTP/transport adapter (Hono routes)
  workers/      # background workers: federation delivery, media, digests
  mobile/       # future native client
packages/
  domain/       # the domain model — pure TS, no I/O, no framework
  ui/           # shared UI primitives and design tokens
  config/       # shared config, env typing, constants
  federation/   # the ActivityPub adapter (inbox/outbox, Activity translation)
  database/     # storage adapter: D1 schema, migrations, repositories
```

### Apps

- **`apps/web`** — the SPA people use. Views, router, session handling, API client. Depends on `packages/ui` and `packages/domain` (for types only). Renders `Person`, `Post`, `Community`, etc.; knows nothing about SQL or ActivityPub.
- **`apps/api`** — the transport adapter. Hono routes that turn HTTP into domain calls and domain results into JSON. Depends on `packages/domain` and `packages/database`. See [API design](api-design.md).
- **`apps/workers`** — async processing detached from the request path: federation delivery/retry, media variant generation, story expiry, digest assembly. See [events and jobs](events-and-jobs.md).
- **`apps/mobile`** — reserved for a future native client. Same domain, same API; a different transport of the same identity.

### Packages

- **`packages/domain`** — the [domain model](domain-model.md): `Person`, `Connection`, `Moment`, `Post`, `Media`, `Conversation`, `Community` and the edge types. Pure, testable, dependency-free. The centre everything points at.
- **`packages/ui`** — shared components and the plain-CSS design tokens, so web (and later mobile web views) stay visually one system.
- **`packages/config`** — env typing (`Env` bindings), constants, feature flags. One source of truth for what the runtime provides.
- **`packages/federation`** — the ActivityPub adapter: `FederationInbox`, `FederationOutbox`, `Activity` translation, `RemoteAccount`/`RemoteObject` mapping. Isolated here so the protocol stays at the edge. See [ActivityPub adapter](activitypub-adapter.md).
- **`packages/database`** — the storage adapter: the D1 schema, migrations, and repository functions that persist domain objects. The only place that knows table names.

The dependency arrows all point at `packages/domain`. `federation` and `database` depend on `domain`; `domain` depends on nothing.

## Current layout (accurate to the repo)

Today the repo is a **single-package monorepo-in-waiting**, not the structure above:

```
src/                 # the Cloudflare Worker (Hono)
  index.ts           # app wiring, /api/* mount, SPA fallback, scheduled() cron
  types.ts           # Env bindings + SessionUser
  routes/            # auth, rooms, posts, invites, public, collections, openweb, me
  openweb/           # the generic ActivityPub READ reader (parse → normalize → domain)
  sources/           # the read-adapter contract + 4 adapters (ADR-017):
                     #   activitypub · feeds · atproto · nostr, merged into Today
  me/                # local-first "Me" (profile, saved, collections) repositories
  lib/               # ulid, passphrase, session, images, turnstile, acks
client/
  src/               # Vite + React + TS SPA
migrations/          # D1 SQL, 0001–0014 (0014 = source registry + item store)
wrangler.jsonc       # Worker + D1 + R2 bindings
package.json         # one package, root scripts
```

### Honest gap analysis

- **No `apps/` or `packages/`.** It is one package with two source roots (`src/`, `client/`). That is fine for Phase 1 and deliberately simple.
- **No `packages/domain`.** Domain logic currently lives *inside* route handlers (e.g. `src/routes/posts.ts` shapes posts and folds in acks/reactions/keeps inline). The domain model of [domain-model.md](domain-model.md) is implicit, not extracted. This is the first refactor to earn its keep.
- **Read adapters are built; write federation is not.** The **read** side ships in `src/openweb/`
  (the generic ActivityPub reader) and `src/sources/` (the shared contract + four adapters —
  ActivityPub, RSS/Atom/JSON Feed, AT Protocol, Nostr — behind [ADR-017](../06-decisions/ADR-017-source-adapters.md)),
  merged into Today. What's still unbuilt is **write** federation: no inbox, no outbox, no `Activity`
  types. That target lives in [ActivityPub adapter](activitypub-adapter.md); a future `packages/federation`
  would house it.
- **`database` is `migrations/` + inline SQL.** Repositories don't exist; handlers write SQL directly against D1. `packages/database` would consolidate this.
- **`api` and `web` already exist in spirit** as `src/` and `client/` — the cleanest future split. `apps/mobile` and `apps/workers` are entirely future.

## Migration stance

We move toward this layout **incrementally and only when a boundary starts paying for itself** — extracting `packages/domain` first (because it clarifies everything), then `packages/database`, then `packages/federation` when federation work begins. Until then, keeping `src/` + `client/` is the calm choice. Restructuring for its own sake would violate *simple over clever*.
