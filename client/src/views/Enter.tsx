import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "../api";
import { setUser } from "../session";
import { navigate } from "../router";
import { ErrorLine } from "../bits";

// Loads the Turnstile script once (only when a site key exists).
let turnstileLoading: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (turnstileLoading) return turnstileLoading;
  turnstileLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile failed to load"));
    document.head.appendChild(s);
  });
  return turnstileLoading;
}

// Login / register. Registration needs an invite code (except the first, bootstrap account).
// An invite link (/join/<code>) arrives here with the code prefilled. When a Turnstile site
// key is configured, registration shows the challenge.
export function Enter({ invite: prefill }: { invite?: string }) {
  const [mode, setMode] = useState<"in" | "up">(prefill ? "up" : "in");
  const [handle, setHandle] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [invite, setInvite] = useState(prefill ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const rendered = useRef(false);

  useEffect(() => {
    api.config().then((cfg) => setSiteKey(cfg.turnstile_site_key)).catch(() => setSiteKey(null));
  }, []);

  // Render the challenge only on the register form, once.
  useEffect(() => {
    if (mode !== "up" || !siteKey || rendered.current) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !widgetRef.current || !window.turnstile || rendered.current) return;
        rendered.current = true;
        window.turnstile.render(widgetRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: (t) => setToken(t),
          "expired-callback": () => setToken(null),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mode, siteKey]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "up" && siteKey && !token) {
      setError("Complete the challenge below.");
      return;
    }
    setBusy(true);
    try {
      const { user } =
        mode === "in"
          ? await api.login(handle, passphrase)
          : await api.register(handle, passphrase, invite || undefined, token ?? undefined);
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
            {siteKey && <div ref={widgetRef} className="turnstile" />}
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
