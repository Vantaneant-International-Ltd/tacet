import type { Post } from "../api";
import { navigate } from "../router";
import { Empty } from "../bits";

// Grid lens (DESIGN §5): square, chronological, silent. No counts, no overlays, no hover
// metrics. Text posts render as typographic tiles; a tile opens the post with its replies.
export function Grid({ slug, posts }: { slug: string; posts: Post[] }) {
  if (posts.length === 0) return <Empty>No posts yet.</Empty>;

  return (
    <div className="grid">
      {posts.map((post) => (
        <button key={post.id} className="tile" onClick={() => navigate(`/rooms/${slug}/p/${post.id}`)}>
          {post.kind === "image" && post.image ? (
            <img className="tile-image" src={post.image} alt="" loading="lazy" />
          ) : (
            <span className="voice tile-text">{post.body}</span>
          )}
        </button>
      ))}
    </div>
  );
}
