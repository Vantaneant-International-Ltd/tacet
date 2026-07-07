import { useEffect, useState } from "react";

// Client mirror of the Worker's open-web domain contract (GET /api/openweb/*). The
// UI renders these domain objects; it never sees or parses protocol details.
export interface Source { id: string; name: string; url: string; software?: string }
export interface Person {
  id: string; name: string; handle: string; avatarUrl: string | null;
  bio: string; url: string; source: Source; verified: boolean;
}
export interface MomentMedia { url: string; kind: "image" | "video" | "other"; alt: string }
export interface Moment {
  id: string; author: Person; text: string; createdAt: string;
  url: string; media: MomentMedia[]; source: Source;
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
