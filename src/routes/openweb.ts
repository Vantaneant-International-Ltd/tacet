import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { makeSource, getToday, getPeople } from "../openweb";

// Read-only open social web endpoints. Public (no session needed) — they surface
// public data from the open web, normalized into Tacet domain objects. They always
// return 200 with an AdapterResult; failures degrade to cached/mock inside the
// adapter, so the product never shows an error page.
export const openwebRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

openwebRoutes.get("/today", async (c) => {
  const source = makeSource(c.env.OPENWEB_INSTANCE);
  return c.json(await getToday(source, 20, Date.now()));
});

openwebRoutes.get("/people", async (c) => {
  const source = makeSource(c.env.OPENWEB_INSTANCE);
  return c.json(await getPeople(source, 24, Date.now()));
});
