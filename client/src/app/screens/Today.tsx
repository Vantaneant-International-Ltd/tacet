import { posts, today } from "../mock";
import { PostCard } from "../components";
import { Icon } from "../../design/icons";

// The calm entry point. A bounded handful from your people, then a clear end — no
// infinite scroll, no algorithmic pull. When you reach the bottom, you're done.
export function Today() {
  return (
    <div className="t-screen t-screen--reading">
      <header className="t-today__head">
        <h1 className="t-today__greeting">{today.greeting}</h1>
        <p className="t-today__line">{today.line}</p>
      </header>

      <div className="t-feed">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="t-caughtup">
        <Icon name="check" size={22} />
        <p className="t-caughtup__title">You&rsquo;re all caught up</p>
        <p className="t-caughtup__body">That&rsquo;s everything from today. The rest of the day is yours.</p>
      </div>
    </div>
  );
}
