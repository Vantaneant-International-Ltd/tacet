// Minimal, non-moving developer notice. Replaces the loud diagonal watermark +
// marquee hazard banners. One quiet fixed bar at the very top, self-contained so it
// works on any surface (landing + auth). Height matches --lp-devbar-h (2.15rem), which
// the landing nav offsets against. When the site is stable, delete this file and its
// imports + <DevBanner /> usages.
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
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 2147483000;
  height: 2.15rem;
  display: flex; align-items: center; justify-content: center; gap: 0.55rem;
  background: #14131a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  color: #9d9da6;
  font-family: "Jost", system-ui, -apple-system, sans-serif;
  font-size: 0.76rem; letter-spacing: 0.01em;
  padding: 0 1rem; text-align: center;
}
.devbar-dot {
  width: 0.42rem; height: 0.42rem; border-radius: 999px;
  background: #a996ec; flex: none;
}
`;
