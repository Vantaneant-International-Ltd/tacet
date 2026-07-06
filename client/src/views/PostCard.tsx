import { api, type Post } from "../api";
import { navigate } from "../router";
import { bylineTime, bylineDate } from "../util";
import { Avatar } from "../bits";

// The warm post card (approved mockup): avatar + who + time, voice body, image, and
// quiet mono actions. Appreciation is the private keep (Amendment 3) — no counts.
export function PostCard({
  post,
  roomSlug,
  roomName,
  onChange,
  onDeleted,
}: {
  post: Post;
  roomSlug: string;
  roomName?: string;
  onChange?: (p: Post) => void;
  onDeleted?: (id: string) => void;
}) {
  const open = () => navigate(`/rooms/${roomSlug}/p/${post.id}`);

  async function toggleKeep() {
    const next = post.kept_by_me ? await api.unkeep(post.id) : await api.keep(post.id);
    onChange?.({ ...post, kept_by_me: next.kept_by_me });
  }
  async function remove() {
    await api.deletePost(post.id);
    onDeleted?.(post.id);
  }

  return (
    <article className="ucard">
      <div className="ucard-head">
        <Avatar handle={post.author_handle} />
        <div className="who">
          <div className="n voice">{post.author_handle}</div>
          <div className="h">
            {roomName ? `${roomName} · ` : ""}
            {bylineTime(post.created_at)} · {bylineDate(post.created_at)}
          </div>
        </div>
      </div>

      {post.body && <p className="ucard-body voice">{post.body}</p>}
      {post.image && <img className="ucard-img" src={post.image} alt="" loading="lazy" onClick={open} />}

      <div className="ucard-acts">
        <button className="uact" onClick={open}>
          Reply
        </button>
        <button
          className={"ubookmark" + (post.kept_by_me ? " on" : "")}
          aria-label={post.kept_by_me ? "Saved" : "Save"}
          onClick={toggleKeep}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={post.kept_by_me ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.7}>
            <path d="M6 3h12v18l-6-4-6 4V3z" />
          </svg>
        </button>
        {post.is_mine && (
          <button className="uact" onClick={remove}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
