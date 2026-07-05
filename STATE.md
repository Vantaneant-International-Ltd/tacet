# STATE

**Phase:** 2 — the address (in progress). Phase 1 complete + Amendments 1 & 2.
**Main runnable:** yes, locally: `npm install` → `npm run migrate` → `npm run dev`.
**Deploy:** see `DEPLOY.md`. Blocked only on R2 being enabled on the account.

## Done since last entry

### Amendment 2 — Phase 2 begins: the address + member invites (authorised by Ren)

- **Member invites:** any member can mint an invite and share a one-use `/join/<code>` link;
  a member sees only their own invites, admin sees all. Invite panel added to YOU. Still
  fully invite-gated — no public registration.
- **Turnstile-ready:** enforced only when `TURNSTILE_SECRET`/site key are configured (local
  dev + tests keyless). `/api/config` exposes the public site key; the register form renders
  the challenge; the server calls siteverify.
- **Deploy progress (the deployer Cloudflare account):**
  - ✅ Remote D1 `tacet` created (`<d1-database-id-old>-…`) and migrated (0001 + 0002).
  - ✅ `wrangler.jsonc` has real `account_id` + `database_id`.
  - ⛔ **R2 not enabled on the account** — blocks `tacet-images` bucket + `wrangler deploy`.
    Ren must enable R2 in the dashboard (see `DEPLOY.md`), then one `deploy` finishes it.
  - ⏳ `SESSION_SECRET` + Turnstile keys set after first deploy.
- 29 tests green; still no counts/algorithm/ads/notifications/red.

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
