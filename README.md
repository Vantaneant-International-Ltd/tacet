# Tacet

**Your home on the open social web.**

People before posts.
Relationships before engagement.
Identity before platforms.
Calm before addiction.
Open before closed.

---

## What is Tacet?

Tacet is one place for your social life on the open web.

Today you keep seven apps to stay in touch with the same people. Each one owns a
different sliver of your identity, holds a different inbox, runs a different
algorithm, and answers to a different company. You do the work of stitching them
together. Nobody set out to build that; it's just what happened when every network
decided to become a walled garden.

Tacet is the calm, single window back into all of it. One identity you own. One
place your people live. One inbox instead of five. And a door — through the open
social web, the Fediverse — to everyone who has already left the walls behind.

Tacet is **not** another social network competing for your attention. It is the
home you plug the open web into.

## Product philosophy

Tacet is built on five commitments. They are not slogans; they decide what we
build and what we refuse to build.

- **People before posts.** The unit of the product is a person and your
  relationship to them, not an endless stream of content. You come back for who is
  here, not for what's trending.
- **Relationships before engagement.** We measure whether people feel closer, not
  how long they scrolled. No metric on this product exists to keep you here longer.
- **Identity before platforms.** You have one identity that you own and can take
  with you. Platforms are plumbing. Your name, your people, and your history are
  yours.
- **Calm before addiction.** Nothing here is engineered to be compulsive. No
  infinite feed tuned to your weaknesses, no manufactured urgency, no dark
  patterns. The app never begs to be opened.
- **Open before closed.** We build on open protocols so you are never locked in.
  If you want to leave, you can — and take your identity and your people with you.
  Openness is the whole point, not a feature.

The rule that governs everything: **the code follows the philosophy. The
philosophy is not invented by the code.** When they disagree, the philosophy wins
and the code changes.

## Repository structure

```txt
docs/            The product. Read this first.
  00-manifesto/                Why Tacet exists and what it refuses to be.
  01-product/                  What Tacet is, surface by surface.
  02-human-interface-guidelines/  How Tacet should feel and behave.
  03-design-system/            The tokens and components that build the feel.
  04-user-journeys/            The product told as human stories.
  05-federation/               The open social web, explained honestly.
  06-engineering/              How the code should be shaped to fit the product.
  07-brand/                    Name, voice, and positioning.
  08-roadmap/                  MVP → v1 → future.

FOUNDING_PRINCIPLES.md   The non-negotiables, in one page.
PRODUCT_DIRECTION.md     Where Tacet is going, and the legacy to review.

src/             The Cloudflare Worker (Hono API).
client/          The React SPA served by the Worker.
migrations/      D1 (SQLite) schema, append-only.
design/          HTML mockups (historical reference; predate this direction).
```

## Documentation map

Start with the manifesto, then read the product docs. Everything else supports
those two.

1. **[docs/00-manifesto/](docs/00-manifesto/)** — start here. Why Tacet exists.
2. **[docs/01-product/](docs/01-product/)** — the product model: Today, People,
   Discover, Conversations, Me.
3. **[docs/02-human-interface-guidelines/](docs/02-human-interface-guidelines/)** —
   how it should feel: calm, rich, original, alive.
4. **[docs/03-design-system/](docs/03-design-system/)** — the tokens and
   components that make the feel concrete.
5. **[docs/04-user-journeys/](docs/04-user-journeys/)** — the product as lived
   experience, from first visit to leaving.
6. **[docs/05-federation/](docs/05-federation/)** — ActivityPub as infrastructure,
   not product. Federation that feels like email.
7. **[docs/06-engineering/](docs/06-engineering/)** — architecture direction,
   domain model, and the ActivityPub adapter.
8. **[docs/07-brand/](docs/07-brand/)** — name, voice, positioning.
9. **[docs/08-roadmap/](docs/08-roadmap/)** — what ships when.

The one-page versions: **[FOUNDING_PRINCIPLES.md](FOUNDING_PRINCIPLES.md)** and
**[PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md)**.

## Development setup

Requires Node 20+. No Cloudflare account is needed for local development — D1 and
R2 are simulated by `wrangler dev`.

```sh
npm install
npm run migrate      # apply D1 migrations to the local database
npm run dev          # build the SPA, then start wrangler dev on http://localhost:8787
```

`npm run dev` builds the client and hands off to `wrangler dev`. After the first
build you can also run `wrangler dev` directly; re-run `npm run build` when client
code changes.

Optional placeholder data:

```sh
npm run seed         # insert obviously-fake placeholder content
npm run seed:wipe    # remove all placeholder data
```

Placeholder passphrases and content are marked as fake and must never reach a
deploy.

Tests and types:

```sh
npm test             # API-route and auth tests (Vitest, Workers runtime)
npm run typecheck    # tsc project-references check
```

## Current status

Tacet is early. There is a working invite-gated app — accounts, profiles,
following, communities, posting, replies, reactions — running locally on
Cloudflare Workers + D1 + R2, deployed to an interim `*.workers.dev` URL.

That app was built under an earlier "quiet invite-only clubhouse, rooms not
followings" thesis. This repository is now being **re-founded around the direction
in `docs/`**: Tacet as your home on the open social web. The code has not yet been
reshaped to match. See **[PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md)** for the
legacy assumptions under review and what changes next.

Working state and build history live in [STATE.md](STATE.md). Federation
(ActivityPub) is not built yet.

## Roadmap

- **MVP** — one owned identity, your people, Today, and the first honest window
  into the Fediverse. Read, follow, and reply across the open social web.
- **v1** — full compose, communities, conversations, discovery, and a polished
  home that a person prefers to the seven apps they replaced.
- **Future** — deeper federation, portability you can feel, and the calm defaults
  that make Tacet the best home for the open social web.

Details in **[docs/08-roadmap/](docs/08-roadmap/)**.

---

*Tacet is a VNTA Group venture.*
