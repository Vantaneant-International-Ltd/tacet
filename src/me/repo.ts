import { ulid } from "../lib/ulid";
import type {
  Profile,
  ProfileField,
  Workspace,
  SavedPost,
  SavedMedia,
  CollectionSummary,
  RecentView,
  PostSnapshot,
  ProfileEdit,
  SavedEdit,
  SavedFilter,
} from "./types";

// The Me PERSISTENCE layer. The only place that knows the schema. Every function takes a
// D1Database and returns domain objects (src/me/types.ts) — never rows. Routes and the UI
// never see a column name. This is the UI → Domain → Persistence → Storage boundary.

// ── Workspaces ───────────────────────────────────────────────────────────────
interface WorkspaceRow {
  id: string;
  name: string;
  kind: string;
  is_default: number;
  created_at: string;
}
function toWorkspace(r: WorkspaceRow): Workspace {
  return { id: r.id, name: r.name, kind: r.kind === "business" ? "business" : "personal", isDefault: r.is_default === 1, createdAt: r.created_at };
}

export async function getWorkspace(db: D1Database, id: string): Promise<Workspace | null> {
  const r = await db.prepare("SELECT id, name, kind, is_default, created_at FROM me_workspaces WHERE id = ?").bind(id).first<WorkspaceRow>();
  return r ? toWorkspace(r) : null;
}

export async function renameWorkspace(db: D1Database, id: string, name: string): Promise<Workspace | null> {
  await db.prepare("UPDATE me_workspaces SET name = ? WHERE id = ?").bind(name.trim(), id).run();
  return getWorkspace(db, id);
}

// ── Profiles ─────────────────────────────────────────────────────────────────
interface ProfileRow {
  id: string;
  workspace_id: string | null;
  display_name: string;
  handle: string;
  bio: string;
  avatar_url: string | null;
  banner_url: string | null;
  website: string | null;
  location: string | null;
  fields_json: string | null;
  created_at: string;
}
function parseFields(json: string | null): ProfileField[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((f) => f && typeof f.name === "string").map((f) => ({ name: String(f.name), value: String(f.value ?? "") })) : [];
  } catch {
    return [];
  }
}
function toProfile(r: ProfileRow): Profile {
  return {
    id: r.id,
    workspaceId: r.workspace_id ?? r.id,
    displayName: r.display_name,
    handle: r.handle,
    bio: r.bio,
    avatarUrl: r.avatar_url ?? null,
    bannerUrl: r.banner_url ?? null,
    website: r.website ?? "",
    location: r.location ?? "",
    fields: parseFields(r.fields_json),
    createdAt: r.created_at,
  };
}

const PROFILE_COLS = "id, workspace_id, display_name, handle, bio, avatar_url, banner_url, website, location, fields_json, created_at";

export async function getProfileRow(db: D1Database, id: string): Promise<Profile | null> {
  const r = await db.prepare(`SELECT ${PROFILE_COLS} FROM me_profiles WHERE id = ?`).bind(id).first<ProfileRow>();
  return r ? toProfile(r) : null;
}

// Create a profile AND its owning default workspace (1:1). New devices get both.
export async function createProfile(db: D1Database, id: string, now: string): Promise<Profile> {
  await db.prepare("INSERT INTO me_workspaces (id, name, kind, is_default, created_at) VALUES (?, 'Personal', 'personal', 1, ?)").bind(id, now).run();
  await db
    .prepare("INSERT INTO me_profiles (id, workspace_id, display_name, handle, bio, avatar_key, avatar_url, banner_url, website, location, fields_json, created_at, updated_at) VALUES (?, ?, '', '', '', NULL, NULL, NULL, NULL, NULL, '[]', ?, ?)")
    .bind(id, id, now, now)
    .run();
  return { id, workspaceId: id, displayName: "", handle: "", bio: "", avatarUrl: null, bannerUrl: null, website: "", location: "", fields: [], createdAt: now };
}

