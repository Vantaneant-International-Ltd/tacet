import type { ReactNode } from "react";
import { Link, usePath } from "../router";
import { useUser } from "../session";

// Signed-in frame: a quiet reading column and a bottom bar of mono words. No icons,
// no badges, no dots (DESIGN §5).
export function Shell({ children }: { children: ReactNode }) {
  const user = useUser();
  const path = usePath();
  const on = (p: string) => (path === p || path.startsWith(p + "/") ? "nav-word here" : "nav-word");

  return (
    <div className="shell">
      <div className="column">{children}</div>
      <nav className="bottom">
        <Link to="/rooms" className={on("/rooms")}>
          Rooms
        </Link>
        {user?.is_admin && (
          <Link to="/admin" className={on("/admin")}>
            Admin
          </Link>
        )}
        <Link to="/you" className={on("/you")}>
          You
        </Link>
      </nav>
    </div>
  );
}
