import { useEffect, useState } from "react";
import { usePath, navigate } from "./router";
import { useUser, refreshUser } from "./session";
import { Loading } from "./bits";
import { Enter } from "./views/Enter";
import { Onboarding, hasOnboarded } from "./views/Onboarding";
import { Shell } from "./views/Shell";
import { RoomList } from "./views/RoomList";
import { Room } from "./views/Room";
import { PostDetail } from "./views/PostDetail";
import { You } from "./views/You";
import { About } from "./views/About";
import { Keeps } from "./views/Keeps";
import { Admin } from "./views/Admin";

export function App() {
  const user = useUser();
  const path = usePath();
  const [onboarded, setOnboarded] = useState(hasOnboarded);

  useEffect(() => {
    refreshUser().catch(() => {});
  }, []);

  // Loading the session.
  if (user === undefined) return <Loading />;

  // Signed out: the only surface is Enter.
  if (user === null) return <Enter />;

  // First run on this device: teach the house once, before anything else.
  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />;

  // Signed in: route within the shell.
  return <Shell>{route(path, user.is_admin)}</Shell>;
}

function route(path: string, isAdmin: boolean) {
  // /rooms/:slug/p/:id
  const detail = path.match(/^\/rooms\/([^/]+)\/p\/([^/]+)$/);
  if (detail) return <PostDetail slug={detail[1]} id={detail[2]} />;

  // /rooms/:slug
  const room = path.match(/^\/rooms\/([^/]+)$/);
  if (room) return <Room slug={room[1]} />;

  if (path === "/rooms" || path === "/") return <RoomList />;
  if (path === "/you") return <You />;
  if (path === "/keeps") return <Keeps />;
  if (path === "/about") return <About />;
  if (path === "/admin") return isAdmin ? <Admin /> : <NotHere />;

  return <NotHere />;
}

function NotHere() {
  useEffect(() => {
    const t = setTimeout(() => navigate("/rooms"), 0);
    return () => clearTimeout(t);
  }, []);
  return null;
}
