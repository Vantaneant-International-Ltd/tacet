import { api } from "../api";
import { useUser, setUser } from "../session";
import { navigate } from "../router";

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
      <button className="label action" onClick={signOut}>
        Sign out
      </button>
    </section>
  );
}
