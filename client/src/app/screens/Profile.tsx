import { useState } from "react";
import { Avatar, Loading, EmptyState } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { navigate } from "../../router";
import { useProfile, conversationPath } from "../openweb";
import type { Person, Moment } from "../openweb";
import { LiveMoment, SourceBadge } from "../live";

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
function joinedLabel(iso?: string): string | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "long" });
}

// A person's profile — inside Tacet, for any implementation. The definitive, editorial way
// to understand someone on the open social web: who they are, what they've posted, their
// media, and their public details — presented in Tacet's language. Read-only.
type Section = "posts" | "media" | "about";

export function Profile({ actorRef }: { actorRef: string }) {
  const state = useProfile(actorRef);
  const [section, setSection] = useState<Section>("posts");

  return (
    <div className="t-screen t-screen--reading">
      <button className="t-profileback" onClick={() => (history.length > 1 ? history.back() : navigate("/people"))}>
        <Icon name="back" size={18} /> <span>Back</span>
      </button>

      {state.status === "loading" && <Loading label="Opening profile" />}

      {(state.status === "error" || (state.status === "ready" && !state.data.profile)) && (
        <EmptyState icon="people" title="Couldn’t open this profile">
          This person’s home couldn’t be reached right now. Try again in a moment.
        </EmptyState>
      )}

      {state.status === "ready" && state.data.profile && (
        <>
          <ProfileHeader person={state.data.profile} />

          <div className="t-tabs" role="tablist" aria-label="Profile">
            {(["posts", "media", "about"] as Section[]).map((s) => (
              <button key={s} role="tab" aria-selected={section === s} className={"t-tab-pill" + (section === s ? " is-active" : "")} onClick={() => setSection(s)}>
                {s === "posts" ? "Posts" : s === "media" ? "Media" : "About"}
              </button>
            ))}
          </div>

          {section === "posts" && <Posts posts={state.data.posts} />}
          {section === "media" && <Media posts={state.data.posts} />}
          {section === "about" && <About person={state.data.profile} />}
        </>
      )}
    </div>
  );
}

function ProfileHeader({ person }: { person: Person }) {
  const joined = joinedLabel(person.joinedAt);
  const c = person.counts;
  const countParts: string[] = [];
  if (c?.followers != null) countParts.push(`${compact.format(c.followers)} followers`);
  if (c?.following != null) countParts.push(`${compact.format(c.following)} following`);
  if (c?.posts != null) countParts.push(`${compact.format(c.posts)} posts`);

  return (
    <header className="t-phead">
      {person.bannerUrl && <div className="t-phead__banner" style={{ backgroundImage: `url(${person.bannerUrl})` }} />}
      <div className={"t-phead__top" + (person.bannerUrl ? " t-phead__top--banner" : "")}>
        <Avatar name={person.name} src={person.avatarUrl} size={88} ring />
        <a className="t-phead__original" href={person.url} target="_blank" rel="noreferrer noopener">
          View original <Icon name="share" size={15} />
        </a>
      </div>
      <h1 className="t-phead__name">{person.name}</h1>
      <p className="t-phead__handle t-mono">{person.handle}</p>
      <SourceBadge source={person.source} />
      {person.bio && <p className="t-phead__bio">{person.bio}</p>}

      {(countParts.length > 0 || joined || person.website || person.location) && (
        <div className="t-phead__meta">
          {countParts.length > 0 && <span className="t-phead__counts">{countParts.join(" · ")}</span>}
          <div className="t-phead__facts">
            {person.website && (
              <a className="t-phead__fact t-phead__fact--link" href={person.website} target="_blank" rel="noreferrer noopener">
                <Icon name="globe" size={15} /> {person.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
            {person.location && (
              <span className="t-phead__fact"><Icon name="discover" size={15} /> {person.location}</span>
            )}
            {joined && <span className="t-phead__fact"><Icon name="today" size={15} /> Joined {joined}</span>}
          </div>
        </div>
      )}
    </header>
  );
}

function Posts({ posts }: { posts: Moment[] }) {
  if (posts.length === 0) return <EmptyState icon="today" title="No public posts to show">There’s nothing public to read here right now.</EmptyState>;
  return (
    <div className="t-feed">
      {posts.map((m) => (
        <LiveMoment key={m.id} moment={m} />
      ))}
    </div>
  );
}

function Media({ posts }: { posts: Moment[] }) {
  const items = posts.flatMap((p) =>
    p.media.filter((m) => m.url && (m.kind === "image" || m.kind === "video")).map((m) => ({ m, post: p })),
  );
  if (items.length === 0) return <EmptyState icon="discover" title="No media yet">This person hasn’t shared public photos or video recently.</EmptyState>;
  return (
    <div className="t-gallery">
      {items.map(({ m, post }, i) => (
        <button key={i} className="t-gallery__item" onClick={() => navigate(conversationPath(post.id))} aria-label="Open post">
          {m.kind === "video" ? (
            <>
              <video className="t-gallery__media" src={m.url} preload="metadata" muted />
              <span className="t-gallery__play" aria-hidden="true"><Icon name="discover" size={18} /></span>
            </>
          ) : (
            <img className="t-gallery__media" src={m.url} alt={m.alt} loading="lazy" />
          )}
        </button>
      ))}
    </div>
  );
}

function About({ person }: { person: Person }) {
  const joined = joinedLabel(person.joinedAt);
  const hasAnything = person.bio || person.website || person.location || joined || (person.fields && person.fields.length > 0);
  if (!hasAnything) return <EmptyState icon="me" title="Not much to show">This person hasn’t shared public profile details.</EmptyState>;
  return (
    <div className="t-about">
      {person.bio && <p className="t-about__bio">{person.bio}</p>}
      <dl className="t-about__fields">
        {person.location && <Row label="Location" value={person.location} />}
        {joined && <Row label="Joined" value={joined} />}
        {person.website && <Row label="Website" value={person.website.replace(/^https?:\/\//, "").replace(/\/$/, "")} href={person.website} />}
        {person.source && <Row label="Home" value={person.source.software ? `${person.source.name} · ${person.source.software}` : person.source.name} />}
        {person.fields?.filter((f) => !/^(web|site|website|url|blog|homepage|location)$/i.test(f.name)).map((f, i) => (
          <Row key={i} label={f.name} value={f.value} href={f.href} />
        ))}
      </dl>
    </div>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="t-about__row">
      <dt className="t-about__label">{label}</dt>
      <dd className="t-about__value">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer noopener">{value}</a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
