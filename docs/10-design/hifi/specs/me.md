# Me — fidelity spec

Conformance target for the **Me** surface: bring `client/src/app/screens/Me.tsx`,
`client/src/app/ConnectivityPanel.tsx`, and `client/src/app/SavedCard.tsx` to match
`docs/10-design/hifi/handoff/Me Desktop.html` + `Me Mobile.html`.

Templates decode to markup via the `__bundler/template` script; text + interactive
structure below was extracted from that decoded DOM. **Type is LOCKED** — templates
name `Jost` / `Space Mono`, but our tokens (`--font-sans` = Hanken Grotesk,
`--font-mono` = Spline Sans Mono in `client/src/design/theme.css`) are the source of
truth. Every other token (`--color-*`, `--space-*`, `--radius-*`, `--text-*`,
`--rail-width`, `--context-width`, elevation, motion) matches the template `:root`
one-to-one and must be used semantically (W3).

---

## 1. Desktop layout — the 3-column canvas

The template lays Me out on the standard app canvas: **left rail 250px · centre feed
~42rem · right context column 320px**, centred within `--canvas-max` (1440px) with
`--gutter` (`--space-6`). The current impl has **no right context column** — this is
the single biggest gap (see GAP-A).

### Left rail (250px) — shared shell, `AppShell.tsx`
Order top→bottom (from template `nav[aria-label="Primary"]`):
1. `tacet` wordmark + mark (brand, links to Today).
2. **Search control** — `[role=button aria-label="Search people, communities, conversations"]` with label `Search` and a `⌘K` mono hint chip. *(Present in template rail; absent in our rail — see GAP-H. Search is a not-yet-built surface, so this must be an honestly-disabled/`coming soon` affordance, not a live box.)*
3. Nav links in order: **Today · People · Discover · Conversations · Me** (Me active).
4. **New** primary button (opens composer).
5. Rail foot: avatar + `Renato Gusani` / `@renato` + **Switch theme** icon button.

The rail already matches items 1,3,4,5. Only Search (2) is missing.

### Centre column (`--feed-measure` = `--measure-reading` = 42rem)
This is the `.t-screen--reading` content. Order top→bottom in the template:

1. **Section eyebrow** — `Me · your place` (mono/label, tertiary). *Missing in impl — GAP-B.*
2. **Profile identity block** (`section[aria-label="Your place"]`):
   - Avatar (76px) — matches.
   - `Renato Gusani` display name (`--text-title`, weight 500, `--tracking-tight`).
   - `@renato@tacet.social` handle in **mono, `--color-text-secondary`**.
     - **W1 HONESTY:** handle is *local, not federated*. Impl currently renders
       `@renato` (no domain) plus an "Edit handle" hint that says
       *"Local for now — not yet a @you@tacet.social address."* Keep that honest
       framing. Do **not** hardcode `@renato@tacet.social` as if federated. If a
       server domain suffix is shown it must be presented as aspirational/local,
       not as a live fediverse address (W5: no protocol words like "fediverse"/
       "ActivityPub" in visible copy).
   - Bio line: `Building calm things for the open web. VNTA by day, long walks by evening.` (this is placeholder data; impl reads live `p.bio`, falling back to `A calm home on the open social web.` — keep the live-data behavior, the template string is just sample content).
   - Actions row: **Edit profile** and **View as public** (template order: Edit then View). Impl has both (`Edit`, `View as public`) — align labels to `Edit profile` + `View as public` and order Edit-first (GAP-C).
3. **Tab list** (`div[role=tablist]`): **Moments · Saved · Collections · Reading Later** (+ template shows a **Pinned** row-label just under the tabs — Pinned/Reading are sub-groupings). Impl tabs are `Saved · Collections · Reading later · Pinned · Notes · Recently viewed`.
   - **Template canonical tab set (desktop): `Moments`, `Saved`, `Collections`, `Reading Later`.** "Pinned" appears as an in-feed group heading, not a top tab.
   - Reconcile: rename/add a **Moments** tab (your own posted/thought items — the first-position tab), keep Saved / Collections / Reading Later. Keep our extra `Notes` and `Recently viewed` as honest additions **only if** they don't push the four canonical tabs out of primacy; prefer moving Notes+Recent behind an overflow or into the context column rather than as peer top-tabs. Order MUST lead with Moments then Saved. (GAP-D)
