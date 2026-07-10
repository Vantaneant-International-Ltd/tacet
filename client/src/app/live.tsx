import { Avatar, Button } from "../design/primitives";
import { Icon } from "../design/icons";
import type { Person, Moment, DataMode, Source, MomentCounts, MomentMedia } from "./openweb";
import { relativeTime, profilePath, conversationPath, presentText, presentHandle } from "./openweb";
import { Link, navigate } from "../router";
import { isSaved, toggleSave, momentToInput, useMeVersion, api } from "./me";

// Presentational components for live open-web domain objects. They reuse the design
// system's classes (.t-post, .t-personrow, .t-identity) so live and sample content
// look identical. Everyone is "a person"; every post is "a post" — no protocol words.

// Where a person or post LIVES — their home or publication (e.g. "mastodon.social",
// "Craig Mod", "Bluesky"), which is part of their identity, plus a quiet secondary note for
// the network/medium (e.g. "Mastodon", "Podcast"). A favicon leads when we have one. Home
// leads; software follows; identical labels collapse. Shown on every card.
export function SourceBadge({ source }: { source?: Source }) {
  if (!source) return null;
  const home = source.name || source.id;
  const sw = source.software;
  const showSw = sw && sw !== home; // avoid "Bluesky · Bluesky"
  if (!home && !sw) return null;
  const title = showSw ? `${home} · ${sw}` : home || sw;
  return (
    <span className="t-srcbadge" title={title}>
      {source.iconUrl ? (
        <img className="t-srcbadge__icon" src={source.iconUrl} alt="" width={14} height={14} loading="lazy" aria-hidden="true" />
      ) : (
        <span className="t-srcbadge__dot" aria-hidden="true" />
      )}
      {home ? <span className="t-srcbadge__home">{home}</span> : <span className="t-srcbadge__home">{sw}</span>}
      {showSw && <span className="t-srcbadge__sw"> · {sw}</span>}
    </span>
  );
}

// Renders EVERY public attachment of a post — images and video as a calm editorial gallery,
// podcasts/audio as a full-width player below. Nothing autoplays (preload="none", no
// autoplay); a video carries its poster/thumbnail. Degrades to nothing when there's none.
export function PostMedia({ media, onOpen }: { media: MomentMedia[]; onOpen?: () => void }) {
  const visual = media.filter((m) => m.url && (m.kind === "image" || m.kind === "video"));
  const audio = media.filter((m) => m.url && m.kind === "audio");
  if (visual.length === 0 && audio.length === 0) return null;
  const shown = visual.slice(0, 4);
  const extra = visual.length - shown.length;
  return (
    <>
      {shown.length > 0 && (
        <div className={`t-media-grid t-media-grid--${shown.length}`}>
          {shown.map((m, i) =>
            m.kind === "video" ? (
              <video
                key={i}
                className="t-media-item"
                src={m.url}
                poster={m.poster}
                controls
                preload="none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img key={i} className="t-media-item" src={m.url} alt={m.alt} loading="lazy" onClick={onOpen} />
            ),
          )}
          {extra > 0 && <span className="t-media-more" aria-hidden="true">+{extra}</span>}
        </div>
      )}
      {audio.map((m, i) => (
        <audio
          key={i}
          className="t-media-audio"
          src={m.url}
          controls
          preload="none"
          onClick={(e) => e.stopPropagation()}
        />
      ))}
    </>
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
        {presentHandle(person.handle)}
        {time && <span aria-hidden="true"> · {time}</span>}
      </span>
      {source && <SourceBadge source={source} />}
    </div>
  );
}

