import type { ReactNode } from "react";

// The three-column desktop canvas the handoff templates are built on: the rail (in
// AppShell) + a centre reading column + a right context column (320px). Opt-in per surface:
// a screen that passes `context` gets the two-column canvas on desktop; on mobile the
// context modules stack calmly BELOW the centre content (never hidden). Screens that pass no
// context render exactly as before — so this adds the canvas without touching other surfaces.
export function Surface({ children, context }: { children: ReactNode; context?: ReactNode }) {
  if (!context) return <>{children}</>;
  return (
    <div className="t-canvas">
      <div className="t-canvas__main">{children}</div>
      <aside className="t-canvas__context" aria-label="Context">{context}</aside>
    </div>
  );
}
