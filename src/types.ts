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
