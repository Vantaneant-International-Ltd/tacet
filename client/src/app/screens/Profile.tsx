import { Avatar, Loading, EmptyState } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { navigate } from "../../router";
import { useProfile } from "../openweb";
import type { Person } from "../openweb";
import { LiveMoment, SourceBadge } from "../live";

// A person's profile — inside Tacet, regardless of where they live. Reuses the generic
// ActivityPub core (actor + recent posts) and the same LiveMoment used everywhere, so a
// Mastodon, Pixelfed, PeerTube, or Misskey person all feel like one product. Read-only:
// no follow, no reply — just their public presence and your own local actions (Save on
// each post). The protocol never surfaces; it's just "a person."
export function Profile({ actorRef }: { actorRef: string }) {
  const state = useProfile(actorRef);

  return (
    <div className="t-screen t-screen--reading">
      <button className="t-profileback" onClick={() => history.length > 1 ? history.back() : navigate("/people")}>
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
          {state.data.posts.length === 0 ? (
            <EmptyState icon="today" title="No public posts to show">
              There’s nothing public to read here right now.
            </EmptyState>
          ) : (
            <>
              <h2 className="t-group__label t-profileposts">Recent posts</h2>
              <div className="t-feed">
                {state.data.posts.map((m) => (
                  <LiveMoment key={m.id} moment={m} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ProfileHeader({ person }: { person: Person }) {
  return (
    <header className="t-phead">
      <div className="t-phead__top">
        <Avatar name={person.name} src={person.avatarUrl} size={88} ring />
        <a className="t-phead__original" href={person.url} target="_blank" rel="noreferrer noopener">
          View original <Icon name="share" size={15} />
        </a>
      </div>
      <h1 className="t-phead__name">{person.name}</h1>
      <p className="t-phead__handle t-mono">{person.handle}</p>
      <SourceBadge source={person.source} />
      {person.bio && <p className="t-phead__bio">{person.bio}</p>}
    </header>
  );
}
