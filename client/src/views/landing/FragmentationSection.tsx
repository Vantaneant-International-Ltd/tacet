import type { Platform } from "./types";
import { GLYPH } from "./types";
import { useInView } from "./useInView";

// Deterministic scattered positions (percent of the container). Deliberately uneven —
// separate islands that do not line up or connect.
const SPOTS = [
  { left: "6%", top: "10%" },
  { left: "64%", top: "4%" },
  { left: "34%", top: "30%" },
  { left: "82%", top: "34%" },
  { left: "12%", top: "58%" },
  { left: "50%", top: "66%" },
  { left: "74%", top: "70%" },
  { left: "26%", top: "82%" },
  { left: "90%", top: "12%" },
];

export function FragmentationSection({ platforms }: { platforms: Platform[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <section className="lp-section" id="lp-fragmentation">
      <div className={"lp-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <h2 className="lp-h2">Today&rsquo;s internet is fragmented.</h2>
        <p className="lp-lead">
          <span className="lp-lead-lines">
            <span>Different identities.</span>
            <span>Different inboxes.</span>
            <span>Different algorithms.</span>
            <span>Different companies.</span>
          </span>
        </p>

        <div className="lp-scatter" aria-hidden="true">
          {platforms.map((p, i) => {
            const spot = SPOTS[i % SPOTS.length];
            return (
              <div
                className="lp-island"
                key={p.id}
                style={{
                  left: spot.left,
                  top: spot.top,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(12px)",
                }}
              >
                <span className="lp-tile-glyph">{GLYPH[p.id]}</span>
                <span className="lp-island-name">{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
