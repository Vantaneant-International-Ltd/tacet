import { BrandLogo } from "./BrandLogos";
import { TacetMark } from "./TacetMark";
import { useInView } from "./useInView";

// The mock's orbital: people (avatars) and the OPEN-web places ring the Tacet Hearth,
// joined by dashed radial lines. Only open places converge into Tacet — no closed
// platform does (honest). Avatars are gradient placeholders for real people.
const NODES = [
  { type: "av", g: 0 },
  { type: "place", id: "mastodon" },
  { type: "av", g: 1 },
  { type: "place", id: "pixelfed" },
  { type: "av", g: 2 },
  { type: "place", id: "peertube" },
  { type: "av", g: 3 },
  { type: "av", g: 4 },
] as const;

const R = 40; // ring radius, % of the square
function pos(i: number, n: number) {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(a) * R, y: 50 + Math.sin(a) * R };
}

export function ConvergenceSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="lp-section lp-band lp-band-lavender" id="lp-convergence">
      <div className={"lp-band-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <div className="lp-band-copy">
          <h2 className="lp-h2">Tacet brings it all together.</h2>
          <p className="lp-band-sub">
            One identity. One feed. One place.{" "}
            <span className="lp-accent-word">The open social web.</span>
          </p>
        </div>

        <div className={"lp-converge" + (inView ? " is-in" : "")} aria-hidden="true">
          <svg className="lp-orb-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            {NODES.map((_, i) => {
              const p = pos(i, NODES.length);
              return <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} />;
            })}
          </svg>
          {NODES.map((node, i) => {
            const p = pos(i, NODES.length);
            const style = { left: `${p.x}%`, top: `${p.y}%`, transitionDelay: `${i * 55}ms` };
            return node.type === "place" ? (
              <div className="lp-orb lp-orb-place" style={style} key={i}>
                <BrandLogo id={node.id} />
              </div>
            ) : (
              <div className={`lp-orb lp-orb-av lp-orb-av--${node.g}`} style={style} key={i} />
            );
          })}
          <div className="lp-core">
            <TacetMark className="lp-hearth lp-hearth-core" />
          </div>
        </div>
      </div>
    </section>
  );
}
