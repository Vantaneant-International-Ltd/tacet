import { useState } from "react";
import { navigate } from "../../router";
import { PLATFORMS } from "../landing/types";
import { BrandLogo } from "../landing/BrandLogos";
import { TacetMark } from "../landing/TacetMark";
import { WelcomeNav } from "./WelcomeNav";
import { WelcomeStepper } from "./WelcomeStepper";
import "./welcome.css";

const DESC: Record<string, string> = {
  instagram: "Photos & stories",
  tiktok: "Videos",
  reddit: "Communities",
  x: "Updates & news",
  linkedin: "Professional network",
  mastodon: "Decentralized social",
  pixelfed: "Photo sharing",
  peertube: "Video sharing",
  other: "Another platform",
};

// The eight named places (4×2 grid), then "Other" centred. Only the OPEN web actually
// connects into Tacet, so the convergence below shows the open places — closed ones are
// the scattered status quo, never a false integration promise.
const PLACES = PLATFORMS.filter((p) => p.id !== "other");
const OTHER = PLATFORMS.find((p) => p.id === "other")!;
const OPEN = PLATFORMS.filter((p) => p.category === "open");

const SCATTER = [
  { l: 10, t: 18 }, { l: 34, t: 10 }, { l: 60, t: 20 }, { l: 86, t: 14 },
  { l: 20, t: 62 }, { l: 46, t: 74 }, { l: 70, t: 60 }, { l: 90, t: 74 },
];

function ScatterDiagram() {
  return (
    <div className="wz-scatter" aria-hidden="true">
      <svg className="wz-scatter-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {SCATTER.slice(1).map((b, i) => {
          const a = SCATTER[i];
          return <line key={i} x1={a.l} y1={a.t} x2={b.l} y2={b.t} />;
        })}
      </svg>
      {PLACES.map((p, i) => {
        const s = SCATTER[i % SCATTER.length];
        return (
          <div className="wz-scatter-chip" key={p.id} style={{ left: `${s.l}%`, top: `${s.t}%` }}>
            <BrandLogo id={p.id} />
          </div>
        );
      })}
    </div>
  );
}

function ConvergeDiagram() {
  const ys = [22, 50, 78];
  return (
    <div className="wz-converge" aria-hidden="true">
      <svg className="wz-converge-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {ys.map((y, i) => (
          <path key={i} className="wz-converge-in" d={`M8 ${y} C 34 ${y}, 40 50, 50 50`} />
        ))}
        {[16, 38, 62, 84].map((y, i) => (
          <path key={"r" + i} className="wz-converge-out" d={`M54 50 C 74 50, 74 ${y}, 94 ${y}`} />
        ))}
      </svg>
      {OPEN.map((p, i) => (
        <div className="wz-converge-chip" key={p.id} style={{ top: `${ys[i]}%` }}>
          <BrandLogo id={p.id} />
        </div>
      ))}
      <div className="wz-converge-core">
        <TacetMark className="wz-hearth wz-hearth-core" />
      </div>
    </div>
  );
}

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
    <main className="wz wz--full">
      <WelcomeNav />

      <div className="wz-inner">
        <WelcomeStepper current={2} />

        <h1 className="wz-title">Where do you live online?</h1>
        <p className="wz-sub">
          Select the places you currently use to connect, share, and keep up with the
          people and things you care about.
          <br />
          <span className="wz-sub-accent">We&rsquo;ll bring your open web together in one place.</span>
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

      {/* ---- Below the flow: the same story the landing tells, in the funnel ---- */}
      <section className="wz-band wz-band-scatter">
        <div className="wz-band-inner">
          <div className="wz-band-copy">
            <h2 className="wz-band-title">Today, your online life is scattered.</h2>
            <ul className="wz-checks">
              {["Different apps", "Different inboxes", "Different algorithms", "Different companies", "Different rules"].map((t) => (
                <li key={t}><span className="wz-tick" aria-hidden="true">✓</span>{t}</li>
              ))}
            </ul>
          </div>
          <ScatterDiagram />
        </div>
      </section>

      <section className="wz-band wz-band-converge">
        <div className="wz-band-inner">
          <div className="wz-band-copy">
            <h2 className="wz-band-title">Tacet brings the open web together.</h2>
            <ul className="wz-checks">
              {["One identity", "One feed", "One place", "The open social web"].map((t) => (
                <li key={t}><span className="wz-tick" aria-hidden="true">✓</span>{t}</li>
              ))}
            </ul>
          </div>
          <ConvergeDiagram />
        </div>
      </section>

      <section className="wz-band wz-band-home">
        <h2 className="wz-home-title">
          Your home on the <span className="wz-accent-word">open</span> social web.
        </h2>
        <p className="wz-home-tag">People before platforms. Always.</p>
        <button className="wz-backlink" onClick={() => navigate("/")}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </section>
    </main>
  );
}
