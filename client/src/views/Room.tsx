import { useEffect, useState } from "react";
import { api, type Lens, type Post, type Room as RoomT } from "../api";
import { Loading } from "../bits";
import { Timeline } from "./Timeline";
import { Grid } from "./Grid";
import { Composer } from "./Composer";

const LENSES: { key: Lens; label: string; blurb: string }[] = [
  { key: "timeline", label: "Timeline", blurb: "read, newest first" },
  { key: "grid", label: "Grid", blurb: "square, chronological, silent" },
];

export function Room({ slug }: { slug: string }) {
  const [room, setRoom] = useState<RoomT | null>(null);
  const [lens, setLens] = useState<Lens>("timeline");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [writing, setWriting] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    let live = true;
    setRoom(null);
    setPosts(null);
    api.room(slug).then((r) => {
      if (!live) return;
      setRoom(r.room);
      setLens(r.lens);
      setFollowing(r.following);
    });
    api.posts(slug).then((r) => live && setPosts(r.posts));
    return () => {
      live = false;
    };
  }, [slug]);

  function chooseLens(next: Lens) {
    if (next === lens) return;
    setLens(next);
    setFadeKey((k) => k + 1); // remount → cross-fade (CSS, reduced-motion aware)
    api.setLens(slug, next).catch(() => {}); // persistence is best-effort
  }

  function onPosted(post: Post) {
    setPosts((prev) => (prev ? [post, ...prev] : [post]));
    setWriting(false);
  }

  async function toggleFollow() {
    const next = following ? await api.unfollow(slug) : await api.follow(slug);
    setFollowing(next.following);
  }

  if (!room) return <Loading />;

  return (
    <section className="room">
      <header className="room-head">
        <div className="room-title">
          <p className="label heading">{room.name}</p>
          {room.description && <p className="room-desc">{room.description}</p>}
        </div>
        <div className="room-head-actions">
          <button className={"label follow-btn" + (following ? " on" : "")} onClick={toggleFollow}>
            {following ? "Following" : "Follow"}
          </button>
          <button className="label write" onClick={() => setWriting(true)}>
            Write
          </button>
        </div>
      </header>

      <div className="lens-switch" role="tablist" aria-label="Lens">
        {LENSES.map((l) => (
          <button
            key={l.key}
            role="tab"
            aria-selected={lens === l.key}
            className={"lens-opt" + (lens === l.key ? " current" : "")}
            onClick={() => chooseLens(l.key)}
          >
            <span className="label lens-name">{l.label}</span>
            <span className="label lens-blurb">{l.blurb}</span>
          </button>
        ))}
      </div>

      {!posts ? (
        <Loading />
      ) : (
        <div key={fadeKey} className="lens-body">
          {lens === "timeline" ? (
            // Timeline shows thoughts (text). Photos live in the Grid, not here.
            <Timeline
              slug={slug}
              posts={posts.filter((p) => p.kind === "text")}
              onChange={(p) => setPosts((prev) => prev!.map((x) => (x.id === p.id ? p : x)))}
              onDeleted={(id) => setPosts((prev) => prev!.filter((x) => x.id !== id))}
            />
          ) : (
            // Grid shows photos only — the Instagram lens.
            <Grid slug={slug} posts={posts.filter((p) => p.kind === "image")} />
          )}
        </div>
      )}

      {writing && <Composer slug={slug} roomName={room.name} onPosted={onPosted} onClose={() => setWriting(false)} />}
    </section>
  );
}
