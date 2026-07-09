import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "../api";
import { setUser } from "../session";
import { navigate, Link } from "../router";
import { Button } from "../design/primitives";
import { DevBanner } from "./landing/DevBanner";

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
// `onComplete` lets the welcome funnel reuse this exact auth path (never forked) and
// continue into identity setup instead of jumping straight to /today. `defaultMode`
// opens directly on create ("up") when the funnel enters here.
export function Enter({
  invite: prefill,
  defaultMode,
  onComplete,
}: {
  invite?: string;
  defaultMode?: "in" | "up";
  onComplete?: () => void;
}) {
  const [mode, setMode] = useState<"in" | "up">(defaultMode ?? (prefill ? "up" : "in"));
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
      if (onComplete) onComplete();
      else navigate("/today");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="t-auth">
      <DevBanner />
      <div className="t-auth__card">
        <Link to="/" className="t-auth__brand">Tacet</Link>
        <p className="t-auth__line">
          {mode === "in" ? "Welcome back to your home on the open social web." : "Claim your home on the open social web."}
        </p>

        <form onSubmit={submit} className="t-auth__form">
          <label className="t-field">
            <span className="t-field__label">Handle</span>
            <input
              className="t-input t-input--block"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="you"
            />
          </label>

          <label className="t-field">
            <span className="t-field__label">Passphrase</span>
            <input
              className="t-input t-input--block"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </label>

          {mode === "up" && (
            <label className="t-field">
              <span className="t-field__label">Invite code</span>
              <input
                className="t-input t-input--block"
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
                autoCapitalize="characters"
                spellCheck={false}
              />
              {siteKey && <div ref={widgetRef} className="turnstile" />}
            </label>
          )}

          {error && <p className="t-auth__error" role="alert">{error}</p>}

          <Button variant="primary" size="lg" full type="submit" disabled={busy}>
            {busy ? "…" : mode === "in" ? "Enter" : "Create your identity"}
          </Button>
        </form>

        <button
          className="t-auth__switch"
          onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(null); }}
        >
          {mode === "in" ? "Have an invite? Create an account" : "Already have a handle? Sign in"}
        </button>
      </div>
    </main>
  );
}
