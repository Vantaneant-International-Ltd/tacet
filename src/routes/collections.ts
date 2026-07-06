import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { requireUser, HttpError } from "../lib/session";

// Highlights / Collections — curated pinned sets of your own posts (no counts).
export const collectionRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// cover = the newest image in the collection, if any.
const LIST_SQL = `
  SELECT c.id, c.name,
    (SELECT p.image_key FROM collection_items ci JOIN posts p ON p.id = ci.post_id
      WHERE ci.collection_id = c.id AND p.image_key IS NOT NULL
      ORDER BY ci.added_at DESC LIMIT 1) AS cover_key
  FROM collections c WHERE c.user_id = ? ORDER BY c.created_at DESC`;

collectionRoutes.get("/", async (c) => {
  const user = requireUser(c);
  const rows = await c.env.DB.prepare(LIST_SQL).bind(user.id).all<{ id: string; name: string; cover_key: string | null }>();
  return c.json({
    collections: rows.results.map((r) => ({ id: r.id, name: r.name, cover: r.cover_key ? `/api/images/${r.cover_key}` : null })),
  });
});

collectionRoutes.post("/", async (c) => {
  const user = requireUser(c);
  const body = await c.req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
  if (!name) throw new HttpError(400, "a collection needs a name");
  const id = ulid();
  await c.env.DB.prepare("INSERT INTO collections (id, user_id, name, created_at) VALUES (?, ?, ?, ?)")
    .bind(id, user.id, name, new Date().toISOString())
    .run();
  return c.json({ collection: { id, name, cover: null } }, 201);
});

collectionRoutes.post("/:id/items", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const owned = await c.env.DB.prepare("SELECT id FROM collections WHERE id = ? AND user_id = ?").bind(id, user.id).first();
  if (!owned) throw new HttpError(404, "no such collection");
  const body = await c.req.json().catch(() => ({}));
  const postId = typeof body.post_id === "string" ? body.post_id : "";
  const post = await c.env.DB.prepare("SELECT id FROM posts WHERE id = ? AND author_id = ?").bind(postId, user.id).first();
  if (!post) throw new HttpError(400, "you can only add your own posts");
  await c.env.DB.prepare("INSERT OR IGNORE INTO collection_items (collection_id, post_id, added_at) VALUES (?, ?, ?)")
    .bind(id, postId, new Date().toISOString())
    .run();
  return c.json({ ok: true });
});

collectionRoutes.delete("/:id", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM collection_items WHERE collection_id = ?").bind(id),
    c.env.DB.prepare("DELETE FROM collections WHERE id = ? AND user_id = ?").bind(id, user.id),
  ]);
  return c.json({ ok: true });
});
