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
  fallback). Current version `f0139d18-ce6f-4cb9-9c46-41ad0ade94eb`. Rollback anchor
  `4b76deae` → `npx wrangler rollback --config wrangler.local.jsonc`.
- **Today reads the open web live** through four source adapters behind one normalization
  contract ([ADR-017](docs/11-decisions/ADR-017-source-adapters.md), `src/sources/`):
  - **ActivityPub** — read live per request through the untouched `src/openweb/` reader.
  - **RSS/Atom/JSON Feed**, **AT Protocol (Bluesky)**, **Nostr** — cron-collected (15 min) +
    lazy-on-read into a D1 store, merged with AP and interleaved calmly (recency + source
    variety, no engagement). Protocol words never reach UI labels.
- **Infra:** D1 `tacet` migrations 0001–0014 applied (remote = disk); R2 `tacet-images`;
  security headers (CSP, HSTS, `X-Frame-Options: DENY`, nosniff) + `Cache-Control: no-store`
  on `/api/*`. Deploy config is the git-ignored `wrangler.local.jsonc`; tracked
  `wrangler.jsonc` carries placeholders only.
- **Connectivity panel** — "Your home is connected" on the Me screen: a live, world-directed
  module (`GET /api/openweb/connectivity`) showing the four source families by product name,
  how many sources this home watches, homes seen, recent posts gathered, and last-refresh.
  Real adapter/registry state, never hardcoded (ADR-011/012 — no personal analytics, no red).
- **Tests:** 118 passing (`npm test`, Workers pool + local D1). Gate is
  `npm run typecheck && npm run build && npm test`.

## Partial / mock

- **Today** and **People** read live; **Discover** renders sample suggestions (honestly
  labelled — not yet wired to the live reader); **Conversations** reads live threads; **Me**
  is real local-first data (never federated).
- **Every interactive control works or is honestly disabled.** Spark / Follow / Reply are
  "coming soon" (calmly disabled) in this read-only milestone; Save is real. No dead buttons.
- The composer is an honest **preview** — publishing isn't live, and the copy says so.
- **Stage 7 (template conformance) in progress:** the 3-column canvas is built (opt-in `Surface`); Today has a context column hosting the connectivity panel; all 8 in-scope surfaces are specced in `docs/10-design/hifi/specs/`. Landing
  + Onboarding are EXCLUDED BY OPERATOR from Stage 7 and ship as-is.

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

## The 2026-07 audit (resolved)

The [full-repo audit](docs/06-engineering/AUDIT-2026-07.md) ran and every finding was fixed,
deferred, or decided. The four operator decisions were signed off and implemented this
session:

1. **Type system** — adopted **Hanken Grotesk + Spline Sans Mono** app-wide (one type
   system); the app now loads its typeface (was rendering in system-ui); Jost/Space Mono
   retired.
2. **Legacy** — deleted `client/src/legacy/` (+ `styles.css`, `bits.tsx`).
3. **Docs tidy** — merged `09-product` → `01-product`; renumbered `06-decisions` →
   `11-decisions`.
4. **Handle** — a local handle is sanitized so it can't impersonate a federated address.

Deferred (documented in the audit): a deterministic `/api/openweb/today` route test and a
client `route()` test (need source injection / a jsdom test project); making the inert
Spark/Follow/Reply controls honestly "coming soon"; retiring the server-side `rooms`/`acks`
product.

## Awaiting operator

- Turnstile keys + a rotated `SESSION_SECRET` remain deploy-time concerns (fallbacks used).

---

## CLEAN STATE DECLARATION (verified 2026-07-10)

Verified correct this session — the next session may cite these without re-checking:

- **Gate green:** typecheck + build + 118 tests pass.
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
- **Type system unified:** app + landing both render in **Hanken Grotesk + Spline Sans
  Mono** (verified in the live CSS); the legacy `client/src/legacy/` tree is gone; docs
  folders tidied (`11-decisions`, merged `01-product`).
- **Deployed version `f0139d18`** matches the current `main` build.
