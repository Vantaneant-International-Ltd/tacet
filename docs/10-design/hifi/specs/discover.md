# Discover — fidelity spec

Conformance target for the **Discover** surface: bring `client/src/app/screens/Discover.tsx`
and `client/src/app/components.tsx` (the `PersonRow`) to match
`docs/10-design/hifi/handoff/Discover Desktop.html` + `Discover Mobile.html`.

Templates decode to markup via the `__bundler/template` script (line 194 of each handoff
HTML, a JSON-encoded string). Text + interactive structure below was extracted from the
decoded DOM (`/tmp/Discover_Desktop_decoded.html`, `/tmp/Discover_Mobile_decoded.html`).

**Type is LOCKED** — templates name `Jost` / `Space Mono`, but our tokens (`--font-sans`
= Hanken Grotesk, `--font-mono` = Spline Sans Mono in `client/src/design/theme.css`) are
the source of truth and must NOT change. Every other token (`--color-*`, `--space-*`,
`--radius-*`, `--text-*`, `--rail-width`, `--context-width`, elevation, motion) matches
the template `:root` one-to-one and must be used semantically (W3).

**Scope note:** this session is **VISUAL ONLY**. Rich cross-network filtering / a live
directory is FENCED to session 3. The honest **"sample suggestions"** note stays (W1).
The current impl is a plausible-but-different Discover (search box, "People to follow",
"Communities" card grid, open-web footer note). The template is an **editorial,
hand-curated "door"** with named sections, a curated conversation card, and a right
context column. This spec conforms the impl to that editorial shape without claiming any
capability the product can't keep.

---

## 1. Desktop layout — the 3-column canvas

The template lays Discover on the standard app canvas: **left rail 250px · centre feed
~42rem · right context column 320px**, centred within `--canvas-max` (1440px). The centre
+ context are a two-column CSS grid inside `<main>`:
`grid-template-columns: minmax(0, var(--measure-reading)) var(--context-width)` with
`gap: var(--gutter)` (= `--space-6`), `justify-content:center`, `padding: 0 var(--space-6)`.

The current impl has **no right context column** and `.t-app` is `grid-template-columns:
250px 1fr` — the single biggest gap (see **GAP-A**). Discover currently renders as a
single centred `.t-screen` (max `--measure-wide`), which must become the 42rem centre
column of a rail + feed + context layout.

### Left rail (250px) — shared shell, `AppShell.tsx`
Order top→bottom (from template `nav[aria-label="Primary"]`):
1. `tacet` wordmark (brand, links to Today) with the accent lamp glow behind it — matches.
2. **Search control** — `[role=button aria-label="Search people, communities,
   conversations"]` with label `Search` + a `⌘K` mono hint chip. *(Present in template rail;
   absent in our rail. Shell-level; tracked as **GAP-H**, shared with the Me spec — do NOT
   duplicate the fix. Search is a not-yet-built surface, so it must be an honestly-disabled
   / `coming soon` affordance, never a live box in the rail.)*
3. Nav links in order: **Today · People · Discover · Conversations · Me** — **Discover
   active** (`aria-current="page"`, accent-subtle gradient pill, accent text). Conversations
   carries the presence dot (never a count). Matches, except active item is Discover here.
4. **New** primary button (opens composer). Matches.
5. Rail foot: avatar + `Renato Gusani` / `@renato` (mono) + **Switch theme** icon button.
   *(Our rail foot shows only name, not the `@renato` mono handle line — minor, tracked in
   the Me spec as shell scope; not re-fixed here.)*

### Centre column (`--feed-measure` = `--measure-reading` = 42rem)
This is the Discover `.t-screen` content, re-scoped to 42rem. Padding in template:
`var(--space-8) 0 var(--space-9)`. Order top→bottom:

1. **Editorial masthead** (`<header>`, `margin-bottom: var(--space-7)`):
   - Eyebrow: `Discover` — `--text-micro`, weight 500, `--tracking-wide`, tertiary.
     *(Missing in impl — GAP-B.)*
   - `<h1>` **`Find your place.`** — `--text-display`, weight **400**, `--tracking-tight`,
     `--leading-tight`, `margin-top: var(--space-3)`. *(Impl currently shows `Discover` as
     the title via `SectionHeading`; must become this editorial masthead — GAP-B.)*
   - Sub `<p>`: **`An honest way to look around the open social web — people worth meeting,
     corners with life in them. Curated by hand, never by a machine that wants your hours.`**
     — secondary, `--text-body-sm`, `--leading-relaxed`, `margin-top: var(--space-3)`.

2. **"Sample suggestions" honest note (W1 — KEEP).** The template has no such note, but it
   is a permitted, required deviation: Discover is not reading live yet. Keep the existing
   `.t-sourcenote .t-sourcenote--muted` line **`Sample suggestions — Discover isn't reading
   live yet.`** Place it directly under the masthead, above the first section. *(Do NOT
   delete this to match the template — W1.)*

3. **Feed column** (`display:flex; flex-direction:column; gap: var(--space-6)`), a sequence
   of **section dividers** (eyebrow + hairline rule) and **cards**, in this exact order:

   **§ Section divider: `Worth meeting`** — a row: mono/label eyebrow (`--text-micro`, wt
   500, `--tracking-wide`, tertiary) + a `flex:1` hairline rule
   (`color-mix(in srgb, var(--color-hairline) 60%, transparent)`).

   **Card 1 — Person, primary Follow (Elena Duarte):** `<article>` on `--surface-gradient`,
   hairline border, `--radius-lg`, `padding: var(--space-5)`, `--elevation-1` +
   `--edge-highlight`. Row: 64px round avatar · body · **Follow** button (primary pill:
   accent gradient, `--radius-full`, `--glow-accent`). Body:
   - Name **`Elena Duarte`** (`--text-subheading`, wt 500) + a **source chip** (globe icon +
     text `WriteFreely`) — `--color-surface-sunken` bg, hairline, `--radius-sm`, micro/mono
     styling, tertiary.
   - Handle `@elena@write.as` — mono, `--text-meta`, tertiary.
   - Bio `Writes a weekly essay about tending small corners of the web. Two people you
     follow read her.`

   **Card 2 — Person with photo grid, secondary Follow (Sol Marchetti):** same article
   shell. Row: 64px avatar · body · **Follow** button (**secondary** pill:
   `--color-surface`, hairline, primary text). Body:
   - Name **`Sol Marchetti`** + source chip `Pixelfed`.
   - Handle `@sol@pixel.town` (mono, meta, tertiary).
   - Bio `Quiet street photography from the same town Jonas shoots in.`
   - **3-up media grid** below (`grid-template-columns: repeat(3,1fr)`, `gap: var(--space-1)`,
     `--radius-md`, overflow hidden): three `role="img"` square gradient tiles labelled
     `Street at dusk`, `Harbour wall`, `A lit window at night`.

   **§ Section divider: `Communities that moved`**

   **Card 3 — Community (Indie Makers):** article shell. Row: 44px rounded-square badge
   (`--radius-md`) · body · **`Step in`** button (ghost: transparent, no border, secondary
   text; hover → surface-sunken bg, primary text). Body:
   - Name **`Indie Makers`** (`--text-subheading`, wt 500).
   - Line `Show & tell is open tonight — small projects arriving all evening.` (secondary,
     `--text-body-sm`).

   **Card 4 — Community (Slow Photography):** same shape.
   - Name **`Slow Photography`**.
   - Line `An essay on shooting one roll a month is being passed around.`
   - **`Step in`** ghost button.

   **§ Section divider: `A conversation worth joining`**

   **Card 5 — Curated conversation (accent card):** distinct article — accent-tinted bg
   (`linear-gradient` from `--color-accent-subtle` to `--color-surface`), accent-tinted
   hairline (`color-mix(... var(--color-accent) 16% ...)`), `--radius-lg`, `--space-5`.
   - Kicker row: conversations icon + mono/micro `Happening on the open web` in
     `--color-accent`, `--tracking-wide`.
   - `<p>` **`Small web, big rooms — what it takes to host your own corner, and why more
     people are trying.`** (`--text-body`, `--leading-relaxed`).
   - Meta line (mono, `--text-meta`, tertiary): `active now · started on mastodon.social`.
   - Link **`Join the conversation`** + right-arrow glyph — `--color-accent-hover`,
     `--text-label`, wt 500. *(This is an `href="#"` dead link in the template — must be
     honestly disabled / non-navigating in impl; see GAP-K.)*

