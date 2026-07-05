import { useEffect, useState } from "react";
import { api, ApiError, type Invite, type Lens } from "../api";
import { bylineDate } from "../util";
import { Loading, ErrorLine } from "../bits";

export function Admin() {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [defaultLens, setDefaultLens] = useState<Lens>("timeline");
  const [roomError, setRoomError] = useState<string | null>(null);
  const [roomNote, setRoomNote] = useState<string | null>(null);

  const [invites, setInvites] = useState<Invite[] | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    api.invites().then((r) => setInvites(r.invites)).catch(() => setInvites([]));
  }, []);

  async function createRoom(e: React.FormEvent) {
    e.preventDefault();
    setRoomError(null);
    setRoomNote(null);
    try {
      const { room } = await api.createRoom(slug.trim().toLowerCase(), name.trim(), desc.trim(), defaultLens);
      setRoomNote(`Created ${room.name}.`);
      setSlug("");
      setName("");
      setDesc("");
      setDefaultLens("timeline");
    } catch (err) {
      setRoomError(err instanceof ApiError ? err.message : "That did not create.");
    }
  }

  async function mint() {
    setInviteError(null);
    try {
      const { invite } = await api.mintInvite();
      setInvites((prev) => [invite, ...(prev ?? [])]);
    } catch (err) {
      setInviteError(err instanceof ApiError ? err.message : "That did not mint.");
    }
  }

  return (
    <section className="admin">
      <p className="label heading">Admin</p>

      <div className="card">
        <p className="label card-title">New room</p>
        <form onSubmit={createRoom} className="admin-form">
          <label className="label">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="the-parlour" autoCapitalize="none" spellCheck={false} />
          <label className="label">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="The Parlour" />
          <label className="label">Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="optional" />
          <label className="label">Opens as</label>
          <div className="lens-pick">
            {(["timeline", "grid"] as Lens[]).map((l) => (
              <button
                key={l}
                type="button"
                className={"label lens-pick-opt" + (defaultLens === l ? " current" : "")}
                onClick={() => setDefaultLens(l)}
              >
                {l === "timeline" ? "Timeline" : "Grid"}
              </button>
            ))}
          </div>
          <ErrorLine>{roomError}</ErrorLine>
          {roomNote && <p className="label note">{roomNote}</p>}
          <button className="label action" type="submit">
            Create
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-head">
          <p className="label card-title">Invites</p>
          <button className="label action" onClick={mint}>
            Mint
          </button>
        </div>
        <ErrorLine>{inviteError}</ErrorLine>
        {!invites ? (
          <Loading />
        ) : invites.length === 0 ? (
          <p className="label empty">No invites yet.</p>
        ) : (
          <ul className="invite-list">
            {invites.map((i) => (
              <li key={i.code} className="invite-row">
                <span className="voice invite-code">{i.code}</span>
                <span className="label invite-meta">
                  {i.used ? `used · ${i.used_by ?? ""}` : "open"} · {bylineDate(i.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
