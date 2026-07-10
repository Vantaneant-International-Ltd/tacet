import { useConnectivity, relativeTime } from "./openweb";

// "Your home is connected" — a calm, world-directed module showing how this home touches the
// open social web right now. Everything here is about the OPEN WEB reachable from Tacet, never
// the person's own activity (ADR-011/012): no self-directed counts, no red, no urgency. Human
// labels only (product/medium names, never protocol words). Numbers are live from the source
// registry + collected cache — never hardcoded. Absent (not an error box) while loading.
export function ConnectivityPanel() {
  const state = useConnectivity();
  if (state.status !== "ready") return null;
  const c = state.data;
  const refreshed = c.lastRefreshed ? relativeTime(c.lastRefreshed) : "";

  return (
    <section className="t-connect t-card" aria-label="Your home is connected">
      <header className="t-connect__head">
        <span className="t-connect__pip" aria-hidden="true" />
        <h3 className="t-connect__title">Your home is connected</h3>
      </header>
      <p className="t-connect__lead">
        A window onto the open social web — here&rsquo;s what it reaches right now.
      </p>

      <ul className="t-connect__families">
        {c.families.map((f) => (
          <li key={f.adapter} className="t-connect__family">
            <span className="t-connect__label">{f.label}</span>
            <span className="t-connect__count t-mono">
              watching {f.watching}
            </span>
          </li>
        ))}
      </ul>

      <p className="t-connect__foot t-mono">
        {c.placesWatched} sources · {c.serversSeen} {c.serversSeen === 1 ? "home" : "homes"} seen · {c.postsGathered} recent posts
        {refreshed ? ` · refreshed ${refreshed === "now" ? "just now" : refreshed + " ago"}` : ""}
      </p>
    </section>
  );
}
