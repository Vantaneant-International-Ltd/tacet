import { api } from "../api";
import { useUser, setUser } from "../session";
import { navigate, Link } from "../router";
import { InvitePanel } from "./InvitePanel";

// The YOU surface is where the house explains itself, not just a sign-out button
// (Amendment 1). Real settings sit alongside a plain statement of the promises.
const PROMISES = [
  "No counts. Nothing here is measured in public.",
  "No algorithm. Time is the only order.",
  "No advertising. You are not the product.",
  "This app never asks to be opened.",
  "Reading is private. Only what you choose to do is seen.",
];

export function You() {
  const user = useUser();
  if (!user) return null;

  async function signOut() {
    await api.logout().catch(() => {});
    setUser(null);
    navigate("/");
  }

  return (
    <section className="you">
      <p className="label heading">You</p>
      <p className="voice you-handle">{user.handle}</p>
      {user.is_admin && <p className="label you-role">Admin</p>}

      <div className="you-links">
        <Link to="/keeps" className="label you-link">
          Your keeps
        </Link>
        <Link to="/about" className="label you-link">
          About this house
        </Link>
      </div>

      <div className="you-house">
        <p className="label heading">The house, in short</p>
        <ul className="you-promises">
          {PROMISES.map((p) => (
            <li key={p} className="you-promise">
              {p}
            </li>
          ))}
        </ul>
        <p className="you-house-line">
          Rooms, not a feed. You choose a room by who is in it, and a lens by how you want to
          look. The only things you do to a post are reply, keep, and acknowledge.
        </p>
      </div>

      <InvitePanel />

      <button className="label action" onClick={signOut}>
        Sign out
      </button>
    </section>
  );
}
