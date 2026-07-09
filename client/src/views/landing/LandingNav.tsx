// Top navigation over the hero. Placeholder sunburst mark (operator instruction —
// swap for a real mark later) + wordmark on the left; Sign in + Join the beta on the
// right. The gradient pill is the page's single strongest call to action.
import { TacetMark } from "./TacetMark";

export function LandingNav({
  onSignIn,
  onJoin,
}: {
  onSignIn: () => void;
  onJoin: () => void;
}) {
  return (
    <header className="lp-nav">
      <a className="lp-nav-brand" href="/" aria-label="Tacet — home">
        <TacetMark className="lp-hearth" />
        <span className="lp-nav-word">tacet</span>
      </a>
      <nav className="lp-nav-actions">
        <button className="lp-linkbtn lp-nav-signin" onClick={onSignIn}>
          Sign in
        </button>
        <button className="lp-btn lp-btn-sm" onClick={onJoin}>
          Join the beta <span aria-hidden="true">&rarr;</span>
        </button>
      </nav>
    </header>
  );
}
