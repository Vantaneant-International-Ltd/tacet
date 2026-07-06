import { useEffect, useState } from "react";
import { api, type KeptPost } from "../api";
import { Link } from "../router";
import { Loading } from "../bits";
import { PostCard } from "./PostCard";

// Your personal feed: posts from the rooms/communities you follow, newest first.
// You assembled it; time ordered it. No algorithm, no counts.
export function Feed() {
  const [posts, setPosts] = useState<KeptPost[] | null>(null);

  useEffect(() => {
    api.feed().then((r) => setPosts(r.posts)).catch(() => setPosts([]));
  }, []);

  if (!posts) return <Loading />;

  return (
    <section className="feed">
      <p className="label heading">Following</p>

      {posts.length === 0 ? (
        <p className="empty-nudge">
          Your feed is quiet. <Link to="/rooms" className="under">Find rooms to follow</Link> and it fills up —
          in the order they were posted, nothing decided for you.
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