4. **Feed of "moments" cards** — the template's centre feed under the tabs shows the
   user's *own* entries (not remote saved posts):
   - Card 1 (with media, `role=img aria-label="A desk by a window, evening light"`):
     title **"Why I keep a slow blog in 2026 — and why it lives on my own address."**
     meta line **`Article · shared with everyone · June 30`**.
   - Group heading **`This week`**.
   - Card 2: **"Spent the evening reading instead of posting. Recommend it."**
     meta **`Thought · shared with people you follow · Tuesday`**.
   - Card 3 (draft): **"Notes from the Stage 6 design review — what "calm richness" actually asks of a product."**
     meta **`Article draft · only you · yesterday`**, with actions **Continue writing** / **Delete draft**.
   - **W1 HONESTY / product truth:** Tacet does **not yet publish/post** (composer is a
     not-yet-publishing preview per audited wording). So a "Moments" feed of the
     user's *own published posts* describes a capability the product doesn't have.
     Resolve one of two honest ways:
     - (preferred) Map "Moments" to the things that DO exist and are the user's own:
       **drafts + private notes** (both local, both real), labelled honestly
       (`Draft · only you`, `Private note · only you`). Keep the "shared with everyone /
       people you follow" meta strings **out** until publishing exists.
     - Or, if Moments cannot be truthfully populated, **fence it**: render the tab but
       with an honest empty state (`Nothing published yet — the composer is a preview
       for now`) rather than faking shared posts.
   - Meta line format `<Kind> · <audience> · <relative time>` in mono/meta, tertiary.
5. **Feed footer note** — `Your place. No numbers live here — nothing on this page is a score.` (mono/meta, tertiary, centred-ish). *Missing in impl — GAP-E. This is the ADR "no scores here" affirmation and must be present.*

**Modules that live in the CENTRE column, not the context column:** the profile
identity block, the tablist, the moments/saved feed, and the "no numbers" footer note.

### Right context column (320px) — `aside`, currently ABSENT
The template right column (`--context-width` = 320px) stacks these modules top→bottom:

1. **"For you only" card** (`aside[aria-label="For you only"]`):
   - Title **`For you only`**.
   - **`3 drafts waiting`** (live count of local drafts).
   - Sub-label **`private — only you see this`** (mono/micro, tertiary).
   - Link/CTA **`Continue writing`**.
   - W1: this is honest — drafts are local + private. Count must be live, not `3`.
   - **Dead-control note:** if drafts editing isn't wired, `Continue writing` must be
     honestly disabled (`coming soon`) rather than a no-op link.
2. **Workspace switcher card**:
   - Heading **`Workspace`**.
   - Current: **`Personal`** / `@renato@tacet.social` (mono).
   - Other: **`VNTA · Workspace`** / `@vnta@tacet.social` (mono).
   - **Switch** button.
   - W1/W5: handles are local — same honesty rule as the profile handle (don't imply a
     live federated address). Workspace data exists in the API
     (`api.getProfileAndWorkspace`, `api.renameWorkspace`) — the model currently
     supports **rename** but there is no multi-workspace list or an actual *switch*
     endpoint. So **Switch must be honestly disabled (`coming soon`)** unless a real
     second workspace + switch route exists. Show the single real workspace as the
     current one; the second row (`VNTA · Workspace`) is sample data — only render a
     second workspace if the API returns one.
3. **"Your home, portable" card**:
   - Title **`Your home, portable`**.
   - Body **`Your identity, people and history can leave with you, any time.`**
   - Link **`Settings & portability`**.
