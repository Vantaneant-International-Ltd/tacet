# Deploying TACET (Phase 2 — the address)

TACET deploys to Cloudflare Workers on the **the deployer** account
(`account_id` in `wrangler.jsonc`). A free `*.workers.dev` URL is the interim address;
a purchased domain is pointed at it later.

## One-time setup (mostly done)

| Step | Status | Command |
|---|---|---|
| Remote D1 database | ✅ created + migrated | `wrangler d1 create tacet` → id in `wrangler.jsonc` |
| R2 bucket for images | ⛔ **blocked on you** | enable R2 in the dashboard, then `wrangler r2 bucket create tacet-images` |
| Session secret | ⏳ after first deploy | `printf '%s' "<random>" \| wrangler secret put SESSION_SECRET` |
| Turnstile (optional now) | ⏳ before Phase 2 "done" | see below |

### Enable R2 (your gate — ~2 clicks)

R2 must be switched on at the account level before a bucket can be created (Cloudflare
asks for a card even on the free tier; images are tiny, cost is ~£0).

1. Cloudflare dashboard → **R2** → **Enable / Purchase R2** (free tier is fine).
2. Then, back here: `npx wrangler r2 bucket create tacet-images`

## Deploy

```sh
npm run build                 # build the SPA into dist/client
npx wrangler deploy           # deploy worker + assets → prints the *.workers.dev URL
printf '%s' "$(openssl rand -hex 32)" | npx wrangler secret put SESSION_SECRET
```

`wrangler deploy` prints the live URL. Setting the secret takes effect immediately on the
running worker (no redeploy needed).

## Turnstile (challenge on registration)

Registration is only challenge-gated when keys are present, so this is optional to go live
but required before calling Phase 2 done.

1. Dashboard → **Turnstile** → add a widget for the workers.dev hostname. Copy the
   **site key** (public) and **secret key**.
2. Set them:
   ```sh
   # site key is public — put it in wrangler.jsonc "vars", or as a secret; either works
   printf '%s' "<secret-key>" | npx wrangler secret put TURNSTILE_SECRET
   printf '%s' "<site-key>"   | npx wrangler secret put TURNSTILE_SITE_KEY
   ```
3. Redeploy or just set — the SPA reads the site key from `/api/config` at runtime.

## Updating the live app later

```sh
npx wrangler d1 migrations apply tacet --remote   # if there are new migrations
npm run build && npx wrangler deploy
```

## Notes

- The first person to register on the fresh remote DB becomes the **admin** (bootstrap).
  Do this yourself first, then invite others.
- Local dev is unaffected: `npm run migrate` + `npm run dev` still use the simulated
  local D1/R2 and a dev session secret.
