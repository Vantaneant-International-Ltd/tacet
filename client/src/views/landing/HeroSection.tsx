import { BreathingNetworkBackground } from "./BreathingNetworkBackground";
import { TacetMark } from "./TacetMark";

// Canonical brand hero (docs/10-design/tacet-brand/ui_kits/landing): deep ink, a
// breathing constellation under an iris glow + blossom wash, the Hearth, one primary
// action, and the five values. Full-height — it holds the screen before anything below.
export function HeroSection({
  onJoin,
  onHowItWorks,
}: {
  onJoin: () => void;
  onHowItWorks: () => void;
}) {
  return (
    <section className="lp-section lp-hero" id="lp-hero">
      <BreathingNetworkBackground />
      <div className="lp-hero-center">
        <TacetMark className="lp-hearth lp-hero-mark" />
        <h1 className="lp-h1 lp-hero-title">
          The social web.
          <br />
          <span className="lp-accent-word">Finally.</span>
        </h1>
        <p className="lp-hero-sub">One identity. Your people. No walls.</p>
        <div className="lp-cta-row lp-hero-cta">
          <button className="lp-btn" onClick={onJoin}>
            Join the beta <span aria-hidden="true">&rarr;</span>
          </button>
          <button className="lp-btn lp-btn-quiet" onClick={onHowItWorks}>
            How it works
          </button>
        </div>
      </div>
      <div className="lp-hero-values">
        <span><b>People</b> before platforms</span>
        <span><b>Relationships</b> before engagement</span>
        <span><b>Identity</b> before algorithms</span>
        <span><b>Calm</b> before addiction</span>
        <span><b>Open</b> before closed</span>
      </div>
      <div className="lp-scroll-cue" aria-hidden="true">
        <span className="lp-mouse" />
        <span className="lp-scroll-chevron" />
      </div>
    </section>
  );
}
