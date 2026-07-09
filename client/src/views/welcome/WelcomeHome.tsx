import { useState } from "react";
import { navigate } from "../../router";
import { Enter } from "../Enter";
import { api } from "../../app/me";
import { WelcomeStepper } from "./WelcomeStepper";
import "./welcome.css";

// Step 3 — "Your home". The guided setup lives here and ONLY here (never on /today).
// Greeting → account creation (reusing the Enter create path, auth never forked) →
// identity basics → /today. "Skip for now" leaves for a read-only walk at any point.
type Sub = "greet" | "create" | "identity";

export function WelcomeHome() {
  const [sub, setSub] = useState<Sub>("greet");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    const edit: { displayName?: string; handle?: string } = {};
    if (name.trim()) edit.displayName = name.trim();
    if (handle.trim()) edit.handle = handle.trim().replace(/^@/, "");
    try {
      if (Object.keys(edit).length) await api.updateProfile(edit);
    } catch {
      /* setup should never block on the network */
    }
    navigate("/today");
  }

  // Account creation reuses the exact Enter path; on success we continue to identity.
  if (sub === "create") {
    return <Enter defaultMode="up" onComplete={() => setSub("identity")} />;
  }

  return (
    <main className="wz">
      <div className="wz-inner wz-inner--narrow">
        <WelcomeStepper current={3} />

        {sub === "greet" && (
          <div className="wz-panel">
            <h1 className="wz-title">Welcome home.</h1>
            <p className="wz-sub">
              Your home on the open social web. One calm place for your people and the
              things you love. Let&rsquo;s make it yours — it takes a minute.
            </p>
            <div className="wz-actions wz-actions--center">
              <button className="wz-btn wz-btn-primary" onClick={() => setSub("create")}>
                Begin
              </button>
            </div>
            <button className="wz-skip" onClick={() => navigate("/today")}>
              Skip for now
            </button>
          </div>
        )}

        {sub === "identity" && (
          <div className="wz-panel">
            <h1 className="wz-title">Make it yours.</h1>
            <p className="wz-sub">This stays on your device. You can change it any time.</p>
            <div className="wz-form">
              <input
                className="wz-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && finish()}
              />
              <div className="wz-handle">
                <span aria-hidden="true">@</span>
                <input
                  className="wz-input"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.replace(/\s/g, ""))}
                  placeholder="handle (optional)"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  onKeyDown={(e) => e.key === "Enter" && finish()}
                />
              </div>
            </div>
            <div className="wz-actions wz-actions--center">
              <button className="wz-btn wz-btn-primary" onClick={finish} disabled={saving}>
                {saving ? "…" : "Enter Tacet"}
              </button>
            </div>
            <button className="wz-skip" onClick={() => navigate("/today")}>
              Skip for now
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
