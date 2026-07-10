# Saved — fidelity spec

Conformance target for the **Saved** surface. Source of truth:
`docs/10-design/hifi/handoff/Saved Desktop.html` + `Saved Mobile.html` (decoded from the
`__bundler` payload; text + interactive structure below was extracted from the rendered DOM).
Current impl to conform: `client/src/app/screens/Me.tsx` (the `"saved"` / `"collections"` /
`"later"` tab views), `client/src/app/SavedCard.tsx`, `client/src/app/me.ts`, rendered inside
`client/src/app/AppShell.tsx`.

**Type is LOCKED** — the templates ship system-ui / their own kit, but our tokens
(`--font-sans` = Hanken Grotesk, `--font-mono` = Spline Sans Mono in
`client/src/design/theme.css`) are the source of truth. Every other token
(`--color-*`, `--space-*`, `--radius-*`, `--text-*`, `--leading-*`, `--tracking-*`,
elevation, motion, and the new layout/atom tokens listed in §6) is used **semantically only
(W3)**. Reduced-motion static + AA contrast honoured (W4). No protocol words in visible copy
(W5); honesty carve-outs called out inline (W1).

---

## 0. Where Saved lives (architecture decision)

The template ships **Saved** as a **standalone full-screen surface**:
- `data-screen-label="Saved — desktop"` / `"Saved — mobile"`.
- Its own masthead ("Your keeps."), its own tab row (Saved / Collections / Reading Later).
- The rail's **Me** pillar carries `aria-current="page"` (Saved is a place reached *from* Me).
- On mobile the top bar is a **back button + "Saved" title** — a detail-view bar, not the
  app chrome; the five-pillar tab bar + compose FAB sit at the bottom.

Current impl renders Saved as the **default tab of `/me`** (`Me.tsx`, `section = "saved"`),
stacked *below* `ProfileCard` + `ConnectivityPanel` + `AppearanceControl`, inside the
single-column `t-main`. There is **no context column** in the shell (`.t-app` is a 2-column
grid, `250px 1fr` — see `app.css:87`). That is the central architectural gap.

**Decision for this build:** keep Saved as a sub-view of `/me` (do **not** add a new route or
touch `TacetApp.tsx` routing). Conform the Saved sub-view's *masthead, tab set, card grids,
private-keeping copy, and context column* to the template. Introduce the right context column
as a real, reusable shell region gated to the wide breakpoint (see §5). Everything the
template shows must map to something that actually exists in `me.ts`, or be honestly
disabled / dropped (W1).

---

## 1. Desktop layout — the 3-column canvas

The template's outer wrapper is a horizontal flex whose min-width is
`calc(var(--rail-width) + var(--measure-reading) + var(--context-width) + 2*var(--gutter) + 2*var(--space-6))`.
Inside `main` it is a **2-track grid**: `grid-template-columns: minmax(0, var(--measure-reading)) var(--context-width)`
with `gap: var(--gutter)`, `justify-content: center`, `padding: 0 var(--space-6)`.

So the full canvas reads **left rail 250px · centre feed ~42rem · right context column 320px**,
centred within the viewport with `--gutter` (= `--space-6`) between the two content tracks.

### 1.1 Left rail (250px) — shared shell (`AppShell.tsx`), not owned by Saved
Order top→bottom in the template `nav[aria-label="Primary"]`:
1. `tacet` wordmark with a radial accent lamp glow behind it (brand → Today).
2. **Search control** — `[role=button tabindex=0 aria-label="Search people, communities, conversations"]`,
   surface pill, magnifier icon, label **`Search`**, right-aligned mono **`⌘K`** hint chip.
3. Nav links in order: **Today · People · Discover · Conversations · Me**.
   - Conversations carries a presence dot (`title="New correspondence"`, accent, glow) —
     never a count.
   - **Me** is the active item: accent-subtle gradient pill + `--edge-highlight`, accent text,
     `aria-current="page"`.
4. **New** primary button (accent gradient, `--glow-accent`) — opens the composer.
5. Rail foot: 36px avatar + `Renato Gusani` / `@renato` (mono, tertiary) + **Switch theme**
   icon button (44×44, sun/dark ↔ moon/light).

Impl already matches 1, 3, 4, 5 (`AppShell.tsx` rail). **Only Search (2) is missing** — see
GAP-H. Search is a not-yet-built surface, so it must be an honestly-disabled affordance
(`title="Search — coming soon"`, `aria-disabled`, no live box), not a working input.

