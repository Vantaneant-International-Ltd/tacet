# Today — fidelity spec

Surface: **Today** — the calm editorial homepage and default route.
Templates: `docs/10-design/hifi/handoff/Today Desktop.html`,
`docs/10-design/hifi/handoff/Today Mobile.html`.
Current impl: `client/src/app/screens/Today.tsx` (the screen),
`client/src/app/live.tsx` (`LiveMoment`, `SourceNote`, `SourceBadge`, `PostMedia`, `PostCounts`),
`client/src/app/AppShell.tsx` (rail / top bar / tab bar / FAB), styled by
`client/src/app/app.css` on tokens from `client/src/design/theme.css`.

Type system is LOCKED: Hanken Grotesk (`--font-sans`) + Spline Sans Mono (`--font-mono`). The
templates ship "Jost" / "Space Mono" webfonts — **ignore those**; the tokens already resolve to
the locked kit and that is correct, not a gap.

Deviations from the template are allowed ONLY where a Whitelist item (W1 honesty / W3 semantic
tokens / W4 reduced-motion + AA / W5 no protocol words) is cited inline.

Today owns the **whole 3-column canvas** (it is the surface the rail, feed and context column
were designed around). This spec therefore covers the shell chrome as it appears on Today as well
as the Today screen body.

---

## A. Desktop layout — the 3-column canvas (≥1200px full; ≥900px folds the context column)

Template outer frame (verbatim intent):

```
min-height:100vh; background-color: var(--color-canvas);
background-image: var(--glow-ambient); background-repeat:no-repeat;   ← ambient lamp glow
color: var(--color-text-primary); font-family: var(--font-sans);
font-weight:400; font-size: var(--text-body); line-height: var(--leading-relaxed);

display:flex →
  min-width: calc(var(--rail-width) + var(--measure-reading) + var(--context-width)
                  + 2*var(--gutter) + 2*var(--space-6))
```

Three columns, left to right:

1. **Left rail** — `--rail-width` (250px), `flex:none`, `position:sticky; top:0; height:100vh`.
   `padding: var(--space-6) var(--space-4) var(--space-5)`.
   Background `linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 80%, var(--color-canvas)) 0%, var(--color-canvas) 60%)`,
   `border-right: var(--border-hairline) solid var(--color-hairline)`.
2. **Centre** — a `<main>` that is itself
   `display:grid; grid-template-columns: minmax(0, var(--measure-reading)) var(--context-width);
   gap: var(--gutter); justify-content:center; padding: 0 var(--space-6)`.
   Column 2a = the feed (fixed 42rem measure). Column 2b = the context column.
3. **Right context column** — lives inside `<main>` as `<aside>` at `--context-width` (320px),
   `align-self:start`, `border-left: var(--border-hairline) solid color-mix(in srgb, var(--color-hairline) 70%, transparent)`,
   `padding: var(--space-8) 0 var(--space-9) var(--space-6)`.

**≥900px, <1200px:** rail + centred 42rem feed only; the context column folds away (nothing
*lives* only there — ADR-012 / hifi/today.md §3). Reading measure stays fixed at 42rem.

### A.1 Left rail (order top → bottom)

1. **Wordmark** `tacet` — `--text-title`, weight 500, `--tracking-tight`, `--leading-tight`,
   `padding: var(--space-2) var(--space-3) var(--space-5)`. Behind it, an absolutely-positioned
   radial accent lamp glow (`radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 13%, transparent), transparent)`),
   `pointer-events:none`. The `TacetMark` glyph may lead the word (current impl has it; template
   uses the word alone — **keep the glyph**, it is on-brand and not a template lie).
2. **Search entry** — `role="button" tabindex="0"`, full width, `padding: var(--space-3)`,
   `margin-bottom: var(--space-5)`, `background: var(--color-surface)`,
   `border: var(--border-hairline) solid var(--color-hairline)`, `border-radius: var(--radius-md)`,
   `color: var(--color-text-secondary)`, `--text-label`, `cursor:text`. Contains: search glyph
   (`--icon-sm`) · label **"Search"** · a mono `⌘K` chip pushed right
   (`--font-mono`, `--text-micro`, hairline border, `--radius-xs`, padding `var(--space-0) var(--space-1)`).
   Hover `border-color: var(--color-text-tertiary)`; focus 2px `--color-focus-ring` ring, offset 2.
   **W1 / dead control:** search is not built. Ship it **honestly disabled** — render it but do not
   pretend it navigates: either `aria-disabled="true"` with a "coming soon" title, or omit the `⌘K`
   affordance. Do NOT wire a fake modal.
