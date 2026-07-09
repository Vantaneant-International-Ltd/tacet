import { useState } from "react";
import { navigate } from "../../router";
import { PLATFORMS } from "../landing/types";
import { BrandLogo } from "../landing/BrandLogos";
import { WelcomeStepper } from "./WelcomeStepper";
import "./welcome.css";

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

  return (
    <main className="wz">
      <div className="wz-inner">
        <WelcomeStepper current={2} />

        <h1 className="wz-title">Where do you live online?</h1>
        <p className="wz-sub">
          Pick the places you spend time now. This just helps orient your home —
          your selections stay on this device.
        </p>

        <div className="wz-grid" role="group" aria-label="Places you use">
          {PLATFORMS.map((p) => {
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
          })}
        </div>

        <p className="wz-fine">
          <span aria-hidden="true">🔒</span> Your selections are private and stay on this device.
        </p>

        <div className="wz-actions">
          <button className="wz-btn wz-btn-ghost" onClick={() => navigate("/")}>
            &larr; Back
          </button>
          <button className="wz-btn wz-btn-primary" onClick={() => navigate("/welcome/home")}>
            Continue <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </main>
  );
}
