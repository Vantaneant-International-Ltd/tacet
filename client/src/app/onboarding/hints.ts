import { useState } from "react";

// Gentle one-time nudges, device-local (localStorage), matching the device-scoped local
// profile. No walls of text, no tours — a few contextual, dismissible lines that teach
// through use and never come back once seen. (The guided first-run setup lives in the
// welcome funnel, WelcomeHome — not here.)

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
