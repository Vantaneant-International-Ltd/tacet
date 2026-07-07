import { useInView } from "./useInView";

// Sparse, keynote cadence. Each line lands alone.
const LINES: { text: string; className?: string }[] = [
  { text: "The internet forgot something." },
  { text: "People.", className: "accent gap" },
  { text: "The web became walls.", className: "dim gap" },
  { text: "You became the product.", className: "dim" },
  { text: "We are rebuilding the social web", className: "gap" },
  { text: "around people again." },
  { text: "One identity.", className: "gap" },
  { text: "Not one platform.", className: "dim" },
  { text: "Welcome home.", className: "accent gap" },
];

export function ManifestoSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <section className="lp-section lp-manifesto" id="lp-manifesto">
      <div className={"lp-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        {LINES.map((l, i) => (
          <p key={i} className={"lp-manifesto-line " + (l.className ?? "")}>
            {l.text}
          </p>
        ))}
      </div>
    </section>
  );
}
