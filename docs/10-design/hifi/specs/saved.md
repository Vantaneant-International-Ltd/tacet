# Saved — fidelity spec

Conformance target for the **Saved** surface. Source of truth: `docs/10-design/hifi/handoff/Saved Desktop.html` + `Saved Mobile.html`. Current impl: `client/src/app/screens/Me.tsx` (Saved section + Collections + Recent), `client/src/app/SavedCard.tsx`, `client/src/app/me.ts`, rendered inside `client/src/app/AppShell.tsx`.

Type system is LOCKED: **Hanken Grotesk + Spline Sans Mono** (the templates ship Jost/Space Mono — ignore; our vendored kit is the one type system per `theme.css`). All tokens below are semantic (W3). Reduced-motion + AA contrast honoured (W4). No protocol words in UI copy (W5). Honesty carve-outs are called out inline (W1).

---

## 0. Where Saved lives

The template ships **Saved** as a **standalone full-screen surface** — its own masthead ("Your keeps."), its own tabs (Saved / Collections / Reading Later), the rail's **Me** pillar marked `aria-current="page"`, and on mobile a **back button + "Saved" title** (Saved is reached *from* Me, so the mobile top bar is a detail-view bar, not the app chrome).

Current impl renders Saved as the **default tab of the `/me` screen** (`Me.tsx`, `section = "saved"`), stacked *below* the ProfileCard + ConnectivityPanel + AppearanceControl, inside the single-column `t-main` (there is **no context column** in the shell). This is the central architectural gap. See §5.

Decision for this build: **keep Saved as a sub-view of `/me`** (do not add a new route), but conform the Saved sub-view's *layout, masthead, tab set, card grid, and context column* to the template. The context column is introduced as a real, reusable shell region (see §5.1).

---

## 1. Desktop layout — the 3-column canvas

Overall: `--color-canvas` + `--glow-ambient` background image (no-repeat), text `--color-text-primary`, `--font-sans`, weight 400, `--text-body`, `--leading-relaxed`.

Three columns, centred, min-width `calc(--rail-width + --measure-reading + --context-width + 2*--gutter + 2*--space-6)`:

