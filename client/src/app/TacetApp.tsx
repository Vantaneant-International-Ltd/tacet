import { usePath } from "../router";
import { AppShell } from "./AppShell";
import { Today } from "./screens/Today";
import { People } from "./screens/People";
import { Discover } from "./screens/Discover";
import { Conversations } from "./screens/Conversations";
import { Me } from "./screens/Me";
import { Profile } from "./screens/Profile";
import { PublicPreview } from "./screens/PublicPreview";
import { Conversation } from "./screens/Conversation";

// The five surfaces of the IA, plus person profiles at /p/<actor> and conversation reads
// at /c/<post>. The app is a walkable alpha — an anonymous visit shows the app directly.
// The guided setup lives only in the welcome funnel (/welcome/home), never here.
export const APP_ROUTES = ["/today", "/people", "/discover", "/conversations", "/me", "/p", "/c"];

function screenFor(path: string) {
  if (path.startsWith("/p/")) return <Profile key={path} actorRef={decodeURIComponent(path.slice(3))} />;
  if (path.startsWith("/c/")) return <Conversation key={path} postRef={decodeURIComponent(path.slice(3))} />;
  if (path.startsWith("/people")) return <People />;
  if (path.startsWith("/discover")) return <Discover />;
  if (path.startsWith("/conversations")) return <Conversations />;
  if (path.startsWith("/me/preview")) return <PublicPreview />;
  if (path.startsWith("/me")) return <Me />;
  return <Today />;
}

export function TacetApp() {
  const path = usePath();
  return <AppShell>{screenFor(path)}</AppShell>;
}
