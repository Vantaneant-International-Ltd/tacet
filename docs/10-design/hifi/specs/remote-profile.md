# Remote Profile — fidelity spec

Surface: a remote person's profile, read inside Tacet (route `/p/:actor`, `Profile.tsx`).
Templates: `docs/10-design/hifi/handoff/Remote Profile Desktop.html`, `Remote Profile Mobile.html`.
Impl to conform: `client/src/app/screens/Profile.tsx`, `client/src/app/ProfileView.tsx` (shared header/About).
Shared card: `client/src/app/live.tsx` (`LiveMoment`, `SourceBadge`). Shell: `client/src/app/AppShell.tsx`.

Scope note (FENCED): this surface is **visual only**. Live hydration/sync of a remote
profile is fenced to session 3. Render whatever cached data we have plus a calm
"the full profile loads as Tacet syncs" state. **Never** show an error box on this
surface — the current `EmptyState "Couldn't open this profile"` is removed (Gap 12).

Type system is LOCKED to Hanken Grotesk + Spline Sans Mono. The template's `Jost` /
`Space Mono` are ignored on purpose; `--font-sans` / `--font-mono` already resolve to
the locked pair in `theme.css`.

> **Token reality (corrected).** Many `--*` names used inline in the template are **NOT
> defined** anywhere in `client/src/design/*` or `app.css`. The template's design-system
> variables must be either **added to `theme.css` as semantic tokens (W3)** or **mapped to
> the nearest existing token**. See §4 for the exact split of *exists* vs *missing*. Do
> **not** assume 1:1 name parity — most of the effect/typography/layout tokens are absent
> today and several are only referenced via inline `var(--x, fallback)` in `app.css`.

---

## 1. Desktop layout — the 3-column canvas

The template is a **three-column** page. The current app shell (`AppShell.tsx` /
`app.css` `.t-app`, `grid-template-columns: 250px 1fr`) is only **two** columns and has
no right context column. This surface introduces the third column.

```
┌─────────────┬──────────────────────────────┬────────────────────┐
│ LEFT RAIL   │ CENTRE FEED                  │ CONTEXT COLUMN     │
│ 250px       │ minmax(0, 42rem)             │ 320px              │
│ (AppShell)  │ profile header + moments     │ About this person  │
└─────────────┴──────────────────────────────┴────────────────────┘
```

Structural truth from the template:

- Outermost container is a **flex row** whose `min-width` is
  `calc(var(--rail-width) + var(--measure-reading) + var(--context-width) + 2*--gutter + 2*--space-6)`.
- **Left rail** = `<nav aria-label="Primary">`, `position:sticky; top:0; height:100vh;
  flex:none; width:var(--rail-width)` (250px), with a `linear-gradient` surface→canvas
  background and a right hairline. It carries: brand **"tacet"** (with a soft accent glow
  behind), a **Search** control (`⌘K`, "Search people, communities, conversations"), the
  five pillars **Today · People · Discover · Conversations · Me** (desktop rail says
  **"Conversations"**, not "Chats"), a compose action, and a me-footer. **The rail is the
  existing `AppShell` `.t-rail` and is out of scope for this surface** — do not re-build it,
  and do not add the `⌘K` Search box here (that is a shell pass, Gap 13).
- **Centre feed** — `<main>` is itself a **2-col grid**:
  `grid-template-columns: minmax(0, var(--measure-reading)) var(--context-width);
  gap: var(--gutter); justify-content:center; padding:0 var(--space-6)`. Column 1 is the
  profile `<section aria-label="Jonas Vold">` (header → Recent moments → home footer),
  `padding:var(--space-8) 0 var(--space-9)`.
- **Context column** — column 2 of that grid: a single `<aside aria-label="About this
  person">`, `align-self:start`, left-separated by a hairline
  (`border-left:var(--border-hairline) solid color-mix(in srgb, var(--color-hairline) 70%, transparent)`),
  `padding:var(--space-8) 0 var(--space-9) var(--space-6)`. Holds four modules (About /
  You both follow / Their communities / cross-web note).

The context column exists only at desktop width. On mobile the aside content is **dropped
entirely** (the mobile template renders none of it) — do **not** stack it under the feed.

---

