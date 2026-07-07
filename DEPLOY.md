# Deploying Tacet

Tacet runs as a single Cloudflare Worker (Hono API) that also serves the built React
SPA, backed by Cloudflare **D1** (SQLite) and **R2** (image storage). You can deploy it
to **your own** Cloudflare account. Local development needs none of this — see the
[README](README.md).

> Tacet is early software. Treat any deployment as experimental.

## Prerequisites

- A Cloudflare account.
- `npx wrangler login` (authenticates the CLI with your account).
- Your `account_id` set in [`wrangler.jsonc`](wrangler.jsonc) (or via
  `CLOUDFLARE_ACCOUNT_ID`).

## One-time setup

```sh
# 1. Create a D1 database and copy the printed id into wrangler.jsonc (database_id).
npx wrangler d1 create tacet

# 2. Enable R2 in the Cloudflare dashboard (free tier is fine), then create the bucket.
npx wrangler r2 bucket create tacet-images

# 3. Apply migrations to the remote database.
npx wrangler d1 migrations apply tacet --remote
```

## Deploy

```sh
npm run build                 # build the SPA into dist/client
npx wrangler deploy           # deploy the Worker + assets; prints the live URL

# Set a strong session secret (signs the session cookie):
printf '%s' "$(openssl rand -hex 32)" | npx wrangler secret put SESSION_SECRET
```

Setting a secret takes effect immediately on the running Worker (no redeploy needed).

## Optional: Turnstile (bot challenge on registration)

Registration is only challenge-gated when both keys are present.

1. Cloudflare dashboard → **Turnstile** → add a widget for your hostname. Copy the
   **site key** (public) and **secret key**.
2. Set them:
   ```sh
   printf '%s' "<secret-key>" | npx wrangler secret put TURNSTILE_SECRET
   printf '%s' "<site-key>"   | npx wrangler secret put TURNSTILE_SITE_KEY
   ```
3. The SPA reads the site key from `/api/config` at runtime.

## Updating a live deployment

```sh
npx wrangler d1 migrations apply tacet --remote   # if there are new migrations
npm run build && npx wrangler deploy
```

## Notes

- The first account to register on a fresh database becomes the **admin** (bootstrap).
- Local dev is unaffected: `npm run migrate` + `npm run dev` use a simulated local
  D1/R2 and a throwaway dev session secret.
- Secrets never live in the repo. Use `wrangler secret put` for deployments and a
  git-ignored `.dev.vars` locally (see [`.dev.vars.example`](.dev.vars.example)).
