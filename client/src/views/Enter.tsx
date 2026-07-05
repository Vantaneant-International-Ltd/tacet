import { useState } from "react";
import { api, ApiError } from "../api";
import { setUser } from "../session";
import { navigate } from "../router";
import { ErrorLine } from "../bits";

// Login / register. Registration needs an invite code, except for the very first
// account (the bootstrap admin), which the server accepts with no invite.
export function Enter() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [handle, setHandle] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { user } =
        mode === "in"
          ? await api.login(handle, passphrase)
          : await api.register(handle, passphrase, invite || undefined);
      setUser(user);
      navigate("/rooms");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="enter">
      <p className="label mark">TACET</p>
      <p className="voice enter-line">A quiet room. Nothing here asks to be opened.</p>

      <form onSubmit={submit} className="enter-form">
        <label className="label">Handle</label>
        <input value={handle} onChange={(e) => setHandle(e.target.value)} autoCapitalize="none" autoCorrect="off" spellCheck={false} />

        <label className="label">Passphrase</label>
        <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />

        {mode === "up" && (
          <>
            <label className="label">Invite code</label>
            <input value={invite} onChange={(e) => setInvite(e.target.value)} autoCapitalize="characters" spellCheck={false} />
          </>
        )}

        <ErrorLine>{error}</ErrorLine>

        <button className="label action" type="submit" disabled={busy}>
          {busy ? "…" : mode === "in" ? "Enter" : "Register"}
        </button>
      </form>

      <button className="label switch" onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(null); }}>
        {mode === "in" ? "Have an invite? Register" : "Already have a handle? Enter"}
      </button>
    </main>
  );
}