## 2. Mobile layout — top bar + tab bar

- **Top bar** — `<header>`, `position:sticky; top:0; z-index:var(--z-content);
  height:var(--topbar-height)`, background
  `color-mix(in srgb, var(--color-surface) 92%, var(--color-canvas))` (**solid, no
  glass/blur**), bottom `--color-hairline` hairline. Contents, left-aligned:
  a **Back** button (`aria-label="Back"`, 44×44, chevron-left `[icon]`, ghost — `background:none`,
  `color:var(--color-text-secondary)`, hover `surface-sunken`), then the person's name
  **"Jonas Vold"** as a plain `<span>` title at `--text-subheading`, weight 500.
  This is profile-specific: the shell default top bar is brand-only. The title is
  **left-aligned next to Back**, not centred.
- **Tab bar** — `<nav aria-label="Primary">`, `position:sticky; bottom:0;
  z-index:var(--z-nav); height:var(--tabbar-height); display:grid;
  grid-template-columns:repeat(5,1fr)`. Order is **Today · People · [New FAB] · Discover ·
  Chats**. Each pillar is a column-flex link, icon + `--text-micro` label, weight 500.
  The **New** compose control is a centre-column FAB: `<button aria-label="New">`,
  `width/height:var(--fab-size)`, `margin-top:calc(-1 * var(--space-5))` (lifted above the
  bar), accent gradient
  (`linear-gradient(180deg, var(--color-accent-hover) 0%, var(--color-accent) 100%)`),
  `box-shadow:var(--glow-accent), var(--elevation-2)`. The mobile template labels the 5th
  pillar **"Chats"** (not "Conversations").
  NOTE: the current shell uses a 5-item tab bar labelled **"Conversations"** with a
  **separate floating `.t-fab`** bottom-right. Reconciling label + FAB placement is a
  shell-wide change — for THIS surface do **not** regress the shell (Gap 13, flag only).
- Feed content = header → Recent moments → home footer, at the reading measure, no aside.

---

## 3. Sections / modules, in order

### Centre feed (desktop + mobile)

1. **Profile header** — `<section aria-label="Jonas Vold">`
   - **Banner** — `<div role="img" aria-label="Banner — the quay at dawn">`,
     `aspect-ratio:var(--ratio-banner)` (3/1), desktop `border-radius:var(--radius-lg)`,
     `box-shadow:var(--media-vignette), var(--elevation-1)`. (Mobile banner is full-bleed:
     no radius, same ratio + vignette.) When no banner exists, collapse gracefully.
   - **Avatar + action row** — a flex row overlapping the banner bottom
     (`margin-top:calc(-1 * var(--space-6))` desktop / `--space-5` mobile). Avatar is
     **96px** desktop / **80px** mobile, `--radius-full`, ring
     `box-shadow:0 0 0 4px var(--color-canvas), var(--elevation-2)`. A spacer (`flex:1`)
     pushes the two action buttons to the right:
     - **Message** — ghost pill: `background:none; color:var(--color-text-secondary);
       border:none; border-radius:var(--radius-full); font-size:var(--text-label);
       font-weight:500; padding:var(--space-2) var(--space-4)`; hover
       `color:var(--color-text-primary); background:var(--color-surface-sunken)`.
       **Dead in template → honestly disabled** (`disabled`, `title="Coming soon"`,
       `aria-label="Message — coming soon"`).
     - **Follow** — accent pill: `background:linear-gradient(180deg,
       var(--color-accent-hover) 0%, var(--color-accent) 100%);
       color:var(--color-on-accent); border-radius:var(--radius-full);
       box-shadow:var(--glow-accent); padding:var(--space-2) var(--space-5)`; hover
       `filter:brightness(1.06)`. Following is **not wired** (read-only milestone; same as
       `LivePerson`'s Follow) → **honestly disabled** (`disabled`, `title="Coming soon"`).
   - **Name row** — flex, gap `--space-3` (desktop) / `--space-2` (mobile), `flex-wrap`:
     - `<h1>` **"Jonas Vold"**, `font-size:var(--text-title)`, weight 500,
       `letter-spacing:var(--tracking-tight)`, `line-height:var(--leading-tight)`.
     - **Source chip** — inline `<span>`: small glyph + product name **"Pixelfed"**.
       `background:var(--color-surface-sunken)`, hairline border,
       `border-radius:var(--radius-sm)`, `font-size:var(--text-micro)`, weight 500,
       `letter-spacing:var(--tracking-wide)`, `color:var(--color-text-tertiary)`. Reuse
       `SourceBadge`; product name only, never a protocol word (W5).
   - **Handle + home line** — `<div>`, `font-family:var(--font-mono)`,
     `color:var(--color-text-tertiary)`, `margin-top:var(--space-2)`. **Desktop** size
     `--text-meta`: **"@jonas@pixel.town · lives at pixel.town, a home for
     photographers"**. **Mobile** size `--text-micro`, shortened: **"@jonas@pixel.town ·
     lives at pixel.town"**. (In the template the whole line is one mono string; when
     splitting, keep the `@handle` mono and the "lives at …" clause may stay mono too, per
     template — do not force a sans/secondary split.)
   - **Bio** — `<p>`, `margin-top:var(--space-3)`, `color:var(--color-text-secondary)`,
     `font-size:var(--text-body-sm)`, `line-height:var(--leading-relaxed)`; desktop
     `max-width:36rem`. **Desktop:** "Street and harbour photography, one roll a month.
     Prints sometimes. The quay, mostly." **Mobile drops "Prints sometimes.":** "Street
     and harbour photography, one roll a month. The quay, mostly."
   - The template header shows **no follower/following/post counts and no
     joined/website/location fact row** in the centre column. Those quiet facts live in the
     context-column "About Jonas" module (desktop) and are simply absent on mobile. Keep the
     header calm (ADR-012, "your world, never your score").

