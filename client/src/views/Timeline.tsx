import { api, type Post } from "../api";
import { navigate } from "../router";
import { Byline, Empty } from "../bits";

// Editorial reading surface (DESIGN §5): no avatars, mono byline, --voice body, a large
// gap between posts. REPLY and KEEP are small mono labels; the author sees KEPT (a word,
// never a number). No chat affordances.
export function Timeline({
  slug,
  posts,
  onChange,
  onDeleted,
}: {
  slug: string;
  posts: Post[];
  onChange: (post: Post) => void;
  onDeleted: (id: string) => void;
}) {
  if (posts.length === 0) return <Empty>No posts yet.</Empty>;

  async function toggleKeep(post: Post) {
    const next = post.kept_by_me
      ? await api.unkeep(post.id)
      : await api.keep(post.id);
    onChange({ ...post, kept_by_me: next.kept_by_me });
  }

  async function remove(post: Post) {
    await api.deletePost(post.id);
    onDeleted(post.id);
  }

  return (
    <div className="timeline">
      {posts.map((post) => (
        <article key={post.id} className="post">
          <Byline handle={post.author_handle} at={post.created_at} />
          {post.body && <p className="voice post-body">{post.body}</p>}
          {post.image && <img className="post-image" src={post.image} alt="" loading="lazy" />}

          <div className="actions">
            <button className="label act" onClick={() => navigate(`/rooms/${slug}/p/${post.id}`)}>
              Reply
            </button>
            {post.is_mine ? (
              <>
                {post.kept && <span className="label kept">Kept</span>}
                <button className="label act" onClick={() => remove(post)}>
                  Delete
                </button>
              </>
            ) : (
              <button
                className={"label act" + (post.kept_by_me ? " active" : "")}
                onClick={() => toggleKeep(post)}
              >
                Keep
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
