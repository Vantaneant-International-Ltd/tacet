import { useEffect, useState } from "react";
import { api, type PublicEntry } from "../api";
import { Link, navigate } from "../router";
import { Loading, Empty, Avatar } from "../bits";
import { bylineTime, bylineDate } from "../util";

type Profile = { handle: string; name: string; bio: string | null };

// A public profile at @name — a person or a brand/community — viewable as Grid (photos) or
// Timeline (thoughts). No account needed to read it (public rooms only).
export function PublicArchive({ slug }: { slug: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [kind, setKind] = useState<"person" | "brand">("person");
  const [posts, setPosts] = useState<PublicEntry[] | null>(null);
  const [lens, setLens] = useState<"grid" | "timeline">("grid");
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let live = true;
    setProfile(null);
    setPosts(null);
    setGone(false);
    api
      .publicProfile(slug)
      .then((r) => {
        if (!live) return;
        setProfile(r.profile);
        setKind(r.kind);
        setPosts(r.posts);
      })
      .catch(() => live && setGone(true));
    return () => {
      live = false;
    };
  }, [slug]);

  if (gone) return <PublicShell><Empty>No such account.</Empty></PublicShell>;
  if (!profile || !posts) return <PublicShell><Loading /></PublicShell>;

  const photos = posts.filter((p) => p.kind === "image");
  const texts = posts.filter((p) => p.kind === "text");

  return (
    <PublicShell>
      <header className="profile-head">
        <Avatar handle={profile.name} large />
        <h1 className="voice profile-name">{profile.name}</h1>
        <p className="profile-handle">
          {kind === "brand" ? `tacet.house/${profile.handle}` : `@${profile.handle}@tacet.house`}
        </p>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
      </header>

      <div className="profile-lens-wrap">
        <div className="lens-switch" role="tablist">
          <button
            role="tab"
            className={"lens-opt" + (lens === "grid" ? " current" : "")}
            onClick={() => setLens("grid")}
          >
            <span className="label lens-name">Grid</span>
          </button>
          <button
            role="tab"
            className={"lens-opt" + (lens === "timeline" ? " current" : "")}
            onClick={() => setLens("timeline")}
          >
            <span className="label lens-name">Timeline</span>
          </button>
        </div>
      </div>

      {lens === "grid" ? (
        photos.length === 0 ? (
          <Empty>No photos yet.</Empty>
        ) : (
          <div className="grid">
            {photos.map((p) => (
              <button key={p.id} className="tile" onClick={() => navigate(`/@${slug}/${p.id}`)}>
                {p.image && <img className="tile-image" src={p.image} alt="" loading="lazy" />}
              </button>
            ))}
          </div>
        )
      ) : texts.length === 0 ? (
        <Empty>No posts yet.</Empty>
      ) : (
        <div className="feed-list">
          {texts.map((p) => (
            <article key={p.id} className="ucard" onClick={() => navigate(`/@${slug}/${p.id}`)} style={{ cursor: "pointer" }}>
              <div className="ucard-head">
                <Avatar handle={profile.name} />
                <div className="who">
                  <div className="n voice">{profile.name}</div>
                  <div className="h">
                    {bylineTime(p.created_at)} · {bylineDate(p.created_at)}
                  </div>
                </div>
              </div>
              <p className="ucard-body voice">{p.body}</p>
            </article>
          ))}
        </div>
      )}
    </PublicShell>
  );
}

// Minimal public frame — one quiet column, a mark, no nav chrome.
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="public">
      <div className="column">{children}</div>
      <footer className="public-foot label">
        <Link to="/">TACET</Link>
        <span>the canonical record</span>
      </footer>
    </div>
  );
}
