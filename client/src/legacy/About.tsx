// A static About page inside the YOU section. Copy is hardcoded and verbatim; no CMS,
// no admin editing. Styled per DESIGN.md — system text in --secondary/--dim, mono labels,
// no panels, no icons.

const PROMISES: [name: string, line: string][] = [
  ["NO COUNTS", "Nothing here is measured in public. No likes, no followers, no views."],
  ["NO ALGORITHM", "No machine decides what you see or when."],
  ["NO ADVERTISING", "You are not the product. Nothing here is for sale to anyone but you."],
  ["NO NOTIFICATIONS", "This app never asks to be opened. You come when you are curious."],
  ["NO SURVEILLANCE", "No online dots, no last-seen, no read receipts. Reading is private."],
];

export function About() {
  return (
    <section className="about">
      <h1 className="about-title">A quiet network.</h1>

      <p className="about-intro">
        TACET is a house of rooms, not a feed. What you see is ordered by time, because
        chronology is the only honest editor. How you see it is your choice: that is what
        lenses are for.
      </p>

      <p className="label about-section">The promises</p>
      <ul className="promises">
        {PROMISES.map(([name, line]) => (
          <li key={name} className="promise">
            <p className="promise-name">{name}</p>
            <p className="promise-line">{line}</p>
          </li>
        ))}
      </ul>

      <p className="label about-section">The verbs</p>
      <p className="about-body">
        You can reply, keep, or acknowledge. A keep is yours alone: the author learns a post
        was kept, never by whom, and never how many times. An acknowledgment is a single word
        — seen, with you, more — placed with your name for the room to see. It is never
        counted, and there is no opposite.
      </p>

      <p className="label about-section">The house</p>
      <p className="about-body">
        This house is run by VNTA Group, Dublin. It is invite-only. If you are reading this
        from inside, someone wanted you here.
      </p>

      <p className="about-foot label">
        <span>v{__APP_VERSION__}</span>
        <span className="about-foot-mark">TACET</span>
      </p>
    </section>
  );
}
