import { api, type Post } from "../api";

// Public like (♥) + dislike (👎) with counts (Amendment 4). One reaction per person, toggled.
export function Reactions({ post, onChange }: { post: Post; onChange?: (p: Post) => void }) {
  async function react(kind: "like" | "dislike") {
    const res = post.my_reaction === kind ? await api.unreact(post.id) : await api.react(post.id, kind);
    onChange?.({ ...post, ...res });
  }

  return (
    <>
      <button
        className={"react" + (post.my_reaction === "like" ? " on" : "")}
        aria-label="Like"
        onClick={() => react("like")}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill={post.my_reaction === "like" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.7}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {post.like_count > 0 && <span className="rc">{post.like_count}</span>}
      </button>

      <button
        className={"react" + (post.my_reaction === "dislike" ? " on" : "")}
        aria-label="Dislike"
        onClick={() => react("dislike")}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill={post.my_reaction === "dislike" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.7}>
          <path d="M7 4v10l5 6 .9-.9c.3-.3.4-.7.4-1.1v-.2L12.5 14H19c1.1 0 2-.9 2-2v-1c0-.3 0-.5-.1-.8L18.6 5.2C18.3 4.5 17.6 4 16.8 4H7z" />
          <path d="M7 4H4v10h3" />
        </svg>
        {post.dislike_count > 0 && <span className="rc">{post.dislike_count}</span>}
      </button>
    </>
  );
}
