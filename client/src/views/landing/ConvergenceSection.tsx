import type { Platform } from "./types";
import { GLYPH } from "./types";
import { useInView } from "./useInView";

// Orbit start positions: each platform begins out on a ring, then — once in view —
// flows inward to the Tacet core (the CSS collapses every orbit to the centre).
function ringOffset(index: number, total: number): { x: string; y: string } {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  const radius = 165; // px from centre
  return {
    x: `calc(-50% + ${Math.cos(angle) * radius}px)`,
    y: `calc(-50% + ${Math.sin(angle) * radius}px)`,
  };
}

export function ConvergenceSection({ platforms }: { platforms: Platform[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="lp-section" id="lp-convergence">
      <div className="lp-inner">
        <h2 className="lp-h2">One place changes everything.</h2>
        <p className="lp-lead">
          <span className="lp-lead-lines">
            <span>One identity.</span>
            <span>One inbox.</span>
            <span>One place.</span>
            <span className="lp-accent-word">The open social web.</span>
          </span>
        </p>

        <div
          className={"lp-converge" + (inView ? " is-in" : "")}
          ref={ref}
          aria-hidden="true"
        >
          {platforms.map((p, i) => {
            const off = ringOffset(i, platforms.length);
            return (
              <div
                className="lp-orbit"
                key={p.id}
                style={{ transform: `translate(${off.x}, ${off.y})` }}
              >
                <span className="lp-tile-glyph">{GLYPH[p.id]}</span>
                <span className="lp-orbit-name">{p.name}</span>
              </div>
            );
          })}
          <div className="lp-core">
            <span className="lp-core-word">Tacet</span>
          </div>
        </div>
      </div>
    </section>
  );
}
