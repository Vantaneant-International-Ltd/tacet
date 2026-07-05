import { Hono } from "hono";
import type { Env, Variables } from "./types";

// The Worker owns /api/*. Static files (JS, CSS, fonts) are served directly by the
// assets binding before the Worker runs. Any remaining path is a client-side route,
// so we serve the SPA shell (index.html) for it.
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

const api = new Hono<{ Bindings: Env; Variables: Variables }>();

api.get("/health", (c) => c.json({ ok: true }));

app.route("/api", api);

// Unknown API paths stay JSON; they must never fall through to the SPA shell.
app.all("/api/*", (c) => c.json({ error: "not found" }, 404));

// SPA fallback: hand back index.html for non-asset, non-API paths.
app.get("*", (c) => {
  const url = new URL(c.req.url);
  return c.env.ASSETS.fetch(new URL("/index.html", url.origin));
});

export default app;
