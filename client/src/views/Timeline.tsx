import { type Post } from "../api";
import { Empty } from "../bits";
import { PostCard } from "./PostCard";

// Editorial reading surface, warm skin. Posts render as quiet cards. Keep is private;
// no counts, no scoreboard (Amendment 3).
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

  return (
    <div className="timeline">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} roomSlug={slug} onChange={onChange} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
