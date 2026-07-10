import { useEffect, useState, useSyncExternalStore } from "react";
import type { Moment } from "./openweb";

// The client side of Me — a typed API over /api/me/* plus a tiny saved-state store so the
// Save control reflects reality everywhere. The UI talks to these functions and hooks; it
// never knows about D1, cookies, or SQL. (UI → this → server routes → persistence.)

export interface ProfileField { name: string; value: string }
export interface Workspace { id: string; name: string; kind: "personal" | "business"; isDefault: boolean; createdAt: string }
export interface Profile {
  id: string; workspaceId: string; displayName: string; handle: string; bio: string;
  avatarUrl: string | null; bannerUrl: string | null; website: string; location: string;
  fields: ProfileField[]; createdAt: string;
}
export type ProfileEdit = Partial<Pick<Profile, "displayName" | "handle" | "bio" | "avatarUrl" | "bannerUrl" | "website" | "location" | "fields">>;
export interface SavedMedia { url: string; kind: "image" | "video" | "audio" | "other"; alt: string; poster?: string }
export interface SavedCounts { reactions?: number; replies?: number; shares?: number }
export interface SavedPost {
  id: string; remoteId: string; authorName: string; authorHandle: string; authorAvatarUrl: string | null;
  title?: string; text: string; url: string; media: SavedMedia[]; sourceId: string; sourceSoftware?: string;
  remoteCreatedAt?: string; note?: string; pinned: boolean; readLater: boolean; savedAt: string; collectionIds: string[];
  counts?: SavedCounts;
}
export interface CollectionSummary { id: string; name: string; count: number; createdAt: string }
export interface RecentView { id: string; remoteId: string; authorName: string; authorHandle: string; text: string; url: string; sourceId: string; sourceSoftware?: string; title?: string; viewedAt: string }

// A post snapshot the way the server wants it, built from a live Moment.
export interface SaveInput {
  remoteId: string; authorName: string; authorHandle: string; authorAvatarUrl: string | null;
  title?: string; text: string; url: string; media: SavedMedia[]; sourceId: string; sourceSoftware?: string; remoteCreatedAt?: string;
  counts?: SavedCounts;
}

