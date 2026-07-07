import { usePath } from "../router";
import { AppShell } from "./AppShell";
import { Today } from "./screens/Today";
import { People } from "./screens/People";
import { Discover } from "./screens/Discover";
import { Conversations } from "./screens/Conversations";
import { Me } from "./screens/Me";

// The Frontend Alpha experience. Runs entirely on mock data (no backend), so the whole
// product is walkable locally. Routes map to the five surfaces of the IA.
export const APP_ROUTES = ["/today", "/people", "/discover", "/conversations", "/me"];

function screenFor(path: string) {
  if (path.startsWith("/people")) return <People />;
  if (path.startsWith("/discover")) return <Discover />;
  if (path.startsWith("/conversations")) return <Conversations />;
  if (path.startsWith("/me")) return <Me />;
  return <Today />;
}

export function TacetApp() {
  const path = usePath();
  return <AppShell>{screenFor(path)}</AppShell>;
}
