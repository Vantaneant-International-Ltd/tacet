import { Hono } from "hono";
import type { Env, Variables } from "./types";
import { sessionMiddleware, HttpError } from "./lib/session";
import { authRoutes } from "./routes/auth";
import { roomRoutes } from "./routes/rooms";
import { postRoutes } from "./routes/posts";
import { inviteRoutes } from "./routes/invites";
import { publicRoutes } from "./routes/public";
import { collectionRoutes } from "./routes/collections";
import { openwebRoutes } from "./routes/openweb";
import { meRoutes } from "./routes/me";
import { refreshAllSources } from "./sources/refresh";

// The Worker owns /api/*. Static files (JS, CSS, fonts) are served directly by the
// assets binding before the Worker runs. Any remaining path is a client-side route,
// so we serve the SPA shell (index.html) for it.
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Content Security Policy. Same-origin app + Cloudflare Turnstile; open-web media
// (avatars, banners, images, video) comes from arbitrary https hosts, so img/media
// allow `https:`. Inline styles are used (style attributes), hence 'unsafe-inline' for
// style only — never for script.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' https: data:",
  "media-src 'self' https:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' https://challenges.cloudflare.com",
  "connect-src 'self'",
  "frame-src https://challenges.cloudflare.com",
].join("; ");

// Security + cache headers on every response. Responses returned by the assets binding
// have immutable headers, so we rebuild the response to attach ours. Dynamic API
// responses are never cached; the SPA shell must always revalidate so deploys are seen.

// Canonical host: the bare apex `tacet.social`. `www` is served (custom domain) but
// 301s to the apex so there is one canonical URL. Other hosts (workers.dev, localhost)
// are left untouched.
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname === "www.tacet.social") {
    url.hostname = "tacet.social";
    return c.redirect(url.toString(), 301);
  }
  await next();
});

app.use("*", async (c, next) => {
  await next();
  const url = new URL(c.req.url);
  const headers = new Headers(c.res.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Content-Security-Policy", CSP);
  headers.set("Permissions-Policy", "interest-cohort=()");
  if (url.protocol === "https:") headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // Only /api and the SPA shell reach the Worker (hashed static assets are served
  // directly by the assets binding, which keeps their immutable caching).
  if (url.pathname.startsWith("/api/")) headers.set("Cache-Control", "no-store");
  else headers.set("Cache-Control", "no-cache");
  c.res = new Response(c.res.body, { status: c.res.status, statusText: c.res.statusText, headers });
});

const api = new Hono<{ Bindings: Env; Variables: Variables }>();

// Every API request carries the current user (or null) in c.var.user.
api.use("*", sessionMiddleware);

api.get("/health", (c) => c.json({ ok: true }));

// Public runtime config for the SPA. The Turnstile site key is public by design; when null,
// the client shows no challenge and registration is not gated.
api.get("/config", (c) => c.json({ turnstile_site_key: c.env.TURNSTILE_SITE_KEY ?? null }));

api.route("/auth", authRoutes);
api.route("/rooms", roomRoutes);
api.route("/invites", inviteRoutes);
api.route("/collections", collectionRoutes);
api.route("/openweb", openwebRoutes);
api.route("/me", meRoutes);
api.route("/public", publicRoutes);
api.route("/", postRoutes);

app.route("/api", api);

// Map thrown HttpErrors to JSON; anything else is an opaque 500.
app.onError((err, c) => {
  if (err instanceof HttpError) return c.json({ error: err.message }, err.status as 400);
  console.error(err);
  return c.json({ error: "something went wrong" }, 500);
});

// Unknown API paths stay JSON; they must never fall through to the SPA shell.
app.all("/api/*", (c) => c.json({ error: "not found" }, 404));

// SPA fallback: hand back index.html for non-asset, non-API paths.
app.get("*", (c) => {
  const url = new URL(c.req.url);
  return c.env.ASSETS.fetch(new URL("/index.html", url.origin));
});

// The Worker exports both a fetch handler (the Hono app) and a scheduled handler. The cron
// trigger refreshes the collector sources (feeds, AT Protocol, Nostr) into D1 so Today has
// fresh content without polling them on every request. Read-only, public sources only.
export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => app.fetch(request, env, ctx),
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(refreshAllSources({ db: env.DB }, Date.now(), { force: true }));
  },
};
