import { useState } from "react";

// The first-run and gentle one-time nudges are device-local (localStorage), matching the
// device-scoped local profile. No walls of text, no tours — just a short setup and a few
// contextual, dismissible lines that teach through use and never come back once seen.

const FIRST_RUN_KEY = "tacet-firstrun";

export function firstRunDone(): boolean {
  try {
    return localStorage.getItem(FIRST_RUN_KEY) === "done";
  } catch {
    return true; // if storage is unavailable, never block the app
  }
}

export function markFirstRunDone(): void {
  try {
    localStorage.setItem(FIRST_RUN_KEY, "done");
  } catch {
    /* ignore */
  }
}

// A one-time hint: shown until dismissed, then never again on this device.
export function useHint(id: string): { show: boolean; dismiss: () => void } {
  const key = `tacet-hint-${id}`;
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return true;
    }
  });
  return {
    show: !dismissed,
    dismiss: () => {
      try {
        localStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      setDismissed(true);
    },
  };
}
