import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { requireUser, HttpError } from "../lib/session";
import { storeImagePair, deleteImagePair, originalKey, variantKey } from "../lib/images";

const MAX_BODY = 5000;

async function roomBySlug(c: { env: Env }, slug: string) {
  const room = await c.env.DB.prepare("SELECT id, slug, name FROM rooms WHERE slug = ?")
    .bind(slug)
    .first<{ id: string; slug: string; name: string }>();
  if (!room) throw new HttpError(404, "no such room");
  return room;
}

type PostRow = {
  id: string;
  kind: string;
  body: string;
  image_key: string | null;
  created_at: string;
  author_handle: string;
  is_mine: number;
  kept_by_me: number;
  was_kept: number;
};

function shapePost(r: PostRow) {
  return {
    id: r.id,
    kind: r.kind,
    body: r.body,
    image: r.image_key ? `/api/images/${r.image_key}` : null,
    author_handle: r.author_handle,
    created_at: r.created_at,
    is_mine: r.is_mine === 1,
    kept_by_me: r.kept_by_me === 1,
    // Author-only signal: THAT the post was kept, never who or how many (lockfile §2).
    kept: r.is_mine === 1 && r.was_kept === 1,
  };
}

// Selects a room's posts (newest first) with per-viewer keep flags. `viewer` is bound
// three times, then `roomId`.
const POSTS_SQL = `
  SELECT p.id, p.kind, p.body, p.image_key, p.created_at, u.handle AS author_handle,
    (p.author_id = ?1) AS is_mine,
    EXISTS(SELECT 1 FROM keeps k WHERE k.post_id = p.id AND k.user_id = ?1) AS kept_by_me,
    CASE WHEN p.author_id = ?1 THEN EXISTS(SELECT 1 FROM keeps k2 WHERE k2.post_id = p.id) ELSE 0 END AS was_kept
  FROM posts p JOIN users u ON u.id = p.author_id
  WHERE p.room_id = ?2
  ORDER BY p.created_at DESC, p.id DESC
  LIMIT 200`;

export const postRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// --- list posts in a room --------------------------------------------------
postRoutes.get("/rooms/:slug/posts", async (c) => {
  const user = requireUser(c);
  const room = await roomBySlug(c, c.req.param("slug"));
  const rows = await c.env.DB.prepare(POSTS_SQL).bind(user.id, room.id).all<PostRow>();
  return c.json({ posts: rows.results.map(shapePost) });
});

// --- create a post (text = JSON, image = multipart) ------------------------
postRoutes.post("/rooms/:slug/posts", async (c) => {
  const user = requireUser(c);
  const room = await roomBySlug(c, c.req.param("slug"));
  const now = new Date().toISOString();
  const postId = ulid();
  const contentType = c.req.header("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await c.req.formData();
    const original = form.get("original");
    const variant = form.get("variant");
    const caption = (form.get("body") as string | null)?.trim() ?? "";
    // formData entries are File | string | null; a real upload is neither string nor null.
    if (original === null || typeof original === "string" || variant === null || typeof variant === "string") {
      throw new HttpError(400, "an image (original and variant) is required");
    }
    if (caption.length > MAX_BODY) throw new HttpError(400, "caption is too long");
    try {
      await storeImagePair(c.env, postId, original, variant);
    } catch (e) {
      throw new HttpError(400, (e as Error).message);
    }
    await c.env.DB.prepare(
      "INSERT INTO posts (id, room_id, author_id, kind, body, image_key, created_at) VALUES (?, ?, ?, 'image', ?, ?, ?)",
    )
      .bind(postId, room.id, user.id, caption, postId, now)
      .run();
  } else {
    const json = (await c.req.json().catch(() => ({}))) as { body?: unknown };
    const text = typeof json.body === "string" ? json.body.trim() : "";
    if (!text) throw new HttpError(400, "a post needs some words");
    if (text.length > MAX_BODY) throw new HttpError(400, "that post is too long");
    await c.env.DB.prepare(
      "INSERT INTO posts (id, room_id, author_id, kind, body, image_key, created_at) VALUES (?, ?, ?, 'text', ?, NULL, ?)",
    )
      .bind(postId, room.id, user.id, text, now)
      .run();
  }

  const row = await c.env.DB.prepare(
    `SELECT p.id, p.kind, p.body, p.image_key, p.created_at, u.handle AS author_handle,
       1 AS is_mine, 0 AS kept_by_me, 0 AS was_kept
     FROM posts p JOIN users u ON u.id = p.author_id WHERE p.id = ?`,
  )
    .bind(postId)
    .first<PostRow>();
  return c.json({ post: shapePost(row!) }, 201);
});

// --- hard-delete own post --------------------------------------------------
postRoutes.delete("/posts/:id", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const post = await c.env.DB.prepare("SELECT id, author_id, image_key FROM posts WHERE id = ?")
    .bind(id)
    .first<{ id: string; author_id: string; image_key: string | null }>();
  if (!post) throw new HttpError(404, "no such post");
  if (post.author_id !== user.id) throw new HttpError(403, "you can only delete your own posts");

  // Remove replies and keeps explicitly (do not rely on FK cascade being enabled in D1),
  // then the post, then its images.
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM replies WHERE post_id = ?").bind(id),
    c.env.DB.prepare("DELETE FROM keeps WHERE post_id = ?").bind(id),
    c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id),
  ]);
  if (post.image_key) await deleteImagePair(c.env, post.image_key);

  return c.json({ ok: true });
});

// --- serve an image variant (default) or the original ----------------------
postRoutes.get("/images/:key", async (c) => {
  const key = c.req.param("key");
  const which = c.req.query("original") === "1" ? originalKey(key) : variantKey(key);
  const obj = await c.env.BUCKET.get(which);
  if (!obj) throw new HttpError(404, "no such image");
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("cache-control", "private, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
});
