# STATE

**Phase:** 1 — the clubhouse.
**Main runnable:** yes. `npm install` → `npm run migrate` → `npm run dev` serves on localhost.

## Done since last entry

- Scaffold (build step 1): repo + git (main), `wrangler.jsonc` (Worker + D1 + R2, local),
  Hono worker owning `/api/*` with SPA fallback for all other paths, Vite + React + TS SPA
  built to `dist/client` and served by the Worker, plain-CSS design tokens from lockfile §4,
  Jost + Space Mono self-hosted from google/fonts, README describing only what runs.
- Verified with `wrangler dev`: `/api/health` returns JSON, unknown `/api/*` returns JSON 404,
  client routes fall back to the SPA shell, fonts serve.

## Open bugs

None.

## Next three tasks

1. Build step 2 — D1 migrations for the §7 schema (ULIDs) + a clearly-fake seed with a wipe command.
2. Build step 3 — auth: invite-code registration, passphrase hashing, httpOnly session cookie, login/logout, server-side `is_admin`.
3. Build step 4 — rooms + posting (admin room creation, text + image posts to R2 with one resized variant, hard-delete own posts).

## Awaiting Ren

- Domain purchase (Phase 2 gate).
- Confirmation or overrule of the editorial Timeline ruling (§5); assumed confirmed.
- Trademark search for TACET (before Phase 5, ideally earlier).
