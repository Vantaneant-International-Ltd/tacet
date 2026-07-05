import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { requireUser, HttpError } from "../lib/session";
import { isAckWord } from "../lib/acks";
import { storeImagePair, deleteImagePair, originalKey, variantKey } from "../lib/images";

const MAX_BODY = 5000;

async function roomBySlug(c: { env: Env }, slug: string) {
  const room = await c.env.DB.prepare("SELECT id, slug, name FROM rooms WHERE slug = ?")
    .bind(slug)
    .first<{ id: string; slug: string; name: string }>();
  if (!room) throw new HttpError(404, "no such room");
  return room;
}

type Ack = { handle: string; word: string };

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
  my_ack: string | null;
};
type KeepRow = PostRow & { room_slug: string; room_name: string };

function shapePost(r: PostRow, acks: Ack[]) {
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
    // Acknowledgments are attributed and room-visible; my_ack is the viewer's own word.
    // There is never a count anywhere.
    my_ack: r.my_ack,
    acks,
  };
}

// Attributed acknowledgments for a set of posts, grouped by post. No counts are derived.
async function acksFor(env: Env, postIds: string[]): Promise<Map<string, Ack[]>> {
  const map = new Map<string, Ack[]>();
  if (postIds.length === 0) return map;
  const placeholders = postIds.map(() => "?").join(",");
  const rows = await env.DB.prepare(
    `SELECT a.post_id, u.handle, a.word FROM acknowledgments a
       JOIN users u ON u.id = a.user_id
      WHERE a.post_id IN (${placeholders})
      ORDER BY a.created_at ASC`,
  )
    .bind(...postIds)
    .all<{ post_id: string; handle: string; word: string }>();
  for (const r of rows.results) {
    const list = map.get(r.post_id) ?? [];
    list.push({ handle: r.handle, word: r.word });
    map.set(r.post_id, list);
  }
  return map;
}

// `viewer` is ?1 (is_mine, kept_by_me, was_kept, my_ack), `roomId` is ?2.
const POSTS_SQL = `
  SELECT p.id, p.kind, p.body, p.image_key, p.created_at, u.handle AS author_handle,
    (p.author_id = ?1) AS is_mine,
    EXISTS(SELECT 1 FROM keeps k WHERE k.post_id = p.id AND k.user_id = ?1) AS kept_by_me,
    CASE WHEN p.author_id = ?1 THEN EXISTS(SELECT 1 FROM keeps k2 WHERE k2.post_id = p.id) ELSE 0 END AS was_kept,
    (SELECT word FROM acknowledgments a WHERE a.post_id = p.id AND a.user_id = ?1) AS my_ack
  FROM posts p JOIN users u ON u.id = p.author_id
  WHERE p.room_id = ?2
  ORDER BY p.created_at DESC, p.id DESC
  LIMIT 200`;

const ONE_POST_SQL = `
  SELECT p.id, p.kind, p.body, p.image_key, p.created_at, u.handle AS author_handle,
    (p.author_id = ?1) AS is_mine,
    EXISTS(SELECT 1 FROM keeps k WHERE k.post_id = p.id AND k.user_id = ?1) AS kept_by_me,
    CASE WHEN p.author_id = ?1 THEN EXISTS(SELECT 1 FROM keeps k2 WHERE k2.post_id = p.id) ELSE 0 END AS was_kept,
    (SELECT word FROM acknowledgments a WHERE a.post_id = p.id AND a.user_id = ?1) AS my_ack
  FROM posts p JOIN users u ON u.id = p.author_id
  WHERE p.id = ?2`;

// Posts the viewer has kept, newest-kept first, across all rooms (private view).
const KEEPS_SQL = `
  SELECT p.id, p.kind, p.body, p.image_key, p.created_at, u.handle AS author_handle,
    r.slug AS room_slug, r.name AS room_name,
    (p.author_id = ?1) AS is_mine,
    1 AS kept_by_me,
    CASE WHEN p.author_id = ?1 THEN EXISTS(SELECT 1 FROM keeps k2 WHERE k2.post_id = p.id) ELSE 0 END AS was_kept,
    (SELECT word FROM acknowledgments a WHERE a.post_id = p.id AND a.user_id = ?1) AS my_ack
  FROM keeps k
  JOIN posts p ON p.id = k.post_id
  JOIN users u ON u.id = p.author_id
  JOIN rooms r ON r.id = p.room_id
  WHERE k.user_id = ?1
  ORDER BY k.created_at DESC, p.id DESC
  LIMIT 200`;

export const postRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// --- list posts in a room --------------------------------------------------
postRoutes.get("/rooms/:slug/posts", async (c) => {
  const user = requireUser(c);
  const room = await roomBySlug(c, c.req.param("slug"));
  const rows = await c.env.DB.prepare(POSTS_SQL).bind(user.id, room.id).all<PostRow>();
  const acks = await acksFor(c.env, rows.results.map((r) => r.id));
  return c.json({ posts: rows.results.map((r) => shapePost(r, acks.get(r.id) ?? [])) });
});

