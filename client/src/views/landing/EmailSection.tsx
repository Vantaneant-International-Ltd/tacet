import { useInView } from "./useInView";

// Brought back by operator request. The email metaphor is the most human way to
// explain the open web: one address, friends elsewhere, messages still arrive. The
// diagram animates — flowing links from you out to people on their own places — so
// the idea reads as alive, not a static list.
const PLACES = [
  { name: "mastodon.social", y: 34 },
  { name: "pixelfed.social", y: 90 },
  { name: "peertube.social", y: 146 },
];

export function EmailSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  return (
    <section className="lp-section lp-band lp-band-dark" id="lp-email">
      <div className={"lp-band-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <div className="lp-band-copy">
          <h2 className="lp-h2">It should work like email.</h2>
          <p className="lp-band-sub">
            You have one address. Your friends can live anywhere.
            <br />
            Messages still arrive. People still connect.
          </p>
          <p className="lp-email-you">you@tacet.social</p>
        </div>

        <div className={"lp-email-diagram" + (inView ? " is-in" : "")} aria-hidden="true">
          <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet">
            {PLACES.map((pl, i) => (
              <line
                key={pl.name}
                className="lp-email-link"
                x1="52" y1="90" x2="248" y2={pl.y}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
            {/* you */}
            <circle cx="52" cy="90" r="20" className="lp-email-you-node" />
            <circle cx="52" cy="90" r="27" className="lp-email-halo" />
            {/* places */}
            {PLACES.map((pl) => (
              <g key={pl.name}>
                <circle cx="248" cy={pl.y} r="9" className="lp-email-place" />
                <text x="234" y={pl.y + 4} className="lp-email-place-label">
                  {pl.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