### 1.1 Left rail — 250px (`--rail-width`)
Shared app chrome (already built in `AppShell.tsx`; matches the template's rail). Verify against template:
- Sticky, full-height, `linear-gradient(180deg, surface→canvas)`, hairline right edge.
- Wordmark **tacet** (`--text-title`, weight 500, `--tracking-tight`) with the accent lamp glow radial behind it.
- **Search** trigger row (`role="button"`, "Search", trailing mono `⌘K` chip). *Current shell has no search row — see gap G12; if not built, it must be honestly disabled/omitted, not a dead affordance.*
- Five pillars in order **Today · People · Discover · Conversations · Me**, each `--radius-md`, `--text-label`, weight 500. Conversations carries the accent **presence dot** (`--dot-presence`, glow) — never a count. **Me is the active pillar** here: accent-subtle gradient pill + `box-shadow: var(--edge-highlight)` + `--color-accent` text + `aria-current="page"`.
- **New** compose button — accent gradient (`accent-hover→accent`), `--color-on-accent`, `--glow-accent`, pencil glyph, label "New".
- Foot: 36px avatar (radial gradient placeholder), display name (`--text-label`/500) + mono `@handle` (`--text-micro`, `--color-text-tertiary`), theme toggle (44×44 icon button, sun/moon).

### 1.2 Centre feed — `minmax(0, 42rem)` (`--measure-reading`)
`<section aria-label="Saved">`, padding `--space-8 0 --space-9`. Order:

1. **Masthead header** (`margin-bottom: --space-7`)
   - **Eyebrow**: positive-color row — a 13×13 filled bookmark glyph (`path d="M6 4h12v16l-6-4-6 4z"`, `fill=currentColor`) + text **"Saved · kept for yourself"** in `--color-positive`, `--text-micro`, weight 500, `--tracking-wide`.
   - **h1** "Your keeps." — `--text-display`, weight 400, `--tracking-tight`, `--leading-tight`, `margin: --space-3 0 0`.
   - **Subhead** "Moments you chose to hold on to. No one else sees this page." — `--color-text-secondary`, `--text-body-sm`, `--leading-relaxed`, `margin: --space-3 0 0`.

2. **Tab row** (`role="tablist"`, hairline bottom border, `gap --space-5`, `margin-bottom --space-6`)
   - **Saved** (active): `aria-selected="true"`, bottom border `--border-strong solid --color-accent` (`margin-bottom:-1px`), text `--color-text-primary`, `--text-label`/500.
   - **Collections**: `aria-selected="false"`, transparent underline, `--color-text-secondary`, hover→primary.
   - **Reading Later**: same inactive style.
   - Only these THREE tabs on this surface (template does not show Pinned / Notes / Recently viewed as tabs here).

3. **Keeps stack** (`display:flex; flex-direction:column; gap --space-6`):
   - **2-col photo keep grid** (`grid-template-columns:1fr 1fr; gap --space-4`), two `<article>` keep tiles:
     - Card chrome: `background: var(--surface-gradient)`, border `--border-hairline solid color-mix(hairline 60%, transparent)`, `--radius-lg`, `box-shadow: var(--elevation-1), var(--edge-highlight)`, `overflow:hidden`.
     - Media: `role="img"`, `aspect-ratio: var(--ratio-square)`, gradient fill placeholder, `box-shadow: var(--media-vignette)`.
     - Body (`padding --space-4`): title `--text-label`/500/`--leading-snug`; mono meta `--text-micro`/`--color-text-tertiary`, `margin-top --space-1`.
     - Tile 1: "Dusk over the old quarter" · aria "Dusk over the old quarter" · meta **"Mara Ito · kept tonight"**.
     - Tile 2: "First light, the quay" · aria "The quay at first light" · meta **"Jonas Vold · kept Monday"**.
   - **Article keep** (`<article>`, `padding --space-5`, same surface-gradient chrome, no media):
     - Title "The maintenance web" — `--text-heading`/500/`--leading-snug`, `margin-bottom --space-2`.
     - Body "The most radical thing a small community can do is keep its corner of the web tended." — `--text-body-sm`/`--leading-relaxed`/`--color-text-secondary`.
     - Mono provenance "Elena Duarte · Article · kept this morning" — `--text-meta`/`--leading-normal`/`--color-text-tertiary`.
   - **"Collections" divider**: label span (`--text-micro`/500/`--tracking-wide`/`--color-text-tertiary`) + hairline rule (`flex:1; height --border-hairline`).
   - **2-col Collections grid** (`1fr 1fr; gap --space-4`), two `<article>` cover cards:
     - Media: `aspect-ratio: var(--ratio-video)` gradient cover, no vignette.
     - Body (`padding --space-4`): name `--text-label`/500; mono "N kept · private" (`--text-micro`/tertiary).
     - Card 1: "Light studies" · **"12 kept · private"**.
     - Card 2: "The slow web" · **"7 kept · private"**.
   - **Footer line** (`text-align:center; padding --space-6 0 0`): "Keeping is private. There is no public list, and nothing here counts toward anything." — `--text-body-sm`/`--color-text-tertiary`.

### 1.3 Context column — 320px (`--context-width`)
`<aside aria-label="Reading later">`, `padding: --space-8 0 --space-9 --space-6`, `align-self:start`, **hairline left border** (`color-mix(hairline 70%, transparent)`) — architectural separator, not a widget card stack. Modules in order:

1. **Reading Later** (`margin-bottom --space-7`)
   - h2 "Reading Later" — `--text-heading`/500/`--leading-snug`, `margin 0 0 --space-4`.
   - One resume card: `flex; gap --space-3; padding --space-4`, surface-gradient chrome + `--elevation-1, --edge-highlight`, `--radius-md`.
     - 56×56 `--radius-sm` gradient thumb.
     - Title "The slow web, and why it's worth it" (`--text-label`/500/`--leading-snug`).
     - Mono "6 min left" (`--text-micro`/tertiary).
     - **"Resume reading"** button — bare, `--color-accent-hover`, `--text-micro`/500, hover underline. Must work or be honestly disabled (G9).

2. **Recently viewed** (`margin-bottom --space-7`)
   - h2 "Recently viewed" (same style).
   - Two rows (`flex; align-items:center; gap --space-3; padding --space-2 0`): 36px round gradient avatar + body (title `--text-label`/500/`--leading-snug` + mono sub `--text-micro`/tertiary).
     - Row 1: "The Internet We Deserve" / **"film · paused at 12:04"**.
     - Row 2: "Indie Makers" / **"community · this evening"**.

3. **Privacy line** (`margin-bottom --space-7`): "Only you can see your keeps. Saving tells no one, ever." — `--text-body-sm`/`--leading-relaxed`/`--color-text-secondary`.

4. **Open-web reassurance panel**: `padding --space-5`, accent-subtle→surface gradient bg, border `color-mix(accent 16%, hairline)`, `--radius-lg`, `--elevation-1 + --edge-highlight`.
   - Positive presence dot (`--dot-presence`, positive glow) + "You're connected across the open social web." (`--text-body-sm`/secondary).
   - **"Learn how it works"** link + arrow glyph — `--color-accent-hover`, `--text-label`/500. Must route somewhere real or be honestly disabled (G10).

---

## 2. Mobile layout

`max-width:430px` centred column, `--color-canvas` + `--glow-ambient`, hairline left/right borders, `flex column`.

### 2.1 Top bar (detail-view bar, NOT app chrome)
`<header>` sticky top, `height: var(--topbar-height)` (56px), `z-index: var(--z-content)`, solid `color-mix(surface 92%, canvas)`, hairline bottom, **no glass/blur**.
- **Back** button (44×44 round icon button, arrow-left glyph) → returns to Me.
- Title span **"Saved"** — `--text-subheading`/500.

### 2.2 Body (`padding var(--space-6) var(--space-4) var(--space-2)` for masthead, then `--space-4 --space-4 --space-6` for the stack)
1. **Masthead** (shorter copy than desktop):
   - Eyebrow "Saved · kept for yourself" (positive, bookmark glyph) — identical treatment.
   - h1 "Your keeps." — **`--text-title`** (not display), weight 500, `--tracking-tight`.
   - Subhead **"No one else sees this page."** (short form) — secondary/`--text-body-sm`.
   - **No tab row on mobile.**
2. **Keeps stack** (`gap --space-4`):
   - 2-col photo grid (`gap --space-3`), tiles with padding `--space-3`, mono meta `margin-top:2px`:
     - "Dusk, old quarter" / **"Mara · tonight"**.
     - "First light, quay" / **"Jonas · Monday"**.
   - Article keep (`padding --space-4`): title **`--text-subheading`**/500, body "The most radical thing a small community can do is keep its corner tended." (short form), mono "Elena Duarte · Article · this morning".
   - "Collections" divider (label + hairline).
   - 2-col Collections grid (`gap --space-3`): "Light studies"/"12 kept · private", "The slow web"/"7 kept · private".
   - Footer line "Keeping is private. Nothing here counts toward anything." (short form) — `--text-body-sm`/tertiary, centred.
   - **No context column on mobile** — Reading Later / Recently viewed / reassurance panel are desktop-only.

### 2.3 Tab bar (app chrome, five pillars)
`<nav>` sticky bottom, `height: var(--tabbar-height)` (72px), `grid repeat(5,1fr)`, solid `color-mix(surface 94%, canvas)`, hairline top. Order in template: **Today · People · [FAB New] · Discover · Chats**.
- The FAB "New" sits in the centre slot: `--fab-size` (56px), `margin-top: calc(-1*--space-5)` (raised), accent gradient, `--glow-accent + --elevation-2`, pencil glyph, `aria-label="New"`.
- **Chats** pillar (rightmost) carries the accent presence dot on the icon (`--dot-presence`, absolute top-right).
- NOTE: the template's mobile tab bar labels the messaging pillar **"Chats"** and has **no visible "Me" tab** (Saved is a Me detail, reached via back). Our shell tab bar (`AppShell.tsx`) is Today/People/Discover/Conversations/Me with a separate FAB. See §5.2 for reconciliation — the honest, low-risk choice is to keep our 5-pillar shell tab bar and NOT restyle it per-surface (the template's centre-FAB tab bar is a shell decision, out of scope for a per-surface build).

