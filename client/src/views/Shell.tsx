import { useEffect, useState, type ReactNode } from "react";
import { api, type Room } from "../api";
import { Link, usePath } from "../router";
import { useUser } from "../session";

// Signed-in frame. On web: a quiet left rail (the room the person is in retreats to the
// centre; navigation lives at the edge). On phone: the rail collapses to a bottom bar of
// mono words. Familiar structure, calm skin — no badges, no counts (DESIGN §5, Amendment 3).
export function Shell({ children }: { children: ReactNode }) {
  const user = useUser();
  const path = usePath();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    api.rooms().then((r) => setRooms(r.rooms)).catch(() => setRooms([]));
  }, []);

  const here = (p: string) => path === p || path.startsWith(p + "/");

  return (
    <div className="shell">
      <aside className="rail">
        <Link to="/rooms" className="rail-mark">
          TACET
        </Link>

        <nav className="rail-nav">
          <div className="rail-group">
            <span className="label">Feed</span>
            <ul>
              <li>
                <Link to="/feed" className={"rail-item" + (here("/feed") ? " here" : "")}>
                  Following
                </Link>
              </li>
            </ul>
          </div>
          <div className="rail-group">
            <span className="label">Rooms</span>
            <ul>
              {rooms.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/rooms/${r.slug}`}
                    className={"rail-room" + (here(`/rooms/${r.slug}`) ? " here" : "")}
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rail-group">
            <span className="label">You</span>
            <ul>
              <li>
                <Link to="/keeps" className={"rail-item" + (here("/keeps") ? " here" : "")}>
                  Your keeps
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="rail-foot">
          {user?.is_admin && (
            <Link to="/admin" className={"rail-item" + (here("/admin") ? " here" : "")}>
              Admin
            </Link>
          )}
          <Link to="/you" className={"rail-you" + (here("/you") ? " here" : "")}>
            {user ? `@${user.handle}` : "You"}
          </Link>
        </div>
      </aside>

      <main className="main">
        <div className="column">{children}</div>
      </main>

      {/* phone only (CSS) */}
      <nav className="bottom">
        <Link to="/feed" className={"nav-word" + (here("/feed") ? " here" : "")}>
          Feed
        </Link>
        <Link to="/rooms" className={"nav-word" + (here("/rooms") ? " here" : "")}>
          Rooms
        </Link>
        {user?.is_admin && (
          <Link to="/admin" className={"nav-word" + (here("/admin") ? " here" : "")}>
            Admin
          </Link>
        )}
        <Link to="/you" className={"nav-word" + (here("/you") ? " here" : "")}>
          You
        </Link>
      </nav>
    </div>
  );
}
