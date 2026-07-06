import { useEffect, useState } from "react";
import { api, type PublicEntry } from "../api";
import { Link, navigate } from "../router";
import { Loading, Empty, Avatar } from "../bits";

type Profile = { handle: string; name: string; bio: string | null };

// A public profile at @name — a person or a brand/community — with their posts. No account
// needed to read it (public rooms only).
export function PublicArchive({ slug }: { slug: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [kind, setKind] = useState<"person" | "brand">("person");
  const [posts, setPosts] = useState<PublicEntry[] | null>(null);
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
  const grid = photos.length > 0 ? photos : posts; // brands render everything as tiles

  return (
    <PublicShell>
      <header className="profile-head">
        <Avatar handle={profile.name} large />
        <h1 className="voice profile-name">{profile.name}</h1>
        <p className="profile-handle">@{profile.handle}@tacet.house</p>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        <p className="label profile-record">{kind === "brand" ? "The record · newest first" : "Posts · newest first"}</p>
      </header>

      {grid.length === 0 ? (
        <Empty>Nothing here yet.</Empty>
      ) : (
        <div className="grid">
          {grid.map((p) => (
            <button key={p.id} className="tile" onClick={() => navigate(`/@${slug}/${p.id}`)}>
              {p.kind === "image" && p.image ? (
                <img className="tile-image" src={p.image} alt="" loading="lazy" />
              ) : (
                <span className="voice tile-text">{p.body}</span>
              )}
            </button>
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
