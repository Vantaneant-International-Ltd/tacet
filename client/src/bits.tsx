import type { ReactNode } from "react";
import { bylineTime, bylineDate } from "./util";

// A static mono word instead of a spinner (DESIGN §6).
export function Loading() {
  return <p className="label loading">Loading</p>;
}

// A quiet identity avatar — an uploaded image if there is one, else the initial in a circle.
export function Avatar({ handle, large, src }: { handle: string; large?: boolean; src?: string | null }) {
  if (src) return <img className={"av av-img" + (large ? " lg" : "")} src={src} alt="" />;
  return <span className={"av" + (large ? " lg" : "")}>{(handle[0] ?? "?").toUpperCase()}</span>;
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
