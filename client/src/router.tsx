import { useSyncExternalStore } from "react";
import type { MouseEvent, ReactNode } from "react";

// A minimal history router — no dependency. The Worker serves index.html for every
// non-API path, so client-side navigation just needs pushState + popstate.
const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, "", to);
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", emit);
}

export function usePath(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => window.location.pathname,
    () => "/",
  );
}

export function Link({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  function onClick(e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  }
  return (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
