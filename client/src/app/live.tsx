import { useState } from "react";
import { Avatar, Button } from "../design/primitives";
import { Icon } from "../design/icons";
import type { Person, Moment, DataMode, Source, MomentCounts, MomentMedia } from "./openweb";
import { relativeTime, profilePath, conversationPath } from "./openweb";
import { Link, navigate } from "../router";
import { isSaved, toggleSave, momentToInput, useMeVersion, api } from "./me";

// Presentational components for live open-web domain objects. They reuse the design
// system's classes (.t-post, .t-personrow, .t-identity) so live and sample content
// look identical. Everyone is "a person"; every post is "a post" — no protocol words.

// Where a person or post LIVES — their home (e.g. "twit.social"), which is part of their
// identity. The software the home runs (e.g. "Mastodon") is infrastructure and shown only
// as a quiet secondary note. Home leads; software follows. Absent when neither is known.
export function SourceBadge({ source }: { source?: Source }) {
  if (!source) return null;
  const home = source.name || source.id;
  if (!home && !source.software) return null;
  return (
    <span className="t-srcbadge" title={source.software && home ? `${home} · ${source.software}` : home || source.software}>
      <span className="t-srcbadge__dot" aria-hidden="true" />
      {home ? <span className="t-srcbadge__home">{home}</span> : source.software}
      {home && source.software && <span className="t-srcbadge__sw"> · {source.software}</span>}
    </span>
  );
}

// Renders EVERY public attachment of a post — one image or four, images and video — as a
// calm editorial gallery. Never drops attachments; degrades to nothing when there are none.
export function PostMedia({ media, onOpen }: { media: MomentMedia[]; onOpen?: () => void }) {
  const items = media.filter((m) => m.url && (m.kind === "image" || m.kind === "video"));
  if (items.length === 0) return null;
  const shown = items.slice(0, 4);
  const extra = items.length - shown.length;
  return (
    <div className={`t-media-grid t-media-grid--${shown.length}`}>
      {shown.map((m, i) =>
        m.kind === "video" ? (
          <video
            key={i}
            className="t-media-item"
            src={m.url}
            controls
            preload="none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            key={i}
            className="t-media-item"
            src={m.url}
            alt={m.alt}
            loading="lazy"
            onClick={onOpen}
          />
        ),
      )}
      {extra > 0 && <span className="t-media-more" aria-hidden="true">+{extra}</span>}
    </div>
  );
}

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

// Lightweight conversation context — never a scoreboard. Shows only what a home exposes,
// hides zeros, no icons competing for attention. "104 reactions · 12 replies · 5 shared".
export function PostCounts({ counts }: { counts?: MomentCounts }) {
  if (!counts) return null;
  const parts: string[] = [];
  if (counts.reactions) parts.push(`${compact.format(counts.reactions)} ${counts.reactions === 1 ? "reaction" : "reactions"}`);
  if (counts.replies) parts.push(`${compact.format(counts.replies)} ${counts.replies === 1 ? "reply" : "replies"}`);
  if (counts.shares) parts.push(`${compact.format(counts.shares)} shared`);
  if (!parts.length) return null;
  return <p className="t-post__counts">{parts.join(" · ")}</p>;
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

export function LiveMoment({ moment, focus }: { moment: Moment; focus?: boolean }) {
  useMeVersion(); // re-render when saved-state changes
  const [sparked, setSparked] = useState(false);
  const saved = isSaved(moment.id);

  // Opening a post is reading its conversation — the calm in-Tacet reader, not a jump out.
  function openConversation() {
    if (focus) return;
    api.recordView(momentToInput(moment));
    navigate(conversationPath(moment.id));
  }
  const bodyProps = focus
    ? {}
    : {
        role: "button" as const,
        tabIndex: 0,
        onClick: openConversation,
        onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openConversation(); } },
      };

  return (
    <article className={"t-post t-card" + (focus ? " t-post--focus" : "")}>
      <div className="t-post__head">
        <Link to={profilePath(moment.author.id)} className="t-post__author">
          <Avatar name={moment.author.name} src={moment.author.avatarUrl} size={44} />
          <Identity person={moment.author} time={relativeTime(moment.createdAt)} source={moment.source} />
        </Link>
        <a
          className="t-iconbtn t-post__more"
          href={moment.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Open at source"
          title="Open at source"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon name="share" size={18} />
        </a>
      </div>

      <div className={focus ? undefined : "t-post__open"} {...bodyProps}>
        {moment.text && <p className="t-post__body">{moment.text}</p>}
        <PostMedia media={moment.media} onOpen={focus ? undefined : openConversation} />
      </div>

      <PostCounts counts={moment.counts} />

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
          onClick={() => toggleSave(momentToInput(moment))}
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
      <Link to={profilePath(person.id)} className="t-personrow__open">
        <Avatar name={person.name} src={person.avatarUrl} size={52} />
        <div className="t-personrow__body">
          <Identity person={person} source={person.source} />
          {person.bio && <p className="t-personrow__bio">{person.bio}</p>}
        </div>
      </Link>
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
