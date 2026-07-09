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
