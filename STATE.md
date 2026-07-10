# STATE

> **Re-founded 2026-07-07 around `/docs/`.** Product authority is now
> [`/docs/`](docs/), [`/FOUNDING_PRINCIPLES.md`](FOUNDING_PRINCIPLES.md), and
> [`/PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md). Tacet is **your home on the open
> social web** (People before posts · Relationships before engagement · Identity
> before platforms · Calm before addiction · Open before closed). `BUILD-LOCKFILE.md`
> and `DESIGN.md` are stamped historical. This file now tracks **build state only**,
> not product direction — see `PRODUCT_DIRECTION.md` for the superseded assumptions
> and the app-reshape plan. The running app below predates the re-founding and has
> not yet been reshaped to match.

## Done since re-founding (2026-07-07)

- **Running-costs transparency doc (2026-07-10) — docs only.** New
  [`docs/01-product/running-costs.md`](docs/01-product/running-costs.md): a public,
  dated (July 2026) estimate of what the hosted service costs to run — a monthly-USD table
  across Beta / 1k / 10k / 100k daily users (Workers, traffic, DB with a planned D1→Postgres
  migration ~10k, R2, jobs, domain+email; totals ~$6/~$10/~$65/~$350). Framed by "you are not
  the product," cheap-by-design (edge, zero egress), and cross-linked both ways with
  `business-model.md` (no conflicting numbers — those are product prices, these are infra
  costs). README's "Open source, sustainable" section links to it; no update cadence promised.
  Gate green (typecheck + build + 109 tests).

- **Adapter documentation pass (2026-07-10) — docs only.** README gained a "What Tacet reads
  today" section (Source | Covers | Status table for the four live families + closed-platforms-
  out + reading-live/publishing-next + seeds transparency). Reconciled every place that still
  called multi-network reading "future": README status/roadmap now say reading is live; the
  top warning softened; `docs/05-federation/README.md` marks the replaceable-adapter law
  *realized and generalized* (AP is one of four adapters); `docs/06-engineering/` adapter +
  folder-structure pages reference ADR-017 and the `src/openweb/` + `src/sources/` layout, and
  distinguish built **read** from unbuilt **write** federation; `FOUNDING_PRINCIPLES.md` got a
  one-line "realized by ADR-017" cross-ref (principle untouched); `business-model.md` free tier
  enumerates the four source families. No "coming soon" for live things, no "live" for the write
  track. Gate green (typecheck + build + 109 tests).

- **Open-web source adapters — FULL READ COVERAGE, LIVE (2026-07-10).** Deploy version
  **`184cc804-96d4-44f2-88b5-924aba3ec7d8`** (rollback anchor: prior live
  `53c71bec-ea7d-4d7d-b3ce-da4e45164406` → `npx wrangler rollback --config wrangler.local.jsonc`).
  ADR-017 (`docs/06-decisions/ADR-017-source-adapters.md`; numbered 017 because 013 was taken).
  Today now renders content from **every major open network** through one normalization
  contract (`src/sources/`): **ActivityPub** (live, untouched reader mapped onto the contract),
  **RSS/Atom/JSON Feed** (`src/sources/feeds/`), **AT Protocol / Bluesky** (`src/sources/atproto/`),
  and **Nostr** (`src/sources/nostr/`). One schema (the product's Moment); protocol language never
  crosses the boundary (UI gets human labels only — "Mastodon", "Bluesky", "Nostr", publication
  names); dedup by canonical URL; UTC timestamps.
  - **Architecture:** ActivityPub is read live per request (existing path never disturbed);
    feeds/Bluesky/Nostr are **collectors** refreshed by a **15-min cron** (in the git-ignored
    deploy config; tracked `wrangler.jsonc` untouched) + a lazy lock-guarded refresh on `/today`
    read, into a shared D1 store (`migration 0014`: `feeds` registry + `source_items` + `source_state`).
    `/api/openweb/today` merges all four and interleaves calmly — recency + source variety, no
    engagement (ADR-011/012). Today still ENDS (20 items); no infinite scroll.
  - **UI:** every card carries a source label + favicon; podcasts get an `<audio>` player and
    videos a poster — controls, preload none, **no autoplay**. `MomentMedia` gained `audio` + `poster`.
  - **Nostr specifics:** read-only over 4 public relays (`relays.json`) in short-lived WS windows
    (Workers can't hold a cron subscription); kind-1 notes + kind-0 profiles for 6 seed npubs
    (`seeds.json`); **Schnorr signature verification** (`@noble/curves`); cross-relay dedup;
    dependency-free bech32. A misbehaving relay is skipped + logged, never blocks the cycle.
  - **Ship debugging (folded in):** the WS **upgrade fetch had no timeout**, so a stalled relay
    hung the whole refresh (feeds/atproto persisted, Nostr wrote 0, report never written). Fixed
    with an upgrade-handshake `AbortSignal.timeout` + a 25s per-adapter budget in the refresh, plus
    durable diagnostics (last refresh report persisted to `source_state`, adapter/relay errors
    logged). Also hardened the WS message handler for binary frames.
  - **Verified live on `https://tacet.social/today`** (cache-busted): `mode:live`, 20 items,
    **all four sources present** — feeds 6, Bluesky 8, Nostr 3, ActivityPub 3 — with human labels
    (Forum/Bluesky/Nostr/Blog/Podcast/Mastodon) and favicons; `/api/health` 200; CSP/HSTS/
    `X-Frame-Options: DENY`/nosniff intact; zero protocol words in UI labels (the only "ActivityPub"/
    "RSS" strings are inside real post/profile text, which we don't censor). D1 store held
    atproto 56 / feeds 20 / nostr 40 at verification.
  - **New deps:** `fast-xml-parser` (feeds), `@noble/curves` (Nostr sig verify) — pure-JS,
    Workers-compatible; worker bundles ~100 KiB gz. **Closed platforms** (IG/TikTok/X/LinkedIn/
    Facebook) permanently out of scope as sources — no read APIs; picker orientation only.
    threads.net verified reachable; federating Threads accounts read via the AP adapter.
  - **Deferred (not blocking):** feed OpenGraph enrichment is bounded to ~6/refresh (logged);
    Bluesky video renders as a thumbnail still (HLS needs a player dep) and links out; a
    `source_items` retention prune keeps 30 days. Follow-up: user-chosen sources (product direction).

- **Business model documented (2026-07-10) — docs only, no billing code.** New
  [`docs/01-product/business-model.md`](docs/01-product/business-model.md) (canonical
  01-product product area; 09-product holds only the publishing-philosophy doc) is the
  public statement of sustainability: the open-source / decentralised / hosted-service
  distinction; free-forever commitments (full self-hostable source with no upsell-only
  feature gates + a genuinely usable free tacet.social account); the governing principle
  *"We price the service, never the software…"* with the verbatim never-list (ads, data,
  engagement mechanics); and the **planned pricing** (Free €0 · Plus €6/mo·€60/yr ·
  Identity €24/yr, bundle €96/yr · Founding €99 once/first-500 or €29/yr patron · Managed
  Homes €29/€99/from-€299/mo · later: B2B, curation, white-label) — publishing intent
  only, nothing charged. README gained an "Open source, sustainable" section; reconciled
  the manifesto (`anti-patterns.md`) and `07-brand/launch-positioning.md` by **linking**
  to the doc (never weakening). Gate green (typecheck + build + 75 tests); no app code,
  no Stripe, no pricing UI; tracked `wrangler.jsonc` untouched.

- **Landing fidelity pass to mocks 1–3, LIVE (2026-07-09).** Deploy **`bdcad653`** (rollback
  anchor `451dadb6`). Spec: `docs/10-design/hifi/fidelity-specs.md`. Verified on
  `https://tacet.social`: `/`, `/welcome/world`, `/welcome/home`, `/today` all 200; `/api/health`
  200; CSP/HSTS/`X-Frame-Options: DENY` intact; Join-the-beta → funnel flow resolves.
  - **§1 Hero background** — rebuilt from sparse to a dense encircling constellation (~340 nodes
    desktop / ~120 mobile), warm-left / cool-right + lavender, hub glow, fixed nearest-neighbour
    edge list; perpetual calm motion (wobble + twinkle + breathe); reduced-motion static (W4).
    Scroll cue re-added. Hero copy unchanged (W1). (`e280634`)
  - **§4 Convergence** — large white soft-shadow disc + iris Hearth, two concentric dotted rings,
    dotted radial connectors, stronger avatar/place drop shadows, central lavender wash. Open-web
    icons only converge (W2). (`fa8cef8`)
  - **§7 Nav + Final CTA** — 'Join the beta' is now a purple gradient pill (nav, hero, final CTA)
    per mock 1; footer copyright matches mock. (`5bcf359`)
  - **§2 Nav, §3 Fragmentation, §5 Divided, §6 People/Manifesto, §8 Welcome step 2** were brought to
    fidelity in the prior passes and left in place.
  - **Whitelist applied:** W1 (hero copy kept), W2 (open-only converge), W3 (honest 'your open web'
    phrasing; no present-tense handle claims). **Objections suppressed per contract:** (a) avatars are
    gradient placeholders, not the mock's stock photos — I won't fabricate copyrighted faces; wire real
    content later. (b) footer now reads 'All rights reserved.' per the mock, though the brand kit's
    README specified '© 2026 Tacet, a VNTA Group venture.' — flagging in case the brand line is preferred.

- **Welcome funnel + landing→Stage-6 refinements + brand type, LIVE (2026-07-09).** Deploy
  **`d57eb64d`** (rollback anchor `47192575`). Verified on `https://tacet.social`: new build
  served; `/`, `/welcome/world`, `/welcome/home`, `/today`, `/enter` all 200; `/api/health`
  200; CSP/HSTS/`X-Frame-Options: DENY`/nosniff intact.
  - **Welcome funnel (new).** The landing IS step 1. `/welcome/world` (step 2 "Your world") —
    platform picker with a 1·2·3 stepper and **honest copy** (selections orient your home, stay
    on device; no closed-platform integration promise). `/welcome/home` (step 3 "Your home") —
    the guided setup lives here and **only** here: "Welcome home." greeting → account creation
    **reusing the Enter create path** (new optional `onComplete`/`defaultMode` props — auth never
    forked) → identity basics → `/today`; "Skip for now" → `/today`.
  - **Wizard interception removed from `/today`** — anonymous `/today` now shows the walkable app
    directly (`TacetApp` no longer mounts `FirstRun`; `FirstRun.tsx`/`onboarding/hints.ts` are now
    unreferenced dead code, left in place). Signed-in visitors on any `/welcome/*` → `/today`.
  - **CTA unification.** One verb — **"Join the beta"** (nav pill, hero primary, final CTA) all →
    `/welcome/world`; **"Sign in"** → `/enter` everywhere. Removed "Find your home" / navigating
    "Continue". Nav = mark+wordmark left, Sign in + Join-the-beta pill right.
  - **Doctrine:** closed-platform logos appear ONLY in Fragmentation (the scattered status quo);
    only open-web places (Mastodon/Pixelfed/PeerTube) converge into the Tacet mark — no closed
    icon converges. EmailSection reframed to **direction, not a present-tense handle claim** (no
    `you@tacet.social`).
  - **Brand type:** landing now uses **Hanken Grotesk + Spline Sans Mono** (served same-origin from
    `/fonts`, CSP-safe). Hero background enriched: pointer parallax on desktop, lighter field on
    mobile, reduced-motion static.
  - **Hygiene:** Stage-6 exports moved `hifi/prototypes/ → hifi/handoff/`; stray `tacet-brand/test` removed.
  - **REMAINING (follow-up, not blocking):** pixel-fidelity polish toward image-1/2 — converging
    thread-lines under the Fragmentation grid, avatars in the Convergence orbit, and image-2 card
    detailing on `/welcome/world`. Optional: apply Hanken app-wide (currently landing-scoped); a
    zone Redirect Rule so the `www` SPA shell (not just worker paths) 301s to the apex.

- **Canonical brand hero adopted + apex domain FIXED, LIVE (2026-07-09).**
  - **Hero** rebuilt to the brand kit's own landing hero (`docs/10-design/tacet-brand/ui_kits/landing`):
    full-height deep-ink moment — breathing **Hearth** mark, "The internet, quiet enough to feel like
    home." (iris "quiet enough"), your-people/your-pace/your-place subline, **Find your home** (solid
    iris) + **How it works** (quiet), and the five values row. Iris glow + blossom wash over the moving
    constellation. Nav → brand links (Why tacet · Communities · Open web · Sign in; collapse on mobile).
    This supersedes the interim "The social web. Finally." hero. Sections below unchanged.
  - **Brand kit vendored** at `docs/10-design/tacet-brand/` (Hearth mark/wordmark SVGs, constellation
    backgrounds, tokens, guidelines). Landing accent aligned to **iris `#7B61FF`** / highlight `#A18BFF`.
  - **"Works like email"** band brought back as an animated dark band (flowing links from one address
    out to people on their places). Real platform logos in Fragmentation/Convergence (operator override
    of the handoff's neutral-monogram rule — recorded).
  - **Apex `tacet.social` now LIVE over HTTPS.** Root cause: the apex is *proxied* through Cloudflare
    (returned CF **520** to a stale/dead origin), so TLS already terminated at the edge — the fix did
    **not** need DNS-edit permission (the OAuth token is `zone:read` only). Added a **Worker route**
    `tacet.social/*` (git-ignored `wrangler.local.jsonc`; tracked config untouched) which intercepts the
    apex at the edge and serves the Worker before the dead origin. `www` stays a custom domain;
    workers.dev fallback kept. **Verified:** `/` 200 (15/15 stable), `/api/health` 200, `today`/`people`
    200, TLS verify=0, HTTP/2, CSP/HSTS/`X-Frame-Options: DENY`/nosniff intact; serves the new hero build.
  - Deploy version **`11deb8ac-aeca-4c18-ab56-42bf855a8988`** (route added). Prior versions this session:
    `55c3e602` (brand hero), `a0005de2` (first hi-fi landing). Rollback: `npx wrangler rollback --config wrangler.local.jsonc`.

- **Landing → Stage 6 high fidelity, LIVE (2026-07-09).** Rebuilt the public landing at `/`
  to the canonical handoff (`docs/10-design/hifi/prototypes/`, README authoritative) in three
  pushed surfaces: (1) hero identity — "The social web. **Finally.**" with a top nav carrying
  the single gradient "Join the beta"; constellation background rebuilt as a warm→cool ring
  (magenta/amber left, lavender/blue right) with glowing hubs, framing an open centre
  (`2e2a6e8`). (2) Alternating light bands — Fragmentation (closed-platform logo cards),
  Convergence (open-web places orbiting one Tacet home), and a new **Divided** band that
  **replaces** the old federation panel (which used protocol jargon + raw `@user@instance`
  handles — a doctrine refusal, now removed); real brand marks via `BrandLogos` (`8218df9`).
  (3) Dark lamplit-purple CTA band + canonical footer (`309d016`). The loud watermark/marquee
  `DevWarningOverlay` was replaced by a minimal, non-moving `DevBanner` (landing + Enter).
  Semantic/landing-scoped tokens only; both themes honoured. **Operator override (recorded):**
  real platform logos are used, overriding the handoff's neutral-monogram rule. Gates green
  each surface (typecheck + build + 75 tests).
  - Deployed `wrangler deploy --config wrangler.local.jsonc`; **Version `a0005de2-5cf5-4d11-93f0-2602e10d41c4`**.
    Rollback anchor (prior live): `0ec9555a-d8d0-463f-93aa-8984c91c25fe` → `npx wrangler rollback --config wrangler.local.jsonc`.
  - **Verified live on `https://www.tacet.social`:** `/` 200 (shell references the new build
    `index-CHGE6xIA.css` / `index-CsHwbP2z.js`), `/api/health` 200 `{"ok":true}`,
    `/api/openweb/today` & `/people` 200 non-empty; headers intact (CSP, HSTS, `X-Frame-Options: DENY`, nosniff).
    workers.dev also 200. Apex `tacet.social` still **520** (pre-existing stale-record issue; unchanged by this deploy).
  - **Remaining (not this session):** the 16 app screens + Onboarding "Your World" from the same
    Stage 6 handoff are NOT yet implemented — landing only.

- **Production readiness (Cloudflare).** Localhost is now **development only**; the
  production target is **tacet.social** on Cloudflare. Hardened the Worker: security
  headers on API responses + a `client/public/_headers` file for the static/SPA responses
  (CSP allowing open-web media, HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy,
  Permissions-Policy); `Cache-Control: no-store` on `/api/*`, `no-cache` on the SPA shell,
  immutable on hashed assets. Enabled Workers **observability** (logging). Config/secret
  separation intact (placeholders in tracked `wrangler.jsonc`; real ids only in git-ignored
  `wrangler.local.jsonc`). Verified: typecheck + build + 75 tests, dry-run deploy (bindings
  resolve), and headers confirmed live under the runtime.

- **Production DEPLOYED (2026-07-09) — live on `*.workers.dev`; custom domain pending one manual step.**
  Nameservers for `tacet.social` were moved to Cloudflare (`anirban`/`serenity.ns.cloudflare.com`);
  the zone is **Active** on the account that owns the existing D1/R2 (Option A, reuse — no data move).
  Done this session:
  - Remote D1 migrations **0010–0013 applied** to the live `tacet` DB (0001–0009 were already applied);
    `migrations list --remote` now clean.
  - `wrangler deploy --config wrangler.local.jsonc` succeeded (Worker + SPA assets); bindings resolve
    (DB `tacet`, BUCKET `tacet-images`, ASSETS). `SESSION_SECRET` already present (not rotated).
  - **Live + verified on `https://tacet.singpurwalakevin.workers.dev`:** `/` 200 (SPA shell),
    `/api/health` 200 `{"ok":true}` (`Cache-Control: no-store`), `/api/openweb/today` & `/api/openweb/people`
    200 with real federated data; security headers present (CSP, HSTS, `X-Frame-Options: DENY`, nosniff).
  - **Rollback:** `npx wrangler rollback --config wrangler.local.jsonc` (prior live version was `****ea21`).
  See `docs/08-roadmap/deployment-plan.md`.

- **Custom-domain cutover (2026-07-09) — `www.tacet.social` LIVE; apex `tacet.social` blocked on one record deletion.**
  Attached via the Cloudflare Workers-domains API (`PUT /accounts/{acct}/workers/domains`) with an
  account API token (Workers scope; token was single-use and must be rotated — it was shared in chat).
  - **`www.tacet.social` ✅ LIVE + verified** (cert provisioned): `/` 200 (SPA + CSP/HSTS/`X-Frame-Options: DENY`/nosniff),
    `/api/health` 200 `{"ok":true}` `Cache-Control: no-store`, `/api/openweb/today` & `/people` 200 non-empty.
    *(Verified with IP-pinned `curl --resolve` because the sandbox blocks fresh UDP DNS; DoH confirmed the record.)*
  - **Apex `tacet.social` ⛔ still blocked.** Attach returned CF error **100117** — the apex already has an
    *externally-managed* A record (stale Blacknight import → dead host, returns 520). The Workers-scoped
    token can *create* new records (www worked) but **cannot delete** the pre-existing apex record; that
    needs **Zone / DNS / Edit**, which the token lacks. **To finish (either):** (a) dashboard → DNS →
    Records → delete the apex `A tacet.social` record, then attach via API:
    `PUT /accounts/{acct}/workers/domains {zone_id, hostname:"tacet.social", service:"tacet", environment:"production"}`;
    or (b) provide a token with **Zone/DNS/Edit + Workers Scripts/Edit** and re-run (auto delete + attach);
    or (c) dashboard → Workers & Pages → `tacet` → Domains & Routes → **Add Custom Domain → tacet.social**
    (accept "replace existing DNS record").
  - workers.dev URL remained enabled and 200 throughout (no wrangler deploy this session).
  - DNS backup NOT created (token lacked DNS-read scope; nothing was deleted, so no rollback artifact needed).

- **Publishing philosophy** (`docs/09-product/publishing-philosophy.md`) — foundational
  design doc; refined pass added a "What is Home?" section, owned-vs-kept distinction,
  clarified Entry is an internal abstraction (UI stays human), and reframed protocol
  mapping as faithful representation.

- **Identity & Workspace foundations.** The local Me is now a real Tacet identity, owned by
  a **workspace** (an owned identity space; one default "Personal" per device now,
  business/project later). `migration 0013` adds `me_workspaces` and expands `me_profiles`
  (banner/website/location/fields + `workspace_id`); the workspace id **equals** the profile
  id (1:1) so all existing content (saved/collections/notes/reading-later/pinned/recently-
  viewed) is workspace-scoped with **zero re-keying** — nothing broke. Local identity fields:
  display name, preferred handle (local, **not** a federation handle — no `@you@tacet.social`
  claimed), bio, avatar/banner (URL for now), website, location, profile fields/links,
  timestamps. **Public vs private split:** Me is the private home (saved/notes/history);
  a new **Public Profile Preview** (`/me/preview`, "View as public") renders the identity
  through the **same** shared `ProfileView` used for remote people — public fields only, no
  saved/notes/history. Strict UI→Domain→Persistence layering; **no** write/federation path.
  Also fixed **text spillover** (long URLs/words now wrap across Today/Profiles/Conversations/
  Saved/Me). 75 tests pass (workspace default, full-identity round-trip, per-device isolation).

- **Profiles 2.0.** Tacet profiles now present a person's full *public* presence — banner,
  avatar, name, handle, bio, **website + metadata fields**, **location**, **joined date**,
  and **followers / following / posts** counts — in Tacet's own language, with Posts /
  Media / About sections. Timeline made authoritative: `src/openweb/resolve.ts` resolves
  reference-only and boosted posts (bounded fetch) so it's not limited to embedded Creates
  (Gargron: 9→27 posts). Profiles briefly cached (90s). **QA fixes folded in:** (1)
  multi-attachment media — every public image/video is preserved and rendered as a gallery
  (a four-image post shows four; verified live); (2) **home vs software** — the person's
  home (host, e.g. `twit.social`) is surfaced as identity; software (e.g. Mastodon) is
  secondary infrastructure. All generic through the adapter; read-only. Domain `Person`
  expanded (banner/joinedAt/website/location/fields/counts); parser reads actor
  attachments/published/followers/following/image; `ApClient.getCollectionTotal` for
  counts. 73 tests pass (7 new). Known gap: some Pixelfed-native outboxes yield no
  normalizable posts (counts still shown). See `docs/05-federation/compatibility.md`.

- **Conversation counts (contextual, calm).** Posts everywhere now carry lightweight
  context — `Moment.counts` (`reactions`/`replies`/`shares`), normalized generically:
  from AP objects' embedded `likes`/`replies`/`shares` `totalItems`, and from Mastodon
  REST `favourites_count`/`replies_count`/`reblogs_count`. Shown as one quiet tertiary
  line ("104 reactions · 12 replies · 5 shared"), zeros hidden, absence ≠ zero, no icons
  or ranking — context over competition. Rendered in `LiveMoment` (Today/Profiles/
  Conversations) and `SavedCard`; counts are captured into the Saved snapshot
  (`migration 0012`). No new engagement mechanics. 67 tests pass; live-verified.

- **Conversations (read-only reader).** Opening a post now reads its *conversation* inside
  Tacet at `/c/<post>`: the context that started it (ancestors via `inReplyTo`), the post
  itself (prominent), and a nested reply tree (via `replies` collections), plus a
  participants row — editorial and calm, with progressive reveal and a clear "that's the
  whole conversation" end. `Conversation` is a first-class domain object (`src/openweb/
  conversation.ts`); the UI never touches ActivityPub reply collections. New endpoint
  `GET /api/openweb/conversation?post=`. One assembler for every implementation; bounded +
  graceful (missing parents, reference-only replies skipped). Posts everywhere open the
  reader (and record to Recently viewed); the Conversations pillar now lists threads you've
  read (no more mock DMs). Strictly read-only — no replies/comments/likes/writes.
  64 tests pass (6 new, no network). Live-verified reading a Mastodon thread.

- **Remote profiles.** Every person — from Mastodon, Pixelfed, PeerTube, Misskey,
  Friendica, or any supported implementation — now has a beautiful profile page **inside
  Tacet** at `/p/<actor>`. Avatar, display name, handle, bio, source badge, recent public
  posts (with media), and a "View original" link. Authors in Today and people in
  People/Discover are clickable through to it. Reuses the generic ActivityPub core
  (`getProfile` in the facade: actor + outbox → normalize → Person + Moment[]) and the same
  `LiveMoment` used everywhere, so each post keeps local **Save**. Read-only: no follow,
  reply, or write. Graceful: a null profile renders a calm error; empty outbox renders a
  calm empty state. New endpoint `GET /api/openweb/profile?actor=`. Live-verified against
  Mastodon + Pixelfed. Known limitation: some homes' outboxes surface fewer normalizable
  posts (boost/reference-only items are skipped read-only).

- **The first five minutes.** A calm, Apple-setup-style first-run (`client/src/app/
  onboarding/`) that runs once per device: Welcome → personalise your local profile
  (name + optional handle) → hand off into Today. Not a tutorial or feature tour. The
  product then teaches through use via gentle one-line, dismissible nudges: on Today,
  "Save anything you love…" then, after the first save, "That's yours now — waiting in
  Me"; on Me, a single nudge toward Collections. All device-local (localStorage), no new
  social features, still read-only toward the open web. Client-only; no backend change.

- **Me — local-first home.** The "Me" pillar is now real: a local profile plus persistent
  Saved, Collections, Private notes, Reading later, Pinned, and Recently viewed — all in
  Tacet's own D1 (`migrations/0011_me.sql`), owned by the user, never federated. Strict
  layering (UI → `/api/me/*` routes → `src/me/repo.ts` persistence → D1); the UI never sees
  SQL. Local identity is a signed `tacet_me` device cookie (not remote auth). Saving stores
  a full snapshot so a saved post survives remote deletion. Save works from Today; posts you
  open are recorded to Recently viewed. Read-only toward the open web (no follows/posts/
  writes). 58 tests pass (6 new Me tests). See [`src/me/README.md`](src/me/README.md).

- **Public-release preparation.** Repository made safe for open-source release: full
  canonical AGPL-3.0 `LICENSE`; governance files (`CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `SECURITY.md`); public-facing `README`; `.dev.vars.example`.
  All Cloudflare infrastructure identifiers (account id, D1 database id, the interim
  `*.workers.dev` subdomain, account-owner references) were replaced with
  placeholders **and scrubbed from the entire git history** (filter-branch across all
  44 commits, backups pruned, gc run — verified zero occurrences remain). Local
  development is untouched: real ids live in a git-ignored `wrangler.local.jsonc`,
  secrets in a git-ignored `.dev.vars`. Typecheck, build, and 31 tests green.

- **Consolidation pass.** Froze the five pillars (Today/People/Discover/
  Conversations/Me) in `FOUNDING_PRINCIPLES.md` with the pillar rule + the
  "complete product / replaceable ActivityPub adapter" law. Quarantined the old
  "rooms" product into `client/src/legacy/` (dormant, tree-shaken out — bundle
  dropped ~25 modules, JS 69→59 KB gz, CSS 10.5→6.3 KB gz), with a concept-migration
  map in `client/src/legacy/README.md`. Collapsed routing to a single model in
  `App.tsx` (Landing → Auth → the five pillars; legacy/public URLs redirect in). New
  flow decoupled from the old `styles.css` (now legacy-only). Audited the UI for
  protocol jargon — none surfaced; removed a redundant per-post "server" badge so
  everyone is simply "a person." Repositioned `docs/05-federation` as an
  implementation detail.

- **Docs-first restructure.** Added `/docs/` (00-manifesto → 08-roadmap),
  `FOUNDING_PRINCIPLES.md`, `PRODUCT_DIRECTION.md`; rewrote the root `README.md` as a
  product introduction. Stamped `BUILD-LOCKFILE.md` and `DESIGN.md` historical.

- **Landing page** at `/` for signed-out visitors (`client/src/views/landing/`):
  keynote-style single-scroll — breathing-network hero, platform selector,
  fragmentation → convergence, federation-as-email, manifesto, CTA. Scoped `.lp-*`
  CSS; reduced-motion aware.

- **Frontend Alpha** — the new product experience, replacing the hardcoded dark-only
  shell. Runs entirely on **mock data** (`client/src/app/mock.ts`); no backend calls.
  - **Design system** (`client/src/design/`) implementing `docs/03-design-system`
    verbatim: `theme.css` semantic tokens with warm **light + dark** as peers
    (system pref + manual `data-theme`, no-flash `initTheme`); `icons.tsx` (Tacet's
    own stroke set); `primitives.tsx` (typed Button/IconButton/Card/Avatar/Chip/…).
  - **App** (`client/src/app/`): responsive `AppShell` (desktop rail + mobile
    tabbar/FAB), screens **Today / People / Discover / Conversations / Me**, and a
    `ComposeSheet`. PostCard carries private Save + Spark (no public counts).
  - **Routing:** `/today`../`me` are walkable without a session (demo alpha); the
    old rooms views (`RoomList`, `Feed`, `Timeline`, …) remain in the tree but are
    routed around. Sign-in (`Enter`) rebuilt on the design system and routes to
    `/today`.
  - **Design source of truth caveat:** the Claude Design workspace (our High-Fidelity
    environment, replacing Figma) could not be opened this session, so the alpha was
    built to the repo's `docs/03-design-system` spec by Ren's direction — to be
    reconciled against the approved High-Fidelity design later.
  - Typecheck + `vite build` green. Local dev: `npm run dev` (→ 8787).

---

**Phase:** 2 — the address (in progress). Phase 1 complete + Amendments 1 & 2.
**Main runnable:** yes, locally: `npm install` → `npm run migrate` → `npm run dev`.
**Deploy:** see `DEPLOY.md`. Blocked only on R2 being enabled on the account.
**Canonical-record goal:** the VNTA-internal "canonical record / syndication" strategy is a **separate, private workstream** — deliberately out of scope for this open-source product (see [PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md) §9).
**Locked thesis (Amendment 3):** a gateway back to the good internet, rebuilt for 2026 — one home, owned by you, chronological, quiet — **keep the action, cut the scoreboard** — powered by AI, open to all (human + AI). Following + AI residents are first-class; no counts/algorithm/ads. Open item: dislikes (held cut, Ren's final call). Next build tracks: (1) follow + personal feed + profiles; (2) rebuild the UI to the dossier/mockup (`design/web-mockup.html`).

## Done since last entry

### Amendment 2 — Phase 2 begins: the address + member invites (authorised by Ren)

- **Member invites:** any member can mint an invite and share a one-use `/join/<code>` link;
  a member sees only their own invites, admin sees all. Invite panel added to YOU. Still
  fully invite-gated — no public registration.
- **Turnstile-ready:** enforced only when `TURNSTILE_SECRET`/site key are configured (local
  dev + tests keyless). `/api/config` exposes the public site key; the register form renders
  the challenge; the server calls siteverify.
- **Deployed to an interim Cloudflare `*.workers.dev` address** (private, invite-gated)
  for early testing. Deploy details (account id, database id, secrets) live in the
  deployer's own Cloudflare account and `.dev.vars`, never in the repo — see
  [`DEPLOY.md`](DEPLOY.md).
  - ✅ D1 created + migrated; R2 bucket created; session secret set out-of-band.
  - ✅ Live smoke test: health ok, SPA serves, auth guard 401s, `/api/config` returns
    null Turnstile.
  - Note: this deployment predates the re-founding and runs the legacy rooms app.
- Redeploy: `npm run build && npx wrangler deploy` (+ `d1 migrations apply tacet
  --remote` if migrations changed). 29 tests green; still no counts/algorithm/ads/notifs/red.

### Earlier

### Amendment 1 — acknowledgment, rooms-as-people, the why-surface (authorised by Ren)

Lockfile amended (§10). Built and verified (28 tests green):

- **ACKNOWLEDGE** verb: a reader places one word from a fixed set (`SEEN` / `WITH YOU` /
  `MORE`) on a post. Attributed and room-visible, shown as names grouped by word, **never a
  count, never an opposite**. Appears in Timeline and post detail; Grid stays silent.
  Migration `0002` adds the `acknowledgments` table; API is `PUT`/`DELETE /posts/:id/ack`;
  posts carry `acks[]` + the viewer's `my_ack`.
- **Rooms are people, not formats; the lens is the format.** Rooms gain a `default_lens`
  (set by admin at creation, user-overridable); room detail resolves lens = saved pref ??
  room default. Onboarding + About teach this.
- **Keep** gains a private **Your keeps** view (`GET /api/keeps`, `/keeps` route), across
  rooms, with unkeep-to-curate.
- **The why-surface:** a first-run **onboarding** overlay (once per device) and a rebuilt
  **YOU/settings** surface that states the house's promises plainly and links to Your keeps
  and About. About's "verbs" copy updated for accuracy (now reply / keep / acknowledge).
- Seed + wipe updated to cover `default_lens` and `acknowledgments`.

### Earlier this session

- **About page** (Phase-1-scope addition): a static `/about` route reached from the YOU tab
  via the mono link `About this house`. Hardcoded, verbatim copy styled per DESIGN.md
  (system text in `--secondary`/`--dim`, mono section labels, no panels, no icons), with a
  foot showing the app version (injected from `package.json`) and `TACET` letterspaced.
  No CMS, no service worker, no analytics. Route serves; build + 21 tests green.

Phase 1 is built and verified end to end. All eight build steps complete:

1. Scaffold — Worker (Hono) owning `/api/*` with SPA fallback; Vite + React + TS SPA
   served from `dist/client`; design tokens (lockfile §4); Jost + Space Mono self-hosted.
2. Database — `migrations/0001_init.sql` for the §7 model (ULID ids, ISO-8601 UTC); seed
   with obviously-fake placeholder data (`placeholder-` prefixes, `[PLACEHOLDER]` bodies)
   and `npm run seed:wipe`.
3. Auth — invite registration, scrypt passphrases, httpOnly HMAC session cookie, login,
   logout, server-side `is_admin`. First account bootstraps as admin with no invite.
4. Rooms + posting — room directory, admin-only room creation (memberships for all users),
   text and image posts (original + one resized variant in R2), hard-delete own posts.
5. Replies + keeps — flat replies; private keep/unkeep; author sees the word `kept`
   (never who, never a number).
6. Lenses — Timeline (editorial §5) and Grid; ~300ms cross-fade (reduced-motion aware);
   lens choice persists per user per room.
7. Invites admin — mint and list invite codes; each shows used / open and by whom.
8. Tests + polish — 21 API/auth tests pass (`npm test`, Workers runtime + local D1);
   product-law self-audit clean (no red, counts, badges/dots, notifications, service
   worker, analytics); fresh clone verified (ci → migrate → build → test → dev → seed).

Also added `DESIGN.md` (visual/interaction reference, subordinate to the lockfile).

### Build decisions (within lockfile authority)

- **Bootstrap admin:** with zero users, the first registration needs no invite and becomes
  admin. This is how Ren's account is created; documented in code and README.
- **Sessions are stateless** (HMAC-signed httpOnly cookie), so the schema stays exactly at
  §7 (no sessions table). Local dev uses a fallback secret; see Phase 2 gate below.
- **Image variant is produced in the browser** (canvas) and uploaded alongside the original,
  keeping the Worker free of an image-decoding dependency while still storing a real
  resized variant (§3).

## Open bugs

None.

## Next three tasks

Phase 1 is done; do not begin Phase 2 work until Ren opens the gate. When Phase 2 starts:

1. Provision the real D1 database id and R2 bucket; set `database_id` in `wrangler.jsonc`.
2. Set a real `SESSION_SECRET` binding (replaces the local-dev fallback).
3. Add Turnstile to registration and deploy to the purchased domain (no new features).

## Awaiting Ren

- **Domain purchase** (Phase 2 gate).
- **Turnstile keys** (Phase 2 gate).
- **A real `SESSION_SECRET`** before any deploy (Phase 2 gate; local dev uses a fallback).
- Confirmation or overrule of the editorial Timeline ruling (§5); assumed confirmed.
- Trademark search for TACET (before Phase 5, ideally earlier).

## Definition of done (Phase 1) — met

- All eight build steps complete, `npm test` green (21), main runnable from a fresh clone.
- No code, schema, or scaffolding exists for any §6 non-goal (federation, instruments,
  extra lenses, video, portraits, notifications, search, editing, DMs, mobile apps).
