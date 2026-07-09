// The welcome funnel's progress: 1 Welcome (complete, the landing itself) · 2 Your
// world · 3 Your home. `current` is the active step number (2 or 3).
const STEPS = [
  { n: 1, label: "Welcome" },
  { n: 2, label: "Your world" },
  { n: 3, label: "Your home" },
];

export function WelcomeStepper({ current }: { current: number }) {
  return (
    <ol className="wz-stepper" aria-label="Setup progress">
      {STEPS.map((s) => {
        const state = s.n < current ? "done" : s.n === current ? "current" : "todo";
        return (
          <li key={s.n} className={`wz-step is-${state}`} aria-current={state === "current" ? "step" : undefined}>
            <span className="wz-step-dot" aria-hidden="true">{state === "done" ? "✓" : s.n}</span>
            <span className="wz-step-label">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