export async function updateProfile(db: D1Database, id: string, edit: ProfileEdit): Promise<Profile | null> {
  const cur = await getProfileRow(db, id);
  if (!cur) return null;
  const next: Profile = {
    ...cur,
    displayName: edit.displayName ?? cur.displayName,
    handle: edit.handle ?? cur.handle,
    bio: edit.bio ?? cur.bio,
    avatarUrl: edit.avatarUrl === undefined ? cur.avatarUrl : edit.avatarUrl || null,
    bannerUrl: edit.bannerUrl === undefined ? cur.bannerUrl : edit.bannerUrl || null,
    website: edit.website ?? cur.website,
    location: edit.location ?? cur.location,
    fields: edit.fields ?? cur.fields,
  };
  await db
    .prepare("UPDATE me_profiles SET display_name = ?, handle = ?, bio = ?, avatar_url = ?, banner_url = ?, website = ?, location = ?, fields_json = ?, updated_at = ? WHERE id = ?")
    .bind(next.displayName, next.handle, next.bio, next.avatarUrl, next.bannerUrl, next.website, next.location, JSON.stringify(next.fields), new Date().toISOString(), id)
    .run();
  return next;
}

// ── Saved ────────────────────────────────────────────────────────────────────
interface SavedRow {
  id: string;
  remote_id: string;
  author_name: string;
  author_handle: string;
  author_avatar: string | null;
  title: string | null;
  text: string;
  url: string;
  media_json: string;
  source_id: string;
  source_software: string | null;
  remote_created_at: string | null;
  note: string | null;
  pinned: number;
  read_later: number;
  saved_at: string;
  reactions: number | null;
  replies: number | null;
  shares: number | null;
}
function parseMedia(json: string): SavedMedia[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function toSaved(r: SavedRow, collectionIds: string[]): SavedPost {
  return {
    id: r.id,
    remoteId: r.remote_id,
    authorName: r.author_name,
    authorHandle: r.author_handle,
    authorAvatarUrl: r.author_avatar,
    title: r.title ?? undefined,
    text: r.text,
    url: r.url,
    media: parseMedia(r.media_json),
    sourceId: r.source_id,
    sourceSoftware: r.source_software ?? undefined,
    remoteCreatedAt: r.remote_created_at ?? undefined,
    note: r.note ?? undefined,
    pinned: r.pinned === 1,
    readLater: r.read_later === 1,
    savedAt: r.saved_at,
    collectionIds,
    counts: countsFromRow(r),
  };
}

function countsFromRow(r: SavedRow): SavedPost["counts"] {
  const c: NonNullable<SavedPost["counts"]> = {};
  if (r.reactions != null) c.reactions = r.reactions;
  if (r.replies != null) c.replies = r.replies;
  if (r.shares != null) c.shares = r.shares;
  return Object.keys(c).length ? c : undefined;
}

const SAVED_COLS =
  "id, remote_id, author_name, author_handle, author_avatar, title, text, url, media_json, source_id, source_software, remote_created_at, note, pinned, read_later, saved_at, reactions, replies, shares";

// A map of saved_id → collectionIds for a profile (one extra query, then grouped).
async function collectionsBySaved(db: D1Database, profileId: string): Promise<Map<string, string[]>> {
  const { results } = await db
    .prepare("SELECT ci.saved_id AS saved_id, ci.collection_id AS collection_id FROM me_collection_items ci JOIN me_saved s ON s.id = ci.saved_id WHERE s.profile_id = ?")
    .bind(profileId)
    .all<{ saved_id: string; collection_id: string }>();
  const map = new Map<string, string[]>();
  for (const r of results ?? []) {
    const arr = map.get(r.saved_id) ?? [];
    arr.push(r.collection_id);
    map.set(r.saved_id, arr);
  }
  return map;
}

export async function listSaved(
  db: D1Database,
  profileId: string,
  opts: { filter?: SavedFilter; collectionId?: string } = {},
): Promise<SavedPost[]> {
  let sql = `SELECT ${SAVED_COLS} FROM me_saved WHERE profile_id = ?`;
  const binds: unknown[] = [profileId];
  if (opts.collectionId) {
    sql = `SELECT ${SAVED_COLS.split(", ").map((c) => "s." + c).join(", ")} FROM me_saved s JOIN me_collection_items ci ON ci.saved_id = s.id WHERE s.profile_id = ? AND ci.collection_id = ?`;
    binds.push(opts.collectionId);
  } else if (opts.filter === "pinned") sql += " AND pinned = 1";
  else if (opts.filter === "read_later") sql += " AND read_later = 1";
  else if (opts.filter === "notes") sql += " AND note IS NOT NULL AND note != ''";
  sql += opts.collectionId ? " ORDER BY s.saved_at DESC" : " ORDER BY pinned DESC, saved_at DESC";

  const { results } = await db.prepare(sql).bind(...binds).all<SavedRow>();
  const cmap = await collectionsBySaved(db, profileId);
  return (results ?? []).map((r) => toSaved(r, cmap.get(r.id) ?? []));
}

async function getSavedRow(db: D1Database, profileId: string, savedId: string): Promise<SavedRow | null> {
  return db.prepare(`SELECT ${SAVED_COLS} FROM me_saved WHERE profile_id = ? AND id = ?`).bind(profileId, savedId).first<SavedRow>();
}

export async function getSaved(db: D1Database, profileId: string, savedId: string): Promise<SavedPost | null> {
  const row = await getSavedRow(db, profileId, savedId);
  if (!row) return null;
  const cmap = await collectionsBySaved(db, profileId);
  return toSaved(row, cmap.get(row.id) ?? []);
}

// Save a snapshot. Idempotent by remote id — saving an already-saved post returns it
// unchanged (never clobbers a note or pin).
export async function savePost(db: D1Database, profileId: string, snap: PostSnapshot): Promise<SavedPost> {
  const existing = await db
    .prepare(`SELECT ${SAVED_COLS} FROM me_saved WHERE profile_id = ? AND remote_id = ?`)
    .bind(profileId, snap.remoteId)
    .first<SavedRow>();
  if (existing) {
    const cmap = await collectionsBySaved(db, profileId);
    return toSaved(existing, cmap.get(existing.id) ?? []);
  }
  const id = ulid();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO me_saved (id, profile_id, remote_id, author_name, author_handle, author_avatar, title, text, url, media_json, source_id, source_software, remote_created_at, note, pinned, read_later, saved_at, reactions, replies, shares)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0, 0, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      profileId,
      snap.remoteId,
      snap.authorName ?? "",
      snap.authorHandle ?? "",
      snap.authorAvatarUrl ?? null,
      snap.title ?? null,
      snap.text ?? "",
      snap.url ?? "",
      JSON.stringify(snap.media ?? []),
      snap.sourceId ?? "",
      snap.sourceSoftware ?? null,
      snap.remoteCreatedAt ?? null,
      now,
      snap.counts?.reactions ?? null,
      snap.counts?.replies ?? null,
      snap.counts?.shares ?? null,
    )
    .run();
  return {
    id,
    remoteId: snap.remoteId,
    authorName: snap.authorName ?? "",
    authorHandle: snap.authorHandle ?? "",
    authorAvatarUrl: snap.authorAvatarUrl ?? null,
    title: snap.title,
    text: snap.text ?? "",
    url: snap.url ?? "",
    media: snap.media ?? [],
    sourceId: snap.sourceId ?? "",
    sourceSoftware: snap.sourceSoftware,
    remoteCreatedAt: snap.remoteCreatedAt,
    note: undefined,
    pinned: false,
    readLater: false,
    savedAt: now,
    collectionIds: [],
    counts: snap.counts,
  };
}