3. **Nav** — `display:flex; flex-direction:column; gap: var(--space-1)`. Five items, each
   `padding: var(--space-3)`, `border-radius: var(--radius-md)`, `gap: var(--space-3)`,
   `--text-label`, weight 500, `--leading-normal`, icon at `--icon-md` (22):
   **Today · People · Discover · Conversations · Me** (exact order and copy).
   - Active item (Today) = `aria-current="page"`, accent-subtle gradient pill
     (`linear-gradient(180deg, color-mix(in srgb, var(--color-accent-subtle) 70%, transparent) 0%, var(--color-accent-subtle) 100%)`),
     `box-shadow: var(--edge-highlight)`, `color: var(--color-accent)`.
   - Inactive = `--color-text-secondary`; hover
     `background: color-mix(in srgb, var(--color-text-primary) 6%, transparent); color: var(--color-text-primary)`.
   - **Conversations** carries a presence dot at `margin-left:auto`: `--dot-presence` (8px),
     `--radius-full`, `background: var(--color-accent)`, `box-shadow: 0 0 8px var(--color-accent)`,
     `title="New correspondence"`. Never a count.
4. **Primary action** — one accent button, `margin-top: var(--space-5)`,
   `padding: var(--space-3) var(--space-4)`, gradient
   `linear-gradient(180deg, var(--color-accent-hover) 0%, var(--color-accent) 100%)`,
   `color: var(--color-on-accent)`, `--radius-md`, `--text-label`, weight 500,
   `box-shadow: var(--glow-accent)`. Icon = compose/quill (`--icon-sm`). Label **"New"**.
   Opens the compose overlay (see compose.md; W1 — it is a not-yet-publishing preview).
5. **Footer** — `margin-top:auto; padding-top: var(--space-5)`, hairline top border
   (`color-mix(in srgb, var(--color-hairline) 60%, transparent)`), `gap: var(--space-3)`:
   36px avatar · a two-line identity block · a theme toggle pushed right.
   - Identity: name **"Renato Gusani"** (`--text-label`, weight 500) over handle **"@renato"**
     (`--font-mono`, `--text-micro`, `--color-text-tertiary`).
   - Theme toggle: 44×44 icon button, sun when dark / moon when light, `aria-label="Switch theme"`;
     hover `background: var(--color-surface-sunken); color: var(--color-text-primary)`.

### A.2 Centre feed (`<section aria-label="Today">`, `padding: var(--space-8) 0 var(--space-9)`)

**Masthead header** (`margin-bottom: var(--space-7)`):
- Overline date — `--text-micro`, weight 500, `--tracking-wide`, `--color-text-tertiary`:
  **"Today · Thursday, July 9"** (a real, human day-line — descriptive, never a nag).
- `<h1>` greeting — `--text-display`, weight 400, `--tracking-tight`, `--leading-tight`,
  `margin-top: var(--space-3)`: **"Good evening, Renato."**
- Sub-line — `--color-text-secondary`, `--text-body-sm`, `--leading-relaxed`,
  `margin-top: var(--space-3)`:
  **"A quiet Thursday, gently busy underneath. Seven things worth your attention, then the evening is yours."**
- **Source cluster** (`margin-top: var(--space-5)`, `gap: var(--space-3)`): a 5-avatar overlapping
  stack (28px, `margin-left: var(--overlap-avatar)`, `box-shadow: 0 0 0 2px var(--color-canvas)`)
  + a mono caption `--font-mono --text-micro --color-text-tertiary`:
  **"tacet.social · mastodon.social · pixel.town · write.as · peertube.social"**.
  W5-safe: these are product/place names, not protocol words. Where content is sample, keep this
  honest (W1) — the SourceNote already carries mode.

**Feed body** — `display:flex; flex-direction:column; gap: var(--space-6)`, in this exact order:

1. **Composer entry** — a calm inline row (NOT a card of vanity scaffolding).
   `display:flex; align-items:center; gap: var(--space-3); padding: var(--space-4)`,
   `background: var(--surface-gradient)`,
   `border: var(--border-hairline) solid color-mix(in srgb, var(--color-hairline) 60%, transparent)`,
   `border-radius: var(--radius-lg)`, `box-shadow: var(--elevation-1), var(--edge-highlight)`.
   Contains: 36px avatar · a pill `role="button" tabindex="0"` reading **"What's on your mind?"**
   (`background: var(--color-surface-sunken)`, hairline, `--radius-full`, `--color-text-tertiary`,
   `--text-body-sm`, `cursor:text`) · a 44×44 "Share a photo" icon button (camera glyph).
   Opens the compose overlay. **W1:** the composer is a not-yet-publishing preview — the placeholder
   is fine, but it must open the honest preview composer, not imply it will post.
2. **Section divider "This evening"** — `gap: var(--space-3)`: a `--text-micro`, weight 500,
   `--tracking-wide`, `--color-text-tertiary` label + a flex hairline rule
   (`height: var(--border-hairline); background: color-mix(in srgb, var(--color-hairline) 60%, transparent)`).
