import { TacetMark } from "./TacetMark";

// Top navigation over the hero: the Hearth lockup on the left; Sign in + the single
// "Join the beta" pill on the right. One verb across the whole page.
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
        <button className="lp-navlink" onClick={onSignIn}>Sign in</button>
        <button className="lp-btn lp-btn-sm" onClick={onJoin}>
          Join the beta <span aria-hidden="true">&rarr;</span>
        </button>
      </nav>
    </header>
  );
}
