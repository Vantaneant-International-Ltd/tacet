import { useInView } from "./useInView";
import { TacetMark } from "./TacetMark";

export function FinalCTA({
  onJoin,
  onSignIn,
  onReadManifesto,
  onHowItWorks,
}: {
  onJoin: () => void;
  onSignIn: () => void;
  onReadManifesto: () => void;
  onHowItWorks: () => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <>
      <section className="lp-section lp-final lp-band-cta" id="lp-final">
        <div className={"lp-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
          <h2 className="lp-h2">Be part of something better.</h2>
          <p className="lp-sub">
            Join the beta and help shape a new kind of social experience.
            <br />
            Built for people, not platforms.
          </p>
          <div className="lp-cta-row">
            <button className="lp-btn" onClick={onJoin}>
              Join the beta <span aria-hidden="true">&rarr;</span>
            </button>
            <button className="lp-linkbtn" onClick={onSignIn}>
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <a className="lp-footer-brand" href="/" aria-label="Tacet — home">
          <TacetMark className="lp-hearth" />
          <span>tacet</span>
        </a>
        <nav className="lp-footer-links">
          <button onClick={onReadManifesto}>Manifesto</button>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/status">Status</a>
          <a
            href="https://github.com/Vantaneant-International-Ltd/tacet"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <button onClick={onHowItWorks}>Contact</button>
        </nav>
        <span className="lp-footer-copy">© 2026 Tacet, a VNTA Group venture.</span>
      </footer>
    </>
  );
}
