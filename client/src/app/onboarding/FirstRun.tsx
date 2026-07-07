import { useState } from "react";
import { Button } from "../../design/primitives";
import { api } from "../me";
import { markFirstRunDone } from "./hints";

// The first five minutes. Not a tutorial or a feature tour — a short, calm setup, one
// thing per screen, closer to Apple's device setup than a SaaS wizard. Its only real job
// is to help someone personalise their home so it already feels like theirs; the product
// teaches the rest through use.
export function FirstRun({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
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
    markFirstRunDone();
    onDone();
  }

  return (
    <div className="t-firstrun">
      <div className="t-firstrun__inner">
        {step === 0 && (
          <div className="t-firstrun__step">
            <p className="t-firstrun__mark">Tacet</p>
            <h1 className="t-firstrun__title">Welcome home.</h1>
            <p className="t-firstrun__lead">
              Your home on the open social web. One calm place for your people and the things
              you love. Let&rsquo;s make it yours — it takes a minute.
            </p>
            <div className="t-firstrun__cta">
              <Button variant="primary" size="lg" onClick={() => setStep(1)}>Begin</Button>
            </div>
            <button className="t-firstrun__skip" onClick={finish}>Skip for now</button>
          </div>
        )}

        {step === 1 && (
          <div className="t-firstrun__step">
            <h1 className="t-firstrun__title">What should we call you?</h1>
            <p className="t-firstrun__lead">This stays on your device. You can change it any time.</p>
            <div className="t-firstrun__form">
              <input
                className="t-input t-input--block t-firstrun__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && setStep(2)}
              />
              <div className="t-firstrun__handle">
                <span aria-hidden="true">@</span>
                <input
                  className="t-input t-input--block"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.replace(/\s/g, ""))}
                  placeholder="handle (optional)"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  onKeyDown={(e) => e.key === "Enter" && setStep(2)}
                />
              </div>
            </div>
            <div className="t-firstrun__cta">
              <Button variant="primary" size="lg" onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="t-firstrun__step">
            <h1 className="t-firstrun__title">{name.trim() ? `This is your place, ${name.trim().split(" ")[0]}.` : "This is your place."}</h1>
            <p className="t-firstrun__lead">
              <strong>Today</strong> is a calm view of the open social web — read it, reach the
              end, and you&rsquo;re done. Save anything you love, and it&rsquo;s yours: it lives
              here in <strong>Me</strong>, even if the original disappears.
            </p>
            <div className="t-firstrun__cta">
              <Button variant="primary" size="lg" onClick={finish} disabled={saving}>
                {saving ? "…" : "Enter Tacet"}
              </Button>
            </div>
          </div>
        )}

        <div className="t-firstrun__dots" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={"t-firstrun__dot" + (i === step ? " is-active" : "")} />
          ))}
        </div>
      </div>
    </div>
  );
}
