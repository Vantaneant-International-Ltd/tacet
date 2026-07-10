import { Hono } from "hono";
import type { Env, Variables } from "../types";
import type { Moment } from "../openweb/types";
import { buildSources, getToday, getPeople, getProfile, getConversation } from "../openweb";
import { makeSignerFromEnv } from "../openweb/activitypub/signing";
import { readRecent } from "../sources/store";
import { refreshAllSources } from "../sources/refresh";
import { mergeTodayResult } from "../sources/today";

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

// Today merges EVERY source through the normalization contract: the live ActivityPub reader
// (untouched) plus the cron-collected items (feeds, Bluesky, Nostr) read back from D1. They
// are one shape, so they dedupe by canonical URL and interleave calmly — recency + source
// variety, never engagement (ADR-011/012). Today still ENDS; there is no infinite scroll.
const TODAY_LIMIT = 20;

openwebRoutes.get("/today", async (c) => {
  const now = Date.now();
  const db = c.env.DB;

  // Keep the collectors warm without blocking the response: a lock-guarded background
  // refresh so fresh content materializes shortly after the first read (and every cron tick).
  if (db) c.executionCtx.waitUntil(refreshAllSources({ db }, now).catch(() => {}));

  // Live ActivityPub, exactly as before (this path is never disturbed).
  const apResult = await getToday(sourcesFor(c.env), TODAY_LIMIT, now);

  // Collected items from the other adapters, then one calm merged result.
  let collected: Moment[] = [];
  if (db) {
    try { collected = await readRecent(db, { limit: 60 }); } catch { collected = []; }
  }
  return c.json(mergeTodayResult(apResult, collected, TODAY_LIMIT));
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

// A read conversation around a post — parents, replies (nested), and participants.
// `post` is the post's URL/id. Always 200; a failure returns a null conversation.
openwebRoutes.get("/conversation", async (c) => {
  const ref = c.req.query("post");
  if (!ref) return c.json({ conversation: null, error: { code: "unavailable", message: "no post specified" } }, 400);
  return c.json(await getConversation(ref, makeSignerFromEnv(c.env)));
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
