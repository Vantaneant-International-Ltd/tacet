# Deployment & Domain Migration Plan (tacet.social → Cloudflare)

> **Status: EXECUTED — kept as a historical record (2026-07).** This plan was carried out.
> Tacet is live on `tacet.social` (see [STATE.md](../../STATE.md) and
> [ADR-017](../11-decisions/ADR-017-source-adapters.md)), on the existing Cloudflare account
> (Option A — reuse), with D1 migrations 0001–0014 applied and a 15-min refresh cron. The
> "do not execute / decision needed / confirmation gate" language below is left intact for
> the record but is no longer pending — read it in past tense.

Current facts:
- Domain **tacet.social** is registered/DNS-hosted at **Blacknight**.
- Your Wrangler CLI is authenticated and has access to more than one Cloudflare
  account. The existing Tacet D1/R2/Worker live under **one specific account** (the
  one the app was first deployed to). Its real account id, database id, and bucket
  are in your **git-ignored `wrangler.local.jsonc`** — never in this public repo.
- Existing infra: D1 `tacet`, R2 bucket `tacet-images`, Worker `tacet`.

> This document is in the **public** repo, so it deliberately names **no** account
> ids or emails. When you deploy, the concrete values come from your local
> `wrangler.local.jsonc` and your Cloudflare login.

---

## Decision needed first: which Cloudflare account owns production?

Two options — **your call**:

- **A. Keep it on the account that already has the D1/R2** (the one referenced by
  `wrangler.local.jsonc`). Zero data migration; fastest. The zone (tacet.social) would
  then live on that account.
- **B. Move everything to a different account you prefer to own it.** Cleaner ownership,
  but requires recreating D1/R2 there (new empty resources) and re-running migrations.

**Recommendation:** **A** for the first production cut (reuse existing D1/R2, no data
move), unless you want tacet.social's zone on a different account for ownership
reasons. This plan assumes **A**; switching to B changes only steps 1, 8, 9.

---

## 1. Cloudflare account selection
- Confirm the target account (A: the one your `wrangler.local.jsonc` already points at).
- `npx wrangler whoami` to confirm the CLI is on the right account; if not,
  `npx wrangler login` / set `CLOUDFLARE_ACCOUNT_ID`.

## 2. Add tacet.social to Cloudflare (creates the zone)
- Cloudflare dashboard → **Add a site** → `tacet.social` → choose the **Free** plan.
- Cloudflare scans existing DNS. **Review the imported records** against Blacknight
  before proceeding (see step 5) so nothing (email/MX, existing A records) is dropped.
- *Requires your Cloudflare login.* (Dashboard action.)

## 3. Get Cloudflare nameservers
- After adding the site, Cloudflare shows **two assigned nameservers**
  (e.g. `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`). Copy them.

## 4. Update nameservers at Blacknight  ⚠️ confirmation gate
- **Requires your Blacknight login.** In Blacknight's control panel → domain
  `tacet.social` → **Nameservers** → replace Blacknight's with the two Cloudflare
  nameservers.
- **Do not do this until DNS records are staged in Cloudflare (step 5)** so the cutover
  is seamless. Propagation: minutes–48h.
- **I cannot do this** (needs your registrar login). This is the one irreversible-ish
  external step — do it only when ready.

## 5. DNS records needed (stage in Cloudflare BEFORE the nameserver switch)
Mirror everything currently at Blacknight, plus the app:
- **App:** the Worker is attached via a **custom domain** (step 7), which creates the
  needed proxied record automatically. If instead using a route, add:
  - `A` / `AAAA` `tacet.social` → proxied (Cloudflare will manage), or a `CNAME`
    `www` → `tacet.social` (proxied).
