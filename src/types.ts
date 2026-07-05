// Worker bindings, declared once. Local dev simulates DB and BUCKET; ASSETS serves
// the built React SPA from dist/client (see wrangler.jsonc).
export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ASSETS: Fetcher;
  // Set at the Phase 2 deploy gate. Absent locally → a dev-only fallback is used.
  SESSION_SECRET?: string;
}

// Shape carried through Hono's context after the session middleware runs.
export interface SessionUser {
  id: string;
  handle: string;
  is_admin: boolean;
}

export type Variables = {
  user: SessionUser | null;
};
