# STATE

**Phase:** 1 — the clubhouse. **Status: complete.**
**Main runnable:** yes, from a fresh clone: `npm install` → `npm run migrate` → `npm run dev`.

## Done since last entry

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