4. **Connectivity module** (`ConnectivityPanel.tsx`) — the template closes the context
   column with the open-web connectivity affirmation:
   - **`You're connected across the open social web.`**
   - Link **`Learn how it works`**.
   - Our `ConnectivityPanel` is richer (title *"Your home is connected"*, per-family
     watch counts, a live foot line). **Keep the live ConnectivityPanel** — it is the
     honest, data-backed version of the template's static line. Place it in the context
     column. Do not downgrade it to the static one-liner; the template line is the
     placeholder, our panel is the truthful build. (See GAP-A placement.)

**Appearance/theme control:** the template has **no** in-page Appearance card on Me
(theme lives only in the rail "Switch theme" icon button). Our `AppearanceControl`
card is an extra. Options: (a) drop the in-page Appearance card to match the template
(theme toggle already exists in the rail), or (b) if kept, move it to the **bottom of
the context column** as a secondary utility, never above the profile. Prefer (a) for
template fidelity. (GAP-F)

---

## 2. Mobile layout

Template `Me Mobile.html` decoded structure, top→bottom:

### Top bar (56px, `--topbar-height`)
- `tacet` wordmark (left).
- **Search** icon button (`aria-label="Search"`).
- **Me** icon button (`aria-label="Me"`) — profile/settings entry.

Our mobile top bar (`AppShell` `.t-topbar`) has the wordmark + a theme toggle only.
Add the **Search** affordance (honestly disabled — Search surface not built, GAP-H)
and the **Me** button. Keep the theme toggle or fold it behind the Me/Settings entry.

### Content (single column, full-width)
1. Profile block: avatar, `Renato Gusani`, `@renato@tacet.social` (mono; same W1
   local-handle honesty), bio `Building calm things for the open web. VNTA by day,
   long walks by evening.`
2. Actions row: **Edit profile · View as public · Settings** (mobile adds a **Settings**
   button not present on desktop — wire it or honestly disable if no settings surface).
3. Tab list (`role=tablist`): **Moments · Saved · Collections · Reading** (mobile
   abbreviates "Reading Later" → **Reading**). Below tabs, group heading **Pinned**.
4. Moments feed (same three sample cards, abbreviated meta on mobile):
   - `Why I keep a slow blog in 2026 — and why it lives on my own address.` —
     `Article · shared with everyone · June 30`.
   - group heading `This week`.
   - `Spent the evening reading instead of posting. Recommend it.` —
     `Thought · people you follow · Tuesday`.
   - `Notes from the Stage 6 design review.` — `Draft · only you · yesterday` +
     **Continue writing**.
   - Same W1 honesty resolution as desktop (drafts/notes are real; shared-post meta
     only once publishing exists).
5. Footer note: **`Your place. Nothing on this page is a score.`** (mobile-shortened).

The context-column modules (For you only / Workspace / Your home portable /
Connectivity) are **not shown inline** in the mobile template's Me feed — on mobile
they collapse away (reachable via the **Me/Settings** button). Do not stack the 320px
context modules into the mobile feed; keep the mobile Me screen to profile + tabs +
moments + footer note.

### Bottom tab bar (72px, `--tabbar-height`) + FAB
Template `nav[aria-label="Primary"]`: **Today · People · [New FAB, centre,
`aria-label="New"`] · Discover · Chats**.
- Mobile tab bar is a **4-item bar with a centre New FAB**, and labels differ from
  desktop: **Today, People, Discover, Chats** (Conversations → **Chats** on mobile),
  with **Me reached via the top-bar Me button**, not the tab bar.
- Our current `.t-tabbar` renders all five (Today/People/Discover/Conversations/Me) as
  peers and a separate floating FAB. Reconcile to the template: 4 tabs
  (Today, People, Discover, **Chats**) + centre-embedded **New** FAB; move **Me** to
  the top bar. (GAP-G) *(Note: this touches AppShell, which is shared shell, not one of
  the three Me files — flag for the shell pass; do not silently diverge the Me screen
  from the shell.)*

---

## 3. Exact human copy (canonical strings)

Centre / profile:
- Eyebrow: `Me · your place`
- Handle (local, honest): `@renato@tacet.social` shown, with edit hint
  `Local for now — not yet a @you@tacet.social address.`
