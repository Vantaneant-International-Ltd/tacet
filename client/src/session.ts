import { useSyncExternalStore } from "react";
import { api, type User } from "./api";

// undefined = still loading; null = signed out; User = signed in.
let user: User | null | undefined = undefined;
const subs = new Set<() => void>();

function set(u: User | null) {
  user = u;
  for (const f of subs) f();
}

export function useUser(): User | null | undefined {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => user,
    () => undefined,
  );
}

export async function refreshUser(): Promise<void> {
  const { user: u } = await api.me();
  set(u);
}

export function setUser(u: User | null): void {
  set(u);
}
