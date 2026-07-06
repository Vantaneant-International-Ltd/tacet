// First-run front door: "Bring your world." Shows where your content will come from, then
// lets you enter. Imports are marked "Soon" (not yet built — honesty over theatre); the
// federated ones (Mastodon/Bluesky) land with P4. Dismissal is a per-device preference.

const KEY = "tacet_onboarded";

export function hasOnboarded(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

const SERVICES = [
  { ic: "IG", name: "Instagram", desc: "Photos, captions, your grid", soon: true },
  { ic: "X", name: "X · Twitter", desc: "Posts and profile", soon: true },
  { ic: "in", name: "LinkedIn", desc: "Profile and articles", soon: true },
  { ic: "M", name: "Mastodon", desc: "Move your account over the protocol", soon: true },
  { ic: "bs", name: "Bluesky", desc: "Bring your posts and follows", soon: true },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  function done() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    onDone();
  }

  return (
    <div className="overlay onboarding" role="dialog" aria-label="Welcome to TACET">
      <div className="overlay-inner onboarding-inner">
        <p className="label mark">TACET</p>
        <h1 className="onboard-title">Bring your world.</h1>
        <p className="onboard-sub">
          Your posts and profile don't have to start empty. Bring them from where you already are — it stays
          yours, and no algorithm follows it here.
        </p>

        <div className="services">
          {SERVICES.map((s) => (
            <div className="service" key={s.name}>
              <span className="ic">{s.ic}</span>
              <div className="tt">
                <div className="n">{s.name}</div>
                <div className="d">{s.desc}</div>
              </div>
              {s.soon && <span className="soon">Soon</span>}
            </div>
          ))}
        </div>

        <button className="label action enter-fresh" onClick={done}>
          Start fresh — enter TACET
        </button>
        <p className="onboard-foot">
          One home for it all — photos, thoughts, video, threads — owned by you, quiet by design.
        </p>
      </div>
    </div>
  );
}