---

## 3. Exact human copy (verbatim)

| Slot | Desktop | Mobile |
|---|---|---|
| Eyebrow | `Saved · kept for yourself` | `Saved · kept for yourself` |
| Title | `Your keeps.` | `Your keeps.` |
| Subhead | `Moments you chose to hold on to. No one else sees this page.` | `No one else sees this page.` |
| Tabs | `Saved` / `Collections` / `Reading Later` | (none) |
| Keep 1 title / meta | `Dusk over the old quarter` / `Mara Ito · kept tonight` | `Dusk, old quarter` / `Mara · tonight` |
| Keep 2 title / meta | `First light, the quay` / `Jonas Vold · kept Monday` | `First light, quay` / `Jonas · Monday` |
| Article title | `The maintenance web` | `The maintenance web` |
| Article body | `The most radical thing a small community can do is keep its corner of the web tended.` | `The most radical thing a small community can do is keep its corner tended.` |
| Article provenance | `Elena Duarte · Article · kept this morning` | `Elena Duarte · Article · this morning` |
| Collections divider | `Collections` | `Collections` |
| Collection 1 | `Light studies` / `12 kept · private` | same |
| Collection 2 | `The slow web` / `7 kept · private` | same |
| Footer | `Keeping is private. There is no public list, and nothing here counts toward anything.` | `Keeping is private. Nothing here counts toward anything.` |
| Ctx: Reading Later h2 | `Reading Later` | — |
| Ctx: resume card | `The slow web, and why it's worth it` / `6 min left` / btn `Resume reading` | — |
| Ctx: Recently viewed h2 | `Recently viewed` | — |
| Ctx: recent 1 | `The Internet We Deserve` / `film · paused at 12:04` | — |
| Ctx: recent 2 | `Indie Makers` / `community · this evening` | — |
| Ctx: privacy line | `Only you can see your keeps. Saving tells no one, ever.` | — |
| Ctx: panel line | `You're connected across the open social web.` | — |
| Ctx: panel link | `Learn how it works` | — |

