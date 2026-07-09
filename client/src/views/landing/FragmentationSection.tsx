import { PLATFORMS } from "./types";
import { BrandLogo } from "./BrandLogos";
import { useInView } from "./useInView";

// The scattered status quo: the places a visitor already lives, closed and open alike
// (Instagram … PeerTube), named as the fragmentation — not a promise of integration.
// Closed platforms appear ONLY here; only the open web converges into Tacet later.
const SCATTERED = PLATFORMS.filter((p) => p.id !== "other");

export function FragmentationSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <section className="lp-section lp-band lp-band-light" id="lp-fragmentation">
      <div className={"lp-band-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <div className="lp-band-copy">
          <h2 className="lp-h2">Today&rsquo;s internet is fragmented.</h2>
          <p className="lp-band-sub">
            Six identities. Six inboxes.
            <br />
            Six algorithms. Six companies.
          </p>
        </div>
        <div className="lp-logo-row" aria-hidden="true">
          {SCATTERED.map((p) => (
            <div className="lp-logo-card" key={p.id}>
              <BrandLogo id={p.id} />
              <span className="lp-logo-name">{p.name}</span>
            </div>
          ))}
          <div className="lp-logo-card lp-logo-more">
            <BrandLogo id="other" />
            <span className="lp-logo-name">And more</span>
          </div>
        </div>
      </div>
    </section>
  );
}