- Actions: `Edit profile`, `View as public` (desktop); + `Settings` (mobile)
- Tabs (desktop): `Moments`, `Saved`, `Collections`, `Reading Later`
- Tabs (mobile): `Moments`, `Saved`, `Collections`, `Reading`
- In-feed group headings: `Pinned`, `This week`
- Footer note (desktop): `Your place. No numbers live here — nothing on this page is a score.`
- Footer note (mobile): `Your place. Nothing on this page is a score.`

Context column:
- `For you only` / `3 drafts waiting` (live) / `private — only you see this` / `Continue writing`
- `Workspace` / `Personal` / `VNTA · Workspace` / `Switch`
- `Your home, portable` / `Your identity, people and history can leave with you, any time.` / `Settings & portability`
- `You're connected across the open social web.` / `Learn how it works`
  — superseded by live `ConnectivityPanel` copy (`Your home is connected`, per-family
  `watching N`, foot line `N sources · N homes seen · N recent posts · refreshed …`).

Meta-line format: `<Kind> · <audience> · <relative time>` — kinds `Article`, `Thought`,
`Article draft`/`Draft`; audiences `shared with everyone`, `shared with people you
follow`, `only you`. **Only `only you` (drafts/notes) is truthful today** (W1).

---

## 4. Semantic tokens used (W3)

- Type: `--font-sans` (Hanken Grotesk) body/headings; `--font-mono` (Spline Sans Mono)
  for handles, meta lines, `⌘K`, counts, footer note.
- Sizes: name `--text-title`; eyebrow/labels `--text-label`; handle `--text-meta`;
  bio `--text-body`; meta lines `--text-meta`/`--text-micro`; footer note `--text-meta`.
- Color: name `--color-text-primary`; handle/bio `--color-text-secondary`;
  eyebrow/meta/footer `--color-text-tertiary`; accent controls/active tab
  `--color-accent` on `--color-accent-subtle`.
- Surfaces: profile + context cards `--color-surface-raised` / `--color-surface` with
  `--color-hairline` borders, `--radius-lg`, `--elevation-1`.
- Layout: `--rail-width` 250px, `--feed-measure`/`--measure-reading` 42rem,
  `--context-width` 320px, `--canvas-max` 1440px, `--gutter` `--space-6`,
  `--topbar-height` 56px, `--tabbar-height` 72px, `--fab-size` 56px.
- Spacing between modules: `--space-5`/`--space-6`. Presence dot / pips
  `--dot-presence`.

## 5. Interaction & accessibility behaviors

- Tabs: `role=tablist` / `role=tab` with `aria-selected`; click switches the centre
  feed; keyboard arrow support (currently plain buttons — acceptable but ensure
  `aria-selected` is set, which it is).
- Profile Edit: opens the in-card edit form (impl already does; keep). Save → PATCH →
  reload. Cancel restores. All fields functional.
- View as public → navigates to `/me/preview` (impl: `navigate("/me/preview")`) — keep.
- Every control WORKS or is honestly disabled:
  - **Search** (rail + mobile top bar): surface not built → **disabled `coming soon`**.
  - **Workspace Switch**: no real switch route/second workspace → **disabled
    `coming soon`** (rename works via `api.renameWorkspace`, but switch does not).
  - **For you only → Continue writing / Moments Continue writing / Delete draft**:
    wire to real draft editing/deletion if a drafts store exists; otherwise
    **disabled `coming soon`**. Do not leave `href="#"` no-ops (the template uses
    `href="#"` placeholders — these are dead in the template and MUST become real or
    disabled).
  - **Settings** (mobile) / **Settings & portability** link: route to a real settings
    view or disable honestly.
  - **Learn how it works**: link to real docs/help or disable.
- Reduced motion (W4): no autoplay/looping; theme/surface transitions already gated by
  `prefers-reduced-motion` in `theme.css`. AA contrast: keep tertiary text at token
  values (they pass on both canvases); footer "no score" note must stay ≥ AA.
- No self-directed numbers anywhere on Me (ADR): no follower/like/score counts on the
  profile or feed. The only counts allowed are the connectivity module's world-directed
  watch counts and the local "N drafts waiting" / collection post counts.