2. **Recent moments** — a **labelled hairline rule**, then `<article>` cards
   - The section marker is **NOT an `<h2>` heading**. It is a small inline label + a
     hairline rule: a flex row of `<span>` **"Recent moments"** (`font-size:var(--text-micro)`,
     weight 500, `letter-spacing:var(--tracking-wide)`, `color:var(--color-text-tertiary)`)
     followed by `<span aria-hidden="true">` that is a `flex:1` hairline
     (`height:var(--border-hairline); background:color-mix(in srgb, var(--color-hairline) 60%, transparent)`).
     The moment stack is `display:flex; flex-direction:column; gap:var(--space-6)` (desktop)
     / `--space-4` (mobile).
   - **Moment card 1** — a photo card. Media is a 3-up mosaic:
     `display:grid; grid-template-columns:1.6fr 1fr; grid-template-rows:1fr 1fr;
     gap:var(--space-1)`, one tall image spanning both rows + two square images
     (`aspect-ratio:var(--ratio-square)`). `role="img"` per tile: "The quay at first
     light" / "A dark street, one window lit" / "Moss on the harbour wall". Below, in a
     `padding:var(--space-5)` (desktop) / `--space-4` (mobile) body: caption `<p>`
     `font-size:var(--text-body)`, `line-height:var(--leading-relaxed)` — desktop **"Morning
     walk, before the street woke up. Three frames from the quay."**, mobile **"Morning
     walk, before the street woke up."** — then a mono meta line
     `font-family:var(--font-mono); font-size:var(--text-meta);
     color:var(--color-text-tertiary)` reading **"Photos · 4:40 pm"**.
   - **Moment card 2** — a single photo. `role="img" aria-label="Harbour in fog"`,
     `aspect-ratio:var(--ratio-photo)`, `box-shadow:var(--media-vignette)`. **Desktop
     only:** a caption scrim overlaid at the bottom of the photo
     (`background:var(--scrim-caption)`, mono text `color:var(--on-media)`,
     `text-shadow:var(--media-shadow)`) reading **"Fog holds the harbour until nine."**.
     **Mobile omits the scrim caption** — the photo carries no overlaid text. Below, in the
     body: mono meta line **"Photo · Monday"** (no caption on mobile).
   - **Card chrome** (both cards): `background:var(--surface-gradient)`, border
     `var(--border-hairline) solid color-mix(in srgb, var(--color-hairline) 60%, transparent)`,
     `border-radius:var(--radius-lg)`, `box-shadow:var(--elevation-1), var(--edge-highlight)`,
     `overflow:hidden`.
   - The template moment cards show **no per-card author link, no per-card source badge, and
     no Spark/Save action row** — author is implicit (it is this person's profile) and the
     meta is media-kind + friendly time, not the handle+relative-time `Identity` line. See
     Gap 6.

3. **Home footer** (end of feed)
   - Centred block (`text-align:center; padding:var(--space-6) 0 0` desktop / `--space-4`
     mobile):
     - Quiet line `<div>` `font-size:var(--text-body-sm); color:var(--color-text-tertiary)`:
       **"Older moments live at their home on pixel.town."** (desktop and mobile).
     - Link **"Visit their home"** → the person's canonical home URL (`person.url`), opens
       in a new tab (`target="_blank" rel="noreferrer noopener"`), with a trailing
       external-link glyph. Style: `display:inline-flex; align-items:center;
       gap:var(--space-2); margin-top:var(--space-3); color:var(--color-accent-hover);
       font-size:var(--text-label); font-weight:500`.
   - This is the honest boundary: Tacet shows recent cached moments; the full archive lives
     at the source. It doubles as the FENCED "full profile loads as Tacet syncs" framing (§5).

### Context column (desktop only) — `<aside aria-label="About this person">`

Four modules, each a block with `margin-bottom:var(--space-7)` (last is a card), in order:

4. **About &lt;FirstName&gt;** — `<h2>` **"About Jonas"** (`font-size:var(--text-heading)`,
   weight 500, `line-height:var(--leading-snug)`, `margin:0 0 var(--space-4)`), then `<p>`
   `font-size:var(--text-body-sm); line-height:var(--leading-relaxed);
   color:var(--color-text-secondary)`: **"Lives at pixel.town — a small, careful photography
   community on the open web. Posting since 2023."** ("pixel.town" is a mono inline span,
   `font-family:var(--font-mono); font-size:var(--text-meta)`). This is where home,
   community description and "since" live — the calm equivalent of the header fact row.