export async function unsave(db: D1Database, profileId: string, savedId: string): Promise<boolean> {
  const res = await db.prepare("DELETE FROM me_saved WHERE profile_id = ? AND id = ?").bind(profileId, savedId).run();
  return (res.meta.changes ?? 0) > 0;
}

export async function updateSaved(db: D1Database, profileId: string, savedId: string, edit: SavedEdit): Promise<SavedPost | null> {
  const cur = await getSavedRow(db, profileId, savedId);
  if (!cur) return null;
  const note = edit.note === undefined ? cur.note : edit.note && edit.note.length > 0 ? edit.note : null;
  const pinned = edit.pinned === undefined ? cur.pinned : edit.pinned ? 1 : 0;
  const readLater = edit.readLater === undefined ? cur.read_later : edit.readLater ? 1 : 0;
  await db
    .prepare("UPDATE me_saved SET note = ?, pinned = ?, read_later = ? WHERE profile_id = ? AND id = ?")
    .bind(note, pinned, readLater, profileId, savedId)
    .run();
  return getSaved(db, profileId, savedId);
}

// ── Collections ──────────────────────────────────────────────────────────────
export async function listCollections(db: D1Database, profileId: string): Promise<CollectionSummary[]> {
  const { results } = await db
    .prepare(
      `SELECT c.id AS id, c.name AS name, c.created_at AS created_at, COUNT(ci.saved_id) AS count
       FROM me_collections c LEFT JOIN me_collection_items ci ON ci.collection_id = c.id
       WHERE c.profile_id = ? GROUP BY c.id ORDER BY c.name COLLATE NOCASE`,
    )
    .bind(profileId)
    .all<{ id: string; name: string; created_at: string; count: number }>();
  return (results ?? []).map((r) => ({ id: r.id, name: r.name, count: Number(r.count), createdAt: r.created_at }));
}

