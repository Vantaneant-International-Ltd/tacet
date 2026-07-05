# TACET

A quiet, invite-only social network. Rooms, not followings. No metrics, no feed, no
notifications. A VNTA Group venture.

This repository is **Phase 1 — the clubhouse**: a single house that runs entirely on
localhost via `wrangler dev`. The build authority is [`BUILD-LOCKFILE.md`](BUILD-LOCKFILE.md);
current status is in [`STATE.md`](STATE.md).

## Stack

- Cloudflare Workers + [Hono](https://hono.dev) (TypeScript)
- Cloudflare D1 (SQLite) — migrations in `migrations/`
- Cloudflare R2 — image originals plus one resized variant
- Vite + React + TypeScript SPA, served by the Worker as static assets
- Plain CSS with design tokens. Fonts (Jost, Space Mono) self-hosted from google/fonts.

## Run it locally

Requires Node 20+ and no Cloudflare account (D1 and R2 are simulated locally).

```sh
npm install
npm run migrate      # apply D1 migrations to the local database
npm run dev          # build the SPA, then start `wrangler dev` on http://localhost:8787
```

`npm run dev` builds the client and hands off to `wrangler dev`. After the first build
you can also run `wrangler dev` directly; re-run `npm run build` when client code changes.

### Placeholder data (optional)

```sh
npm run seed         # insert obviously-fake placeholder rooms/users/posts
npm run seed:wipe    # remove all placeholder data
```

Placeholder passphrases and content are marked as fake and must never reach a deploy.

## Test

```sh
npm test             # API-route and auth tests (Vitest, Workers runtime)
npm run typecheck    # tsc project-references check
```

## What runs today

See `STATE.md`. Only what is listed there is built.
