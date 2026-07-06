import { useEffect, useState } from "react";
import { api, type KeptPost } from "../api";
import { Link, navigate } from "../router";
import { Byline, Loading } from "../bits";

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
            <article key={p.id} className="post">
              <p className="label kept-room">{p.room.name}</p>
              <Byline handle={p.author_handle} at={p.created_at} />
              <button className="kept-open" onClick={() => navigate(`/rooms/${p.room.slug}/p/${p.id}`)}>
                {p.body && <p className="voice post-body">{p.body}</p>}
                {p.image && <img className="post-image" src={p.image} alt="" loading="lazy" />}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
