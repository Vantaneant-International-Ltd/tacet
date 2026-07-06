import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { HttpError } from "../lib/session";

// The public face of TACET: brand archives readable with no account. Only rooms marked
// public are exposed here, and only the record itself (content + permanent id + render) —
// no personal handles, no engagement, no counts. This is the canonical record, quiet.
export const publicRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

type PubPost = { id: string; kind: string; body: string; image_key: string | null; created_at: string };

function shape(p: PubPost) {
  return {
    id: p.id,
    kind: p.kind,
    body: p.body,
    image: p.image_key ? `/api/images/${p.image_key}` : null,
    created_at: p.created_at,
  };
}

async function publicBrand(env: Env, slug: string) {
  const brand = await env.DB.prepare(
    "SELECT id, slug, name, description FROM rooms WHERE slug = ? AND is_public = 1",
  )
    .bind(slug)
    .first<{ id: string; slug: string; name: string; description: string | null }>();
  if (!brand) throw new HttpError(404, "no such archive");
  return brand;
}

// Brand archive: metadata + its posts, newest first.
publicRoutes.get("/brands/:slug", async (c) => {
  const brand = await publicBrand(c.env, c.req.param("slug"));
  const rows = await c.env.DB.prepare(
    "SELECT id, kind, body, image_key, created_at FROM posts WHERE room_id = ? ORDER BY created_at DESC, id DESC LIMIT 200",
  )
    .bind(brand.id)
    .all<PubPost>();
  return c.json({
    brand: { slug: brand.slug, name: brand.name, description: brand.description },
    posts: rows.results.map(shape),
  });
});

// A public profile at @name — resolves to a brand/community archive or a person. A person's
// posts are those in public rooms only.
publicRoutes.get("/profile/:name", async (c) => {
  const name = c.req.param("name");

  const brand = await c.env.DB.prepare(
    "SELECT id, slug, name, description FROM rooms WHERE slug = ? AND is_public = 1",
  )
    .bind(name)
    .first<{ id: string; slug: string; name: string; description: string | null }>();
  if (brand) {
    const rows = await c.env.DB.prepare(
      "SELECT id, kind, body, image_key, created_at FROM posts WHERE room_id = ? ORDER BY created_at DESC, id DESC LIMIT 200",
    )
      .bind(brand.id)
      .all<PubPost>();
    return c.json({
      kind: "brand",
      profile: { handle: brand.slug, name: brand.name, bio: brand.description },
      posts: rows.results.map(shape),
    });
  }

  const person = await c.env.DB.prepare("SELECT id, handle, display_name, bio FROM users WHERE handle = ?")
    .bind(name)
    .first<{ id: string; handle: string; display_name: string | null; bio: string | null }>();
  if (!person) throw new HttpError(404, "no such account");
  const rows = await c.env.DB.prepare(
    `SELECT p.id, p.kind, p.body, p.image_key, p.created_at
     FROM posts p JOIN rooms r ON r.id = p.room_id
     WHERE p.author_id = ? AND r.is_public = 1
     ORDER BY p.created_at DESC, p.id DESC LIMIT 200`,
  )
    .bind(person.id)
    .all<PubPost>();
  return c.json({
    kind: "person",
    profile: { handle: person.handle, name: person.display_name ?? person.handle, bio: person.bio },
    posts: rows.results.map(shape),
  });
});

// A single canonical entry at its permanent id, only if its brand is public.
publicRoutes.get("/posts/:id", async (c) => {
  const row = await c.env.DB.prepare(
    `SELECT p.id, p.kind, p.body, p.image_key, p.created_at, r.slug AS brand_slug, r.name AS brand_name
     FROM posts p JOIN rooms r ON r.id = p.room_id
     WHERE p.id = ? AND r.is_public = 1`,
  )
    .bind(c.req.param("id"))
    .first<PubPost & { brand_slug: string; brand_name: string }>();
  if (!row) throw new HttpError(404, "no such entry");
  return c.json({ post: { ...shape(row), brand: { slug: row.brand_slug, name: row.brand_name } } });
});
