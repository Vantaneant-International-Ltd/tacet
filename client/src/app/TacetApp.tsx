import { useState } from "react";
import { usePath, navigate } from "../router";
import { AppShell } from "./AppShell";
import { Today } from "./screens/Today";
import { People } from "./screens/People";
import { Discover } from "./screens/Discover";
import { Conversations } from "./screens/Conversations";
import { Me } from "./screens/Me";
import { Profile } from "./screens/Profile";
import { Conversation } from "./screens/Conversation";
import { FirstRun } from "./onboarding/FirstRun";
import { firstRunDone } from "./onboarding/hints";

// The five surfaces of the IA, plus person profiles at /p/<actor> and conversation reads
// at /c/<post>. The first-run setup gates the experience once per device, then to Today.
export const APP_ROUTES = ["/today", "/people", "/discover", "/conversations", "/me", "/p", "/c"];

function screenFor(path: string) {
  if (path.startsWith("/p/")) return <Profile key={path} actorRef={decodeURIComponent(path.slice(3))} />;
  if (path.startsWith("/c/")) return <Conversation key={path} postRef={decodeURIComponent(path.slice(3))} />;
  if (path.startsWith("/people")) return <People />;
  if (path.startsWith("/discover")) return <Discover />;
  if (path.startsWith("/conversations")) return <Conversations />;
  if (path.startsWith("/me")) return <Me />;
  return <Today />;
}

export function TacetApp() {
  const path = usePath();
  const [firstRun, setFirstRun] = useState(() => !firstRunDone());

  if (firstRun) {
    return (
      <FirstRun
        onDone={() => {
          setFirstRun(false);
          navigate("/today");
        }}
      />
    );
  }

  return <AppShell>{screenFor(path)}</AppShell>;
}
