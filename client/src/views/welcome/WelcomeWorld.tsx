import { useState } from "react";
import { navigate } from "../../router";
import { PLATFORMS } from "../landing/types";
import { BrandLogo } from "../landing/BrandLogos";
import { WelcomeNav } from "./WelcomeNav";
import { WelcomeStepper } from "./WelcomeStepper";
import "./welcome.css";

// The eight named places (4×2 grid), then "Other" centred on its own row — per mock.
const PLACES = PLATFORMS.filter((p) => p.id !== "other");
const OTHER = PLATFORMS.find((p) => p.id === "other")!;

// Human descriptors — plain place words, no protocol jargon.
const DESC: Record<string, string> = {
  instagram: "Photos & stories",
  tiktok: "Video",
  reddit: "Communities",
  x: "Posts & news",
  linkedin: "Work",
  mastodon: "Open social",
  pixelfed: "Open photos",
  peertube: "Open video",
  other: "Another place",
};

// Step 2 — "Your world". The platform picker. Honest: selections only orient your
// home; they are never sent anywhere and imply no integration with closed platforms.
// Selections stay client-side (this component's state) for now.
export function WelcomeWorld() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const card = (p: (typeof PLATFORMS)[number]) => {
    const on = selected.has(p.id);
    return (
      <button
        key={p.id}
        type="button"
        className={"wz-card" + (on ? " is-on" : "")}
        aria-pressed={on}
        onClick={() => toggle(p.id)}
      >
        <span className="wz-check" aria-hidden="true">{on ? "✓" : ""}</span>
        <BrandLogo id={p.id} />
        <span className="wz-card-name">{p.name}</span>
        <span className="wz-card-desc">{DESC[p.id] ?? ""}</span>
      </button>
    );
  };

  return (
    <main className="wz">
      <WelcomeNav />
      <div className="wz-inner">
        <WelcomeStepper current={2} />

        <h1 className="wz-title">Where do you live online?</h1>
        <p className="wz-sub">
          Pick the places you spend time now. This just helps orient your home —
          your selections stay on this device.
        </p>

        <div className="wz-grid" role="group" aria-label="Places you use">
          {PLACES.map(card)}
        </div>
        <div className="wz-grid-other">{card(OTHER)}</div>

        <p className="wz-fine">
          <span aria-hidden="true">🔒</span> Your selections are private and stay on this device.
        </p>

        <div className="wz-actions">
          <button className="wz-btn wz-btn-ghost" onClick={() => navigate("/")}>
            <span aria-hidden="true">&larr;</span> Back
          </button>
          <button className="wz-btn wz-btn-dark" onClick={() => navigate("/welcome/home")}>
            Continue <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </main>
  );
}
