import type { ReactNode } from "react";
import { bylineTime, bylineDate } from "./util";

// A static mono word instead of a spinner (DESIGN §6).
export function Loading() {
  return <p className="label loading">Loading</p>;
}

// Quiet, factual empty state — states a fact and stops (DESIGN §7).
export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty label">{children}</p>;
}

// Byline: HANDLE · HH:MM · DD MMM — mono, --dim, uppercased by CSS.
export function Byline({ handle, at }: { handle: string; at: string }) {
  return (
    <p className="byline label">
      <span>{handle}</span>
      <span className="sep"> · </span>
      <span>{bylineTime(at)}</span>
      <span className="sep"> · </span>
      <span>{bylineDate(at)}</span>
    </p>
  );
}

// A one-sentence error line (DESIGN §7).
export function ErrorLine({ children }: { children: ReactNode }) {
  return children ? <p className="error-line label">{children}</p> : null;
}