export function momentToInput(m: Moment): SaveInput {
  return {
    remoteId: m.id,
    authorName: m.author.name,
    authorHandle: m.author.handle,
    authorAvatarUrl: m.author.avatarUrl,
    title: m.title,
    text: m.text,
    url: m.url,
    media: m.media,
    sourceId: m.source.id,
    sourceSoftware: m.source.software,
    remoteCreatedAt: m.createdAt,
    counts: m.counts,
  };
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/me${path}`, { credentials: "same-origin", headers: { "content-type": "application/json", accept: "application/json" }, ...init });
  if (!res.ok) throw new Error(`request failed (${res.status})`);
  return (await res.json()) as T;
}

export const api = {
  getProfile: () => req<{ profile: Profile }>("/profile").then((r) => r.profile),
  getProfileAndWorkspace: () => req<{ profile: Profile; workspace: Workspace | null }>("/profile"),
  updateProfile: (edit: ProfileEdit) =>
    req<{ profile: Profile }>("/profile", { method: "PATCH", body: JSON.stringify(edit) }).then((r) => r.profile),
  renameWorkspace: (name: string) => req<{ workspace: Workspace }>("/workspace", { method: "PATCH", body: JSON.stringify({ name }) }).then((r) => r.workspace),
  listSaved: (opts: { filter?: string; collection?: string } = {}) => {
    const q = new URLSearchParams();
    if (opts.filter) q.set("filter", opts.filter);
    if (opts.collection) q.set("collection", opts.collection);
    const qs = q.toString();
    return req<{ saved: SavedPost[] }>(`/saved${qs ? `?${qs}` : ""}`).then((r) => r.saved);
  },
  save: (input: SaveInput) => req<{ saved: SavedPost }>("/saved", { method: "POST", body: JSON.stringify(input) }).then((r) => r.saved),
  unsave: (id: string) => req<{ ok: boolean }>(`/saved/${id}`, { method: "DELETE" }),
  updateSaved: (id: string, edit: { note?: string | null; pinned?: boolean; readLater?: boolean }) =>
    req<{ saved: SavedPost }>(`/saved/${id}`, { method: "PATCH", body: JSON.stringify(edit) }).then((r) => r.saved),
  listCollections: () => req<{ collections: CollectionSummary[] }>("/collections").then((r) => r.collections),
  createCollection: (name: string) => req<{ collection: CollectionSummary }>("/collections", { method: "POST", body: JSON.stringify({ name }) }).then((r) => r.collection),
  deleteCollection: (id: string) => req<{ ok: boolean }>(`/collections/${id}`, { method: "DELETE" }),
  addToCollection: (id: string, savedId: string) => req<{ ok: boolean }>(`/collections/${id}/items`, { method: "POST", body: JSON.stringify({ savedId }) }),
  removeFromCollection: (id: string, savedId: string) => req<{ ok: boolean }>(`/collections/${id}/items/${savedId}`, { method: "DELETE" }),
  listRecent: () => req<{ recent: RecentView[] }>("/recent").then((r) => r.recent),
  recordView: (input: SaveInput) => req<{ ok: boolean }>("/recent", { method: "POST", body: JSON.stringify(input) }).catch(() => ({ ok: false })),
  clearRecent: () => req<{ ok: boolean }>("/recent", { method: "DELETE" }),
};

// ── Saved-state store ─────────────────────────────────────────────────────────
// A small external store of remoteId → savedId so the Save control is correct across
// Today and Me. Bootstrapped once; updated on every save/unsave.
let savedIndex = new Map<string, string>();
let ready = false;
let version = 0;
const subs = new Set<() => void>();
function emit() { version++; for (const s of subs) s(); }

export function isSaved(remoteId: string): boolean { return savedIndex.has(remoteId); }
export function savedIdOf(remoteId: string): string | undefined { return savedIndex.get(remoteId); }
// Keep the store in sync when Me itself saves/unsaves (so Today's control reflects it).
export function forgetSaved(remoteId: string) { if (savedIndex.delete(remoteId)) emit(); }
export function rememberSaved(remoteId: string, savedId: string) { savedIndex.set(remoteId, savedId); emit(); }

let booted = false;
export async function initMe(): Promise<void> {
  if (booted) return;
  booted = true;
  try {
    await api.getProfile(); // establishes the local-profile cookie
    const saved = await api.listSaved();
    savedIndex = new Map(saved.map((s) => [s.remoteId, s.id]));
  } catch {
    /* offline / not ready — Save simply no-ops until reachable */
  }
  ready = true;
  emit();
}

export async function toggleSave(input: SaveInput): Promise<void> {
  const existing = savedIndex.get(input.remoteId);
  if (existing) {
    savedIndex.delete(input.remoteId);
    emit();
    await api.unsave(existing).catch(() => { savedIndex.set(input.remoteId, existing); emit(); });
  } else {
    try {
      const saved = await api.save(input);
      savedIndex.set(saved.remoteId, saved.id);
      emit();
    } catch { /* ignore */ }
  }
}

// Register interest in save-state changes (returns the version so components re-render).
export function useMeVersion(): number {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => version,
    () => 0,
  );
}
export function useMeReady(): boolean { useMeVersion(); return ready; }
export function useSavedCount(): number { useMeVersion(); return savedIndex.size; }

// ── A tiny fetch hook for Me lists ────────────────────────────────────────────
export type Load<T> = { status: "loading" } | { status: "ready"; data: T } | { status: "error" };
export function useResource<T>(loader: () => Promise<T>, deps: unknown[]): Load<T> & { reload: () => void } {
  const [state, setState] = useState<Load<T>>({ status: "loading" });
  const [key, setKey] = useState(0);
  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    loader().then((data) => alive && setState({ status: "ready", data })).catch(() => alive && setState({ status: "error" }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, key]);
  return { ...state, reload: () => setKey((k) => k + 1) } as Load<T> & { reload: () => void };
}