// --- the viewer's private keeps, across rooms ------------------------------
postRoutes.get("/keeps", async (c) => {
  const user = requireUser(c);
  const rows = await c.env.DB.prepare(KEEPS_SQL).bind(user.id).all<KeepRow>();
  const acks = await acksFor(c.env, rows.results.map((r) => r.id));
  return c.json({
    posts: rows.results.map((r) => ({
      ...shapePost(r, acks.get(r.id) ?? []),
      room: { slug: r.room_slug, name: r.room_name },
    })),
  });
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
       1 AS is_mine, 0 AS kept_by_me, 0 AS was_kept, NULL AS my_ack
     FROM posts p JOIN users u ON u.id = p.author_id WHERE p.id = ?`,
  )
    .bind(postId)
    .first<PostRow>();
  return c.json({ post: shapePost(row!, []) }, 201);
});

// --- a single post with its (flat) replies ---------------------------------
postRoutes.get("/posts/:id", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const row = await c.env.DB.prepare(ONE_POST_SQL).bind(user.id, id).first<PostRow>();
  if (!row) throw new HttpError(404, "no such post");
  const acks = await acksFor(c.env, [id]);

  const replies = await c.env.DB.prepare(
    `SELECT r.id, r.body, r.created_at, u.handle AS author_handle, (r.author_id = ?1) AS is_mine
     FROM replies r JOIN users u ON u.id = r.author_id
     WHERE r.post_id = ?2 ORDER BY r.created_at ASC, r.id ASC`,
  )
    .bind(user.id, id)
    .all<{ id: string; body: string; created_at: string; author_handle: string; is_mine: number }>();

  return c.json({
    post: shapePost(row, acks.get(id) ?? []),
    replies: replies.results.map((r) => ({
      id: r.id,
      body: r.body,
      created_at: r.created_at,
      author_handle: r.author_handle,
      is_mine: r.is_mine === 1,
    })),
  });
});

// --- flat reply ------------------------------------------------------------
postRoutes.post("/posts/:id/replies", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const exists = await c.env.DB.prepare("SELECT id FROM posts WHERE id = ?").bind(id).first();
  if (!exists) throw new HttpError(404, "no such post");

  const json = (await c.req.json().catch(() => ({}))) as { body?: unknown };
  const text = typeof json.body === "string" ? json.body.trim() : "";
  if (!text) throw new HttpError(400, "a reply needs some words");
  if (text.length > MAX_BODY) throw new HttpError(400, "that reply is too long");

  const now = new Date().toISOString();
  const replyId = ulid();
  await c.env.DB.prepare(
    "INSERT INTO replies (id, post_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(replyId, id, user.id, text, now)
    .run();

  return c.json(
    { reply: { id: replyId, body: text, created_at: now, author_handle: user.handle, is_mine: true } },
    201,
  );
});

// --- keep / unkeep (private to the keeper) ---------------------------------
postRoutes.post("/posts/:id/keep", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const exists = await c.env.DB.prepare("SELECT id FROM posts WHERE id = ?").bind(id).first();
  if (!exists) throw new HttpError(404, "no such post");
  await c.env.DB.prepare("INSERT OR IGNORE INTO keeps (user_id, post_id, created_at) VALUES (?, ?, ?)")
    .bind(user.id, id, new Date().toISOString())
    .run();
  return c.json({ kept_by_me: true });
});

postRoutes.delete("/posts/:id/keep", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM keeps WHERE user_id = ? AND post_id = ?").bind(user.id, id).run();
  return c.json({ kept_by_me: false });
});

// --- acknowledge / unacknowledge (attributed, room-visible, uncounted) -----
postRoutes.put("/posts/:id/ack", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as { word?: unknown };
  if (!isAckWord(body.word)) throw new HttpError(400, "not one of the acknowledgment words");
  const exists = await c.env.DB.prepare("SELECT id FROM posts WHERE id = ?").bind(id).first();
  if (!exists) throw new HttpError(404, "no such post");
  await c.env.DB.prepare(
    `INSERT INTO acknowledgments (user_id, post_id, word, created_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, post_id) DO UPDATE SET word = excluded.word, created_at = excluded.created_at`,
  )
    .bind(user.id, id, body.word, new Date().toISOString())
    .run();
  return c.json({ my_ack: body.word });
});

postRoutes.delete("/posts/:id/ack", async (c) => {
  const user = requireUser(c);
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM acknowledgments WHERE user_id = ? AND post_id = ?")
    .bind(user.id, id)
    .run();
  return c.json({ my_ack: null });
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

  // Remove replies, keeps and acknowledgments explicitly (do not rely on FK cascade being
  // enabled in D1), then the post, then its images.
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM replies WHERE post_id = ?").bind(id),
    c.env.DB.prepare("DELETE FROM keeps WHERE post_id = ?").bind(id),
    c.env.DB.prepare("DELETE FROM acknowledgments WHERE post_id = ?").bind(id),
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
