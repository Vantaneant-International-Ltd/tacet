import { usePath } from "../../router";

// Minimal developer notice, pinned at the very top on every page. On the app (read-only
// walkable alpha) it says so and names the source; elsewhere it flags the dev preview.
// It exposes --devbar-h so sticky app chrome (rail, top bar) can sit just below it.
// When the site is stable, delete this file + its single mount in App.tsx.
const APP_PREFIXES = ["/today", "/people", "/discover", "/conversations", "/me", "/p/", "/c/"];

export function DevBanner() {
  const path = usePath();
  const isApp = APP_PREFIXES.some((p) => path === p || path.startsWith(p));
  return (
    <>
      <style>{css}</style>
      <div className="devbar" role="status">
        <span className="devbar-dot" aria-hidden="true" />
        {isApp
          ? "Read-only preview — live posts from the open social web. Nothing here saves yet."
          : "Developer preview — breaking changes. Nothing here is final."}
      </div>
    </>
  );
}

const css = `
:root { --devbar-h: 2.15rem; }
.devbar {
  position: sticky;
  top: 0; left: 0; right: 0;
  z-index: 2147483000;
  height: var(--devbar-h);
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
