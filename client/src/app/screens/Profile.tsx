import { useState } from "react";
import { Loading, EmptyState } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { navigate } from "../../router";
import { useProfile, conversationPath } from "../openweb";
import type { Moment } from "../openweb";
import { LiveMoment } from "../live";
import { ProfileHeader, About } from "../ProfileView";

// A person's profile — inside Tacet, for any implementation. The definitive, editorial way
// to understand someone on the open social web. Read-only.
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