**W1 honesty note:** the template copy above is already honest for Saved (private-by-default, "counts toward nothing", "kept for yourself"). Keep it verbatim. Where our impl fills real data, the *placeholder* strings ("Mara Ito · kept tonight", "12 kept · private", etc.) are sample content — when the section is empty, show honest empty states (§4), never the fabricated samples. Recently viewed / Reading Later that we cannot yet populate must render honest empty/absent states, not the template's fictional rows.

---

## 4. Interaction behaviors & honestly-disabled controls

Every interactive control must WORK or be honestly disabled ("coming soon"). Template controls are static; our impl already has real backing for most.

Working (already backed by `me.ts` API — keep functional):
- **Tabs** Saved / Collections / Reading Later — switch the centre view. Our `SECTIONS` state machine (`Me.tsx`) already does this; trim to the 3 template tabs on this surface (see G3).
- **Keep cards** — per-post actions live in `SavedCard.tsx` (Pin, Later, Note, Collect, Open at source, Remove) — all functional via `api.updateSaved / unsave / add/removeFromCollection`. Keep.
- **Collections** create / open / delete / add-remove items — functional. Keep.
- **Recently viewed** list + **Clear** — functional (`api.listRecent / clearRecent`). Keep. Maps to context-column "Recently viewed".
- **Theme toggle** (rail foot / AppearanceControl) — functional.

Dead in the template → must be real or honestly disabled in our build:
- **G9 · "Resume reading"** (context Reading Later): if we have no resume position, either (a) route to the saved article's `url`, or (b) render the button `disabled` with title "Coming soon". Do NOT ship a no-op.
- **G10 · "Learn how it works"** (reassurance panel link): must point at a real explainer route/anchor, or be omitted. No dead `href="#"`.
- **Rail "Search / ⌘K"** (G12): shell-level; if search isn't built, omit the row rather than ship a dead trigger. (Shell scope — flag, don't necessarily build here.)
- **Mobile FAB "New" / rail "New"** — opens `ComposeSheet` (already wired). Composer remains a **not-yet-publishing preview** (W1) — keep its honest disabled/preview framing.
- **Mobile "Back"** must navigate to `/me` (real history back or `navigate("/me")`).

