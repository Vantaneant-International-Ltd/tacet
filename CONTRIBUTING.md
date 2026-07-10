# Contributing to Tacet

Thank you for your interest in Tacet — **your home on the open social web.**

Tacet is early software, in active development and **not yet ready for production
use**. That means the codebase moves quickly and some things are intentionally
unfinished. It also means thoughtful contributions can have outsized impact.

Please read this alongside the [Code of Conduct](CODE_OF_CONDUCT.md).

## The one rule that shapes everything

Tacet is built around **five permanent product pillars**:

**Today · People · Discover · Conversations · Me**

> Every contribution should strengthen one of these pillars. If it strengthens none
> of them, it probably does not belong in Tacet.

Before proposing a feature, read [`FOUNDING_PRINCIPLES.md`](FOUNDING_PRINCIPLES.md)
and [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md). Tacet is a **complete product**
that speaks open protocols — not a Fediverse client. ActivityPub is a replaceable
adapter underneath; the interface never exposes protocol jargon (it's *a person*,
not "a remote account"; *a post*, not "an ActivityPub object").

## Ways to contribute

- **Design & UX** — the highest-leverage area. Tacet lives or dies on taste and calm.
- **Product feedback** — does a screen strengthen its pillar? Open a discussion.
- **Docs** — clarity, honesty, and accuracy (see [`docs/`](docs/)).
- **Code** — bug fixes and well-scoped features that fit the pillars.

For anything non-trivial, **open an issue or discussion first** so we can align on
direction before you invest time.

## Local setup

Requires Node 20+. No Cloudflare account or secrets needed for local development.

```sh
npm install
npm run migrate      # apply D1 migrations to a simulated local database
npm run dev          # build the SPA + run the Worker at http://localhost:8787
```

The five-pillar app (Today / People / Discover / Conversations / Me) runs on mock
data and is walkable without signing in — start at `/today`.

## Before you open a pull request

Run the checks and don't hide failures:

```sh
npm run typecheck    # tsc project-references
npm run build        # Vite production build
npm test             # Vitest (API + auth)
```

Guidelines:

- **Keep PRs focused.** One coherent change. Small is beautiful.
- **Match the design system.** Use the tokens and primitives in
  [`client/src/design/`](client/src/design/). Don't invent one-off colors, spacing,
  or components. Density is a failure mode; calm is the goal.
- **No protocol jargon in the UI.** Product language only.
- **Never commit secrets.** Local secrets live in a git-ignored `.dev.vars` (see
  [`.dev.vars.example`](.dev.vars.example)).
- **Don't resurrect the old "rooms" product.** It was removed from the client
  (it lives only in git history now). Build inside a pillar instead of porting it back.
- **Write like the surrounding code.** Match its style, naming, and comment density.

## Commit and PR style

- Conventional-commit-ish messages are appreciated (`feat(app): …`, `fix(a11y): …`,
  `docs: …`, `refactor: …`).
- Describe *why*, not just *what*, and note anything you deliberately left out.

## Reporting security issues

Do **not** open a public issue. See [`SECURITY.md`](SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the project's
license (see [`LICENSE`](LICENSE); AGPL-3.0 is the recommended default, pending final
founder sign-off).
