# Tacet brand guidelines

Here are our brand guidelines and production assets. Use as needed — nothing here is a spec to rebuild from scratch; it's the source of truth to pull from while you work on the landing page and web app.

`readme.md` is the full guideline document (brand story, voice, colour rules, type, spacing, motion, iconography). Skim it once; reference it whenever a design decision comes up.

## What's here

- `readme.md` — the brand guidelines. Start here.
- `styles.css` + `tokens/` — production CSS custom properties. Import `styles.css` once; use only semantic aliases (`--surface-1`, `--text-secondary`, `--accent`…). Dark mode = `[data-theme="dark"]` on any subtree.
- `assets/logo/` — vector-first, styleable and animatable:
  - `tacet-mark.svg` — the Hearth in `currentColor` (style via CSS `color`); baked variants: iris/ink/white/lavender.
  - `tacet-wordmark.svg` / `tacet-lockup.svg` — vector wordmark + lockup in `currentColor` (SVG text in Hanken Grotesk — load the font on the page, which the site does anyway).
  - `tacet-mark-animated.svg` — self-contained breathing mark (4s ease-breathe loop, dot pulse, `prefers-reduced-motion` safe). Works inline or as `<img>`.
  - `appicon-*.svg`, `favicon.svg`, plus PNG wordmarks/lockups where raster is required.
- `assets/icons/` — 36 product icons (Lucide, ISC): outline, 2px stroke, `currentColor`. Nav map: today→sun, people→users, discover→compass, communities→users-round, compose→square-pen, federation→network.
- `assets/fonts/` — Hanken Grotesk + Spline Sans Mono, variable woff2 (`tokens/fonts.css` has the @font-face rules).
- `assets/backgrounds/` — constellation SVGs (dark/light): the only ambient background device, keep opacity ≤ 0.55.
- `assets/marketing/og-image.png` — 2400×1260 Open Graph image.
- `components/` — React reference implementations (`.jsx` + `.d.ts` + `.prompt.md` usage notes) of every component. If the repo already has its own components, treat these as the styling/behaviour reference rather than code to drop in.
- `tacet-bundle.js` — pre-transpiled bundle (`window.TacetDS`) for no-build HTML pages, if useful.
- `ui_kits/` — reference screens (web app Today view, landing hero) showing correct composition.
- `guidelines/` — small HTML specimen cards per foundation (open in a browser to eyeball).
- `SKILL.md` — drop this folder into `~/.claude/skills/tacet-design/` to keep these guidelines in every session.

## The rules that matter most

- Iris `#7B61FF` marks presence and connection only — links, active states, the mark. Almost nothing else. Blossom pink never appears as UI chrome.
- Sentence case everywhere. The wordmark is always lowercase `tacet`. People, never "users". No exclamation marks. Counts cap at "9+".
- Radius: 10 buttons / 14 cards / 20 dialogs. Hairline borders + soft violet shadows, never heavy outlines.
- Motion: ease-glide default, 120–560ms, entrances fade + 8–12px rise; no bounces, no particles; honour reduced-motion.
- The Hearth mark is brand, never a UI glyph.
