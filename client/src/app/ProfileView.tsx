import { Avatar } from "../design/primitives";
import { Icon } from "../design/icons";
import type { Person } from "./openweb";
import { SourceBadge } from "./live";

// The shared, reusable profile presentation — a person's header and About. Used for BOTH
// remote people and the user's own public-profile preview, so "you" and "them" look like
// one product. Presentational only; knows nothing about fetching or persistence.

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
export function joinedLabel(iso?: string): string | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "long" });
}

export function ProfileHeader({ person, local }: { person: Person; local?: boolean }) {
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
        <Avatar name={person.name || "You"} src={person.avatarUrl} size={88} ring />
        {!local && person.url && (
          <a className="t-phead__original" href={person.url} target="_blank" rel="noreferrer noopener">
            View original <Icon name="share" size={15} />
          </a>
        )}
      </div>
      <h1 className="t-phead__name">{person.name || "Your name"}</h1>
      {person.handle && <p className="t-phead__handle t-mono">{person.handle}</p>}
      {local ? (
        <p className="t-phead__local"><Icon name="check" size={14} /> Local profile — not yet on the open social web</p>
      ) : (
        <SourceBadge source={person.source} />
      )}
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
            {person.location && <span className="t-phead__fact"><Icon name="discover" size={15} /> {person.location}</span>}
            {joined && <span className="t-phead__fact"><Icon name="today" size={15} /> Joined {joined}</span>}
          </div>
        </div>
      )}
    </header>
  );
}

export function About({ person }: { person: Person }) {
  const joined = joinedLabel(person.joinedAt);
  const rows: { label: string; value: string; href?: string }[] = [];
  if (person.location) rows.push({ label: "Location", value: person.location });
  if (joined) rows.push({ label: "Joined", value: joined });
  if (person.website) rows.push({ label: "Website", value: person.website.replace(/^https?:\/\//, "").replace(/\/$/, ""), href: person.website });
  if (person.source?.name) rows.push({ label: "Home", value: person.source.software ? `${person.source.name} · ${person.source.software}` : person.source.name });
  (person.fields ?? [])
    .filter((f) => !/^(web|site|website|url|blog|homepage|location)$/i.test(f.name))
    .forEach((f) => rows.push({ label: f.name, value: f.value.replace(/^https?:\/\//, ""), href: /^https?:\/\//.test(f.value) ? f.value : f.href }));

  const hasAnything = person.bio || rows.length > 0;
  if (!hasAnything) return <p className="t-about__empty">No public profile details yet.</p>;
  return (
    <div className="t-about">
      {person.bio && <p className="t-about__bio">{person.bio}</p>}
      {rows.length > 0 && (
        <dl className="t-about__fields">
          {rows.map((r, i) => (
            <div className="t-about__row" key={i}>
              <dt className="t-about__label">{r.label}</dt>
              <dd className="t-about__value">{r.href ? <a href={r.href} target="_blank" rel="noreferrer noopener">{r.value}</a> : r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
