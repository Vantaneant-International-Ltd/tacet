import { useEffect, useState } from "react";
import { api, ApiError, type Room } from "../api";
import { Link, navigate } from "../router";
import { Loading, Avatar, ErrorLine } from "../bits";

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
}

// Rooms = your communities (the subreddits you've joined) + a way to make one.
export function RoomList() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.rooms().then((r) => setRooms(r.rooms)).catch(() => setRooms([]));
  }, []);

  if (!rooms) return <Loading />;
  const mine = rooms.filter((r) => r.following);

  return (
    <section className="rooms">
      <div className="rooms-head">
        <p className="label heading">Rooms</p>
        <button className="label create-btn" onClick={() => setCreating(true)}>
          New community
        </button>
      </div>

      {mine.length === 0 ? (
        <p className="empty-nudge">
          You haven't joined any communities yet. <Link to="/discover" className="under">Discover some</Link>, or
          make your own.
        </p>
      ) : (
        <ul className="room-cards">
          {mine.map((room) => (
            <li key={room.slug}>
              <Link to={`/rooms/${room.slug}`} className="room-card">
                <Avatar handle={room.name} />
                <div className="room-card-body">
                  <span className="voice room-card-name">{room.name}</span>
                  {room.description && <span className="room-card-desc">{room.description}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {creating && <CreateCommunity onClose={() => setCreating(false)} />}
    </section>
  );
}

function CreateCommunity({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setError(null);
    setBusy(true);
    try {
      const slug = toSlug(name);
      const { room } = await api.createRoom(slug, name.trim(), description.trim(), "timeline", isPublic);
      onClose();
      navigate(`/rooms/${room.slug}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That did not create.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" role="dialog" aria-label="New community">
      <div className="overlay-inner">
        <div className="overlay-head">
          <p className="label">New community</p>
          <button className="label" onClick={onClose}>
            Close
          </button>
        </div>

        <label className="label field-label">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="The Darkroom" autoFocus />
        <label className="label field-label">What it's for</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="optional" />
        <label className="label toggle-line">
          <input type="checkbox" className="cb" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Public — anyone can read it
        </label>

        <ErrorLine>{error}</ErrorLine>
        <button className="label action" onClick={create} disabled={busy || !name.trim()}>
          {busy ? "…" : "Create"}
        </button>
      </div>
    </div>
  );
}
