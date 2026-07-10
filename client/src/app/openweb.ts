import { useEffect, useState } from "react";

// Client mirror of the Worker's open-web domain contract (GET /api/openweb/*). The
// UI renders these domain objects; it never sees or parses protocol details.
export interface Source { id: string; name: string; url: string; software?: string; adapter?: string; iconUrl?: string | null }
export interface ProfileField { name: string; value: string; href?: string }
export interface ProfileCounts { followers?: number; following?: number; posts?: number }
export interface Person {
  id: string; name: string; handle: string; avatarUrl: string | null;
  bio: string; url: string; source: Source; verified: boolean;
  bannerUrl?: string | null; joinedAt?: string; website?: string; location?: string;
  fields?: ProfileField[]; counts?: ProfileCounts;
}
export interface MomentMedia { url: string; kind: "image" | "video" | "audio" | "other"; alt: string; poster?: string }
export interface MomentCounts { reactions?: number; replies?: number; shares?: number }
export interface Moment {
  id: string; author: Person; text: string; createdAt: string;
  url: string; media: MomentMedia[]; source: Source; title?: string; counts?: MomentCounts;
}
export type DataMode = "live" | "cached" | "mock";
export interface AdapterError { code: string; message: string }
export interface AdapterResult<T> {
  data: T; mode: DataMode; source: Source | null; fetchedAt: string; error?: AdapterError;
}

export type LoadState<T> =
  | { status: "loading" }
  | { status: "ready"; result: AdapterResult<T> }
  | { status: "error"; message: string };

async function fetchResult<T>(path: string): Promise<AdapterResult<T>> {
  const res = await fetch(path, { credentials: "same-origin", headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`request failed (${res.status})`);
  return (await res.json()) as AdapterResult<T>;
}

function useResource<T>(path: string): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    fetchResult<T>(path)
      .then((result) => { if (alive) setState({ status: "ready", result }); })
      .catch((e) => { if (alive) setState({ status: "error", message: e instanceof Error ? e.message : "unavailable" }); });
    return () => { alive = false; };
  }, [path]);
  return state;
}

export const useToday = () => useResource<Moment[]>("/api/openweb/today");
export const usePeople = () => useResource<Person[]>("/api/openweb/people");

// ── Render sanitation ───────────────────────────────────────────────────────────
// Protocol tokens never reach rendered UI (W5). Items collected before the adapters learned
// to strip them can still carry nostr: URIs / bech32 strings or a NIP-05 "_@domain" handle —
// clean at render so the rule holds for stored data too.
const PROTOCOL_TOKEN_RE = /(?:\bnostr:[a-z0-9]+\b|\b(?:npub|note|nevent|naddr|nprofile)1[02-9ac-hj-np-z]{8,}\b)/gi;
export function presentText(text: string): string {
  return text.replace(PROTOCOL_TOKEN_RE, "").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
export function presentHandle(handle: string): string {
  return handle.replace(/^@_@/, "@");
}

// ── Connectivity ("Your home is connected") ─────────────────────────────────────
export interface ConnectivityFamily { adapter: string; label: string; watching: number; collected: number }
export interface Connectivity {
  families: ConnectivityFamily[];
  placesWatched: number; serversSeen: number; postsGathered: number; lastRefreshed: string | null;
}
export type ConnectivityState =
  | { status: "loading" }
  | { status: "ready"; data: Connectivity }
  | { status: "error" };

export function useConnectivity(): ConnectivityState {
  const [state, setState] = useState<ConnectivityState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    fetch("/api/openweb/connectivity", { credentials: "same-origin", headers: { accept: "application/json" } })
      .then((r) => (r.ok ? (r.json() as Promise<Connectivity>) : Promise.reject(new Error("unavailable"))))
      .then((data) => { if (alive) setState({ status: "ready", data }); })
      .catch(() => { if (alive) setState({ status: "error" }); });
    return () => { alive = false; };
  }, []);
  return state;
}

// ── Remote profiles ────────────────────────────────────────────────────────────
export interface ProfileData { profile: Person | null; posts: Moment[]; source: Source | null; error?: AdapterError }
export type ProfileState =
  | { status: "loading" }
  | { status: "ready"; data: ProfileData }
  | { status: "error"; message: string };

// The in-Tacet path for a person's profile. `actorId` is their canonical actor URL.
export function profilePath(actorId: string): string {
  return "/p/" + encodeURIComponent(actorId);
}

// ── Conversations ──────────────────────────────────────────────────────────────
export interface ConversationNode { post: Moment; replies: ConversationNode[] }
export interface Conversation {
  focusId: string; ancestors: Moment[]; focus: Moment; replies: ConversationNode[]; participants: Person[]; truncated: boolean;
}
export interface ConversationData { conversation: Conversation | null; error?: AdapterError }
export type ConversationState =
  | { status: "loading" }
  | { status: "ready"; data: ConversationData }
  | { status: "error"; message: string };

export function conversationPath(postId: string): string {
  return "/c/" + encodeURIComponent(postId);
}

export function useConversation(postRef: string): ConversationState {
  const [state, setState] = useState<ConversationState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    fetch(`/api/openweb/conversation?post=${encodeURIComponent(postRef)}`, { credentials: "same-origin", headers: { accept: "application/json" } })
      .then((r) => r.json() as Promise<ConversationData>)
      .then((data) => { if (alive) setState({ status: "ready", data }); })
      .catch((e) => { if (alive) setState({ status: "error", message: e instanceof Error ? e.message : "unavailable" }); });
    return () => { alive = false; };
  }, [postRef]);
  return state;
}

export function useProfile(actorRef: string): ProfileState {
  const [state, setState] = useState<ProfileState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    fetch(`/api/openweb/profile?actor=${encodeURIComponent(actorRef)}`, { credentials: "same-origin", headers: { accept: "application/json" } })
      .then((r) => r.json() as Promise<ProfileData>)
      .then((data) => { if (alive) setState({ status: "ready", data }); })
      .catch((e) => { if (alive) setState({ status: "error", message: e instanceof Error ? e.message : "unavailable" }); });
    return () => { alive = false; };
  }, [actorRef]);
  return state;
}

// Calm relative time from an ISO string. Small, dependency-free.
export function relativeTime(iso: string): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(then).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
