import { PLATFORMS } from "./types";
import { BrandLogo } from "./BrandLogos";
import { TacetMark } from "./TacetMark";
import { useInView } from "./useInView";

// The open social web Tacet actually connects to, orbiting one home. Place badges,
// not protocol talk. These stay in a stable ring — they do not collapse into a count.
const OPEN = PLATFORMS.filter((p) => p.category === "open");

function ringOffset(index: number, total: number): { x: string; y: string } {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  const radius = 150; // px from centre
  return {
    x: `calc(-50% + ${Math.cos(angle) * radius}px)`,
    y: `calc(-50% + ${Math.sin(angle) * radius}px)`,
  };
}

export function ConvergenceSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="lp-section lp-band lp-band-lavender" id="lp-convergence">
      <div className={"lp-band-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <div className="lp-band-copy">
          <h2 className="lp-h2">Tacet brings it all together.</h2>
          <p className="lp-band-sub">
            One identity. One inbox. One place.{" "}
            <span className="lp-accent-word">The open social web.</span>
          </p>
        </div>

        <div className={"lp-converge" + (inView ? " is-in" : "")} aria-hidden="true">
          {OPEN.map((p, i) => {
            const off = ringOffset(i, OPEN.length);
            return (
              <div
                className="lp-orbit"
                key={p.id}
                style={{ transform: `translate(${off.x}, ${off.y})` }}
              >
                <BrandLogo id={p.id} />
                <span className="lp-orbit-name">{p.name}</span>
              </div>
            );
          })}
          <div className="lp-core">
            <TacetMark className="lp-hearth lp-hearth-core" />
            <span className="lp-core-word">tacet</span>
          </div>
        </div>
      </div>
    </section>
  );
}