---

## 6. GAP LIST — concrete edits to conform impl to template

**GAP-A (structural, highest priority): add the right context column.**
Me is currently a single 42rem column (`.t-screen--reading`) with `ConnectivityPanel`
and `AppearanceControl` stacked *inside* the centre. Introduce a Me-level 2-part canvas
inside `.t-main`: centre feed (42rem) + right context column (320px, `--context-width`),
collapsing the context column below `--bp-lg`. Move into the context column, in order:
(1) a new **"For you only"** drafts card, (2) a **Workspace** switcher card,
(3) a **"Your home, portable"** card, (4) the existing **`ConnectivityPanel`**. Remove
`ConnectivityPanel` from its current position at the top of the centre column
(`Me.tsx` line 36).

**GAP-B: add the `Me · your place` eyebrow** above the profile card (mono/label,
tertiary).

**GAP-C: profile actions** — relabel/re-order to `Edit profile` (currently `Edit`) then
`View as public`; template order is Edit-first. Keep both live.

**GAP-D: tab set + order** — lead with a **`Moments`** tab (position 1), then `Saved`,
`Collections`, `Reading Later`. Demote `Notes` and `Recently viewed` out of the primary
top-tab row (overflow or context column) so the four canonical tabs match the template.
Mobile: abbreviate `Reading Later` → `Reading`.

**GAP-E: add the footer affirmation note** at the bottom of the centre feed:
`Your place. No numbers live here — nothing on this page is a score.` (desktop) /
`Your place. Nothing on this page is a score.` (mobile). Mono/meta, tertiary.

**GAP-F: Appearance card** — remove the in-page `AppearanceControl` card from Me (theme
lives in the rail toggle, matching the template), or move it to the bottom of the context
column as a minor utility. Prefer removal.

**GAP-G (shell, flag): mobile tab bar** — reconcile `AppShell` mobile nav to the
template: 4 tabs `Today · People · Discover · Chats` (Conversations→**Chats** label on
mobile) with the **New** FAB embedded centre, and **Me** moved to the top bar as an icon
button. This is shell scope, not a Me-file edit — coordinate with the shell pass.

**GAP-H (shell, flag): Search affordance** — add the `Search` control to the rail
(`Search` + `⌘K` mono hint) and a `Search` icon button to the mobile top bar. Search is
not a built surface → render **honestly disabled (`coming soon`)**, not a live input.
Shell scope.

**GAP-I: Moments feed content honesty (W1)** — the template's Moments cards show
*published* posts with `shared with everyone` / `shared with people you follow` meta.
The product does not publish yet. Populate Moments from real local data only (drafts +
private notes, meta `only you`) OR fence with an honest empty state
(`Nothing published yet — the composer is a preview for now`). Never render fake
shared-audience meta.

**GAP-J: handle honesty (W1/W5)** — keep the handle presented as local, with the
existing edit hint. Do not present `@renato@tacet.social` (or any domain suffix) as a
live federated address; no protocol words in copy.

**GAP-K: dead-button audit** — the template uses `href="#"` for `Continue writing`,
`Settings & portability`, and `Learn how it works`, and a `Switch` button with no
backing route. In the build, each must be a real route/action OR `disabled` with a
`coming soon` affordance. No `href="#"` or silent no-ops ship.

**GAP-L: media on Moments cards** — card 1 carries a `role=img` cover
(`aria-label="A desk by a window, evening light"`). Reuse the existing `PostMedia`
pattern with real `alt` text; do not ship decorative placeholder imagery without an
honest alt (AA/W4). Only render media that exists in the underlying entry.

**Keep as-is (already conformant):** avatar sizing (76px), profile edit form fields,
`View as public` → `/me/preview`, `SavedCard` local-only actions (Pin/Later/Note/
Collect/Open/Remove) with no writes to the open web, `ConnectivityPanel`'s
world-directed watch counts (superior to the template's static line), the full
semantic-token vocabulary in `theme.css`, and the locked Hanken Grotesk + Spline Sans
Mono type (do NOT adopt the template's Jost/Space Mono).
