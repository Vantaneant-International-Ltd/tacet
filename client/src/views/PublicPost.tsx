import { useEffect, useState } from "react";
import { api, type PublicEntry } from "../api";
import { Link } from "../router";
import { Loading, Empty } from "../bits";
import { bylineTime, bylineDate } from "../util";
import { PublicShell } from "./PublicArchive";

// A single canonical entry at its permanent public URL, readable with no account.
// NOTE: functional layout only; the visual pass comes from Ren's dossiers.
export function PublicPost({ slug, id }: { slug: string; id: string }) {
  const [post, setPost] = useState<(PublicEntry & { brand: { slug: string; name: string } }) | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let live = true;
    setPost(null);
    setGone(false);
    api
      .publicEntry(id)
      .then((r) => live && setPost(r.post))
      .catch(() => live && setGone(true));
    return () => {
      live = false;
    };
  }, [id]);

  if (gone) return <PublicShell><Empty>No such entry.</Empty></PublicShell>;
  if (!post) return <PublicShell><Loading /></PublicShell>;

  return (
    <PublicShell>
      <Link to={`/@${slug}`} className="label back">
        {post.brand.name}
      </Link>
      <article className="post">
        <p className="byline label">
          <span>{post.brand.name}</span>
          <span className="sep"> · </span>
          <span>{bylineTime(post.created_at)}</span>
          <span className="sep"> · </span>
          <span>{bylineDate(post.created_at)}</span>
        </p>
        {post.body && <p className="voice post-body">{post.body}</p>}
        {post.image && <img className="post-image" src={post.image} alt="" loading="lazy" />}
      </article>
    </PublicShell>
  );
}
