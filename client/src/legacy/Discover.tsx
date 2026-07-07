import { useEffect, useState } from "react";
import { api, type Room } from "../api";
import { Link } from "../router";
import { Loading, Avatar } from "../bits";

// Browse communities and follow them (no algorithm, no counts). Federation lands here later.
export function Discover() {
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    api.rooms().then((r) => setRooms(r.rooms)).catch(() => setRooms([]));
  }, []);

  async function toggle(slug: string, cur: boolean) {
    const n = cur ? await api.unfollow(slug) : await api.follow(slug);
    setRooms((prev) => prev!.map((x) => (x.slug === slug ? { ...x, following: n.following } : x)));
  }

  if (!rooms) return <Loading />;

  return (
    <section className="discover">
      <p className="label heading">Discover</p>
      <div className="search-box">Search people, rooms, the fediverse…</div>

      <p className="label sub">Communities</p>
      <div className="dlist">
        {rooms.map((r) => (
          <div key={r.slug} className="dcard">
            <Avatar handle={r.name} />
            <Link to={`/rooms/${r.slug}`} className="dcard-who">
              <span className="n voice">/{r.slug}</span>
              <span className="h">{r.name}</span>
            </Link>
            <button
              className={"followbtn" + (r.following ? " on" : "")}
              onClick={() => toggle(r.slug, !!r.following)}
            >
              {r.following ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>

      <p className="fed-note">
        Federation is coming: follow accounts on Mastodon, Pixelfed and PeerTube and see them here in the
        matching lens — Mastodon in Timeline, Pixelfed in Grid, PeerTube in Theatre. One network.
      </p>
    </section>
  );
}
