import { useEffect, useState } from "react";
import { usePath, navigate } from "../router";
import { useUser, refreshUser } from "../session";
import { Loading } from "../bits";
import "../styles.css";
import { Onboarding, hasOnboarded } from "./Onboarding";
import { Shell } from "./Shell";
import { RoomList } from "./RoomList";
import { Room } from "./Room";
import { PostDetail } from "./PostDetail";
import { You } from "./You";
import { About } from "./About";
import { Contact, Privacy } from "./Info";
import { Keeps } from "./Keeps";
import { Feed } from "./Feed";
import { Discover } from "./Discover";
import { Admin } from "./Admin";
import { PublicArchive } from "./PublicArchive";
import { PublicPost } from "./PublicPost";
import { Collection } from "./Collection";

// ─────────────────────────────────────────────────────────────────────────────
// DORMANT. This is the old "rooms" product (the pre-2026-07 clubhouse), preserved
// intact but NOT mounted in the live router. The live product is the five pillars
// (see client/src/app/). Nothing imports this component, so it is tree-shaken out
// of the bundle — it exists only so the old experience can be re-enabled or mined
// for parts. See ./README.md for the concept-by-concept migration mapping.
//
// To re-enable temporarily, render <LegacyApp /> for the legacy paths in App.tsx.
// ─────────────────────────────────────────────────────────────────────────────
export function LegacyApp() {
  const user = useUser();
  const path = usePath();
  const [onboarded, setOnboarded] = useState(hasOnboarded);

  useEffect(() => {
    refreshUser().catch(() => {});
  }, []);

  const pubPost = path.match(/^\/@([^/]+)\/([^/]+)$/);
  if (pubPost) return <PublicPost slug={pubPost[1]} id={pubPost[2]} />;
  const pubArchive = path.match(/^\/@([^/]+)$/);
  if (pubArchive) return <PublicArchive slug={pubArchive[1]} />;
  const coll = path.match(/^\/collection\/([^/]+)$/);
  if (coll) return <Collection id={coll[1]} />;

  if (user === undefined) return <Loading />;
  if (user === null) return <Loading />;
  if (!onboarded) return <Onboarding onDone={() => setOnboarded(true)} />;

  return <Shell>{route(path, user.is_admin)}</Shell>;
}

function route(path: string, isAdmin: boolean) {
  const detail = path.match(/^\/rooms\/([^/]+)\/p\/([^/]+)$/);
  if (detail) return <PostDetail slug={detail[1]} id={detail[2]} />;

  const room = path.match(/^\/rooms\/([^/]+)$/);
  if (room) return <Room slug={room[1]} />;

  if (path === "/feed") return <Feed />;
  if (path === "/rooms") return <RoomList />;
  if (path === "/discover") return <Discover />;
  if (path === "/you") return <You />;
  if (path === "/keeps") return <Keeps />;
  if (path === "/about") return <About />;
  if (path === "/contact") return <Contact />;
  if (path === "/privacy") return <Privacy />;
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
