import { useEffect, useState } from "react";
import { api, type PublicEntry } from "../api";
import { navigate } from "../router";
import { Loading, Empty } from "../bits";
import { PublicShell } from "./PublicArchive";

// A public collection (highlight): its name + the public posts in it.
export function Collection({ id }: { id: string }) {
  const [name, setName] = useState("");
  const [posts, setPosts] = useState<PublicEntry[] | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let live = true;
    api
      .publicCollection(id)
      .then((r) => {
        if (!live) return;
        setName(r.name);
        setPosts(r.posts);
      })
      .catch(() => live && setGone(true));
    return () => {
      live = false;
    };
  }, [id]);

  if (gone) return <PublicShell><Empty>No such collection.</Empty></PublicShell>;
  if (!posts) return <PublicShell><Loading /></PublicShell>;

  return (
    <PublicShell>
      <p className="label heading collection-kicker">Collection</p>
      <h1 className="voice collection-name">{name}</h1>
      {posts.length === 0 ? (
        <Empty>Nothing here yet.</Empty>
      ) : (
        <div className="grid collection-grid">
          {posts.map((p) => (
            <button key={p.id} className="tile" onClick={() => navigate(`/@_/${p.id}`)}>
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
