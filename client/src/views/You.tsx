import { useState } from "react";
import { api } from "../api";
import { useUser, setUser } from "../session";
import { navigate, Link } from "../router";
import { Avatar } from "../bits";
import { InvitePanel } from "./InvitePanel";

// The You tab, rebuilt as a real settings panel — grouped rows, a working private-account
// switch, the house's pages, and the fediverse address. Quiet, but a proper settings screen.
export function You() {
  const user = useUser();
  const [priv, setPriv] = useState(user?.is_private ?? false);
  const [busy, setBusy] = useState(false);
  if (!user) return null;

  async function togglePrivate() {
    const next = !priv;
    setPriv(next);
    setBusy(true);
    try {
      const { user: updated } = await api.updateSettings(next);
      setUser(updated);
    } catch {
      setPriv(!next); // revert on failure
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await api.logout().catch(() => {});
    setUser(null);
    navigate("/");
  }

  return (
    <section className="settings">
      <div className="settings-profile">
        <Avatar handle={user.handle} large />
        <div className="sp-name voice">{user.handle}</div>
        <div className="sp-addr">@{user.handle}@tacet.house</div>
        {user.is_admin && <span className="sp-role label">Admin</span>}
      </div>

      <p className="settings-group-label">Account</p>
      <div className="settings-group">
        <div className="srow toggle-row">
          <div className="srow-main">
            <div className="srow-t voice">Private account</div>
            <div className="srow-d">Only approved followers see your posts. Fully enforced as profiles roll out.</div>
          </div>
          <button
            className={"sw" + (priv ? " on" : "")}
            role="switch"
            aria-checked={priv}
            disabled={busy}
            onClick={togglePrivate}
          >
            <span className="sw-dot" />
          </button>
        </div>
        <Link className="srow" to="/keeps">
          <span className="srow-t">Your keeps</span>
          <span className="chev">›</span>
        </Link>
      </div>

      <InvitePanel />

      <p className="settings-group-label">Privacy &amp; safety</p>
      <div className="settings-group">
        <Link className="srow" to="/privacy">
          <span className="srow-t">Your privacy</span>
          <span className="chev">›</span>
        </Link>
      </div>

      <p className="settings-group-label">The house</p>
      <div className="settings-group">
        <Link className="srow" to="/about">
          <span className="srow-t">About TACET</span>
          <span className="chev">›</span>
        </Link>
        <Link className="srow" to="/contact">
          <span className="srow-t">Contact us</span>
          <span className="chev">›</span>
        </Link>
      </div>

      <button className="signout" onClick={signOut}>
        Sign out
      </button>

      <p className="settings-foot label">
        TACET · v{__APP_VERSION__} · @{user.handle}@tacet.house
      </p>
    </section>
  );
}
