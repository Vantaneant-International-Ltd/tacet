import { useState } from "react";
import { usePath, navigate } from "../router";
import { AppShell } from "./AppShell";
import { Today } from "./screens/Today";
import { People } from "./screens/People";
import { Discover } from "./screens/Discover";
import { Conversations } from "./screens/Conversations";
import { Me } from "./screens/Me";
import { FirstRun } from "./onboarding/FirstRun";
import { firstRunDone } from "./onboarding/hints";

// The five surfaces of the IA. The first-run setup ("the first five minutes") gates the
// experience once per device, then hands off into Today.
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
