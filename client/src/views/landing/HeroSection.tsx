import { BreathingNetworkBackground } from "./BreathingNetworkBackground";

export function HeroSection({
  onContinue,
  onSignIn,
}: {
  onContinue: () => void;
  onSignIn: () => void;
}) {
  return (
    <section className="lp-section lp-hero" id="lp-hero">
      <BreathingNetworkBackground />
      <div className="lp-inner">
        <p className="lp-hero-mark">Tacet</p>
        <h1 className="lp-h1">
          How many social networks
          <br />
          do you need to stay connected?
        </h1>
        <p className="lp-lead lp-hero-lead">
          <span className="lp-lead-lines">
            <span>One identity.</span>
            <span>Your people.</span>
            <span>No walls.</span>
          </span>
        </p>
        <div className="lp-cta-row">
          <button className="lp-btn" onClick={onContinue}>Continue</button>
          <button className="lp-linkbtn" onClick={onSignIn}>
            Already have an account? Sign in
          </button>
        </div>
      </div>
      <div className="lp-scroll-cue" aria-hidden="true">Scroll</div>
    </section>
  );
}
