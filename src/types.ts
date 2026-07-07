// Worker bindings, declared once. Local dev simulates DB and BUCKET; ASSETS serves
// the built React SPA from dist/client (see wrangler.jsonc).
export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ASSETS: Fetcher;
  // Set at the Phase 2 deploy gate. Absent locally → a dev-only fallback is used.
  SESSION_SECRET?: string;
  // Turnstile (Amendment 2). When both are set, registration is challenge-gated. Absent
  // locally and in tests, so registration works without keys. The site key is public.
  TURNSTILE_SECRET?: string;
  TURNSTILE_SITE_KEY?: string;
  // Read-only open social web discovery config. Optional; only the adapter uses these.
  // OPENWEB_INSTANCE: a Mastodon-compatible home for the REST discovery shim.
  // OPENWEB_SEED: comma-separated @user@home handles for the generic ActivityPub seed.
  OPENWEB_INSTANCE?: string;
  OPENWEB_SEED?: string;
  // Authorized fetch (optional). When AP_ACTOR_ID + AP_PRIVATE_KEY are set, outbound
  // ActivityPub GETs are HTTP-signed so stricter homes serve public content; AP_ACTOR_ID
  // must be a reachable URL serving the server actor (see /api/openweb/actor). Read-only.
  AP_ACTOR_ID?: string; // e.g. https://tacet.social/api/openweb/actor
  AP_PUBLIC_KEY?: string; // PEM (SPKI) — published in the actor document
  AP_PRIVATE_KEY?: string; // PEM (PKCS#8) — secret; keep in .dev.vars / wrangler secret
}

// Shape carried through Hono's context after the session middleware runs.
export interface SessionUser {
  id: string;
  handle: string;
  is_admin: boolean;
  is_private: boolean;
}

export type Variables = {
  user: SessionUser | null;
};
