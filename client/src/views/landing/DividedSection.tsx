import { useInView } from "./useInView";

// Replaces the old "work like email" panel, which used protocol jargon and raw
// @user@instance handles (a doctrine refusal). This states the feeling plainly and
// lets a scattered field resolve into one calm node.
export function DividedSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <section className="lp-section lp-band lp-band-light" id="lp-divided">
      <div className={"lp-band-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <div className="lp-band-copy">
          <h2 className="lp-h2">
            The internet was never
            <br />
            meant to be this divided.
          </h2>
        </div>
        <div className="lp-divided-visual">
          <svg
            className="lp-divided-svg"
            viewBox="0 0 320 120"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <g stroke="var(--lp-accent-deep)" strokeWidth="1" opacity="0.5" fill="none">
              <path d="M10 20 Q120 60 200 60" />
              <path d="M4 45 Q120 58 200 60" />
              <path d="M14 70 Q120 60 200 60" />
              <path d="M8 95 Q120 62 200 60" />
              <path d="M40 12 Q130 58 200 60" />
              <path d="M36 105 Q130 62 200 60" />
            </g>
            <g fill="var(--lp-accent-deep)" opacity="0.55">
              <circle cx="10" cy="20" r="2" />
              <circle cx="4" cy="45" r="2" />
              <circle cx="14" cy="70" r="2" />
              <circle cx="8" cy="95" r="2" />
              <circle cx="40" cy="12" r="2" />
              <circle cx="36" cy="105" r="2" />
              <circle cx="70" cy="35" r="1.6" />
              <circle cx="90" cy="82" r="1.6" />
            </g>
            <line x1="200" y1="60" x2="308" y2="60" stroke="var(--lp-accent-deep)" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.6" />
            <circle cx="200" cy="60" r="9" fill="var(--lp-accent-deep)" />
            <circle cx="200" cy="60" r="14" fill="none" stroke="var(--lp-accent-deep)" strokeWidth="1" opacity="0.4" />
            <circle cx="308" cy="60" r="3" fill="var(--lp-accent-deep)" />
          </svg>
          <p className="lp-divided-aside">The open social web was always the future.</p>
        </div>
      </div>
    </section>
  );
}
