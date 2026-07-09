// Minimal, non-moving developer notice. Mounted ONCE at the App root so it shows on
// every page (landing, welcome funnel, auth, and the app). In-flow (not fixed) so it
// pushes content down at rest and scrolls away — never covering the app's sticky rail
// or top bar. Self-contained. When the site is stable, delete this file + its single
// mount in App.tsx.
export function DevBanner() {
  return (
    <>
      <style>{css}</style>
      <div className="devbar" role="status">
        <span className="devbar-dot" aria-hidden="true" />
        Developer preview — breaking changes. Nothing here is final.
      </div>
    </>
  );
}

const css = `
.devbar {
  position: relative;
  z-index: 2147483000;
  width: 100%; box-sizing: border-box;
  height: 2.15rem;
  display: flex; align-items: center; justify-content: center; gap: 0.55rem;
  background: #14131a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  color: #9d9da6;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.76rem; letter-spacing: 0.01em;
  padding: 0 1rem; text-align: center;
}
.devbar-dot {
  width: 0.42rem; height: 0.42rem; border-radius: 999px;
  background: #a996ec; flex: none;
}
`;
