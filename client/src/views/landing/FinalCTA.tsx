import { useInView } from "./useInView";

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
    <section className="lp-section lp-final" id="lp-final">
      <div className={"lp-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <h2 className="lp-h2">Be part of something better.</h2>
        <p className="lp-sub">
          Help shape a calmer, open social network built for people, not platforms.
        </p>
        <p className="lp-fine" style={{ marginTop: "1.25rem" }}>
          Tacet begins with the open social web. Closed platforms remain walled gardens.
        </p>
        <div className="lp-cta-row">
          <button className="lp-btn" onClick={onJoin}>Join the beta</button>
          <button className="lp-linkbtn" onClick={onReadManifesto}>Read the manifesto</button>
        </div>
      </div>

      <footer className="lp-footer">
        <span className="lp-footer-mark">Tacet</span>
        <button onClick={onReadManifesto}>Manifesto</button>
        <button onClick={onHowItWorks}>How it works</button>
        <a href="/privacy">Privacy</a>
        <a href="https://github.com/Vantaneant-International-Ltd/tacet" target="_blank" rel="noreferrer">GitHub</a>
        <a href="/status">Status</a>
        <button onClick={onSignIn}>Sign in</button>
      </footer>
    </section>
  );
}
