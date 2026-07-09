import { TacetMark } from "./TacetMark";

// Top navigation over the hero, per the canonical brand hero: the Hearth lockup on
// the left; Why tacet · Communities · Open web · Sign in on the right. The marketing
// links collapse on small screens (mobile stays cosy — wordmark + Sign in only).
export function LandingNav({
  onWhy,
  onCommunities,
  onOpenWeb,
  onSignIn,
}: {
  onWhy: () => void;
  onCommunities: () => void;
  onOpenWeb: () => void;
  onSignIn: () => void;
}) {
  return (
    <header className="lp-nav">
      <a className="lp-nav-brand" href="/" aria-label="Tacet — home">
        <TacetMark className="lp-hearth" />
        <span className="lp-nav-word">tacet</span>
      </a>
      <nav className="lp-nav-actions">
        <button className="lp-navlink lp-nav-marketing" onClick={onWhy}>Why tacet</button>
        <button className="lp-navlink lp-nav-marketing" onClick={onCommunities}>Communities</button>
        <button className="lp-navlink lp-nav-marketing" onClick={onOpenWeb}>Open web</button>
        <button className="lp-navlink" onClick={onSignIn}>Sign in</button>
      </nav>
    </header>
  );
}
