import { useState, type ReactNode } from "react";
import { Link, usePath } from "../router";
import { GlobalCompose } from "./GlobalCompose";

// Signed-in frame, built to the approved mockup: one centred warm column, a bottom bar of
// four places (Home · Rooms · Discover · You), and a compose FAB. No counts, no badges.
export function Shell({ children }: { children: ReactNode }) {
  const path = usePath();
  const [composing, setComposing] = useState(false);
  const on = (p: string) =>
    (p === "/" ? path === "/" || path === "/feed" : path === p || path.startsWith(p + "/")) ? "tab here" : "tab";

  return (
    <div className="appwrap">
      <div className="appcol">{children}</div>

      <button className="fab" onClick={() => setComposing(true)} aria-label="Write a post">
        +
      </button>

      <nav className="tabbar">
        <Link to="/" className={on("/")}>Home</Link>
        <Link to="/rooms" className={on("/rooms")}>Rooms</Link>
        <Link to="/discover" className={on("/discover")}>Discover</Link>
        <Link to="/you" className={on("/you")}>You</Link>
      </nav>

      {composing && <GlobalCompose onClose={() => setComposing(false)} />}
    </div>
  );
}