5. **You both follow** — `<h2>` **"You both follow"** (same h2 style), then a flex row: an
   overlapping trio of 28px avatar circles (`margin-left:var(--overlap-avatar)`, each ringed
   `0 0 0 2px var(--color-canvas)`) + `<span>` **"Mara, Alex and Tobi"**
   (`font-size:var(--text-body-sm); color:var(--color-text-secondary)`). This is relational
   context (shared follows), never a follower count. **Data is not wired** (no mutuals source
   in `openweb.ts` `Person`) → **omit this whole module when there is no mutuals payload**.
   Do NOT fabricate mutuals against a real person (W1). Prefer: render only when the profile
   payload actually carries mutuals; otherwise drop the module (calm absence, not an empty box).

6. **Their communities** — `<h2>` **"Their communities"** (same h2 style), then a row: a
   36px avatar circle + a two-line body — `<div>` **"Slow Photography"**
   (`font-size:var(--text-label); font-weight:500; line-height:var(--leading-snug)`) over
   `<div>` **"a community on pixel.town"** (mono, `font-size:var(--text-micro);
   color:var(--color-text-tertiary)`). Same rule: **render only from real payload data;
   otherwise omit** the module. `Person` has no communities field today → omit until wired.

7. **Cross-web note** (bottom of aside) — a soft accent card:
   `padding:var(--space-5); background:linear-gradient(160deg, color-mix(in srgb,
   var(--color-accent-subtle) 80%, var(--color-surface)) 0%, var(--color-surface) 75%);
   border:var(--border-hairline) solid color-mix(in srgb, var(--color-accent) 16%,
   var(--color-hairline)); border-radius:var(--radius-lg); box-shadow:var(--elevation-1),
   var(--edge-highlight)`. Contents:
   - Line `<div>` `font-size:var(--text-body-sm); color:var(--color-text-secondary)`: a
     small positive presence dot (`width/height:var(--dot-presence); --radius-full;
     background:var(--color-positive)`; glow) + **"You're connected across the open social
     web."**
   - Link **"Learn how it works"** (accent, `--text-label`, weight 500, trailing glyph) →
     the existing explainer/help surface if one exists; **if none exists, honestly disable**
     it (do not invent a page). W1.