### 1.2 Centre column (`--measure-reading` = 42rem) — the Saved feed
`section[aria-label="Saved"]`, `padding: var(--space-8) 0 var(--space-9)`. Order top→bottom:

1. **Masthead** (`header`, `margin-bottom: var(--space-7)`):
   - **Eyebrow** — bookmark glyph + **`Saved · kept for yourself`**, `--text-micro`, weight 500,
     `--tracking-wide`, colour **`--color-positive`**.
   - **`h1` → `Your keeps.`** — `--text-display`, weight 400, `--tracking-tight`,
     `--leading-tight`, `margin-top: var(--space-3)`.
   - **Sub** — **`Moments you chose to hold on to. No one else sees this page.`**,
     `--color-text-secondary`, `--text-body-sm`, `--leading-relaxed`.
2. **Tab row** (`div[role=tablist]`, bottom hairline, `gap: var(--space-5)`,
   `margin-bottom: var(--space-6)`). Three tabs, underline-style (not pills):
   - **`Saved`** — active (`aria-selected="true"`, `border-bottom: var(--border-strong) solid var(--color-accent)`, `margin-bottom:-1px`, primary text).
   - **`Collections`** — inactive (transparent underline, secondary text, hover→primary).
   - **`Reading Later`** — inactive.
3. **Feed body** (`display:flex; flex-direction:column; gap: var(--space-6)`), in this order:
   - **Media pair** — a 2-col grid (`1fr 1fr`, `gap: var(--space-4)`) of two square
     media cards (`--ratio-square`, `--media-vignette`):
     - **`Dusk over the old quarter`** — meta `Mara Ito · kept tonight` (mono, micro, tertiary).
     - **`First light, the quay`** — meta `Jonas Vold · kept Monday`.
   - **Article card** — full-width `article`, `padding: var(--space-5)`:
     - Heading **`The maintenance web`** (`--text-heading`, weight 500, `--leading-snug`).
     - Body **`The most radical thing a small community can do is keep its corner of the web tended.`** (`--text-body-sm`, secondary).
     - Meta **`Elena Duarte · Article · kept this morning`** (mono, `--text-meta`, tertiary).
   - **`Collections` divider** — a label+rule row: mono-weight label **`Collections`**
     (`--text-micro`, weight 500, `--tracking-wide`, tertiary) followed by a 1px hairline rule.
   - **Collection covers** — 2-col grid of two `--ratio-video` cover cards:
     - **`Light studies`** — `12 kept · private`.
     - **`The slow web`** — `7 kept · private`.
   - **Footer reassurance** (centred, `padding-top: var(--space-6)`):
     **`Keeping is private. There is no public list, and nothing here counts toward anything.`**
     (`--text-body-sm`, tertiary).

> **Note — sample content.** The card copy above is placeholder data in the template. Impl
> renders **live** rows from `api.listSaved(...)` and `api.listCollections()`. Keep the live
> behaviour; match the card *chrome, grid, meta format, and section order*, not the strings.
> The template mixes media-square cards, an article card, and collection covers to show the
> visual system — see §3 for how each maps to a card variant.

### 1.3 Right context column (`--context-width` = 320px) — "your world, never your score" (ADR-012)
`aside[aria-label="Reading later"]`, `border-left` hairline, `padding: var(--space-8) 0 var(--space-9) var(--space-6)`.
Modules, top→bottom (each block `margin-bottom: var(--space-7)`):

1. **Reading Later** (`h2`, `--text-heading`):
   - One resume card (`--surface-gradient`, hairline, `--elevation-1`, `--edge-highlight`):
     56px thumbnail + title **`The slow web, and why it's worth it`** + mono meta
     **`6 min left`** + a text button **`Resume reading`** (accent-hover, underline on hover).
2. **Recently viewed** (`h2`, `--text-heading`):
   - A flush list of rows (36px round thumbnail + title + mono meta), e.g.
     **`The Internet We Deserve`** / `film · paused at 12:04`, and
     **`Indie Makers`** / `community · this evening`.
3. **Privacy line** — **`Only you can see your keeps. Saving tells no one, ever.`**
   (`--text-body-sm`, `--leading-relaxed`, secondary).
4. **Connectivity card** (accent-tinted gradient panel, hairline, `--elevation-1`,
   `--edge-highlight`):
   - Positive presence dot + **`You're connected across the open social web.`**
   - Link row **`Learn how it works` →** (accent-hover, arrow icon).