// Which editorial card variant a REAL moment renders as, derived from its own data — never
// fabricated. hero = the lead moment with a photo (media-first, magazine-framed); video =
// carries playable video; article = long-form with a title and no image (title link + dek);
// quiet = a short thought with no media (unboxed, type carries it); default = framed card.
type Variant = "hero" | "video" | "article" | "quiet" | "default";
function variantOf(m: Moment, lead: boolean): Variant {
  const hasVideo = m.media.some((x) => x.kind === "video");
  const hasImage = m.media.some((x) => x.kind === "image");
  if (hasVideo) return "video";
  if (lead && hasImage) return "hero";
  if (m.title && !hasImage) return "article";
  if (!hasImage && !m.title && m.text.length > 0 && m.text.length < 220) return "quiet";
  return "default";
}
// The dek for an article variant: the body with its leading title line removed (feeds/AP
// join "Title\n\nBody" into text — don't repeat the title once it's a heading).
function dekOf(m: Moment): string {
  if (!m.title) return m.text;
  const t = m.text.trimStart();
  return t.startsWith(m.title) ? t.slice(m.title.length).trimStart() : m.text;
}

export function LiveMoment({ moment, focus, lead = false, feed = false, highlight = false }: { moment: Moment; focus?: boolean; lead?: boolean; feed?: boolean; highlight?: boolean }) {
  useMeVersion(); // re-render when saved-state changes
  const saved = isSaved(moment.id);
  const variant = focus ? "default" : variantOf(moment, lead);
  const heroImage = variant === "hero" ? moment.media.find((x) => x.kind === "image") : undefined;

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
  const cls = ["t-post", "t-card", `t-post--${variant}`, highlight ? "t-post--highlight" : "", focus ? "t-post--focus" : ""].filter(Boolean).join(" ");

  return (
    <article className={cls}>
      {highlight && !heroImage && (
        <p className="t-post__hl t-mono"><Icon name="spark" size={14} /> From your world</p>
      )}
      {heroImage && (
        <div className="t-post__hero" role="button" tabIndex={0} onClick={openConversation}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openConversation(); } }}>
          <img className="t-post__hero-img" src={heroImage.url} alt={heroImage.alt} loading="lazy" />
          {heroImage.alt && <span className="t-post__hero-cap t-mono">{heroImage.alt}</span>}
        </div>
      )}

      <div className="t-post__head">
        <Link to={profilePath(moment.author.id)} className="t-post__author">
          <Avatar name={moment.author.name} src={moment.author.avatarUrl} size={44} />
          <Identity person={moment.author} time={relativeTime(moment.createdAt)} source={moment.source} />
        </Link>
      </div>

      <div className={focus ? undefined : "t-post__open"} {...bodyProps}>
        {variant === "article" && moment.title ? (
          <>
            <h3 className="t-post__title">{moment.title}</h3>
            {dekOf(moment) && <p className="t-post__dek">{presentText(dekOf(moment))}</p>}
          </>
        ) : (
          moment.text && <p className="t-post__body">{presentText(moment.text)}</p>
        )}
        {!heroImage && <PostMedia media={moment.media} onOpen={focus ? undefined : openConversation} />}
      </div>

      {!feed && <PostCounts counts={moment.counts} />}

      <div className="t-post__actions">
        {/* Reply isn't wired yet — honestly disabled, never a button that pretends. */}
        <button className="t-action is-soon" type="button" disabled title="Coming soon" aria-label="Reply — coming soon">
          <Icon name="reply" size={18} /> <span>Reply</span>
        </button>
        <a className="t-action" href={moment.url} target="_blank" rel="noreferrer noopener"
          title="Open at source" aria-label="Open at source" onClick={(e) => e.stopPropagation()}>
          <Icon name="share" size={18} /> <span>Share</span>
        </a>
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
  return (
    <div className="t-personrow t-card">
      <Link to={profilePath(person.id)} className="t-personrow__open">
        <Avatar name={person.name} src={person.avatarUrl} size={52} />
        <div className="t-personrow__body">
          <Identity person={person} source={person.source} />
          {person.bio && <p className="t-personrow__bio">{person.bio}</p>}
        </div>
      </Link>
      {/* Following isn't wired yet (read-only milestone) — honestly disabled, not a fake toggle. */}
      <Button variant="secondary" size="sm" disabled title="Coming soon">Follow</Button>
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
