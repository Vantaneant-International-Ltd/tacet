import { useEffect, useState } from "react";
import { api, ApiError, type Post, type Reply } from "../api";
import { Link, navigate } from "../router";
import { Loading, Empty, ErrorLine, Avatar } from "../bits";
import { bylineTime, bylineDate } from "../util";

// The reading column: one post opened with its flat replies (DESIGN §5).
export function PostDetail({ slug, id }: { slug: string; id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [gone, setGone] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    setPost(null);
    api
      .post(id)
      .then((r) => {
        if (!live) return;
        setPost(r.post);
        setReplies(r.replies);
      })
      .catch(() => live && setGone(true));
    return () => {
      live = false;
    };
  }, [id]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setError(null);
    setBusy(true);
    try {
      const { reply } = await api.reply(id, body.trim());
      setReplies((prev) => [...prev, reply]);
      setBody("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That did not send.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleKeep() {
    if (!post) return;
    const next = post.kept_by_me ? await api.unkeep(post.id) : await api.keep(post.id);
    setPost({ ...post, kept_by_me: next.kept_by_me });
  }

  async function remove() {
    if (!post) return;
    await api.deletePost(post.id);
    navigate(`/rooms/${slug}`);
  }

  if (gone) return <Empty>That post is gone.</Empty>;
  if (!post) return <Loading />;

  return (
    <section className="detail">
      <Link to={`/rooms/${slug}`} className="label back">
        Back
      </Link>

      <article className="ucard">
        <div className="ucard-head">
          <Avatar handle={post.author_handle} />
          <div className="who">
            <div className="n voice">{post.author_handle}</div>
            <div className="h">
              {bylineTime(post.created_at)} · {bylineDate(post.created_at)}
            </div>
          </div>
        </div>
        {post.body && <p className="ucard-body voice">{post.body}</p>}
        {post.image && <img className="ucard-img" src={post.image} alt="" loading="lazy" />}
        <div className="ucard-acts">
          {post.is_mine ? (
            <>
              {post.kept && <span className="uact kept">Kept</span>}
              <button className="uact" onClick={remove}>
                Delete
              </button>
            </>
          ) : (
            <button className={"uact" + (post.kept_by_me ? " on" : "")} onClick={toggleKeep}>
              Keep
            </button>
          )}
        </div>
      </article>

      <div className="replies">
        {replies.length === 0 ? (
          <Empty>No replies yet.</Empty>
        ) : (
          replies.map((r) => (
            <div key={r.id} className="reply ucard">
              <div className="ucard-head">
                <Avatar handle={r.author_handle} />
                <div className="who">
                  <div className="n voice">{r.author_handle}</div>
                  <div className="h">
                    {bylineTime(r.created_at)} · {bylineDate(r.created_at)}
                  </div>
                </div>
              </div>
              <p className="ucard-body voice">{r.body}</p>
            </div>
          ))
        )}
      </div>

      <form className="reply-form" onSubmit={sendReply}>
        <textarea
          className="voice"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Reply"
          rows={3}
        />
        <ErrorLine>{error}</ErrorLine>
        <button className="label action" type="submit" disabled={busy}>
          {busy ? "…" : "Reply"}
        </button>
      </form>
    </section>
  );
}