- **Email (critical — don't lose it):** copy existing **MX**, plus **SPF** (`TXT`),
  **DKIM** (`TXT`/`CNAME`), and **DMARC** (`TXT`) records exactly from Blacknight. If
  email is on Blacknight/Google/etc., these must carry over or mail breaks.
- **Verification/other:** any existing `TXT` verifications, `CNAME`s (e.g. for a
  status page), etc.
- Keep records **DNS-only (grey cloud)** where proxying would break them (MX, some
  TXT); proxy (orange) only the web/app records.

## 6. Worker deployment target
- Reuse the existing Worker `tacet` (name in `wrangler.jsonc`). Deploy with the
  git-ignored real config:
  ```sh
  npm run build
  npx wrangler deploy --config wrangler.local.jsonc
  ```
- This uploads the Worker + the built SPA assets (`dist/client`).

## 7. Custom domain / route setup
- Preferred: **Custom Domain** on the Worker (dashboard → Workers & Pages → `tacet`
  → Settings → Domains & Routes → **Add Custom Domain** → `tacet.social` and
  `www.tacet.social`). Cloudflare provisions the cert and the proxied DNS record.
- Alternative (config): add to `wrangler.local.jsonc`:
  ```jsonc
  "routes": [{ "pattern": "tacet.social/*", "custom_domain": true }]
  ```
- TLS is automatic (Cloudflare Universal SSL). Verify HTTPS after propagation.

## 8. D1 remote migrations (reuse existing DB)
- The `tacet` D1 has migrations 0001–0014 applied (through `0014_sources.sql`, the source
  registry + item store the live collectors depend on). Apply any new ones:
  ```sh
  npx wrangler d1 migrations apply tacet --remote --config wrangler.local.jsonc
  ```
- (Option B only: `wrangler d1 create tacet` on the new account, update the id, then
  apply all migrations.)

## 9. R2 bucket binding (reuse existing bucket)
- The `BUCKET` binding → `tacet-images` already exists in `wrangler.local.jsonc`. No
  new bucket needed. (Option B: `wrangler r2 bucket create tacet-images` on the new
  account.)

## 10. Environment variables / secrets
- Set on the deployed Worker (never in the repo):
  ```sh
  # session signing (required for real auth):
  printf '%s' "$(openssl rand -hex 32)" | npx wrangler secret put SESSION_SECRET --config wrangler.local.jsonc
  # optional: point the open-web adapter at a chosen home (defaults to mastodon.social)
  # via a var in wrangler.local.jsonc: "vars": { "OPENWEB_INSTANCE": "mastodon.social" }
  # optional Turnstile:
  printf '%s' "<secret>" | npx wrangler secret put TURNSTILE_SECRET --config wrangler.local.jsonc
  printf '%s' "<sitekey>" | npx wrangler secret put TURNSTILE_SITE_KEY --config wrangler.local.jsonc
  ```

## 11. Production SESSION_SECRET
- Generate a fresh 32-byte random secret (command above). Do **not** reuse the local
  dev value. Store it only in Cloudflare (via `wrangler secret put`) — never committed.

## 12. Deployment command (full sequence)
```sh
npm run typecheck && npm run build && npm test        # gate: all green
npx wrangler d1 migrations apply tacet --remote --config wrangler.local.jsonc
npx wrangler deploy --config wrangler.local.jsonc
# set SESSION_SECRET (once) as in step 10
```

## 13. Post-deploy smoke test
```sh
BASE=https://tacet.social
curl -s -o /dev/null -w "%{http_code}\n" $BASE/                      # 200 (SPA)
curl -s -o /dev/null -w "%{http_code}\n" $BASE/api/health            # 200 {ok:true}
curl -s $BASE/api/openweb/today  | head -c 200                       # live/mock result
curl -s $BASE/api/openweb/people | head -c 200                       # live result
```
- Load `https://tacet.social/today` and `/people` in a browser — confirm live content,
  light/dark, and mobile layout. Confirm email still flows (send a test) after DNS
  cutover.

## 14. Rollback plan
- **App rollback:** `npx wrangler rollback --config wrangler.local.jsonc` (reverts the
  Worker to the previous deployment), or redeploy the previous git tag/commit.
- **DNS rollback:** the app custom-domain record can be removed in the dashboard; the
  Worker keeps serving on `*.workers.dev`.
- **Nameserver rollback (worst case):** re-point tacet.social's nameservers back to
  Blacknight (they propagate back). Because you staged all records in Cloudflare
  first (step 5), a rollback loses nothing.
- Keep the pre-migration Blacknight DNS export saved before step 4.

---

## What requires you (external logins / irreversible)
- **Blacknight login** — step 4 (nameserver change) and exporting current DNS records.
- **Cloudflare login/dashboard** — step 2 (add site), step 7 (custom domain), step 10
  (secrets can be CLI or dashboard).
- **Final go/no-go confirmation** before step 4 and before the first production deploy.

Everything else (build, migrations, `wrangler deploy`) I can run on command once you
confirm — using `wrangler.local.jsonc`, no new infrastructure.
