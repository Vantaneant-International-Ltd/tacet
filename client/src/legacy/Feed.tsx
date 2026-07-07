import { useEffect, useState } from "react";
import { api, type KeptPost, type Room } from "../api";
import { Link } from "../router";
import { Loading, Avatar } from "../bits";
import { PostCard } from "./PostCard";

// Home: a quiet Stories row of your communities, then your personal chronological feed
// (posts from what you follow — no algorithm, no counts).
export function Feed() {
  const [posts, setPosts] = useState<KeptPost[] | null>(null);
  const [following, setFollowing] = useState<Room[]>([]);

  useEffect(() => {
    api.feed().then((r) => setPosts(r.posts)).catch(() => setPosts([]));
    api.rooms().then((r) => setFollowing(r.rooms.filter((x) => x.following))).catch(() => setFollowing([]));
  }, []);

  if (!posts) return <Loading />;

  return (
    <section className="feed">
      <p className="label heading">Home</p>

      {following.length > 0 && (
        <div className="stories">
          {following.map((r) => (
            <Link key={r.slug} to={`/rooms/${r.slug}`} className="story">
              <Avatar handle={r.name} />
              <span className="story-lbl">{r.name}</span>
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="empty-nudge">
          Your feed is quiet. <Link to="/discover" className="under">Find communities to follow</Link> and it fills
          up — in the order things were posted, nothing decided for you.
        </p>
      ) : (
        <div className="feed-list">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              roomSlug={p.room.slug}
              roomName={p.room.name}
              onChange={(np) => setPosts((prev) => prev!.map((x) => (x.id === np.id ? { ...x, ...np } : x)))}
              onDeleted={(id) => setPosts((prev) => prev!.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
