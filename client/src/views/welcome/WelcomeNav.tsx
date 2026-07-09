import { Link } from "../../router";
import { TacetMark } from "../landing/TacetMark";

// Funnel header: the Hearth lockup on the left; "Already have an account? Sign in" on
// the right (→ /enter). Matches the welcome mock.
export function WelcomeNav() {
  return (
    <header className="wz-nav">
      <Link to="/" className="wz-nav-brand" aria-label="Tacet — home">
        <TacetMark className="wz-hearth" />
        <span className="wz-nav-word">tacet</span>
      </Link>
      <Link to="/enter" className="wz-nav-signin">
        Already have an account? <span>Sign in</span>
      </Link>
    </header>
  );
}