3. **HERO moment** — media-first, magazine-framed `<article>`:
   `background: var(--surface-gradient)`, hairline, `--radius-lg`,
   `box-shadow: var(--elevation-2), var(--edge-highlight)`, `overflow:hidden`.
   - Media band `aspect-ratio: var(--ratio-photo)`, `box-shadow: var(--media-vignette)`, with a
     bottom caption scrim (`background: var(--scrim-caption)`) carrying mono on-media caption
     **"Dusk over the old quarter."** (`--on-media`, `text-shadow: var(--media-shadow)`).
   - Body `padding: var(--space-5)`: 44px avatar · identity (name **"Mara Ito"** `--text-subheading`
     weight 500; meta `--font-mono --text-meta --color-text-tertiary` **"@mara · on tacet.social · 8:12 pm"**)
     · a 44×44 overflow "⋯" button `aria-label="More about this moment"`.
   - Text `--text-body --leading-relaxed`:
     **"Finished the long edit at last. Letting it sit for a day before I read it back with fresh eyes — the light this evening felt like the right note to end on."**
   - Affordance row `gap: var(--space-5); margin-top: var(--space-4)`: **Reply · Share · Saved**.
     "Saved" is the on-state (`--color-positive`, filled bookmark). Each button `--text-label`
     weight 500, `--color-text-secondary`, hover `--color-text-primary`. **No like/comment counts.**
4. **Curator moment — "A conversation worth joining"** — quiet accent-tinted `<article>`:
   `background: linear-gradient(180deg, color-mix(in srgb, var(--color-accent-subtle) 55%, var(--color-surface)) 0%, var(--color-surface) 100%)`,
   `border: var(--border-hairline) solid color-mix(in srgb, var(--color-accent) 16%, var(--color-hairline))`,
   `--radius-lg`, `padding: var(--space-5)`, `box-shadow: var(--elevation-1), var(--edge-highlight)`.
   - Overline (mono, `--color-accent`, conversations glyph 14px): **"A conversation worth joining"**.
   - Identity: **"Chris Hall"**, **"@chrish@mastodon.social · 28m"**, + a **Mastodon** source badge
     (globe glyph, surface-sunken chip). Overflow "⋯".
   - Text: **"What we actually mean when we say we're "building for the open web" — and why the boring parts matter most."**
   - Represented-momentum line: a 3-avatar stack + mono caption
     **"active now · Alex, Cassie and others you follow are here"** (qualitative, relationship-scoped —
     never "N replies").
   - Affordances **Reply · Share · Save**.
5. **Content card — photo essay (Pixelfed triptych)** — framed `<article>`, `overflow:hidden`.
   - Media grid `grid-template-columns: 1.6fr 1fr; grid-template-rows: 1fr 1fr; gap: var(--space-1)`:
     one tall image `grid-row: 1 / span 2` + two `--ratio-square` tiles.
   - Identity: **"Jonas Vold"**, **"@jonas@pixel.town · 4:40 pm"**, **Pixelfed** badge, overflow.
   - Text: **"Morning walk, before the street woke up. Three frames from the quay."**
   - Affordances **Reply · Share · Save**.
6. **Section divider "Earlier today"** — same divider component.
7. **Content card — article from the open web** — flat `<article>` (`--elevation-1`, no media band):
   - Identity: **"Elena Duarte"**, **"@elena@write.as · 11:20 am"**, **WriteFreely** badge, overflow.
   - `<h3>` link title `--text-title` weight 500 `--tracking-tight`: **"The maintenance web"**
     (link `--color-text-primary`; hover `--color-accent-hover` underline).
   - Dek `--text-body-sm --color-text-secondary`:
     **"The most radical thing a small community can do is keep its corner of the web tended — on software built to last, not to grow."**
   - Meta mono line: **"Article · 9 min read"**.
   - Affordances **Reply · Share · Save**.
8. **Quiet moment (unboxed)** — a thought with no card frame; type carries it.
   `padding: var(--space-2) var(--space-5)`, 36px avatar, inline name **"Tobi Wren"** + mono meta
   **"@tobi@lemmy.ml · 1:12 pm"**, text
   **"A quiet Thursday morning. Coffee, journaling, and no algorithm. This is underrated."**
   Affordances here are only **Reply · Save** (no Share). Provides rhythm against the framed cards.