export async function createCollection(db: D1Database, profileId: string, name: string): Promise<CollectionSummary> {
  const clean = name.trim();
  const existing = await db.prepare("SELECT id, created_at FROM me_collections WHERE profile_id = ? AND name = ?").bind(profileId, clean).first<{ id: string; created_at: string }>();
  if (existing) return { id: existing.id, name: clean, count: 0, createdAt: existing.created_at };
  const id = ulid();
  const now = new Date().toISOString();
  await db.prepare("INSERT INTO me_collections (id, profile_id, name, created_at) VALUES (?, ?, ?, ?)").bind(id, profileId, clean, now).run();
  return { id, name: clean, count: 0, createdAt: now };
}

export async function deleteCollection(db: D1Database, profileId: string, collectionId: string): Promise<boolean> {
  const res = await db.prepare("DELETE FROM me_collections WHERE profile_id = ? AND id = ?").bind(profileId, collectionId).run();
  return (res.meta.changes ?? 0) > 0;
}

export async function addToCollection(db: D1Database, profileId: string, collectionId: string, savedId: string): Promise<boolean> {
  const owns = await db.prepare("SELECT 1 FROM me_collections WHERE id = ? AND profile_id = ?").bind(collectionId, profileId).first();
  const has = await db.prepare("SELECT 1 FROM me_saved WHERE id = ? AND profile_id = ?").bind(savedId, profileId).first();
  if (!owns || !has) return false;
  await db.prepare("INSERT OR IGNORE INTO me_collection_items (collection_id, saved_id, added_at) VALUES (?, ?, ?)").bind(collectionId, savedId, new Date().toISOString()).run();
  return true;
}

export async function removeFromCollection(db: D1Database, profileId: string, collectionId: string, savedId: string): Promise<boolean> {
  const owns = await db.prepare("SELECT 1 FROM me_collections WHERE id = ? AND profile_id = ?").bind(collectionId, profileId).first();
  if (!owns) return false;
  await db.prepare("DELETE FROM me_collection_items WHERE collection_id = ? AND saved_id = ?").bind(collectionId, savedId).run();
  return true;
}

// ── Recently viewed ──────────────────────────────────────────────────────────
export async function recordView(db: D1Database, profileId: string, snap: PostSnapshot): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO me_recently_viewed (id, profile_id, remote_id, author_name, author_handle, text, url, source_id, source_software, viewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(profile_id, remote_id) DO UPDATE SET viewed_at = excluded.viewed_at`,
    )
    .bind(ulid(), profileId, snap.remoteId, snap.authorName ?? "", snap.authorHandle ?? "", snap.text ?? "", snap.url ?? "", snap.sourceId ?? "", snap.sourceSoftware ?? null, now)
    .run();
  // Keep history bounded (most recent 100).
  await db
    .prepare("DELETE FROM me_recently_viewed WHERE profile_id = ? AND id NOT IN (SELECT id FROM me_recently_viewed WHERE profile_id = ? ORDER BY viewed_at DESC LIMIT 100)")
    .bind(profileId, profileId)
    .run();
}

export async function listRecent(db: D1Database, profileId: string, limit = 40): Promise<RecentView[]> {
  const { results } = await db
    .prepare("SELECT id, remote_id, author_name, author_handle, text, url, source_id, source_software, viewed_at FROM me_recently_viewed WHERE profile_id = ? ORDER BY viewed_at DESC LIMIT ?")
    .bind(profileId, limit)
    .all<{ id: string; remote_id: string; author_name: string; author_handle: string; text: string; url: string; source_id: string; source_software: string | null; viewed_at: string }>();
  return (results ?? []).map((r) => ({
    id: r.id,
    remoteId: r.remote_id,
    authorName: r.author_name,
    authorHandle: r.author_handle,
    text: r.text,
    url: r.url,
    sourceId: r.source_id,
    sourceSoftware: r.source_software ?? undefined,
    viewedAt: r.viewed_at,
  }));
}

export async function clearRecent(db: D1Database, profileId: string): Promise<void> {
  await db.prepare("DELETE FROM me_recently_viewed WHERE profile_id = ?").bind(profileId).run();
}