---

## 4. Semantic tokens — EXISTS vs MISSING (map or add per W3)

**Already defined in `theme.css` — use directly (verified present):**
`--font-sans`, `--font-mono`; type `--text-title`, `--text-subheading`, `--text-heading`,
`--text-body`, `--text-body-sm`, `--text-label`, `--text-meta`, `--text-micro`; spacing
`--space-0`…`--space-9`; `--measure-reading` (42rem); radius `--radius-xs/sm/md/lg/full`;
colour `--color-canvas`, `--color-surface`, `--color-surface-raised`,
`--color-surface-sunken`, `--color-hairline`, `--color-text-primary/secondary/tertiary`,
`--color-accent`, `--color-accent-hover`, `--color-accent-subtle`, `--color-on-accent`,
`--color-positive`, `--color-focus-ring`; `--elevation-1/2/3`; motion `--dur-1`,
`--ease-out`.

**NOT defined anywhere in `client/src/design/*` or `app.css` — the template relies on these
but they are missing today. Each must be ADDED to `theme.css` as a semantic token (W3), or
mapped to the nearest existing token. `app.css` currently references some only via inline
`var(--x, fallback)` (e.g. `--glow-accent`, `--border-hairline`, `--leading-relaxed`),
which silently no-ops.** Grouped:

- **Layout vars:** `--rail-width` (=250px), `--context-width` (=320px), `--gutter`
  (feed↔aside gap), `--topbar-height`, `--tabbar-height`, `--fab-size`. These can be plain
  literals in the grid/shell rules rather than global tokens, but `--gutter`,
  `--topbar-height`, `--tabbar-height`, `--fab-size` should be defined once (shell pass).
- **Ratios:** `--ratio-banner` (3/1), `--ratio-square` (1/1), `--ratio-photo` (≈4/3 or the
  chosen photo ratio). Add to `theme.css`.
- **Typographic detail:** `--tracking-tight`, `--tracking-wide`, `--leading-tight`,
  `--leading-snug`, `--leading-normal`, `--leading-relaxed`. Add these (the design-system
  docs define the scale; theme.css currently omits them and code hard-codes `line-height`
  values like `1.55`).
- **Surface/effect:** `--surface-gradient` (card fill), `--edge-highlight` (card top
  highlight), `--media-vignette` (banner/photo inner shadow), `--scrim-caption` (photo
  caption scrim), `--on-media` (text on media), `--media-shadow` (text shadow on media),
  `--glow-accent` (accent button/FAB glow). Add to `theme.css` as semantic tokens.
- **Micro:** `--overlap-avatar` (negative margin for stacked avatars), `--dot-presence`
  (presence-dot size), `--border-hairline` (hairline width, e.g. 1px), `--z-content`,
  `--z-nav` (z-index scale). Add to `theme.css`.

> The prior version of this spec claimed "No new tokens are required" and "the same names
> already in theme.css — map 1:1". **That is incorrect** and is superseded by this section:
> the effect, ratio, tracking/leading, and several layout tokens are genuinely absent and
> must be added (W3, no raw hex/inline magic values in components) or mapped.

---

## 5. FENCED / honest states (this surface renders, never errors)

- **Cached / partial** (default, session-2): render header + whatever cached moments exist,
  then the honest home footer. If the profile is only partially present, show a single calm
  line **"The full profile loads as Tacet syncs."** (`--color-text-secondary`, no icon, no
  red, no spinner). This replaces the current `Loading label="Opening profile"` spinner
  text on this surface.
- **No moments yet cached** — a calm note, not an error:
  **"No recent moments cached yet — the full profile loads as Tacet syncs."** Use a
  `.t-caughtup`-style calm block (neutral tone), never `EmptyState icon="today" title="No
  public posts to show"`.
- **Never an error box** — fetch failure falls back to the calm sync line, never
  `EmptyState icon="people" title="Couldn't open this profile"` (that block is removed here).

---

## 6. Interaction behaviors + honestly-disabled controls

- **Message** — disabled, `title="Coming soon"`, `aria-label="Message — coming soon"` (dead
  in template).
