import { Link } from "../router";

// Static house pages reachable from Settings. Quiet, factual, no marketing (DESIGN §7).
function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="info">
      <Link to="/you" className="label back">
        Settings
      </Link>
      <h1 className="info-title">{title}</h1>
      {children}
      <p className="info-foot label">TACET · a VNTA Group venture · vnta.xyz</p>
    </section>
  );
}

export function Contact() {
  return (
    <Page title="Contact">
      <p className="info-p">TACET is run by VNTA Group, Dublin. It is invite-only, and quiet on purpose.</p>
      <p className="info-p">
        For anything — a question, a problem, a house of your own — write to{" "}
        <a className="under" href="mailto:hello@vnta.xyz">
          hello@vnta.xyz
        </a>
        . A person reads it. The app will never message you on its own behalf.
      </p>
    </Page>
  );
}

export function Privacy() {
  return (
    <Page title="Your privacy">
      <p className="info-p">
        The refusals are the privacy policy. There is no advertising, no tracking pixels, no analytics beyond
        privacy-respecting server logs, and nothing is ever sold — least of all you.
      </p>
      <ul className="info-list">
        <li>No like, follower, or view counts. Nothing about you is measured in public.</li>
        <li>No algorithm deciding what you see. Chronology only.</li>
        <li>Reading is private — no online dots, no last-seen, no read receipts.</li>
        <li>A private account keeps your posts to approved followers.</li>
        <li>Your data is yours: bring it in, and take it with you (the network is federated and open).</li>
      </ul>
      <p className="info-p">We keep only what is needed to run the house, and no more.</p>
    </Page>
  );
}
