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
  - **Design source of truth caveat:** the Figma/Claude Design workspace could not be
    opened (design access unauthenticated this session), so the alpha was built to the
    repo's `docs/03-design-system` spec by Ren's direction — to be reconciled against
    the approved design later.
  - Typecheck + `vite build` green. Local dev: `npm run dev` (→ 8787).

---

**Phase:** 2 — the address (in progress). Phase 1 complete + Amendments 1 & 2.
**Main runnable:** yes, locally: `npm install` → `npm run migrate` → `npm run dev`.
**Deploy:** see `DEPLOY.md`. Blocked only on R2 being enabled on the account.
**Canonical-record goal:** see [`GOALS-SYNDICATION.md`](GOALS-SYNDICATION.md) — TACET as canonical record, Instagram as syndication window (standing VNTA decision, 5 Jul 2026).
**Locked thesis (Amendment 3):** a gateway back to the good internet, rebuilt for 2026 — one home, owned by you, chronological, quiet — **keep the action, cut the scoreboard** — powered by AI, open to all (human + AI). Following + AI residents are first-class; no counts/algorithm/ads. Open item: dislikes (held cut, Ren's final call). Next build tracks: (1) follow + personal feed + profiles; (2) rebuild the UI to the dossier/mockup (`design/web-mockup.html`).

## Done since last entry

### Amendment 2 — Phase 2 begins: the address + member invites (authorised by Ren)

- **Member invites:** any member can mint an invite and share a one-use `/join/<code>` link;
  a member sees only their own invites, admin sees all. Invite panel added to YOU. Still
  fully invite-gated — no public registration.
- **Turnstile-ready:** enforced only when `TURNSTILE_SECRET`/site key are configured (local
  dev + tests keyless). `/api/config` exposes the public site key; the register form renders
  the challenge; the server calls siteverify.
- **DEPLOYED — live on the the-account Cloudflare account** (Renato's own account had
  R2 disabled; Ren directed us to his work account, where R2 was already on):
  - 🌐 **https://example.workers.dev**
  - ✅ D1 `tacet` (`dbad5dea-…`) created + migrated (0001, 0002); R2 bucket `tacet-images`
    created; `SESSION_SECRET` set; `wrangler.jsonc` carries Kevin's `account_id` + db id.
  - ✅ Live smoke test: health ok, SPA serves, auth guard 401s, `/api/config` returns null
    Turnstile (so invite-holders can register now).
  - ⏳ **Ren to register first** on the live URL → becomes the bootstrap admin, then hand out
    `/join/<code>` invite links.
  - ⏳ Turnstile keys (optional now; before Phase 2 "done") — see `DEPLOY.md`.
  - 🧹 An empty orphan `tacet` D1 on the the deployer account (`<d1-database-id-old>`) to be deleted.
- Redeploy later: `npm run build && npx wrangler deploy` (+ `d1 migrations apply tacet
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
