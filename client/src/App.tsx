import { useEffect } from "react";
import { usePath, navigate } from "./router";
import { useUser, refreshUser } from "./session";
import { Loading } from "./design/primitives";
import { Enter } from "./views/Enter";
import { LandingPage } from "./views/landing/LandingPage";
import { WelcomeWorld } from "./views/welcome/WelcomeWorld";
import { WelcomeHome } from "./views/welcome/WelcomeHome";
import { TacetApp, APP_ROUTES } from "./app/TacetApp";

// One navigation model. There is exactly one product flow:
//
//   Landing (/)  →  Auth (/enter)  →  App Shell  →  Today · People · Discover · Conversations · Me
//
// The old "rooms" product is quarantined and dormant (client/src/legacy/), not
// routed here. Legacy/public deep-links fall through to a gentle redirect.
export function App() {
  const user = useUser();
  const path = usePath();

  useEffect(() => {
    refreshUser().catch(() => {});
  }, []);

  // The five pillars. Mock-data alpha — walkable with or without a session.
  if (APP_ROUTES.some((r) => path === r || path.startsWith(r + "/"))) return <TacetApp />;

  // Auth: sign in / create, and invite links that prefill it.
  const joining = path.match(/^\/join\/([^/]+)$/);
  if (joining) return <Enter invite={decodeURIComponent(joining[1])} />;
  if (path === "/enter") return <Enter />;

  // Resolve the session before deciding the front door.
  if (user === undefined) return <Loading />;

  // Welcome funnel (public). Signed-in visitors are already home.
  if (path.startsWith("/welcome")) {
    if (user) return <Redirect to="/today" />;
    if (path === "/welcome/world") return <WelcomeWorld />;
    if (path === "/welcome/home") return <WelcomeHome />;
    return <Redirect to="/welcome/world" />;
  }

  // Signed out: the landing page is the only front door.
  if (user === null) {
    if (path === "/") return <LandingPage />;
    return <Redirect to="/" />;
  }

  // Signed in: home is Today. Anything unrecognised (incl. dormant legacy URLs
  // like /rooms, /@name) resolves into the one product model.
  return <Redirect to="/today" />;
}

// A one-shot client redirect that avoids setState-during-render.
function Redirect({ to }: { to: string }) {
  useEffect(() => {
    const t = setTimeout(() => navigate(to), 0);
    return () => clearTimeout(t);
  }, [to]);
  return <Loading />;
}
