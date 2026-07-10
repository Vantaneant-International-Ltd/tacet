# STATE

> **Current-truth build state.** Product authority is [`/docs/`](docs/),
> [`FOUNDING_PRINCIPLES.md`](FOUNDING_PRINCIPLES.md), and
> [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md). Full history lives in
> [`docs/06-engineering/STATE-archive.md`](docs/06-engineering/STATE-archive.md).
> Tacet is **your home on the open social web** (People before posts · Relationships before
> engagement · Identity before platforms · Calm before addiction · Open before closed).

## What Tacet is, today

A read-only reader for the **open** social web, built as one coherent product around five
permanent pillars — **Today · People · Discover · Conversations · Me**. Reading is live;
publishing (writing back to the open web) is the next track, not yet built.

## Live

- **Deployed** on `tacet.social` (apex via a Worker route; `www` → 301 → apex; workers.dev
  fallback). Current version `8fedc604-449f-49ae-b1df-baf5daf9f04f`. Rollback anchor
  `184cc804` → `npx wrangler rollback --config wrangler.local.jsonc`.
- **Today reads the open web live** through four source adapters behind one normalization
  contract ([ADR-017](docs/06-decisions/ADR-017-source-adapters.md), `src/sources/`):
  - **ActivityPub** — read live per request through the untouched `src/openweb/` reader.
  - **RSS/Atom/JSON Feed**, **AT Protocol (Bluesky)**, **Nostr** — cron-collected (15 min) +
    lazy-on-read into a D1 store, merged with AP and interleaved calmly (recency + source
    variety, no engagement). Protocol words never reach UI labels.
- **Infra:** D1 `tacet` migrations 0001–0014 applied (remote = disk); R2 `tacet-images`;
  security headers (CSP, HSTS, `X-Frame-Options: DENY`, nosniff) + `Cache-Control: no-store`
  on `/api/*`. Deploy config is the git-ignored `wrangler.local.jsonc`; tracked
  `wrangler.jsonc` carries placeholders only.
- **Tests:** 116 passing (`npm test`, Workers pool + local D1). Gate is
  `npm run typecheck && npm run build && npm test`.

## Partial / mock

- **Today** and **People** read live; **Discover** renders sample suggestions (honestly
  labelled — not yet wired to the live reader); **Conversations** reads live threads; **Me**
  is real local-first data (never federated).
- Interactive affordances **Spark / Follow / Reply** are UI-only in this read-only milestone.
- The composer is an honest **preview** — publishing isn't live, and the copy says so.

## Product model (frozen)

Five pillars; every feature must strengthen one. The protocol is a replaceable adapter at
the edge (ADR-007, realized by ADR-017). Human language over protocol language in all UI
(ADR-008). Metrics are context, never a scoreboard (ADR-011/012). Closed platforms
(Instagram/TikTok/X/LinkedIn/Facebook) are named only to describe fragmentation — never read
as sources; they have no read APIs and are permanently out of scope.

## Identity (Me)

Local-first: a device-cookie profile owns a workspace (saved / collections / notes / reading
later / pinned / recently-viewed). A local handle is a bare username — sanitized server-side
so it can't impersonate a federated address. Not remote auth; nothing federates or publishes.

## Open decisions (from the 2026-07 audit)

See [`docs/06-engineering/AUDIT-2026-07.md`](docs/06-engineering/AUDIT-2026-07.md) for full
findings. Awaiting an operator call (recommendations in the audit):

1. **Type system (S1/S2).** The app ships two fonts: landing renders in Hanken Grotesk +
   Spline Sans Mono (the vendored brand kit), while tokens.md + the app tokens still name
   Jost/Space Mono — and the app loads *neither* `@font-face`, so it renders in system-ui.
   Recommend: adopt Hanken/Spline app-wide, update tokens, load it, retire Jost.
2. **Delete `client/src/legacy/`** (unrouted, tree-shaken; ~26 files + `styles.css` +
   `bits.tsx`). Recommend: delete (git preserves it).
3. **Docs folder tidy** — merge `09-product` → `01-product`; renumber `06-decisions` off the
   `06` collision. Recommend: do it (mechanical `git mv` + link rewrite).

## Awaiting operator

- The three decisions above.
- Turnstile keys + a rotated `SESSION_SECRET` remain deploy-time concerns (fallbacks used).

---

## CLEAN STATE DECLARATION (verified 2026-07-10)

Verified correct this session — the next session may cite these without re-checking:

- **Gate green:** typecheck + build + 116 tests pass.
- **Live:** `tacet.social` landing, `/welcome/world`, `/welcome/home`, `/today`, `/enter`
  all 200; `/api/health` 200; `www` → 301 → apex; security headers intact.
- **Four sources live** on `/today` (`mode:live`, 20 items — ActivityPub + feeds + Bluesky +
  Nostr) with human labels only; **zero protocol words in UI labels** (guarded by test).
- **Migrations:** remote D1 = disk (0001–0014); no pending migrations.
- **D1 diagnostics bounded:** `source_items` pruned to 30 days; `source_state` is a small
  fixed key set; refresh is single-flight (25 s per-adapter budget) — all test-pinned.
- **Honesty:** no capability the UI claims is unbuilt — composer is a labelled preview,
  Discover is labelled sample, Me identity is framed local-not-federated, a local handle
  can't impersonate a federated address (test-pinned).
- **Doctrine intact:** FOUNDING_PRINCIPLES and the manifesto were only cross-referenced,
  never weakened (audit A6-7).
- **Deployed version `8fedc604`** matches the current `main` build.
