import { BrandLogo } from "./BrandLogos";
import { TacetMark } from "./TacetMark";
import { useInView } from "./useInView";

// "The people matter. Not where they signed up." People you follow live on open-web
// places; Tacet gathers them into one Today. Avatars are gradient placeholders (real
// people are wired later). Only open/fedi places appear — honest.
const AV = [
  "linear-gradient(140deg,#a18bff,#e6b0ec)",
  "linear-gradient(140deg,#8ab4ff,#7b61ff)",
  "linear-gradient(140deg,#f0aa78,#e58bb0)",
  "linear-gradient(140deg,#93d6c0,#8ab4ff)",
  "linear-gradient(140deg,#c6b6f6,#8a70ff)",
  "linear-gradient(140deg,#ffd08a,#f0aa78)",
  "linear-gradient(140deg,#b0e0d0,#93c0e0)",
];

type Card = {
  place: string; label: string; name: string; role: string; av: number;
  kind: "note" | "image" | "video"; text?: string; thumb?: number;
};
const CARDS: Card[] = [
  { place: "mastodon", label: "Mastodon", name: "Anna", role: "Designer & Maker", av: 0, kind: "note", text: "Working on a new illustration series…", thumb: 4 },
  { place: "pixelfed", label: "Pixelfed", name: "James", role: "Photographer", av: 1, kind: "image" },
  { place: "peertube", label: "PeerTube", name: "Sarah", role: "Video Creator", av: 2, kind: "video" },
  { place: "friendica", label: "Friendica", name: "Mike", role: "Community Builder", av: 3, kind: "note", text: "Can’t wait for the event this weekend!" },
];

const TODAY = [
  { name: "Anna", av: 0 }, { name: "James", av: 1 }, { name: "Sarah", av: 2 }, { name: "Mike", av: 3 },
  { name: "Emily", av: 4 }, { name: "Priya", av: 5 }, { name: "Tom", av: 6 },
];

const FEATURES = [
  { icon: "person", title: "One identity", sub: "One you." },
  { icon: "inbox", title: "One feed", sub: "Everything in one place." },
  { icon: "people", title: "All your people", sub: "From everywhere they choose to be." },
];

function FIcon({ name }: { name: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "inbox")
    return <svg viewBox="0 0 24 24" width="16" height="16"><path {...c} d="M3 13h5l1.5 2.5h5L16 13h5M4 13l2-7h12l2 7v5H4z" /></svg>;
  if (name === "people")
    return <svg viewBox="0 0 24 24" width="16" height="16"><circle {...c} cx="9" cy="8" r="3" /><path {...c} d="M3 19a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 19a6 6 0 0 0-4-5.6" /></svg>;
  return <svg viewBox="0 0 24 24" width="16" height="16"><circle {...c} cx="12" cy="8" r="3.2" /><path {...c} d="M5 20a7 7 0 0 1 14 0" /></svg>;
}

export function PeopleSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <section className="lp-section lp-band lp-band-lavender lp-people" id="lp-people">
      <div className={"lp-people-inner lp-reveal" + (inView ? " is-in" : "")} ref={ref}>
        <div className="lp-people-copy">
          <span className="lp-people-badge"><FIcon name="people" /> Your people, everywhere</span>
          <h2 className="lp-h2 lp-people-h">
            The people matter.
            <br />
            Not where they signed up.
          </h2>
          <p className="lp-band-sub">
            Your friends are on Mastodon.<br />
            Creators you love are on Pixelfed.<br />
            Communities live on PeerTube.<br />
            You shouldn’t need four apps just to keep up with them.
          </p>
          <p className="lp-people-accent">
            Tacet finds them.<br />
            You simply come home.
          </p>
          <ul className="lp-people-features">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <span className="lp-people-fi" aria-hidden="true"><FIcon name={f.icon} /></span>
                <span className="lp-people-ft"><b>{f.title}</b>{f.sub}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lp-people-flow" aria-hidden="true">
          <div className="lp-people-cards">
            {CARDS.map((c) => (
              <div className="lp-pcard" key={c.name}>
                <div className="lp-pcard-head"><BrandLogo id={c.place} /> {c.label}</div>
                <div className="lp-pcard-av" style={{ backgroundImage: AV[c.av] }} />
                <div className="lp-pcard-name">{c.name}</div>
                <div className="lp-pcard-role">{c.role}</div>
                {c.kind === "note" && (
                  <div className="lp-pcard-note">
                    <span>{c.text}</span>
                    {c.thumb !== undefined && <span className="lp-pcard-thumb" style={{ backgroundImage: AV[c.thumb] }} />}
                  </div>
                )}
                {c.kind === "image" && <div className="lp-pcard-media" style={{ backgroundImage: AV[c.av] }} />}
                {c.kind === "video" && (
                  <div className="lp-pcard-media lp-pcard-video" style={{ backgroundImage: AV[c.av] }}>
                    <span className="lp-pcard-play" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <svg className="lp-people-connect" viewBox="0 0 100 24" preserveAspectRatio="none">
            {[13, 38, 62, 87].map((x, i) => (
              <path key={i} d={`M${x} 0 C ${x} 15, 50 8, 50 24`} />
            ))}
          </svg>

          <div className="lp-people-core"><TacetMark className="lp-hearth lp-hearth-core" /></div>
          <div className="lp-people-arrow" />

          <div className="lp-people-today">
            <div className="lp-today-label">Today</div>
            <div className="lp-today-row">
              {TODAY.map((t) => (
                <div className="lp-today-av" key={t.name}>
                  <span className="lp-today-face" style={{ backgroundImage: AV[t.av] }} />
                  <span className="lp-today-name">{t.name}</span>
                </div>
              ))}
              <div className="lp-today-av">
                <span className="lp-today-more">+</span>
                <span className="lp-today-name">and more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-people-foot">
        <h3 className="lp-people-foot-h">One home for your social world.</h3>
        <p className="lp-people-foot-sub">No walls. No switching. No missing out.</p>
      </div>
    </section>
  );
}
