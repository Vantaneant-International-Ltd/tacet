import { useSyncExternalStore } from "react";

// Theme = "system" (follow OS), "light", or "dark". Persisted, applied via a
// data-theme attribute on <html>; "system" removes the attribute so the media query
// in theme.css takes over. One tiny store, no context needed.
export type Theme = "system" | "light" | "dark";

const KEY = "tacet-theme";
const listeners = new Set<() => void>();

function read(): Theme {
  if (typeof localStorage === "undefined") return "system";
  const v = localStorage.getItem(KEY);
  return v === "light" || v === "dark" ? v : "system";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function setTheme(theme: Theme) {
  if (typeof localStorage !== "undefined") {
    if (theme === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  }
  apply(theme);
  for (const l of listeners) l();
}

// Call once on boot before React renders, to avoid a flash of the wrong theme.
export function initTheme() {
  if (typeof document !== "undefined") apply(read());
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "system",
  );
}

// The effective light/dark, resolving "system" against the OS preference.
export function useResolvedTheme(): "light" | "dark" {
  const theme = useTheme();
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
