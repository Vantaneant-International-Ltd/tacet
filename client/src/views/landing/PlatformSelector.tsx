import { PLATFORMS } from "./types";
import { PlatformTile } from "./PlatformTile";
import { useInView } from "./useInView";

export function PlatformSelector({
  selected,
  onToggle,
  onContinue,
}: {
  selected: Set<string>;
  onToggle: (id: string) => void;
  onContinue: () => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <section className="lp-section" id="lp-selector">
      <div className={"lp-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <h2 className="lp-h2">Where do you live online?</h2>
        <p className="lp-sub">
          Choose the places you use today. Tacet brings the open web into one calm place.
        </p>

        <div className="lp-tiles">
          {PLATFORMS.map((p) => (
            <PlatformTile
              key={p.id}
              platform={p}
              selected={selected.has(p.id)}
              onToggle={onToggle}
            />
          ))}
        </div>

        <p className="lp-fine">
          Selections help personalize onboarding. Closed platforms may require manual
          import or future support.
        </p>

        <div className="lp-cta-row">
          <button className="lp-btn" onClick={onContinue}>Continue</button>
        </div>
      </div>
    </section>
  );
}