- **Follow** — disabled, `title="Coming soon"` (read-only milestone; consistent with
  `LivePerson`'s disabled Follow).
- **Visit their home** — live external link to `person.url`, new tab
  (`target="_blank" rel="noreferrer noopener"`).
- **Back** (mobile top bar) — `history.length > 1 ? history.back() : navigate("/people")`
  (matches existing `.t-profileback` behaviour).
- **Per-moment cards** — no Spark/Save row per template (author implicit). If, for engineering
  reasons, `LiveMoment` is reused, Save stays live and Spark stays disabled "Coming soon" as
  an honest superset — but prefer the profile-context variant that hides the action row and
  author link (Gap 6).
- **"Learn how it works"** — link to the existing explainer if one exists; otherwise honestly
  disable. Do not invent a page.
- **"You both follow" / "Their communities"** — data-gated: render only from real payload,
  otherwise omit the whole module (no fabricated relationships).
- All controls: AA contrast (W4), visible `:focus-visible` ring (global in theme.css),
  reduced-motion static (global). The template's `style-hover`/`style-focus` map to CSS
  `:hover`/`:focus-visible`.

---

## 7. Whitelist compliance

- **W1 (honesty):** error/empty "Couldn't open this profile" removed for the calm sync line;
  Message + Follow honestly disabled; mutuals/communities modules data-gated, not faked; home
  footer keeps the true "full archive lives at their home" boundary; "Learn how it works"
  disabled if no explainer exists.
- **W3:** semantic tokens only — the missing tokens in §4 are **added to `theme.css`** (or
  mapped), never inlined as raw hex/magic values in components.
- **W4:** reduced-motion static, AA contrast.
- **W5:** product names "Pixelfed" / "pixel.town" are fine; no protocol words in UI copy.

---

## 8. GAP LIST — concrete edits to conform current impl

Ordered by impact.

1. **Add the missing design tokens (BLOCKING, do first).** §4's "MISSING" set
   (`--ratio-banner`, `--ratio-square`, `--ratio-photo`, `--surface-gradient`,
   `--edge-highlight`, `--media-vignette`, `--scrim-caption`, `--on-media`, `--media-shadow`,
   `--glow-accent`, `--tracking-tight/wide`, `--leading-tight/snug/normal/relaxed`,
   `--overlap-avatar`, `--dot-presence`, `--border-hairline`, `--z-content`, `--z-nav`, plus
   layout `--gutter`, `--context-width`, `--rail-width`, `--fab-size`, `--topbar-height`,
   `--tabbar-height`) is **not defined** today. Add them to `theme.css` (light + dark peers
   where colour-bearing) before styling this surface — otherwise the template's card/banner
   fills, vignettes and accent glow silently collapse. (This corrects the earlier claim that
   no new tokens were needed.)

2. **Add the third (context) column.** `Profile.tsx` currently renders a single
   `.t-screen--reading` centre column. Introduce a per-surface layout: `<main>` becomes a
   2-col grid `minmax(0, var(--measure-reading)) var(--context-width)` (gap `--gutter`,
   `justify-content:center`), with the profile `<section>` in col 1 and
   `<aside aria-label="About this person">` in col 2. Collapse to single-column (no aside)
   below the desktop breakpoint. Do not modify the shell rail; the rail stays the shell's
   `.t-rail`.

3. **Remove the tab strip.** `Profile.tsx` renders `.t-tabs` with Posts/Media/About pills +
   `useState<Section>`. The template has **no tabs** — one inline "Recent moments" list, with
   About moved to the aside. Delete the tab state, `.t-tabs`, the `Media` gallery view, and
   the in-feed `About` render.

4. **Replace the "Posts" list with a labelled "Recent moments" rule.** Not an `<h2>` heading:
   a small `--text-micro` uppercase-tracking label + a `flex:1` hairline rule (§3.2). Cap to
   the recent set (template shows 2 cards) and follow with the home footer — not an infinite
   feed.

5. **Add the header action row (Message + Follow), both honestly disabled.** Current
   `ProfileHeader` (`ProfileView.tsx`) has only a "View original" text link. Add the two pill
   buttons per §3.1 (Message = ghost disabled; Follow = accent gradient disabled), in a flex
   row that overlaps the banner bottom, right-aligned via a `flex:1` spacer next to the
   avatar. Fold the old "View original" exit into the "Visit their home" footer (Gap 8) to
   avoid duplicate exits.

6. **Suppress header counts + fact row on this surface.** `ProfileHeader` renders
   follower/following/post **counts** (`.t-phead__counts`) and a website/location/joined
   **fact row** (`.t-phead__facts`, `.t-phead__meta`). The template header shows none of
   these. Hide them on the remote-profile surface (keep the shared component's other uses
   intact) and render the home/"since" prose in the aside "About Jonas" module instead.

7. **Profile-context moment cards.** Reusing `LiveMoment` renders a per-card author `Link` +
   `SourceBadge` head and a Spark/Save action row — all redundant/absent per template. Add a
   `context="profile"` variant (or `hideAuthor` + `hideActions` props) that suppresses the
   author link, the source badge, and the action row. Keep the media grid and swap the
   `Identity` (handle · relative time) line for the media-kind meta line below (Gap 8a).

8. **Add the media-kind meta line.** Under each profile moment, render a mono
   `--text-meta`/`--color-text-tertiary` line of the form **"&lt;Photo|Photos|Video&gt; ·
   &lt;friendly time&gt;"** ("Photos · 4:40 pm", "Photo · Monday") — not the `Identity`
   line. Friendly time = clock time for today, weekday for this week, else date.

9. **Add the home footer.** New centred block after the moments: line **"Older moments live
   at their home on &lt;home&gt;."** + accent link **"Visit their home"** → `person.url`
   (new tab, trailing external glyph). This is the single, honest exit — it replaces the
   header's "View original".

10. **Add the context-column modules** ("About Jonas" prose, "You both follow", "Their
    communities", cross-web note) per §3.4–7. **Data-gate** mutuals + communities: `Person`
    in `openweb.ts` has no `mutuals`/`communities` fields, so render those two modules only
    when a real payload carries them; otherwise **omit** (calm absence). "About Jonas" +
    cross-web note render from existing `source`/home data; "Learn how it works" honestly
    disabled if no explainer route exists.

11. **Mobile top bar = Back + person name.** The shell `.t-topbar` is brand-only. On a remote
    profile, mobile must show Back + the person's name (`--text-subheading`, weight 500,
    left-aligned next to Back). Prefer letting the profile screen render its own in-content
    sticky top bar for mobile (option a) over adding a shell title slot, to avoid shell churn;
    reuse the existing `.t-profileback` back affordance behaviour.

12. **Banner uses the ratio, not a fixed height.** `.t-phead__banner` is `height:8.5rem`
    today. Change to `aspect-ratio:var(--ratio-banner)` (3/1) with `--radius-lg` top (desktop;
    full-bleed square on mobile) and `--media-vignette`. Avatar is 96px desktop / 80px
    mobile with the `0 0 0 4px var(--color-canvas), var(--elevation-2)` ring.

13. **Remove the error/empty states here.** Replace `Loading label="Opening profile"`,
    `EmptyState "Couldn't open this profile"`, and the empty "No public posts" block with
    the calm FENCED states in §5. Never render an error box on this surface.

14. **Copy-diff desktop vs mobile (must differ):** mobile drops the bio sentence "Prints
    sometimes.", shortens the handle line to "@jonas@pixel.town · lives at pixel.town",
    shortens card-1 caption to "Morning walk, before the street woke up.", **omits card-2's
    scrim caption "Fog holds the harbour until nine."**, and drops the entire context column.
    Handle line is `--text-meta` on desktop, `--text-micro` on mobile.

15. **FLAG (do not silently diverge) — tab-bar label + compose FAB.** Template labels the 5th
    mobile pillar **"Chats"** and centres the New FAB inside the tab bar (`margin-top:-space-5`);
    the current shell says **"Conversations"** and floats a separate `.t-fab` bottom-right.
    This is a shell-wide decision, not remote-profile-local. Record the delta; do **not**
    change the global shell as part of this surface unless the shell pass adopts it.

16. **Fonts stay LOCKED.** Confirm the surface inherits `--font-sans: Hanken Grotesk` /
    `--font-mono: Spline Sans Mono`. Ignore the template's Jost / Space Mono `@font-face`.
