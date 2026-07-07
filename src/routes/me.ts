import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { HttpError } from "../lib/session";
import { currentProfile } from "../me/profile";
import type { PostSnapshot, SavedEdit, SavedFilter, SavedMedia } from "../me/types";
import * as repo from "../me/repo";

// The Me API — the user's local-first home. Routes are the ONLY place that ties HTTP to
// the persistence layer; they never write SQL. Every route resolves the current device's
// local profile (a signed cookie), then delegates to the repository. Read-only toward the
// open web: nothing here posts, follows, or federates. It only stores what the user chose.
export const meRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

function str(x: unknown): string | undefined {
  return typeof x === "string" ? x : undefined;
}

function snapshotFrom(body: Record<string, unknown>): PostSnapshot {
  const media = Array.isArray(body.media)
    ? (body.media as unknown[]).filter((m): m is SavedMedia => !!m && typeof (m as any).url === "string").map((m) => ({
        url: (m as any).url as string,
        kind: ((m as any).kind === "image" || (m as any).kind === "video" ? (m as any).kind : "other") as SavedMedia["kind"],
        alt: str((m as any).alt) ?? "",
      }))
    : [];
  return {
    remoteId: str(body.remoteId) ?? "",
    authorName: str(body.authorName) ?? "",
    authorHandle: str(body.authorHandle) ?? "",
    authorAvatarUrl: str(body.authorAvatarUrl) ?? null,
    title: str(body.title),
    text: str(body.text) ?? "",
    url: str(body.url) ?? "",
    media,
    sourceId: str(body.sourceId) ?? "",
    sourceSoftware: str(body.sourceSoftware),
    remoteCreatedAt: str(body.remoteCreatedAt),
  };
}

async function json(c: { req: { json: () => Promise<unknown> } }): Promise<Record<string, unknown>> {
  const b = await c.req.json().catch(() => ({}));
  return b && typeof b === "object" ? (b as Record<string, unknown>) : {};
}

// ── Profile ──────────────────────────────────────────────────────────────────
meRoutes.get("/profile", async (c) => c.json({ profile: await currentProfile(c) }));

meRoutes.patch("/profile", async (c) => {
  const p = await currentProfile(c);
  const b = await json(c);
  const updated = await repo.updateProfile(c.env.DB, p.id, { displayName: str(b.displayName), handle: str(b.handle), bio: str(b.bio) });
  return c.json({ profile: updated });
});

// ── Saved ────────────────────────────────────────────────────────────────────
meRoutes.get("/saved", async (c) => {
  const p = await currentProfile(c);
  const filter = (c.req.query("filter") as SavedFilter) || "all";
  const collectionId = c.req.query("collection") || undefined;
  return c.json({ saved: await repo.listSaved(c.env.DB, p.id, { filter, collectionId }) });
});

meRoutes.post("/saved", async (c) => {
  const p = await currentProfile(c);
  const b = await json(c);
  if (!str(b.remoteId)) throw new HttpError(400, "a post is required");
  return c.json({ saved: await repo.savePost(c.env.DB, p.id, snapshotFrom(b)) }, 201);
});

meRoutes.patch("/saved/:id", async (c) => {
  const p = await currentProfile(c);
  const b = await json(c);
  const edit: SavedEdit = {};
  if ("note" in b) edit.note = b.note === null ? null : String(b.note);
  if (typeof b.pinned === "boolean") edit.pinned = b.pinned;
  if (typeof b.readLater === "boolean") edit.readLater = b.readLater;
  const saved = await repo.updateSaved(c.env.DB, p.id, c.req.param("id"), edit);
  if (!saved) throw new HttpError(404, "not found");
  return c.json({ saved });
});

meRoutes.delete("/saved/:id", async (c) => {
  const p = await currentProfile(c);
  return c.json({ ok: await repo.unsave(c.env.DB, p.id, c.req.param("id")) });
});

// ── Collections ──────────────────────────────────────────────────────────────
meRoutes.get("/collections", async (c) => {
  const p = await currentProfile(c);
  return c.json({ collections: await repo.listCollections(c.env.DB, p.id) });
});

meRoutes.post("/collections", async (c) => {
  const p = await currentProfile(c);
  const name = str((await json(c)).name)?.trim();
  if (!name) throw new HttpError(400, "a name is required");
  return c.json({ collection: await repo.createCollection(c.env.DB, p.id, name) }, 201);
});

meRoutes.delete("/collections/:id", async (c) => {
  const p = await currentProfile(c);
  return c.json({ ok: await repo.deleteCollection(c.env.DB, p.id, c.req.param("id")) });
});

meRoutes.post("/collections/:id/items", async (c) => {
  const p = await currentProfile(c);
  const savedId = str((await json(c)).savedId);
  if (!savedId) throw new HttpError(400, "savedId is required");
  const ok = await repo.addToCollection(c.env.DB, p.id, c.req.param("id"), savedId);
  if (!ok) throw new HttpError(404, "not found");
  return c.json({ ok });
});

meRoutes.delete("/collections/:id/items/:savedId", async (c) => {
  const p = await currentProfile(c);
  return c.json({ ok: await repo.removeFromCollection(c.env.DB, p.id, c.req.param("id"), c.req.param("savedId")) });
});

// ── Recently viewed ──────────────────────────────────────────────────────────
meRoutes.get("/recent", async (c) => {
  const p = await currentProfile(c);
  return c.json({ recent: await repo.listRecent(c.env.DB, p.id) });
});

meRoutes.post("/recent", async (c) => {
  const p = await currentProfile(c);
  const b = await json(c);
  if (!str(b.remoteId)) throw new HttpError(400, "a post is required");
  await repo.recordView(c.env.DB, p.id, snapshotFrom(b));
  return c.json({ ok: true });
});

meRoutes.delete("/recent", async (c) => {
  const p = await currentProfile(c);
  await repo.clearRecent(c.env.DB, p.id);
  return c.json({ ok: true });
});
