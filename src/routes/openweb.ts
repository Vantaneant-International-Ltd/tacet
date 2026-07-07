import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { buildSources, getToday, getPeople } from "../openweb";

// Read-only open social web endpoints. Public (no session needed). They fan out to the
// configured discovery sources, normalize everything into Tacet domain objects, and
// always return 200 with an AdapterResult (degrading to cached/mock on failure).
export const openwebRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

function sourcesFor(env: Env) {
  const seed = env.OPENWEB_SEED
    ? env.OPENWEB_SEED.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;
  return buildSources({ instance: env.OPENWEB_INSTANCE, seed });
}

openwebRoutes.get("/today", async (c) => {
  return c.json(await getToday(sourcesFor(c.env), 20, Date.now()));
});

openwebRoutes.get("/people", async (c) => {
  return c.json(await getPeople(sourcesFor(c.env), 24, Date.now()));
});
