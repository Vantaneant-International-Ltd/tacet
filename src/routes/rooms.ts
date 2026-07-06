import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { requireUser, HttpError } from "../lib/session";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,49}$/;
// Communities live at bare tacet.house/<slug>, so a slug can't be an app page.
const RESERVED_SLUGS = new Set([
  "rooms", "discover", "you", "feed", "keeps", "about", "contact", "privacy", "admin", "join", "api", "c", "u", "settings",
]);

export const roomRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Room directory. Alphabetical (a stable directory, not an attention-ranked feed).
roomRoutes.get("/", async (c) => {
  const user = requireUser(c);
  const rooms = await c.env.DB.prepare(
    `SELECT r.slug, r.name, r.description,
       EXISTS(SELECT 1 FROM follows f WHERE f.room_id = r.id AND f.user_id = ?) AS following
     FROM rooms r ORDER BY r.name COLLATE NOCASE ASC`,
  )
    .bind(user.id)
    .all<{ slug: string; name: string; description: string | null; following: number }>();
  return c.json({
    rooms: rooms.results.map((r) => ({
      slug: r.slug,
      name: r.name,
      description: r.description,
      following: r.following === 1,
    })),
  });
});

// Create a room / community. Anyone can (like making a subreddit or a Discord server);
// the creator owns it and auto-follows it. Others join by following.
roomRoutes.post("/", async (c) => {
  const user = requireUser(c);
  const body = await c.req.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const defaultLens = body.default_lens === "grid" ? "grid" : "timeline";
  const isPublic = body.is_public === true ? 1 : 0;
  if (!SLUG_RE.test(slug)) throw new HttpError(400, "slug must be 2–50 characters: lowercase letters, numbers or -");
  if (RESERVED_SLUGS.has(slug)) throw new HttpError(400, "that name is reserved");
  if (name.length < 1 || name.length > 80) throw new HttpError(400, "name must be 1–80 characters");
  if (description.length > 280) throw new HttpError(400, "description must be 280 characters or fewer");

  const exists = await c.env.DB.prepare("SELECT id FROM rooms WHERE slug = ?").bind(slug).first();
  if (exists) throw new HttpError(409, "a room with that slug already exists");

  const now = new Date().toISOString();
  const roomId = ulid();

  await c.env.DB.batch([
    c.env.DB.prepare(
      "INSERT INTO rooms (id, slug, name, description, default_lens, is_public, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    ).bind(roomId, slug, name, description || null, defaultLens, isPublic, user.id, now),
    c.env.DB.prepare("INSERT INTO memberships (user_id, room_id, joined_at) VALUES (?, ?, ?)").bind(user.id, roomId, now),
    c.env.DB.prepare("INSERT INTO follows (user_id, room_id, created_at) VALUES (?, ?, ?)").bind(user.id, roomId, now),
  ]);

  return c.json({ room: { slug, name, description } }, 201);
});

// Room metadata plus the current user's saved lens (default timeline).
roomRoutes.get("/:slug", async (c) => {
  const user = requireUser(c);
  const slug = c.req.param("slug");
  const room = await c.env.DB.prepare("SELECT id, slug, name, description, default_lens FROM rooms WHERE slug = ?")
    .bind(slug)
    .first<{ id: string; slug: string; name: string; description: string | null; default_lens: string }>();
  if (!room) throw new HttpError(404, "no such room");

  const pref = await c.env.DB.prepare("SELECT lens FROM lens_prefs WHERE user_id = ? AND room_id = ?")
    .bind(user.id, room.id)
    .first<{ lens: string }>();
  const fol = await c.env.DB.prepare("SELECT 1 FROM follows WHERE user_id = ? AND room_id = ?")
    .bind(user.id, room.id)
    .first();

  return c.json({
    room: { slug: room.slug, name: room.name, description: room.description },
    // The saved choice wins; otherwise the room's suggested default (lockfile §1).
    lens: pref?.lens ?? room.default_lens,
    following: Boolean(fol),
  });
});

// Follow / unfollow a room (curation, no count). Idempotent.
roomRoutes.post("/:slug/follow", async (c) => {
  const user = requireUser(c);
  const room = await c.env.DB.prepare("SELECT id FROM rooms WHERE slug = ?")
    .bind(c.req.param("slug"))
    .first<{ id: string }>();
  if (!room) throw new HttpError(404, "no such room");
  await c.env.DB.prepare("INSERT OR IGNORE INTO follows (user_id, room_id, created_at) VALUES (?, ?, ?)")
    .bind(user.id, room.id, new Date().toISOString())
    .run();
  return c.json({ following: true });
});

roomRoutes.delete("/:slug/follow", async (c) => {
  const user = requireUser(c);
  const room = await c.env.DB.prepare("SELECT id FROM rooms WHERE slug = ?")
    .bind(c.req.param("slug"))
    .first<{ id: string }>();
  if (!room) throw new HttpError(404, "no such room");
  await c.env.DB.prepare("DELETE FROM follows WHERE user_id = ? AND room_id = ?")
    .bind(user.id, room.id)
    .run();
  return c.json({ following: false });
});

// Persist the current user's lens choice for this room (lockfile §6: per person per room).
roomRoutes.put("/:slug/lens", async (c) => {
  const user = requireUser(c);
  const room = await c.env.DB.prepare("SELECT id FROM rooms WHERE slug = ?")
    .bind(c.req.param("slug"))
    .first<{ id: string }>();
  if (!room) throw new HttpError(404, "no such room");

  const body = await c.req.json().catch(() => ({}));
  const lens = body.lens;
  if (lens !== "timeline" && lens !== "grid") throw new HttpError(400, "lens must be timeline or grid");

  await c.env.DB.prepare(
    `INSERT INTO lens_prefs (user_id, room_id, lens) VALUES (?, ?, ?)
     ON CONFLICT(user_id, room_id) DO UPDATE SET lens = excluded.lens`,
  )
    .bind(user.id, room.id, lens)
    .run();
  return c.json({ lens });
});
