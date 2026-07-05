import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { requireUser, requireAdmin, HttpError } from "../lib/session";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,49}$/;

export const roomRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Room directory. Alphabetical (a stable directory, not an attention-ranked feed).
roomRoutes.get("/", async (c) => {
  requireUser(c);
  const rooms = await c.env.DB.prepare(
    "SELECT slug, name, description FROM rooms ORDER BY name COLLATE NOCASE ASC",
  ).all<{ slug: string; name: string; description: string | null }>();
  return c.json({ rooms: rooms.results });
});

// Create a room (admin only). Every existing user is made a member — rooms are
// invite-wide in Phase 1, but membership rows are still recorded (lockfile §7).
roomRoutes.post("/", async (c) => {
  const admin = requireAdmin(c);
  const body = await c.req.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!SLUG_RE.test(slug)) throw new HttpError(400, "slug must be 2–50 characters: lowercase letters, numbers or -");
  if (name.length < 1 || name.length > 80) throw new HttpError(400, "name must be 1–80 characters");
  if (description.length > 280) throw new HttpError(400, "description must be 280 characters or fewer");

  const exists = await c.env.DB.prepare("SELECT id FROM rooms WHERE slug = ?").bind(slug).first();
  if (exists) throw new HttpError(409, "a room with that slug already exists");

  const now = new Date().toISOString();
  const roomId = ulid();
  const users = await c.env.DB.prepare("SELECT id FROM users").all<{ id: string }>();

  const stmts = [
    c.env.DB.prepare(
      "INSERT INTO rooms (id, slug, name, description, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(roomId, slug, name, description || null, admin.id, now),
    ...users.results.map((u) =>
      c.env.DB.prepare("INSERT INTO memberships (user_id, room_id, joined_at) VALUES (?, ?, ?)").bind(
        u.id,
        roomId,
        now,
      ),
    ),
  ];
  await c.env.DB.batch(stmts);

  return c.json({ room: { slug, name, description } }, 201);
});

// Room metadata plus the current user's saved lens (default timeline).
roomRoutes.get("/:slug", async (c) => {
  const user = requireUser(c);
  const slug = c.req.param("slug");
  const room = await c.env.DB.prepare("SELECT id, slug, name, description FROM rooms WHERE slug = ?")
    .bind(slug)
    .first<{ id: string; slug: string; name: string; description: string | null }>();
  if (!room) throw new HttpError(404, "no such room");

  const pref = await c.env.DB.prepare("SELECT lens FROM lens_prefs WHERE user_id = ? AND room_id = ?")
    .bind(user.id, room.id)
    .first<{ lens: string }>();

  return c.json({
    room: { slug: room.slug, name: room.name, description: room.description },
    lens: pref?.lens ?? "timeline",
  });
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
