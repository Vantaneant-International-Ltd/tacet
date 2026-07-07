import { useEffect, useState } from "react";
import { api, ApiError, type Post, type Reply } from "../api";
import { Link, navigate } from "../router";
import { Loading, Empty, ErrorLine, Avatar } from "../bits";
import { bylineTime, bylineDate } from "../util";
import { Reactions } from "./Reactions";

// The reading column: one post opened with its flat replies (DESIGN §5).
export function PostDetail({ slug, id }: { slug: string; id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [gone, setGone] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [collecting, setCollecting] = useState(false);

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
          <Reactions post={post} onChange={setPost} />
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
            <>
              <button className="uact" onClick={() => setCollecting(true)}>
                Highlight
              </button>
              <button className="uact" onClick={remove}>
                Delete
              </button>
            </>
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

      {collecting && post && <AddToCollection postId={post.id} onClose={() => setCollecting(false)} />}
    </section>
  );
}

function AddToCollection({ postId, onClose }: { postId: string; onClose: () => void }) {
  const [cols, setCols] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    api.myCollections().then((r) => setCols(r.collections)).catch(() => setCols([]));
  }, []);

  async function add(id: string, label: string) {
    await api.addToCollection(id, postId).catch(() => {});
    setNote(`Added to ${label}.`);
  }
  async function createAndAdd() {
    if (!name.trim()) return;
    const { collection } = await api.createCollection(name.trim());
    await add(collection.id, collection.name);
    setCols((prev) => [{ id: collection.id, name: collection.name }, ...prev]);
    setName("");
  }

  return (
    <div className="overlay" role="dialog" aria-label="Add to a highlight">
      <div className="overlay-inner">
        <div className="overlay-head">
          <p className="label">Add to a highlight</p>
          <button className="label" onClick={onClose}>
            Close
          </button>
        </div>
        {note && <p className="label note">{note}</p>}
        <div className="settings-group" style={{ marginTop: "1rem" }}>
          {cols.length === 0 && <p className="srow srow-t" style={{ color: "var(--dim)" }}>No highlights yet — make one.</p>}
          {cols.map((c) => (
            <button key={c.id} className="srow" onClick={() => add(c.id, c.name)}>
              <span className="srow-t">{c.name}</span>
              <span className="chev">+</span>
            </button>
          ))}
        </div>
        <label className="label field-label">New highlight</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Placements" maxLength={60} />
        <button className="label action" onClick={createAndAdd}>
          Create &amp; add
        </button>
      </div>
    </div>
  );
}