9. **Content card — video (PeerTube, poster-first, no autoplay)** — framed `<article>`:
   - Media `aspect-ratio: var(--ratio-video)`, `box-shadow: var(--media-vignette)`; a single centered
     play button (56px circle, `background: var(--scrim-media)`, on-media play glyph;
     `aria-label="Play — The Internet We Deserve, 1 hour 24 minutes"`); a mono duration chip
     bottom-right (`background: var(--scrim-media-strong)`): **"1:24:10"**. **No autoplay.**
   - Identity: **"Free Culture"**, **"@freeculture@peertube.social · 2:05 pm"**, **PeerTube** badge, overflow.
   - Text: **"New documentary — *The Internet We Deserve*: a quiet look at building a decentralized, human-centered web."**
     (`<em>` on the title).
   - Affordances **Reply · Share · Save**.
10. **Curator moment — "From a community you're in"** — accent-tinted `<article>` (same recipe as #4):
    - Overline (people glyph): **"From a community you're in"**.
    - Community identity: **"Indie Makers"** with a square (`--radius-md`) avatar; sub
      **"a community on tacet.social"** (no overflow button).
    - Text: **"Show & tell is open tonight — small projects arriving all evening, from a solar e-reader to a tiny weather station."**
    - Momentum line (mono): **"busy this evening"**.
    - A single ghost onward link **"Step in"** + arrow (`--color-accent-hover`, `--text-label`).
      This card has NO Reply/Share/Save row — it is a door, not a post.
11. **The bounded end** — `text-align:center; padding: var(--space-8) 0 0`:
    - A short centered hairline rule (`max-width: 20rem`, `margin-bottom: var(--space-6)`).
    - A check glyph `--icon-lg`, `--color-text-secondary`.
    - Title `--text-subheading` weight 500 `--color-text-secondary`:
      **"That's today. You're all caught up."**
    - Body `--text-body-sm --color-text-tertiary` (`max-width: 28rem`):
      **"Nothing more is waiting. The rest of the evening is yours."**
    - A pill ghost link (hairline, `--radius-full`) **"Look around Discover"** + arrow → routes to
      `/discover`.

### A.3 Right context column (`<aside aria-label="Your world">`) — "your world, never your score" (ADR-012)

Two mutually-exclusive states. **Living** (`contextLiving`, default) shows four blocks, each with a
`<h2>` at `--text-heading` weight 500 `--leading-snug`, `margin-bottom: var(--space-7)` between blocks:

1. **"People close to you"** — four rows, each `gap: var(--space-3); padding: var(--space-2) 0`:
   36px avatar · name (`--text-label` weight 500) + mono handle (`--text-micro --color-text-tertiary`)
   · a presence signal pushed right (mono):
   - **Alex Rivera** · `@alex@tacet.social` · dot + **"around now"**
   - **Cassie Lin** · `@cassie@pixelfed.social` · dot + **"around now"**
   - **Maya Okonkwo** · `@maya@mastodon.social` · **"earlier"** (no dot)
   - **Tobi Wren** · `@tobi@lemmy.ml` · **"yesterday"** (no dot)
   Presence dot = `--dot-presence`, `--color-accent`, `box-shadow: 0 0 8px var(--color-accent)`.
   Never "N online", never a ranking. Ghost link **"See your people"** + arrow → `/people`.
2. **"Continue"** — one inset card
   (`--surface-gradient`, hairline, `--radius-md`, `box-shadow: var(--elevation-1), var(--edge-highlight)`):
   56px thumbnail (`--radius-sm`) · title **"The slow web, and why it's worth it"** (`--text-label`
   weight 500) · mono **"6 min left"** · a text button **"Resume reading"** (`--color-accent-hover`,
   `--text-micro`, hover underline). One item only (IA §6 continuity).
3. **"Across your world"** — represented, relationship-scoped momentum (never a leaderboard):
   - Row A: 2-avatar stack + **"A conversation on *designing for calm*"** (`<em>`) with mono sub
     **"active now · among people you follow"**.
   - Row B (hairline top border): 40px thumbnail + **"*The Internet We Deserve* — a film"** with mono
     sub **"shared widely across the open web"** (qualitative range, never a raw count).
   - Ghost link **"Look around Discover"** + arrow → `/discover`.
4. **"Communities active today"** — two rows, square (`--radius-sm`) thumbnails:
   - **Indie Makers** · **"show & tell is open tonight"**
   - **Slow Photography** · **"an essay being passed around"**
5. **The open web reassurance** — a calm accent-tinted panel
   (`linear-gradient(160deg, color-mix(in srgb, var(--color-accent-subtle) 80%, var(--color-surface)) 0%, var(--color-surface) 75%)`,
   accent-tinted hairline, `--radius-lg`, `box-shadow: var(--elevation-1), var(--edge-highlight)`):
   a positive dot (`--color-positive`, glow) + **"You're connected across the open social web."** and
   a ghost link **"Learn how it works"** + arrow. Educational, shown once — **not** a live federation
   ticker / server counter / pulsing map (ADR-012 banned).

**Resting** (`contextResting`) variant: `padding-top: var(--space-7)`, two lines
**"Your world is quiet right now."** (`--color-text-secondary`) and **"Nothing needs your attention."**
(`--color-text-tertiary`), then the same open-web reassurance panel. A composed quiet, never blank.

**Explicitly banned in this column** (ADR-012): creator/follower/like/view leaderboards, personal reach
analytics, streaks, red counts, urgency halos, a live-ticking federation panel.

---

## B. Mobile layout (<900px; frame max-width 430px)

Outer frame: `display:flex; flex-direction:column; min-height:100vh`,
`background-color: var(--color-canvas); background-image: var(--glow-ambient)`, with faint
`color-mix` hairlines left/right on the 430px column.

1. **Top bar** (`<header>`) — `position:sticky; top:0; z-index: var(--z-content)`, `height: var(--topbar-height)`
   (56px), `gap: var(--space-3); padding: 0 var(--space-4)`, **solid surface + hairline, no glass**:
   `background: color-mix(in srgb, var(--color-surface) 92%, var(--color-canvas))`,
   `border-bottom: var(--border-hairline) solid var(--color-hairline)`.
   Contents: wordmark **"tacet"** (`--text-heading` weight 500 `--tracking-tight`) · a 44×44 Search
   icon button pushed right (`aria-label="Search"`; **W1** honestly disabled — search unbuilt) · a
   44×44 **Me** button showing a 32px avatar (`aria-label="Me"`) → `/me`.
   **Note:** the template top bar has NO theme toggle. The current impl puts the theme toggle here;
   move it or keep it as the trailing control — but the Search + Me avatar are the template's required
   trailing actions.
2. **Editorial masthead** — `padding: var(--space-6) var(--space-4) var(--space-2)`:
   overline **"Today · Thursday, July 9"** · `<h1>` **"Good evening, Renato."** (`--text-title`
   weight 500 `--tracking-tight` `--leading-tight`) · sub-line
   **"A quiet Thursday. Seven things worth your attention, then you're done."** (`--text-body-sm
   --color-text-secondary`) · a 4-avatar stack (24px) + mono caption
   **"your people, from five places on the open web"**.
3. **Lens row** (`role="radiogroup" aria-label="View of Today"`) — a segmented control,
   `margin: var(--space-4) var(--space-4) var(--space-2)`, `gap: var(--space-1); padding: var(--space-1)`,
   `background: var(--color-surface-sunken)`, hairline, `--radius-full`. Four options, each `flex:1`,
   `padding: var(--space-2) var(--space-3)`, `--text-label` weight 500, `--radius-full`:
   **For You · Following · Local · Trending**. Active = **For You** (`aria-checked="true"`,
   `background: var(--surface-gradient)`, `box-shadow: var(--elevation-1), var(--edge-highlight)`,
   `--color-text-primary`); others `--color-text-secondary` on transparent, hover `--color-text-primary`.
   Neutral surface, **never accent**. Rules (hifi/today.md §4): each lens is an honest bounded view
   that still ends; Trending is represented/relationship-scoped momentum (softened numbers), never a
   global leaderboard; no red counts, no auto-advance.
   **W1 / behavior:** if lens switching is not wired to distinct real data yet, the three inactive
   lenses must be honestly non-functional (visibly present but inert / "coming soon") rather than
   silently showing the identical feed as if filtered.
4. **The digest** — `display:flex; flex-direction:column; gap: var(--space-5);
   padding: var(--space-4) var(--space-4) var(--space-6)`. Card order (a subset of desktop; note the
   mobile cards drop the affordance row on the non-hero cards):
   1. **Hero** — Mara Ito card, `--elevation-2`, photo band + caption scrim
      **"Dusk over the old quarter."**, text
      **"Finished the long edit at last. Letting it sit for a day before I read it back with fresh eyes."**,
      affordance row **Reply · Share · Saved** (Saved = on-state). No overflow "⋯" on mobile hero.
   2. **Curator moment "A conversation worth joining"** — Chris Hall, Mastodon badge, text
      **"What we actually mean when we say we're "building for the open web" — and why the boring parts matter most."**,
      momentum line 2-avatar stack + **"active now · people you follow are here"**. No affordance row.
   3. **Photo essay** — Jonas Vold triptych, Pixelfed badge, text
      **"Morning walk, before the street woke up. Three frames from the quay."** No affordance row.
   4. **Quiet thought** — Tobi Wren, `@tobi@lemmy.ml · 1:12 pm`, text
      **"A quiet Thursday morning. Coffee, journaling, and no algorithm. This is underrated."**
      `padding: var(--space-2)`, unboxed.
   5. **Film** — Free Culture, PeerTube badge, poster + play + duration chip **"1:24:10"**, text
      **"New documentary — *The Internet We Deserve*: a quiet look at building a decentralized, human-centered web."**
      No affordance row.
   6. **The bounded end** — check glyph + **"That's today. You're all caught up."** +
      **"Nothing more is waiting. The rest of the evening is yours."** + ghost pill
      **"Look around Discover"** → `/discover`. `max-width: 20rem` on the body.
5. **Tab bar** (`<nav aria-label="Primary">`) — `position:sticky; bottom:0; z-index: var(--z-nav)`,
   `height: var(--tabbar-height)` (72px), `display:grid; grid-template-columns: repeat(5,1fr)`,
   **solid surface + hairline, no glass** (`background: color-mix(in srgb, var(--color-surface) 94%, var(--color-canvas))`,
   `border-top: var(--border-hairline) solid var(--color-hairline)`). Five slots, center is the FAB:
   - **Today** (active, `aria-current="page"`, `--color-accent`, home glyph)
   - **People**
   - **[ New FAB ]** — center slot: a 56px (`--fab-size`) accent gradient circle raised
     `margin-top: calc(-1 * var(--space-5))`, `box-shadow: var(--glow-accent), var(--elevation-2)`,
     compose glyph, `aria-label="New"`. Opens compose overlay.
   - **Discover**
   - **Chats** — labelled **"Chats"** (NOT "Conversations" on mobile), with a presence dot
     top-right of the glyph (`--dot-presence`, `--color-accent`, glow, `title="New correspondence"`).
   Each tab column with icon `--icon-md` (22) over `--text-micro` label; inactive `--color-text-secondary`.

---

## C. Semantic tokens used (all names exist in tokens.md §2–§11; W3)

Layout: `--rail-width`, `--context-width`, `--feed-measure` / `--measure-reading` (42rem),
`--measure-wide`, `--gutter`, `--canvas-max`, `--topbar-height`, `--tabbar-height`, `--fab-size`,
`--z-content`, `--z-nav`, `--z-fab`.
Type: `--font-sans`, `--font-mono`, `--text-display`, `--text-title`, `--text-heading`,
`--text-subheading`, `--text-body`, `--text-body-sm`, `--text-label`, `--text-meta`, `--text-micro`,
`--leading-tight/-snug/-normal/-relaxed`, `--tracking-tight/-normal/-wide`.
Colour/surface: `--color-canvas`, `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`,
`--color-hairline`, `--color-text-primary/-secondary/-tertiary`, `--color-accent/-hover/-subtle`,
`--color-on-accent`, `--color-positive`, `--color-warning`, `--color-focus-ring`.
Atmosphere (Stage-6): `--glow-ambient`, `--surface-gradient`, `--edge-highlight`, `--glow-accent`,
`--media-vignette`.
Media/scrim: `--scrim-caption`, `--scrim-media`, `--scrim-media-strong`, `--on-media`, `--media-shadow`,
`--dot-presence`, `--overlap-avatar`, `--ratio-photo`, `--ratio-video`, `--ratio-square`.
Space/radius/border/motion: `--space-0…9`, `--radius-xs/-sm/-md/-lg/-xl/-full`, `--border-hairline`,
`--border-strong`, `--icon-inline/-sm/-md/-lg`, `--elevation-0…3`, `--dur-1…4`, `--ease-out/-in-out`.

---

## D. Interaction & accessibility behaviors

- **Focus:** every interactive control shows `outline: 2px solid var(--color-focus-ring); outline-offset: 2px`
  (or the impl's `:focus-visible` 4px offset on card-open). Nav uses `aria-current="page"`.
- **Card open = read the conversation** (current `LiveMoment` behavior): the body region is
  `role="button" tabIndex=0`, Enter/Space open the in-Tacet reader (`conversationPath`). Keep. The
  overflow "⋯" and inner links stop propagation.
- **No autoplay:** video is poster-first with a single play control; `preload="none"`. Keep.
- **W4 reduced motion:** `@media (prefers-reduced-motion: reduce) { * { transition:none !important;
  animation:none !important; } }` — the template ships this; the impl's `t-fade` screen-enter and card
  transitions must be neutralized under it. All on-media / accent-subtle / tertiary text pairings must
  clear AA (scrims are already tuned via `--alpha-scrim`; on-media uses `--media-shadow`).
- **Theme toggle** flips `data-theme` dark↔light; body background must track (`#0D0D0D` / `#F7F4EF`).
- **Honestly-disabled / dead controls** (must NOT pretend to work): rail + mobile **Search**;
  mobile **lens** switching if not backed by distinct data; **Spark** action (already disabled in
  `LiveMoment`); **Follow** on person rows (already disabled). Give each a "coming soon" title and
  `disabled`/`aria-disabled`. The **overflow "⋯"** button must either open a real menu or be omitted —
  do not ship a no-op.

---

## E. GAP LIST — concrete edits to conform the impl to the template

Current `Today.tsx` renders only: a small `<h1>`/line masthead, `SourceNote`, a flat `t-feed` of
`LiveMoment`s, and a caught-up block. The template is a composed 3-column editorial homepage. Edits,
most important first:

**Shell / canvas (AppShell.tsx + app.css)**
1. **Add the third column.** `.t-app` grid is `250px 1fr`; change the canvas so Today lays out as
   rail (`--rail-width`) · centre `<main>` grid (`minmax(0, var(--measure-reading)) var(--context-width)`,
   `gap: var(--gutter)`) · context `<aside>`. The context column shows ≥1200px and folds ≥900/<1200px.
   (Context column is a Today-owned module — introduce it in the Today screen, rendered into the
   `<main>` grid's second track.)
2. **Rail Search entry** — add the search `role="button"` row with glyph + "Search" + mono `⌘K` chip
   between wordmark and nav. Ship **honestly disabled** (W1) until search exists.
3. **Rail footer identity** — the template shows name **"Renato Gusani"** + mono handle **"@renato"**;
   current impl shows only `me.name` ("Renato"). Add the mono handle line. (Mock `me.user="renato"`,
   `me.server="tacet.social"` — W1: this handle is local-not-federated; render `@renato`, not a
   federated address claim.)
4. **Rail primary button label** — template says **"New"**; impl already says "New" ✓. Keep the
   compose glyph and `--glow-accent`.
5. **Ambient glow** — apply `background-image: var(--glow-ambient)` to the app canvas (desktop and
   mobile). Requires the token (see §F).
6. **Mobile top bar** — add the **Search** (honestly disabled) and **Me avatar** trailing buttons;
   reconcile the theme toggle (template omits it here — either drop it from the top bar or keep it as
   an extra trailing control, but Search + Me are required). Make the bar **solid** surface + hairline
   (remove the `backdrop-filter` glass — the template is explicit "no glass").
7. **Mobile tab bar** — make it a `grid-template-columns: repeat(5,1fr)` with the **center New FAB**
   raised into the bar (currently the FAB floats separately as `.t-fab`). Rename the 5th tab from
   **"Conversations"** to **"Chats"** on mobile (desktop rail keeps "Conversations"). Add the presence
   dot on the Chats tab. Make the bar **solid** (drop `backdrop-filter`). Height 72px (`--tabbar-height`).
8. **Conversations presence dot on the rail** — impl already renders `.t-navitem__dot` ✓; ensure it
   uses `--dot-presence` sizing and accent glow.

**Today screen body (Today.tsx + live.tsx + app.css)**
9. **Masthead** — replace the bare `<h1>`+line with: overline date-line
   **"Today · Thursday, July 9"** (`--text-micro --tracking-wide --color-text-tertiary`), `<h1>` at
   `--text-display` (desktop) / `--text-title` (mobile), the fuller sub-line, and the avatar-stack +
   mono source caption. Update mock `today` copy to the template greeting/line (or add a date-line
   field). W1: keep the day-line descriptive of reality, not a hook.
10. **Composer entry row** — add the calm inline composer ("What's on your mind?" + camera button) at
    the top of the feed; opens the compose overlay. W1: it is a not-yet-publishing preview.
11. **Section dividers** — add the **"This evening"** and **"Earlier today"** labelled hairline
    dividers between feed groups. (Group the moments into two runs.)
12. **Card variants** — `LiveMoment` renders one flat `.t-post` for all. The template has distinct
    variants that must exist: **hero** (media band + caption scrim + `--elevation-2`), **content card
    with media grid** (already partly via `PostMedia`/`t-media-grid`), **article card** (title link +
    dek + "N min read" meta, no media band), **quiet unboxed moment** (no card frame, Reply·Save only),
    **video card** (poster + play + duration chip, no autoplay), and two **curator moments**
    (accent-tinted, honestly-labelled overlines). Add these as variants of `LiveMoment` or sibling
    components driven by moment `kind`/curator metadata.
13. **Affordance labels** — the template action row is **Reply · Share · Save/Saved**; the impl row is
    **Spark (disabled) · Save**. Add **Reply** and **Share** actions (or honestly disable any not
    wired), and keep **Save/Saved** with the `--color-positive` on-state. **W1:** do not add
    like/comment/repost **counts** — `PostCounts` must stay off Today feed cards (it is world-directed
    reception only, per ADR-011; the template shows none on Today).
14. **Curator moments** — add the two accent-tinted cards: **"A conversation worth joining"**
    (with the represented-momentum line "active now · … are here") and **"From a community you're
    in"** ("Indie Makers" → "Step in" door, no affordance row). Honestly labelled, relationship-
    justified (L11).
15. **Bounded end** — expand the current `.t-caughtup` to the template's end block: short hairline
    rule + check glyph + **"That's today. You're all caught up."** + **"Nothing more is waiting. The
    rest of the evening is yours."** + a ghost pill **"Look around Discover"** → `/discover`.
16. **Context column** — build the `<aside aria-label="Your world">` with the four living blocks
    (People close to you / Continue / Across your world / Communities active today) + the open-web
    reassurance panel, and the **resting** variant. All content is world-directed, softened,
    non-leaderboard (ADR-012). Ghost links route: See your people → `/people`; both Discover links →
    `/discover`; Learn how it works → the connectivity/education surface (`ConnectivityPanel`).
17. **Mobile lens row** — add the `role="radiogroup"` segmented control **For You · Following · Local ·
    Trending** above the digest (mobile only). Reuse the existing `.t-segmented` styling. **W1:** if
    lenses aren't backed by distinct data, make the three inactive lenses honestly inert.
18. **SourceNote / honesty** — keep `SourceNote` (live / cached / sample). The masthead source caption
    and avatar stack are decorative; the honest data-mode note stays. Discover-style "sample
    suggestions" honesty is preserved elsewhere; Today's sample fallback copy stays as-is (W1).

**Motion / a11y**
19. Ensure `prefers-reduced-motion` neutralizes `t-fade` and all card/nav transitions (W4). Verify AA
    on `--color-text-tertiary`, accent-subtle, and on-media pairings.

---

## F. New design tokens needed (names already canonical in tokens.md; missing from `theme.css`)

These are used pervasively by the template but are **not yet defined** in
`client/src/design/theme.css`. Add them (values from `docs/10-design/tokens.md`) so the build stays
token-only (W3). None are new *names* — they complete the implemented set:

- Layout: `--rail-width` (250px), `--context-width` (320px), `--feed-measure` (= `--measure-reading`),
  `--gutter` (= `--space-6`), `--canvas-max` (1440px), `--topbar-height` (56px),
  `--tabbar-height` (72px), `--fab-size` (56px), and z-index tokens `--z-content` (20), `--z-nav` (30),
  `--z-fab` (31) (also `--z-base`, `--z-sheet`, `--z-modal`, `--z-toast`).
- Type completeness: `--leading-tight/-snug/-normal/-relaxed`, `--tracking-tight/-normal/-wide`.
- Border/icon/alpha: `--border-hairline` (1px), `--border-strong` (1.5px), `--icon-inline/-sm/-md/-lg`,
  `--alpha-disabled/-hover/-pressed/-scrim`.
- Media/scrim: `--scrim-media`, `--scrim-media-strong`, `--scrim-caption`, `--on-media`,
  `--media-shadow`, `--dot-presence` (8px), `--overlap-avatar` (-8px), `--ratio-square/-photo/-video/
  -portrait/-banner`.
- Atmosphere (Stage-6, ADR-016): `--glow-ambient`, `--surface-gradient`, `--edge-highlight`,
  `--glow-accent`, `--media-vignette` — including their `[data-theme="light"]` re-tunes.

(`--glow-accent` is already referenced with a fallback in `app.css` line 141; promote it to a real
token.) Breakpoint tokens `--bp-sm/-md/-lg/-xl/-2xl` are also referenced by the token system and
should back the media queries.

---

## G. Whitelisted deviations applied here (do NOT "fix" these to match the template literally)

- **W1 honesty:** Rail/mobile **Search** honestly disabled (unbuilt). **Composer** entry opens a
  not-yet-publishing preview, not a real publisher. Mobile **lens** switching honestly inert if not
  data-backed. Rail handle **"@renato"** is local-not-federated — no federated-address claim. **Spark**
  and **Follow** remain honestly disabled. Sample-content fallback keeps its honest SourceNote. No
  per-card reception **counts** on Today (ADR-011). The "connected across the open social web" panel is
  an educational line, not a live federation ticker (ADR-012).
- **W3:** semantic tokens only (no raw hex/px in components); the template's raw avatar gradient fills
  are decorative placeholders — real avatars come from data, so they are not literal-value gaps.
- **W4:** reduced-motion static fallback + AA contrast on all text/scrim pairings.
- **W5:** no protocol words in UI copy. Product/place names (Mastodon, Pixelfed, PeerTube, WriteFreely,
  tacet.social, pixel.town, write.as, lemmy.ml) are allowed as human-place provenance.
- **Type is LOCKED:** ignore the template's Jost/Space Mono webfonts; keep Hanken Grotesk +
  Spline Sans Mono via `--font-sans` / `--font-mono`. This is intended, not a gap.
```