4. **Closing line** (`text-align:center; padding: var(--space-7) 0 0`):
   `--text-body-sm`, tertiary: **`That's the look around for today. Discovery is a door, not
   a feed.`** *(Replaces the impl's current `.t-openweb-note` open-web footer — GAP-F.)*

### Right context column (320px) — `aside`, currently ABSENT
`aside[aria-label="About this corner"]`, `--context-width` (320px), `align-self:start`,
`padding: var(--space-8) 0 var(--space-9) var(--space-6)`, `border-left` hairline
(`color-mix(... 70% ...)`). Three stacked modules, each `margin-bottom: var(--space-7)`,
then a footer affirmation card. **This whole column is missing in impl — GAP-A.**

Modules in order (each `<h2>` is `--text-heading`, wt 500, `--leading-snug`,
`margin: 0 0 var(--space-4)`):

1. **`About this corner`** — a single card (`--surface-gradient`, hairline, `--radius-lg`,
   `--space-5`, `--elevation-1` + `--edge-highlight`): 44px rounded-square badge + name
   **`pixel.town`** (`--text-subheading`, wt 500) + mono/micro tagline `a home for
   photographers`; then `<p>` (secondary, body-sm) `A small, careful place on the open web.
   Jonas and Sol both live here.`

2. **`People there you may know`** — two person rows (no card; `padding: var(--space-2) 0`):
   36px round avatar · name (`--text-label`, wt 500) + mono/micro handle · trailing status.
   - `Jonas Vold` / `@jonas@pixel.town` · trailing mono/micro `you follow`.
   - `Sol Marchetti` / `@sol@pixel.town` · (no trailing status).

3. **`Communities active today`** — two rows (same row shape):
   - `Indie Makers` / mono/micro `show & tell is open`.
   - `Slow Photography` / mono/micro `an essay going around`.

4. **Footer affirmation card** (accent-tinted, like the conversation card; `--radius-lg`,
   `--space-5`): a `--color-positive` presence dot + `You're connected across the open
   social web.` (body-sm, secondary); then link **`Learn how it works`** + right-arrow
   (`--color-accent-hover`, label, wt 500). *(`href="#"` dead link → honestly disabled;
   GAP-K.)*

> The context column embodies ADR-012: **your world, never your score** — it names the
> corner and the people/communities in it, never counts, ranks, or "trending".

---

## 2. Mobile layout

Single 430px-max column, `flex-direction:column`, with a sticky top bar and a sticky
bottom tab bar. The **context column does not appear on mobile** — its content is dropped,
not stacked (the template omits it entirely). Body glow = `--glow-ambient`.

### Top bar (56px, `--topbar-height`)
`header` sticky, `background: color-mix(in srgb, var(--color-surface) 92%, var(--color-canvas))`,
bottom hairline (solid surface + hairline, **no glass**). Contents:
- `tacet` wordmark — `--text-heading`, wt 500, `--tracking-tight`.
- Spacer, then **Search** icon button (44px hit target, `aria-label="Search"`). *(Shell;
  our top bar currently shows only the theme toggle — GAP-G.)*
- **Me** avatar button (32px avatar, 44px hit target, `aria-label="Me"`) linking to Me.
  *(Shell — GAP-G.)*

> Template top bar has **no theme toggle** (theme lives elsewhere on mobile). Our current
> top bar shows `ThemeToggle`. Reconciling this is shell-level and shared across surfaces —
> flag under GAP-G, do not silently drop the toggle without a home for it.

### Content (single column, full-width, `padding: var(--space-4)`, `gap: var(--space-4)`)
1. **Editorial masthead** (`padding: var(--space-6) var(--space-4) var(--space-2)`):
   - Eyebrow `Discover` (micro, wt 500, tracking-wide, tertiary).
   - `<h1>` **`Find your place.`** — `--text-title` (smaller than desktop display), wt
     **500**, `--tracking-tight`, `--leading-tight`.
   - Sub `<p>`: **`People worth meeting, corners with life in them. Curated by hand.`**
     (secondary, body-sm) — note this is the **shortened** mobile copy, distinct from the
     longer desktop sub.
2. **"Sample suggestions" honest note** (W1 — KEEP, same as desktop).
3. Feed, `gap: var(--space-4)`, same section order as desktop but **denser** (card
   `padding: var(--space-4)`, avatars 56px on person cards):
   - **§ `Worth meeting`** divider.
   - **Card 1 (Elena Duarte)** — Follow **below** the body (`margin-top: var(--space-3)`),
     not to the right. Source chip `WriteFreely`. Bio is the **short** mobile variant:
     `Weekly essays about tending small corners of the web.`
   - **Card 2 (Sol Marchetti)** — Follow (secondary) on the right of the header row; source
     chip `Pixelfed`; handle `@sol@pixel.town`; **no bio line**; 3-up media grid (labels
     `Street at dusk`, `Harbour wall`, `A lit window`).
   - **§ `Communities that moved`** divider.
   - **Card 3 (Indie Makers)** — line `Show & tell is open tonight.` (short) · `Step in`.
   - **Card 4 (Slow Photography)** — line `An essay is being passed around.` (short) ·
     `Step in`.
   - **Closing line** (`padding: var(--space-5) 0 0`, tertiary, body-sm):
     **`That's the look around for today.`** (short mobile variant — no "Discovery is a
     door" second sentence).
   - Mobile **omits** the curated-conversation accent card (§ "A conversation worth
     joining") and the entire context column. Keep them **desktop-only**.

### Bottom tab bar (72px, `--tabbar-height`) + FAB
Sticky, `background: color-mix(in srgb, var(--color-surface) 94%, var(--color-canvas))`,
top hairline, 5 columns. **Template tab set + order: `Today · People · [New FAB] · Discover
· Chats`** — only **four labelled tabs** flanking a centre compose FAB, and the fifth pillar
label is **`Chats`** not `Conversations`. Discover is `aria-current="page"` (accent). The
`Chats` tab carries a presence dot on its icon.

Our impl's mobile tab bar is 5 labelled tabs `Today · People · Discover · Conversations ·
Me` with a **separate floating FAB** (`.t-fab`) — different structure/labels from the
template. Reconciling to the template's centre-FAB + `Chats` layout is **shell-level and
shared across every mobile surface** — tracked as **GAP-G**; do not fork it per-surface.

---

## 3. Exact human copy (canonical strings)

Masthead (desktop): eyebrow `Discover`; title `Find your place.`; sub `An honest way to
look around the open social web — people worth meeting, corners with life in them. Curated
by hand, never by a machine that wants your hours.`

Masthead (mobile): eyebrow `Discover`; title `Find your place.`; sub `People worth meeting,
corners with life in them. Curated by hand.`

Honest note (both, W1): `Sample suggestions — Discover isn't reading live yet.`

Section dividers: `Worth meeting` · `Communities that moved` · `A conversation worth
joining` (desktop only).

Person cards:
- `Elena Duarte` · chip `WriteFreely` · `@elena@write.as` · desktop bio `Writes a weekly
  essay about tending small corners of the web. Two people you follow read her.` · mobile
  bio `Weekly essays about tending small corners of the web.` · button `Follow` (primary).
- `Sol Marchetti` · chip `Pixelfed` · `@sol@pixel.town` · desktop bio `Quiet street
  photography from the same town Jonas shoots in.` (mobile: no bio) · button `Follow`
  (secondary) · media labels `Street at dusk`, `Harbour wall`, `A lit window at night`
  (mobile last: `A lit window`).

Community cards:
- `Indie Makers` · desktop `Show & tell is open tonight — small projects arriving all
  evening.` / mobile `Show & tell is open tonight.` · button `Step in` (ghost).
- `Slow Photography` · desktop `An essay on shooting one roll a month is being passed
  around.` / mobile `An essay is being passed around.` · button `Step in` (ghost).

Curated conversation card (desktop): kicker `Happening on the open web`; body `Small web,
big rooms — what it takes to host your own corner, and why more people are trying.`; meta
`active now · started on mastodon.social`; link `Join the conversation`.

Closing line: desktop `That's the look around for today. Discovery is a door, not a feed.`
/ mobile `That's the look around for today.`

Context column (desktop): heading `About this corner`; card `pixel.town` / `a home for
photographers` / `A small, careful place on the open web. Jonas and Sol both live here.`
Heading `People there you may know`: `Jonas Vold` / `@jonas@pixel.town` / `you follow`;
`Sol Marchetti` / `@sol@pixel.town`. Heading `Communities active today`: `Indie Makers` /
`show & tell is open`; `Slow Photography` / `an essay going around`. Footer card `You're
connected across the open social web.` + link `Learn how it works`.

> **Copy migration:** the impl's current strings — subtitle `A door to the wider open
> social web. No trending, no algorithm — just people worth knowing.`, section labels
> `People to follow` / `Communities`, `Visit` buttons, `{n} here` member counts, and the
> `.t-openweb-note` (`Tacet begins with the open social web. Closed platforms remain walled
> gardens…`) — are all **replaced** by the template copy above. **Member counts must be
> removed** (no scoreboard; template shows none).

---

## 4. Semantic tokens used (W3)

- **Type:** `--font-sans` (Hanken Grotesk, LOCKED), `--font-mono` (Spline Sans Mono, LOCKED
  — used for handles, source-chip text, meta lines, `⌘K`, kicker). Sizes: `--text-display`
  (desktop h1), `--text-title` (mobile h1), `--text-heading` (context `<h2>`),
  `--text-subheading` (card names, `pixel.town`), `--text-body` (conversation body),
  `--text-body-sm` (bios, community lines, sub, closing), `--text-label` (buttons, links,
  context rows), `--text-meta` (handles), `--text-micro` (eyebrows, chips, mono kickers).
  Weights: masthead h1 = **400 desktop / 500 mobile**; names/labels/eyebrows = 500.
  Tracking: `--tracking-tight` (h1), `--tracking-wide` (eyebrows/chips/kickers).
- **Colour:** `--color-canvas`, `--color-surface`, `--color-surface-sunken` (chips),
  `--surface-gradient` (cards), `--color-hairline` (+ `color-mix` 60–70% for softened
  rules/borders), `--color-text-primary/secondary/tertiary`, `--color-accent` (+
  `--color-accent-hover` links, `--color-accent-subtle` conversation/footer cards,
  `--color-on-accent` primary button text), `--color-positive` (footer presence dot).
- **Space:** `--space-1..9` per layout above. **Radius:** `--radius-sm` (chip), `--radius-md`
  (media grid, community badges, search), `--radius-lg` (cards), `--radius-full` (avatars,
  pills, dots). **Elevation:** `--elevation-1` on cards; `--glow-accent` on primary buttons;
  `--edge-highlight` inner top light. **Motion:** `--dur-1`/`--ease-out` hovers.
- **Layout:** `--rail-width` (250), `--feed-measure`/`--measure-reading` (42rem centre),
  `--context-width` (320), `--gutter` (`--space-6`), `--canvas-max` (1440),
  `--topbar-height` (56), `--tabbar-height` (72), `--fab-size` (56), `--dot-presence` (8px),
  `--ratio-square` (media tiles).
- No raw hex except the intentional decorative avatar/media placeholder gradients (which the
  template also hardcodes — permitted as art, not UI tokens).

---

## 5. Interaction & accessibility behaviors

- **Every interactive control WORKS or is honestly disabled** (`disabled` + `title="Coming
  soon"`), never a no-op that pretends:
  - **Follow** buttons — following is not wired (read-only milestone). Keep the impl's
    existing pattern: honestly **disabled** with `title="Coming soon"`. Primary (Elena) vs
    secondary (Sol) styling still applies to the disabled button.
  - **Step in** (community) — no community view exists → **disabled `coming soon`**.
  - **Join the conversation** / **Learn how it works** links — `href="#"` dead in template →
    render as **disabled/non-navigating** `coming soon` affordances (a `<button disabled>` or
    a span, not an `<a href>` that goes nowhere). See GAP-K.
  - **Search** (rail control + mobile top-bar icon) — search surface not built → **disabled
    `coming soon`** (GAP-G/H, shell). Do not ship a live-looking input that does nothing.
- **Active nav:** Discover rail item + mobile Discover tab = `aria-current="page"`, accent
  pill (rail) / accent colour (tab).
- **Focus:** all controls use the global `:focus-visible` ring (`--color-focus-ring`, 2px,
  offset 2px) — already provided.
- **Reduced motion (W4):** honour `prefers-reduced-motion` — the `.t-fade` screen-in and
  any hover transitions collapse to static (already handled in `theme.css`); no new motion.
- **Contrast (W4):** tertiary-on-surface eyebrow/meta text must clear **AA**; the tuned
  dark `--color-text-tertiary` (`#55554f` in `theme.css`) is darker than the template's
  `#83837C`/`#8A8A86` — when an eyebrow/meta sits on `--color-canvas` and fails AA, use
  `--color-text-secondary` rather than reintroducing the lighter template hex.
- **Media tiles / avatars:** decorative — `aria-hidden` avatars; media tiles keep the
  descriptive `role="img"` + `aria-label` from the template.
- **Presence dots** are presence, never counts (Conversations rail dot, footer positive dot,
  mobile `Chats` dot).

---

## 6. GAP LIST — concrete edits to conform impl to template

**GAP-A (structural, highest priority): the 3-column canvas + right context column.**
Discover currently renders as a lone centred `.t-screen` in a `250px 1fr` app grid, with no
context column. Introduce the rail + **42rem centre** + **320px context** layout for
Discover (grid `minmax(0, var(--measure-reading)) var(--context-width)`, `gap:
var(--gutter)`, centred). Build the `aside[aria-label="About this corner"]` with its three
modules (`About this corner` card, `People there you may know`, `Communities active today`)
and the accent **footer affirmation card** exactly as in §1. Context column is
**desktop-only** (hidden below the `--bp-lg` 900px breakpoint). This is shared plumbing with
other surfaces' context columns — coordinate with the Me/Conversation specs so the shell
grows a real context slot rather than a Discover-only hack.

**GAP-B: replace `SectionHeading` with the editorial masthead.** Swap the current
`<SectionHeading title="Discover" subtitle="A door…">` for the eyebrow (`Discover`) + `<h1>`
**`Find your place.`** + the template sub-copy (desktop long / mobile short). h1 weight 400
desktop / 500 mobile, `--text-display` / `--text-title` respectively.

**GAP-C: adopt the section-divider pattern.** Replace `.t-group` + `.t-group__label`
headings with the template's **eyebrow + hairline-rule divider** (`Worth meeting`,
`Communities that moved`, `A conversation worth joining`). The `.t-convo-context__label`
style is close but the template divider has the trailing `flex:1` rule — reuse or add a
`.t-divider` that matches.

**GAP-D: re-shape person cards to the curated form.** The template person cards are
`--radius-lg` articles with a 64px (desktop) / 56px (mobile) avatar, an inline **source chip**
(globe + network name), mono handle, bio, and a Follow button whose variant differs per card
(**primary** for Elena, **secondary** for Sol). Card 2 also carries a **3-up media grid**.
The impl's `PersonRow` (`components.tsx`) has no source chip, no media grid, no per-card
button variant, and pulls from `mock.suggested` (different people/handles). Either extend
`PersonRow` with `sourceLabel`, `media`, and `followVariant` props, or add a Discover-local
card. Feed the two named people (Elena Duarte / Sol Marchetti) with the exact copy in §3.
Keep Follow **disabled `coming soon`** (matches existing honesty).

**GAP-E: add community cards + `Step in`.** Replace the `.t-community` card grid (name +
server chip + `{n} here` + `Visit`) with the template's **row-form community cards**: badge +
name + activity line + **`Step in`** ghost button, one per row in the feed column (not a
`repeat(auto-fill)` grid). Use `Indie Makers` / `Slow Photography` with §3 copy. **Remove
member counts** (`c.members` / `{n} here`) — no scoreboard. `Step in` is disabled
`coming soon`.

**GAP-F: add the curated-conversation accent card (desktop) + closing line.** Add the
accent-tinted `A conversation worth joining` card (§1 card 5) with kicker `Happening on the
open web`, body, meta, and disabled `Join the conversation` link. Replace the current
`.t-openweb-note` footer with the centred closing line `That's the look around for today.
Discovery is a door, not a feed.` (desktop) / `That's the look around for today.` (mobile).

**GAP-G (shell, flag — shared): mobile top bar + tab bar.** The template mobile top bar has
`tacet` + **Search icon** + **Me avatar** (no theme toggle); the tab bar is `Today · People ·
[New FAB] · Discover · Chats` (four labels + centre FAB, fifth pillar labelled **`Chats`**).
Our `AppShell` mobile bar is 5 labelled tabs with a separate floating FAB and a top-bar theme
toggle. Reconcile in `AppShell.tsx`, not per-surface. (Same GAP as noted in the Me spec — do
not double-fix.)

**GAP-H (shell, flag — shared): rail Search control.** Add the `Search` control to the left
rail (label + `⌘K` mono hint) as an honestly-disabled `coming soon` affordance. Shell-level,
shared with Me spec.

**GAP-I: replace mock data source.** Discover currently maps `mock.suggested` (8+ arbitrary
people from `people.filter(!following)`) and `mock.communities` (3 with member counts). The
template shows a **hand-curated, fixed** set: exactly two people (Elena, Sol), two
communities (Indie Makers, Slow Photography), one conversation, and a context corner
(pixel.town + Jonas/Sol). Introduce a small Discover-specific curated dataset with these exact
names/handles/copy rather than reusing the generic feed lists.

**GAP-J: keep the "sample suggestions" honesty note (W1).** Do **not** delete
`Sample suggestions — Discover isn't reading live yet.` to match the template — it stays,
under the masthead. Discover is a preview, not a live directory (fenced to session 3).

**GAP-K: dead-button / dead-link audit.** The template uses `href="#"` for **`Join the
conversation`** and **`Learn how it works`**, and `role=button`/plain buttons for **Follow**,
**Step in**, and **Search**. None navigate anywhere real. In impl, render each as either a
working control or an **honestly-disabled `coming soon`** affordance — never an `<a href="#">`
or a button that silently does nothing.

**GAP-L: source chips + globe icon.** Person cards need the inline **source chip** (globe
icon + network name `WriteFreely` / `Pixelfed`) using the existing `Chip` primitive
(`tone="open"`, `icon="globe"`) styled to the template chip (surface-sunken, hairline,
`--radius-sm`, mono/micro, tertiary). This replaces the impl's server-chip-on-community with a
person-card source chip.

**GAP-M: arrow-glyph on links.** `Join the conversation` and `Learn how it works` carry a
trailing **right-arrow** glyph. `icons.tsx` has no `arrow-right`/`arrow`; add one (or use an
inline SVG matching the template's `M5 12h14 / m13 6 6 6-6 6` path) so the honestly-disabled
links still read as directional affordances.
