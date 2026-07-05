import { Hono } from "hono";
import type { Env, Variables } from "./types";
import { sessionMiddleware, HttpError } from "./lib/session";
import { authRoutes } from "./routes/auth";
import { roomRoutes } from "./routes/rooms";
import { postRoutes } from "./routes/posts";
import { inviteRoutes } from "./routes/invites";

// The Worker owns /api/*. Static files (JS, CSS, fonts) are served directly by the
// assets binding before the Worker runs. Any remaining path is a client-side route,
// so we serve the SPA shell (index.html) for it.
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

const api = new Hono<{ Bindings: Env; Variables: Variables }>();

// Every API request carries the current user (or null) in c.var.user.
api.use("*", sessionMiddleware);

api.get("/health", (c) => c.json({ ok: true }));
api.route("/auth", authRoutes);
api.route("/rooms", roomRoutes);
api.route("/invites", inviteRoutes);
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

export default app;
