import { useInView } from "./useInView";

// Mock's split-tone band: heading left, a dispersed field of dots resolving through one
// node into a single line, and the closing line on the right. Replaces the old
// federation panel (protocol jargon / raw handles — a doctrine refusal).
const DOTS = [
  { x: 12, y: 20 }, { x: 8, y: 48 }, { x: 18, y: 74 }, { x: 14, y: 98 },
  { x: 36, y: 12 }, { x: 30, y: 60 }, { x: 40, y: 92 }, { x: 56, y: 28 },
  { x: 52, y: 72 }, { x: 70, y: 16 }, { x: 66, y: 50 }, { x: 74, y: 88 },
  { x: 92, y: 34 }, { x: 88, y: 66 }, { x: 104, y: 22 }, { x: 100, y: 80 },
  { x: 120, y: 48 }, { x: 118, y: 96 },
];
const NODE = { x: 205, y: 60 };

export function DividedSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <section className="lp-section lp-band lp-band-light lp-band-divided" id="lp-divided">
      <div className={"lp-divided-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <h2 className="lp-h2 lp-divided-h">
          The internet was
          <br />
          never meant to be
          <br />
          this divided.
        </h2>

        <div className="lp-divided-visual">
          <svg className="lp-divided-svg" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g stroke="var(--lp-accent-deep)" strokeWidth="0.6" opacity="0.35" fill="none">
              {DOTS.map((d, i) => (
                <path key={i} d={`M${d.x} ${d.y} Q ${(d.x + NODE.x) / 2} ${(d.y + NODE.y) / 2 + (i % 2 ? 8 : -8)}, ${NODE.x} ${NODE.y}`} />
              ))}
            </g>
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={i % 3 ? 1.8 : 2.4} fill={i % 4 === 0 ? "#e58bb0" : "var(--lp-accent-deep)"} opacity="0.7" />
            ))}
            <line x1={NODE.x} y1={NODE.y} x2="312" y2={NODE.y} stroke="var(--lp-accent-deep)" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />
            <circle cx={NODE.x} cy={NODE.y} r="16" fill="none" stroke="var(--lp-accent-deep)" strokeWidth="1" opacity="0.35" />
            <circle cx={NODE.x} cy={NODE.y} r="9" fill="var(--lp-accent-deep)" />
            <circle cx="312" cy={NODE.y} r="3.5" fill="var(--lp-accent-deep)" />
          </svg>
        </div>

        <p className="lp-divided-aside">The open social web was always the future.</p>
      </div>
    </section>
  );
}
