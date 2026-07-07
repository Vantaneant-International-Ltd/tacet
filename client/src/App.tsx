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
import { Contact, Privacy } from "./views/Info";
import { Keeps } from "./views/Keeps";
import { Feed } from "./views/Feed";
import { Discover } from "./views/Discover";
import { Admin } from "./views/Admin";
import { PublicArchive } from "./views/PublicArchive";
import { PublicPost } from "./views/PublicPost";
import { Collection } from "./views/Collection";
import { LandingPage } from "./views/landing/LandingPage";

// Words reserved for the app itself — a community can't take one (they'd collide with a page).
const RESERVED = new Set([
  "rooms", "discover", "you", "feed", "keeps", "about", "contact", "privacy", "admin", "join", "api", "c", "u", "settings", "collection", "enter",
]);

export function App() {
  const user = useUser();
  const path = usePath();
  const [onboarded, setOnboarded] = useState(hasOnboarded);

  useEffect(() => {
    refreshUser().catch(() => {});
  }, []);

  // Public pages render for everyone, signed in or not — no session needed.
  // People/brands: /@name · communities: bare /name (subreddit-style), guarded from the
  // reserved app words. Post permalinks: /@name/id.
  const pubPost = path.match(/^\/@([^/]+)\/([^/]+)$/);
  if (pubPost) return <PublicPost slug={pubPost[1]} id={pubPost[2]} />;
  const pubArchive = path.match(/^\/@([^/]+)$/);
  if (pubArchive) return <PublicArchive slug={pubArchive[1]} />;
  const coll = path.match(/^\/collection\/([^/]+)$/);
  if (coll) return <Collection id={coll[1]} />;
  const community = path.match(/^\/([a-z0-9][a-z0-9-]{1,49})$/);
  if (community && !RESERVED.has(community[1])) return <PublicArchive slug={community[1]} />;

  // Loading the session.
  if (user === undefined) return <Loading />;

  // An invite link (/join/<code>) prefills registration.
  const joining = path.match(/^\/join\/([^/]+)$/);

  // Signed out: the public landing page is the front door at `/`. The Enter view
  // (sign in / register) lives at /enter, and an invite link jumps straight to it.
  if (user === null) {
    if (joining) return <Enter invite={decodeURIComponent(joining[1])} />;
    if (path === "/enter") return <Enter />;
    return <LandingPage />;
  }

  // A signed-in person following an invite link doesn't need it.
  if (joining) {
    navigate("/rooms");
    return <Loading />;
  }

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

  if (path === "/" || path === "/feed") return <Feed />;
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
