import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { buildSources, getToday, getPeople, getProfile } from "../openweb";
import { makeSignerFromEnv } from "../openweb/activitypub/signing";

// Read-only open social web endpoints. Public (no session needed). They fan out to the
// configured discovery sources, normalize everything into Tacet domain objects, and
// always return 200 with an AdapterResult (degrading to cached/mock on failure).
export const openwebRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

function sourcesFor(env: Env) {
  const seed = env.OPENWEB_SEED
    ? env.OPENWEB_SEED.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;
  return buildSources({ instance: env.OPENWEB_INSTANCE, seed, signer: makeSignerFromEnv(env) });
}

openwebRoutes.get("/today", async (c) => {
  return c.json(await getToday(sourcesFor(c.env), 20, Date.now()));
});

openwebRoutes.get("/people", async (c) => {
  return c.json(await getPeople(sourcesFor(c.env), 24, Date.now()));
});

// A single person's profile — read-only, any implementation. `actor` is an actor URL or
// an @user@home handle. Always 200; a failure returns a null profile the UI renders calmly.
openwebRoutes.get("/profile", async (c) => {
  const ref = c.req.query("actor") || c.req.query("handle");
  if (!ref) return c.json({ profile: null, posts: [], source: null, error: { code: "unavailable", message: "no person specified" } }, 400);
  return c.json(await getProfile(ref, makeSignerFromEnv(c.env)));
});

// The SERVER actor document — a service actor whose public key stricter homes fetch to
// verify our authorized-fetch signatures. Served only when signing is configured. It is
// read-only: it advertises no usable inbox behaviour and we process no deliveries.
openwebRoutes.get("/actor", (c) => {
  const id = c.env.AP_ACTOR_ID;
  const publicKey = c.env.AP_PUBLIC_KEY;
  if (!id || !publicKey) return c.json({ error: "not found" }, 404);
  return c.json(
    {
      "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"],
      id,
      type: "Application",
      preferredUsername: "tacet",
      name: "Tacet",
      summary: "Tacet — a read-only reader for the open social web. This actor exists only to verify authorized-fetch signatures.",
      inbox: `${id}/inbox`,
      outbox: `${id}/outbox`,
      publicKey: { id: `${id}#main-key`, owner: id, publicKeyPem: publicKey },
    },
    200,
    { "content-type": "application/activity+json" },
  );
});

// We accept no deliveries — strictly read-only.
openwebRoutes.post("/actor/inbox", (c) => c.json({ error: "read-only" }, 405));
