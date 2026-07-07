import { useState } from "react";
import { Avatar, Button } from "../design/primitives";
import { Icon } from "../design/icons";
import type { Person, Moment, DataMode, Source } from "./openweb";
import { relativeTime } from "./openweb";

// Presentational components for live open-web domain objects. They reuse the design
// system's classes (.t-post, .t-personrow, .t-identity) so live and sample content
// look identical. Everyone is "a person"; every post is "a post" — no protocol words.

// A calm, minimal note of where a person or post lives ("Mastodon", "Pixelfed"…).
// Never protocol jargon; never dominant. Absent when the home's software is unknown.
export function SourceBadge({ source }: { source?: Source }) {
  if (!source?.software) return null;
  return (
    <span className="t-srcbadge" title={`Lives on ${source.software}`}>
      <span className="t-srcbadge__dot" aria-hidden="true" />
      {source.software}
    </span>
  );
}

function Identity({ person, time, source }: { person: Person; time?: string; source?: Source }) {
  return (
    <div className="t-identity">
      <span className="t-identity__name">{person.name}</span>
      <span className="t-identity__meta t-mono">
        {person.handle}
        {time && <span aria-hidden="true"> · {time}</span>}
      </span>
      {source?.software && <SourceBadge source={source} />}
    </div>
  );
}

export function LiveMoment({ moment }: { moment: Moment }) {
  const [saved, setSaved] = useState(false);
  const [sparked, setSparked] = useState(false);
  const image = moment.media.find((m) => m.kind === "image");

  return (
    <article className="t-post t-card">
      <div className="t-post__head">
        <Avatar name={moment.author.name} src={moment.author.avatarUrl} size={44} />
        <Identity person={moment.author} time={relativeTime(moment.createdAt)} source={moment.source} />
        <a
          className="t-iconbtn t-post__more"
          href={moment.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Open at source"
          title="Open at source"
        >
          <Icon name="share" size={18} />
        </a>
      </div>

      {moment.text && <p className="t-post__body">{moment.text}</p>}

      {image && (
        <img className="t-post__img" src={image.url} alt={image.alt} loading="lazy" />
      )}

      <div className="t-post__actions">
        <button
          className={"t-action" + (sparked ? " is-on" : "")}
          type="button"
          aria-pressed={sparked}
          onClick={() => setSparked((s) => !s)}
        >
          <Icon name="spark" size={18} /> <span>{sparked ? "Sparked" : "Spark"}</span>
        </button>
        <button
          className={"t-action" + (saved ? " is-on" : "")}
          type="button"
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
        >
          <Icon name={saved ? "saved" : "save"} size={19} /> <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </article>
  );
}

export function LivePerson({ person }: { person: Person }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="t-personrow t-card">
      <Avatar name={person.name} src={person.avatarUrl} size={52} />
      <div className="t-personrow__body">
        <Identity person={person} source={person.source} />
        {person.bio && <p className="t-personrow__bio">{person.bio}</p>}
      </div>
      {/* UI-only follow affordance — read-only milestone performs no remote write. */}
      <Button variant={following ? "secondary" : "primary"} size="sm" onClick={() => setFollowing((f) => !f)}>
        {following ? "Following" : "Follow"}
      </Button>
    </div>
  );
}

// A calm, honest one-line note about where the data came from.
export function SourceNote({ mode, sourceName }: { mode: DataMode; sourceName?: string | null }) {
  if (mode === "live") {
    return (
      <p className="t-sourcenote">
        <span className="t-sourcenote__dot" /> Live from the open social web
        {sourceName ? ` · ${sourceName}` : ""}
      </p>
    );
  }
  if (mode === "cached") {
    return (
      <p className="t-sourcenote">
        <span className="t-sourcenote__dot t-sourcenote__dot--cached" /> Recent activity from the open social web
      </p>
    );
  }
  return (
    <p className="t-sourcenote t-sourcenote--muted">
      Showing sample content — we couldn&rsquo;t reach the open social web just now.
    </p>
  );
}
