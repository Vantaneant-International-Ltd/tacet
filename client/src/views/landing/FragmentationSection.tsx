import { PLATFORMS } from "./types";
import { BrandLogo } from "./BrandLogos";
import { useInView } from "./useInView";

// The walls a visitor already lives behind. Naming the problem — not promising to
// integrate with any of them. Closed platforms only; the open web converges next.
const CLOSED = PLATFORMS.filter((p) => p.category === "closed");

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
          {CLOSED.map((p) => (
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
