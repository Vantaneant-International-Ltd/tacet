import { useEffect, useState } from "react";
import { api, type KeptPost } from "../api";
import { Link, navigate } from "../router";
import { Byline, Loading, Empty } from "../bits";

// A private reading list of what you've kept, across rooms. Yours alone, no metrics.
export function Keeps() {
  const [posts, setPosts] = useState<KeptPost[] | null>(null);

  useEffect(() => {
    api.keeps().then((r) => setPosts(r.posts)).catch(() => setPosts([]));
  }, []);

  async function unkeep(id: string) {
    await api.unkeep(id);
    setPosts((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
  }

  if (!posts) return <Loading />;

  return (
    <section className="keeps">
      <Link to="/you" className="label back">
        Back
      </Link>
      <p className="label heading">Your keeps</p>

      {posts.length === 0 ? (
        <Empty>Nothing kept yet.</Empty>
      ) : (
        <div className="kept-list">
          {posts.map((post) => (
            <article key={post.id} className="post">
              <p className="label kept-room">{post.room.name}</p>
              <Byline handle={post.author_handle} at={post.created_at} />
              <button className="kept-open" onClick={() => navigate(`/rooms/${post.room.slug}/p/${post.id}`)}>
                {post.body && <p className="voice post-body">{post.body}</p>}
                {post.image && <img className="post-image" src={post.image} alt="" loading="lazy" />}
              </button>
              <div className="actions">
                <button className="label act active" onClick={() => unkeep(post.id)}>
                  Unkeep
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