---

## 5. GAP LIST — edits to conform current impl to template

Ordered most-important first.

**G1 · No context column exists (biggest gap).** The shell (`AppShell.tsx`, grid `250px 1fr`) has no right context column, so the template's `<aside>` (Reading Later, Recently viewed, privacy line, reassurance panel) has nowhere to live. **Introduce a context-column region.** Two options:
  - (a) Shell-level: change desktop grid to `250px minmax(0,42rem) 320px` and let each screen slot an `aside` via a shared layout region — cleanest, matches all other surfaces' README spec. *Preferred but shell-scope.*
  - (b) Screen-local: give the Saved sub-view its own 2-col grid (`minmax(0,42rem) 320px`) inside `t-main`, rendering the aside itself.
  Add tokens `--context-width: 320px`, `--rail-width: 250px` and the aside styles (hairline-left, `padding --space-8 0 --space-9 --space-6`). ConnectivityPanel content ("connected across the open social web") maps into the context-column reassurance panel — reuse it there instead of stacking it at the top of the feed.

**G2 · Missing atmosphere/layout tokens.** The template references tokens absent from `theme.css`/`app.css`. Add to the design system (W3 — semantic names, values from the template's Stage-6 style layer):
  - `--surface-gradient`, `--edge-highlight`, `--media-vignette`, `--glow-ambient` (canvas ambient glow), `--glow-accent` (currently only an inline fallback in `.t-rail__compose`).
  - `--ratio-square: 1/1`, `--ratio-video: 16/9`, `--ratio-photo: 3/2` (for keep media).
  - `--dot-presence: 8px`.
  - Layout: `--context-width: 320px`, `--rail-width: 250px`, `--topbar-height: 56px`, `--tabbar-height: 72px`, `--fab-size: 56px`.
  Provide light + dark values (template gives both).

**G3 · Wrong tab set on Saved.** `Me.tsx` `SECTIONS` has six pills (Saved, Collections, Reading later, Pinned, Notes, Recently viewed) rendered as scrollable `t-tab-pill`s. The Saved surface template shows exactly **three underline tabs: Saved · Collections · Reading Later**. Conform: on this surface use a 3-tab underline row (`role="tablist"`, accent bottom-border active) matching template markup — not the pill style. Pinned / Notes belong to the broader Me screen (`me.md` spec), not Saved; Recently viewed moves into the **context column**, not a tab.

**G4 · Masthead absent.** Saved currently has no masthead — it dives straight into `CollectionsNudge` + `SavedList`. Add the header block: positive eyebrow + bookmark glyph "Saved · kept for yourself", h1 "Your keeps." (`--text-display` desktop / `--text-title` mobile), subhead. Remove/relocate `CollectionsNudge` (the template has no inline nudge banner; keep it only if it survives as an honest optional hint, but it is NOT in the template — recommend suppressing on this surface).

**G5 · Keep-card visual form.** Template keeps are **media-tile + article cards** with `--surface-gradient`, `--edge-highlight`, `--media-vignette`, `--radius-lg`, and a 2-col photo grid + full-width article card. Current `SavedCard.tsx` renders a **full social-post card** (avatar head, body, PostMedia, PostCounts, 6-action row). These are different object models. Conform the *saved grid presentation* toward the template: real saved items with media render as photo tiles (square media + title + mono "author · kept {relativeTime}"); text-only/article saves render as the article card. The full action row (Pin/Later/Note/Collect/Open/Remove) should move to an **expanded/detail state or hover affordances**, not sit on every tile in the grid (template tiles have no visible action bar). Keep all actions reachable and functional (§4).

**G6 · Collections presentation.** Current `Collections()` renders `t-collcard` text-only cards in an `auto-fill minmax(15rem,1fr)` grid. Template shows **2-col cover-image collection cards** (`--ratio-video` gradient cover + name + mono "N kept · private"). Add cover treatment and the "N kept · private" mono line (currently "N posts"). The **"Collections" hairline divider label** above the grid must be added.

**G7 · Footer privacy line missing.** Add the centred footer "Keeping is private. There is no public list, and nothing here counts toward anything." (desktop) / short form (mobile) after the collections grid.

**G8 · Mobile is not a detail view.** Template mobile Saved has a **back button + "Saved" title** top bar and **no bottom "Me" affordance change**; our shell always shows the full 5-pillar top bar (`tacet` brand) + tab bar. Because Saved is the `/me` default, on mobile it currently shows the whole Me screen (Profile + Connectivity + Appearance + 6 pill tabs) with no back bar. For fidelity, when the Saved sub-view is the active mobile view, present the masthead-first Saved layout without the Profile/Appearance stack, and provide a back path. (If Saved stays merged into Me on mobile, at minimum reorder so the Saved masthead + keeps read as the template shows; do not fabricate the Reading Later / Recently viewed modules on mobile — they are desktop-only.)

**G9 · "Resume reading" is a template dead button.** Wire it (open the saved article URL) or render disabled "coming soon". No no-op.

**G10 · "Learn how it works" is a template dead link (`href="#"`).** Point at a real explainer or omit. No dead anchor.

**G11 · ConnectivityPanel placement + copy.** It currently stacks at the top of the Me screen as a wide card. On Saved's context column it becomes the **accent-tinted reassurance panel** ("You're connected across the open social web." + "Learn how it works"). Reconcile: either reuse `ConnectivityPanel` styled as the panel, or render the template's simpler panel in the aside. Keep its honest, non-numeric, no-map framing (ADR-011/012). Its live "watching N / sources / homes seen" mono footer is honest and may stay if shown, but the template's panel is deliberately count-free — prefer the calm version here.

**G12 · Rail search row (shell).** Template rail has a "Search … ⌘K" trigger; `AppShell.tsx` rail has none. Shell-scope; flag. If not implemented, do not add a dead trigger.

**G13 · Sample vs real data honesty (W1).** The template's fabricated rows (Mara Ito, Jonas Vold, "12 kept · private", "The Internet We Deserve", "Indie Makers") are design placeholders. Our build must render **real** saved items / collections / recent views, and honest **empty states** when there is nothing — never the fabricated names. Empty-state copy already exists in `Me.tsx` (e.g. "Nothing saved yet", "Nothing to read later") — reuse it; it is honest and on-voice.

---

## 6. Semantic tokens used (reference)

Type: `--text-display`, `--text-title`, `--text-heading`, `--text-subheading`, `--text-body`, `--text-body-sm`, `--text-label`, `--text-meta`, `--text-micro`; `--leading-tight/snug/normal/relaxed`; `--tracking-tight/wide`; `--font-sans`, `--font-mono`; `--measure-reading`.
Space: `--space-1`…`--space-9`, `--gutter`.
Radius: `--radius-xs/sm/md/lg/full`. Border: `--border-hairline`, `--border-strong`.
Color: `--color-canvas`, `--color-surface`, `--color-surface-sunken`, `--color-hairline`, `--color-text-primary/secondary/tertiary`, `--color-accent`, `--color-accent-hover`, `--color-accent-subtle`, `--color-on-accent`, `--color-positive`, `--color-focus-ring`.
Elevation/motion: `--elevation-1/2`, `--dur-1`, `--ease-out`.
**New (G2):** `--surface-gradient`, `--edge-highlight`, `--media-vignette`, `--glow-ambient`, `--glow-accent`, `--ratio-square`, `--ratio-video`, `--ratio-photo`, `--dot-presence`, `--context-width`, `--rail-width`, `--topbar-height`, `--tabbar-height`, `--fab-size`.

---

## 7. Out of scope (do not touch)
`client/src/views/landing/*`, `client/src/views/welcome/*`. Rail/tab-bar/top-bar shell restyle beyond noting gaps (G8, G12) is shell-scope, not per-surface — flag, don't rebuild. The composer stays a not-yet-publishing preview (W1).