**Mapping to real modules:** the context column is where our existing **`ConnectivityPanel`**
(module 4) and the **Reading Later** + **Recently viewed** data (modules 1–2, both already in
`me.ts`: `api.listSaved({filter:"read_later"})`, `api.listRecent()`) belong. See §5 for the
concrete relocation.

---

## 2. Mobile layout

Outer: centred column, `max-width: 430px`, full-height flex, canvas bg + `--glow-ambient`,
hairline left/right borders.

### 2.1 Top bar (detail-view chrome)
`header`, sticky top, `height: var(--topbar-height)`, `z-index: var(--z-content)`, solid
`color-mix(--color-surface 92%, --color-canvas)` (**no glass/blur**), bottom hairline:
- **Back button** (44×44 round, `aria-label="Back"`, chevron-left icon).
- **Title `Saved`** (`--text-subheading`, weight 500).

> This replaces the app's usual `t-topbar` (brand + theme toggle) **for this surface only**.
> On mobile, Saved is a pushed detail view of Me, so it shows Back + title. See GAP-M1.

### 2.2 Masthead (`padding: var(--space-6) var(--space-4) var(--space-2)`)
- Eyebrow — bookmark glyph + **`Saved · kept for yourself`** (positive, micro, `--tracking-wide`).
- **`h1` → `Your keeps.`** — **`--text-title`** (smaller than desktop's `--text-display`),
  weight 500, `--tracking-tight`, `--leading-tight`.
- Sub — **`No one else sees this page.`** (secondary, `--text-body-sm`; note this is the
  *shortened* mobile string — desktop's is longer).

### 2.3 Feed (`padding: var(--space-4) var(--space-4) var(--space-6)`, `gap: var(--space-4)`)
Same order as desktop, tighter spacing and shorter meta strings:
- Media pair (`gap: var(--space-3)`, card padding `--space-3`):
  **`Dusk, old quarter`** / `Mara · tonight` and **`First light, quay`** / `Jonas · Monday`.
- Article card (`padding: var(--space-4)`): **`The maintenance web`** heading
  (**`--text-subheading`** on mobile), body **`The most radical thing a small community can
  do is keep its corner tended.`**, meta **`Elena Duarte · Article · this morning`**.
- `Collections` label+rule divider.
- Collection covers pair: **`Light studies`** / `12 kept · private`, **`The slow web`** /
  `7 kept · private`.
- Footer reassurance (centred, `padding-top: var(--space-4)`):
  **`Keeping is private. Nothing here counts toward anything.`** (shortened for mobile).

**Mobile drops the context column** entirely (Reading Later / Recently viewed / connectivity
are not shown on the Saved mobile screen — they live behind the Reading-Later tab and Me).

### 2.4 Bottom tab bar + compose FAB
`nav[aria-label="Primary"]`, sticky bottom, `height: var(--tabbar-height)`,
`z-index: var(--z-nav)`, solid `color-mix(--color-surface 94%, --color-canvas)` (no glass),
top hairline, `grid-template-columns: repeat(5,1fr)`. Five slots:
1. **Today** (home icon + label).
2. **People**.
3. **New** — centre **FAB** (`--fab-size`, round, accent gradient, `--glow-accent` +
   `--elevation-2`, lifted `margin-top: calc(-1 * var(--space-5))`), pencil icon, `aria-label="New"`.
4. **Discover**.
5. **Chats** — chat icon with a **presence dot** (`title="New correspondence"`, accent, glow) —
   never a count. **Copy note:** template mobile labels this pillar **`Chats`**; our shell
   labels it **`Conversations`**. See GAP-M2.

Impl already has `t-tabbar` + `t-fab`, but they are separate siblings (FAB floats bottom-right),
not a single 5-slot grid with a centre FAB. See GAP-M3.

---

## 3. Every card / module, mapped to a variant

The template shows **three card families** in the centre feed plus **three context modules**.
Map each onto real impl atoms:

| Template block | Chrome | Real data source | Impl mapping |
|---|---|---|---|
| Media-square card | `--ratio-square` media, title, mono meta `Author · kept <when>` | `SavedPost` with image `media` | New compact "keep" card variant of `SavedCard` (media-forward) |
| Article card | no media, heading + excerpt + mono meta `Author · Article · kept <when>` | `SavedPost` with `title` + `text`, no media | `SavedCard` text variant |
| Collection cover | `--ratio-video` cover, name, `N kept · private` | `CollectionSummary` (`name`, `count`) | `t-collcard` restyled with a cover band |
| Reading-Later resume | thumb + title + `N min left` + `Resume reading` | `SavedPost` `filter:"read_later"` | context-column module |
| Recently viewed row | thumb + title + mono `medium · <when>` | `RecentView` (`api.listRecent`) | context-column module |
| Connectivity card | presence dot + line + `Learn how it works →` | live connectivity | existing `ConnectivityPanel`, restyled to the tinted panel |

**All meta uses mono** (`--font-mono`, `--text-micro`/`--text-meta`, tertiary) and the
**` · `** separator, matching `SavedCard`'s existing `t-identity__meta`.

> **W1 — "kept" framing.** The template's meta reads `kept tonight` / `kept this morning`.
> Our `SavedCard` reads `saved <relativeTime>`. Both are honest; align copy to **`kept …`** to
> match the template's warmer, private-keeping voice (it reinforces "no one else sees this").

---

## 4. Interaction behaviors & honest-disable list

### 4.1 Must WORK (already real in `me.ts`)
- **Tabs** `Saved / Collections / Reading Later` — switch the centre feed
  (`setSection("saved"|"collections"|"later")`). `role=tablist` + `aria-selected`.
- **Collection cover click** — opens that collection's items (`Collections` open-state in
  `Me.tsx`).
- **Per-card actions** (`SavedCard`): **Pin**, **Later**, **Note**, **Collect**, **Open at
  source**, **Remove** — all wired to `api.updateSaved` / `api.unsave` /
  `api.addToCollection` etc. Keep them; they are the honest "keeping is local" toolkit.
- **Resume reading** (context) — link to the saved post's `url` (open at source). Honest label.
- **Recently-viewed rows** — link to `url` (`target="_blank"`), already real.
- **Learn how it works →** (connectivity card) — link to the connectivity/help surface if one
  exists; otherwise honestly disabled (see below).
- **Rail Search / ⌘K** — see §1.1 GAP-H (disable).
- **New / FAB** — opens `ComposeSheet` (already wired). Composer remains the audited
  **not-yet-publishing preview** (W1) — do not imply it posts.

### 4.2 Dead controls in the template that must be honestly disabled or dropped
- **Rail `Search` + `⌘K`** — no search surface exists. Render as a disabled affordance
  (`aria-disabled="true"`, `title="Search — coming soon"`, `.is-soon`), **not** a live box (W1).
- **Mobile `Back` button** — must actually navigate back to `/me` (`navigate("/me")` /
  `history.back()`), not be a no-op. If Saved stays a tab of `/me`, the Back button returns the
  Me tab-set to its default; wire it, don't leave it dead.
- **`Learn how it works →`** — only render as a link if a target exists; otherwise disable with
  `title="Coming soon"`. Never link to `#`.
- Any `href="#"` in the template rail (Today/People/etc.) maps to the real router `Link`s —
  never ship literal `#`.

### 4.3 Empty / loading (keep existing, honest)
- Loading → quiet `EmptyState title="…"` (no spinner). Reduced-motion safe.
- Error → `EmptyState icon="saved" title="Couldn't load"` — "Try again in a moment."
- Empty Saved → `EmptyState icon="saved" title="Nothing saved yet"` — keep the existing hint
  copy ("Save a post from Today and it lives here — yours, even if the original disappears.").
- The template's private-keeping reassurance lines (footer + context privacy line) are
  **first-class copy** — add them even when the list is populated, not only in the empty state.

---

## 5. The context column — concrete shell work

The single biggest structural gap. The shell must gain an **optional right context column**
that Saved (and later, other surfaces) can fill, shown only at the wide breakpoint.

### 5.1 Shell change (`AppShell.tsx` + `app.css`)
- `AppShell` accepts an optional `context?: ReactNode` prop (or a `<ContextColumn>` slot).
  When present and viewport ≥ the wide breakpoint, `.t-app` becomes a **3-track grid**:
  `grid-template-columns: var(--rail-width) minmax(0, var(--measure-reading)) var(--context-width)`
  with `column-gap: var(--gutter)`, centred. When absent (all other surfaces), it stays the
  current 2-track grid — no regression.
- Below the wide breakpoint the context column is **not rendered** (mobile drops it entirely,
  matching the template).
- Context column visual: `border-left` hairline (60–70% mix), `padding` per §1.3, `align-self:
  start`, sticky-optional.

### 5.2 Saved fills the context column with real modules
`Me.tsx` (only while `section === "saved"`, and only at the wide breakpoint) supplies:
1. **Reading Later** module — a compact resume card built from
   `api.listSaved({filter:"read_later"})[0]` (title + "N min left" if we track read progress;
   if we don't yet track minutes, show `kept <when>` and label the button **`Resume`** →
   opens at source — do **not** fabricate a "6 min left" estimate we can't compute; W1).
2. **Recently viewed** module — first 2–3 rows of `api.listRecent()` (already real).
3. **Privacy line** — `Only you can see your keeps. Saving tells no one, ever.`
4. **ConnectivityPanel** — relocated from the centre stack into the context column, restyled
   to the tinted accent panel (its current copy — "Your home is connected" — is honest and
   world-directed; keep it, or adopt the template's `You're connected across the open social
   web.` line — both are W1-clean).

> On mobile / narrow, these modules stay where they already are (Reading-Later tab, Recently
> viewed tab, Me stack) so no data is orphaned.

---

## 6. New semantic tokens required (W3 — add to `tokens.md` + `theme.css`)

The template uses a set of layout/atom tokens **not yet defined** in `theme.css`/`app.css`
(several are already referenced by `app.css` today but resolve to nothing). Define them once,
in `theme.css` `:root`, mapped to existing scale values:

**Layout**
- `--rail-width: 250px` (matches the `250px` hardcoded in `app.css:87`).
- `--context-width: 320px`.
- `--gutter: var(--space-6)`.
- `--topbar-height: 56px` (matches current `t-topbar`).
- `--tabbar-height: 64px`; `--fab-size: 56px` (matches current `t-fab`).

**Surface / edge**
- `--surface-gradient` — the subtle card fill gradient (surface → surface-raised).
- `--edge-highlight` — the 1px inner top highlight used on cards (inset box-shadow, token per
  theme).
- `--glow-ambient` — the page's soft accent glow background image (radial, accent at ~10%),
  per theme; used on the canvas.
- `--glow-accent` — accent button glow (already referenced with a fallback in `app.css:141`;
  promote to a real token).
- `--media-vignette` — inner shadow on media tiles.

**Atoms**
- `--ratio-square: 1 / 1`; `--ratio-video: 16 / 9`.
- `--dot-presence: 8px` (presence dot size; never a count).
- `--icon-sm: 18px`; `--icon-md: 22px` (align with existing `Icon` sizes).
- `--border-hairline: 1px`; `--border-strong: 2px`.
- `--z-content` (top bar) and `--z-nav` (tab bar) — map to the existing `z-index: 20 / 30`.

**Leading / tracking** (referenced across `app.css` but undefined):
- `--leading-tight: 1.15`; `--leading-snug: 1.3`; `--leading-normal: 1.45`;
  `--leading-relaxed: 1.6`.
- `--tracking-tight: -0.015em`; `--tracking-normal: 0`; `--tracking-wide: 0.04em`.

All values must have **light + dark** variants where colour-bearing (`--surface-gradient`,
`--edge-highlight`, `--glow-*`, `--media-vignette`) and pass **AA contrast** (W4). Reduced
motion: the ambient glow is static (no animation), so it is already reduced-motion safe.

---

## 7. GAP LIST — concrete edits to conform impl → template

**Structural (highest priority)**
- **GAP-A — Context column.** Shell has no right context column (`.t-app` = `250px 1fr`).
  Add an optional 3-track grid + a `context` slot to `AppShell.tsx`/`app.css`; Saved fills it
  with Reading Later + Recently viewed + privacy line + ConnectivityPanel (§5). *Biggest gap.*
- **GAP-B — Masthead.** Saved sub-view currently has **no masthead**. Add the eyebrow
  (`Saved · kept for yourself`, positive), `h1` **`Your keeps.`** (`--text-display` desktop /
  `--text-title` mobile), and the sub line (long on desktop, `No one else sees this page.` on
  mobile). Currently the ProfileCard + panels sit above the tabs instead.
- **GAP-C — Surface separation.** Template Saved is its own screen; impl stacks it under
  ProfileCard/ConnectivityPanel/AppearanceControl. When `section === "saved"`, render the
  masthead + Saved-specific tab row + feed as the primary content, and move Connectivity into
  the context column (§5.2). (Profile + Appearance belong to other Me tabs, not the Saved feed.)

**Tabs & feed**
- **GAP-D — Tab set.** Template Saved tabs are exactly **`Saved · Collections · Reading Later`**
  (3, underline style). Impl exposes 6 pills (`Saved · Collections · Reading later · Pinned ·
  Notes · Recently viewed`). For the Saved surface, present the **three canonical tabs** in
  underline style; keep Pinned/Notes/Recently-viewed as honest extras **behind** the primary
  three (overflow, or moved into Me / the context column), never as peer top-tabs on Saved.
- **GAP-E — Tab style.** Impl uses pill tabs (`t-tab-pill`, accent-subtle bg). Template uses
  **underline tabs** (bottom-border accent, `--border-strong`, transparent for inactive). Add a
  `t-tabs--underline` variant (or restyle for this surface) using `--border-strong` +
  `--color-accent`.
- **GAP-F — Card grids.** Template groups keeps into a **2-col media grid**, a **full-width
  article card**, a **`Collections` label+rule divider**, then a **2-col cover grid**. Impl
  renders a single flat `t-feed` column of `SavedCard`s. Add: (a) a media-square card variant,
  (b) the label+rule divider atom, (c) a `--ratio-video` cover band on `t-collcard`. Group live
  data into these lanes (media keeps vs text keeps vs collections).
- **GAP-G — "kept" copy.** Change card meta from `saved <when>` to **`kept <when>`** and the
  collection count line to **`N kept · private`** (`SavedCard` + `t-collcard`). W1-clean, warmer.

**Rail / chrome**
- **GAP-H — Search affordance.** Rail is missing the `Search` + `⌘K` control. Add it as an
  **honestly-disabled** affordance (`aria-disabled`, `title="Search — coming soon"`, `.is-soon`),
  not a live input (W1). (Shell-level; benefits every surface.)
- **GAP-I — Footer reassurance.** Add the centred private-keeping footer line
  (`Keeping is private. There is no public list, and nothing here counts toward anything.` /
  mobile: `Keeping is private. Nothing here counts toward anything.`) below the feed, always
  visible, not only in the empty state.

**Mobile**
- **GAP-M1 — Detail top bar.** On mobile, Saved shows a **Back + "Saved" title** top bar
  (solid surface, no blur), replacing the brand/theme `t-topbar` for this surface. Back must
  `navigate("/me")` (or `history.back()`) — wire it, don't leave it dead.
- **GAP-M2 — `Chats` label.** Mobile tab bar labels the correspondence pillar **`Chats`**;
  shell currently labels it `Conversations`. Reconcile the mobile tab label to **`Chats`**
  (desktop rail may keep `Conversations`); keep the presence dot, never a count.
- **GAP-M3 — Tab bar as 5-slot grid with centre FAB.** Template tab bar is a single
  `repeat(5,1fr)` grid with the **New** FAB lifted in the centre slot. Impl has `t-tabbar`
  (5 nav items, no centre gap) + a separately floating `t-fab` bottom-right. Restructure the
  mobile bar to the 5-slot grid with the centre compose FAB (solid surface, no glass, top
  hairline). Remove the floating bottom-right FAB on this layout.
- **GAP-M4 — Solid chrome, no glass.** Template top bar and tab bar are **solid**
  (`color-mix` surface, hairline), explicitly **no backdrop-filter/blur**. Impl `t-topbar` /
  `t-tabbar` use `backdrop-filter: blur(...)`. Drop the blur for these bars (W4: solid is safer
  for contrast and reduced-transparency).

**Tokens**
- **GAP-T — Define missing tokens.** Add all §6 tokens to `theme.css` (light + dark). Several
  (`--leading-*`, `--border-hairline`, `--glow-accent`, `--surface-gradient`, `--edge-highlight`)
  are already *referenced* by `app.css` but undefined — defining them fixes latent broken
  styles across the app, not just Saved.

---

## 8. Whitelist deviations applied here
- **W1 (honesty):** "kept for yourself" / "no one else sees this page" kept literal (they are
  true — keeping is local). Search is disabled, not faked. Composer stays a not-yet-publishing
  preview. Reading-Later "N min left" only shown if we actually track read progress; otherwise
  a plain `Resume` → open-at-source (no fabricated estimate). No federated/protocol claims.
- **W3:** every value above is a semantic token; §6 lists the new ones to add centrally.
- **W4:** solid chrome (no blur) for AA contrast; ambient glow is static (reduced-motion safe).
- **W5:** copy uses product/medium words only ("open social web", "Article", "film",
  "community") — no protocol names in visible UI.
