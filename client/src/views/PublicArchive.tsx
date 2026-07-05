import { useEffect, useState } from "react";
import { api, type PublicBrand, type PublicEntry } from "../api";
import { Link, navigate } from "../router";
import { Loading, Empty } from "../bits";

// The public brand archive — the canonical record, readable with no account.
// NOTE: functional layout only; the visual pass comes from Ren's dossiers.
export function PublicArchive({ slug }: { slug: string }) {
  const [brand, setBrand] = useState<PublicBrand | null>(null);
  const [posts, setPosts] = useState<PublicEntry[] | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let live = true;
    setBrand(null);
    setPosts(null);
    setGone(false);
    api
      .publicBrand(slug)
      .then((r) => {
        if (!live) return;
        setBrand(r.brand);
        setPosts(r.posts);
      })
      .catch(() => live && setGone(true));
    return () => {
      live = false;
    };
  }, [slug]);

  if (gone) return <PublicShell><Empty>No such archive.</Empty></PublicShell>;
  if (!brand || !posts) return <PublicShell><Loading /></PublicShell>;

  return (
    <PublicShell>
      <header className="archive-head">
        <p className="label">TACET · Record</p>
        <h1 className="voice archive-title">{brand.name}</h1>
        {brand.description && <p className="archive-desc">{brand.description}</p>}
      </header>

      {posts.length === 0 ? (
        <Empty>Nothing on the record yet.</Empty>
      ) : (
        <div className="grid">
          {posts.map((p) => (
            <button key={p.id} className="tile" onClick={() => navigate(`/@${slug}/${p.id}`)}>
              {p.kind === "image" && p.image ? (
                <img className="tile-image" src={p.image} alt="" loading="lazy" />
              ) : (
                <span className="voice tile-text">{p.body}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </PublicShell>
  );
}

// Minimal public frame — one quiet column, a mark, no nav chrome.
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="public">
      <div className="column">{children}</div>
      <footer className="public-foot label">
        <Link to="/">TACET</Link>
        <span>the canonical record</span>
      </footer>
    </div>
  );
}
