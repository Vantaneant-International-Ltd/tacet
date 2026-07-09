import { PLATFORMS } from "./types";
import { BrandLogo } from "./BrandLogos";
import { useInView } from "./useInView";

// The scattered status quo, per mock: heading left, one full-width row of every place a
// visitor lives (closed + open) + "And more", with dotted threads dropping from each and
// converging to a single point below. Closed platforms appear ONLY here.
const ITEMS = [
  ...PLATFORMS.filter((p) => p.id !== "other"),
  { id: "other", name: "And more" },
];

// Each thread tinted toward its platform, like the mock.
const THREAD: Record<string, string> = {
  instagram: "#C13584", tiktok: "#FE2C55", reddit: "#FF4500", x: "#3b3b3b",
  linkedin: "#0A66C2", mastodon: "#6364FF", pixelfed: "#8A4FFF", peertube: "#F1680D", other: "#9c93b2",
};

export function FragmentationSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const n = ITEMS.length;
  return (
    <section className="lp-section lp-band lp-band-light lp-frag" id="lp-fragmentation">
      <div className={"lp-frag-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <div className="lp-frag-copy">
          <h2 className="lp-h2">Today&rsquo;s internet is fragmented.</h2>
          <p className="lp-band-sub">
            Six identities. Six inboxes.
            <br />
            Six algorithms. Six companies.
          </p>
          <span className="lp-frag-rule" aria-hidden="true" />
        </div>

        <div className="lp-frag-cards" aria-hidden="true">
          <div className="lp-frag-row">
            {ITEMS.map((p) => (
              <div className="lp-logo-card" key={p.id}>
                <BrandLogo id={p.id} />
                <span className="lp-logo-name">{p.name}</span>
              </div>
            ))}
          </div>
          <svg className="lp-frag-threads" viewBox="0 0 100 40" preserveAspectRatio="none">
            {ITEMS.map((p, i) => {
              const x = ((i + 0.5) / n) * 100;
              return (
                <path key={p.id} d={`M${x} 0 C ${x} 22, 50 20, 50 40`} stroke={THREAD[p.id]} />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
