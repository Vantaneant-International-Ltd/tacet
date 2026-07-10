# People — fidelity spec

Conformance target for the **People** surface. Source of truth: `docs/10-design/hifi/handoff/People Desktop.html` + `People Mobile.html`. Current impl: `client/src/app/screens/People.tsx` (screen) + `client/src/app/live.tsx` (`LivePerson`, `SourceNote`, `Identity`), rendered inside `client/src/app/AppShell.tsx`. Data: `usePeople()` from `client/src/app/openweb.ts`.

Type system is LOCKED: **Hanken Grotesk + Spline Sans Mono** (the templates ship Jost/Space Mono — ignore; our vendored kit is the one type system per `theme.css`). All tokens below are semantic (W3). Reduced-motion static + AA contrast honoured (W4). No protocol words in UI copy (W5). Honesty carve-outs are called out inline (W1). Every interactive control must WORK or be honestly disabled ("coming soon").

---

## 0. Where People lives

People is a **primary pillar** (rail + tab bar position 2) and a full screen at `/people`. No architectural relocation needed — unlike Saved/Me, People is already its own route.

The one shared architectural gap: the app **shell is single-column** (`t-main`, `grid-template-columns: 250px 1fr` at desktop — see `app.css:87`). The template is the **3-column canvas**: left rail 250px · centre feed 42rem · **right context column 320px**. This spec introduces the context column as a real, reusable shell region (the same region the Me/Saved specs call for — build it once). If the context region is deferred, the "In focus" / "You both know" / "Recently around" modules (§4) must be **honestly omitted**, not stubbed with fake data — they read as real relationship state and must never show invented people.

The current impl is also **fundamentally different in shape**: it is a **flat, searchable, single list** of live open-web people with a search box and a source note. The template has **no search box** and instead **groups people into three named bands** ("Around now" / "Your people" / "New for you") plus the context column. See the gap list (§7) for how to reconcile — decision: **conform to the banded layout, keep the honest live/sample source note, and keep search as an honest addition demoted below the masthead** (search over your own people is truthful and useful; it is not a template lie).

---

## 1. Desktop layout — the 3-column canvas

Overall page: `--color-canvas` background, text `--color-text-primary`, `--font-sans`, weight 400. The three columns are centred; the shell grid is:

```
grid-template-columns: 250px  minmax(0, var(--measure-reading))  var(--context-width);
gap: var(--gutter);            /* = var(--space-6) = 32px */
justify-content: center;
```

Template tokens confirmed from `People Desktop.html`: `--context-width: 320px`, `--gutter: var(--space-6)`, `--measure-reading: 42rem`, `--dot-presence: 8px`, `--tracking-wide: 0.02em`, `--tracking-tight: -0.02em`, `--border-hairline: 1px`, `--leading-tight: 1.15`, `--leading-snug: 1.30`, `--leading-relaxed: 1.60`. (Add `--rail-width: 250px`, `--context-width`, `--gutter` as semantic tokens if not present — see §6.)

### 1.1 Left rail — 250px (`--rail-width`)
Shared app chrome, already built in `AppShell.tsx`. On this surface: the **People** pillar is the active one — `is-active` + `aria-current="page"`. Rail order MUST be **Today · People · Discover · Conversations · Me**; Conversations carries the accent presence dot (`t-navitem__dot`), never a count. No People-specific rail changes.

### 1.2 Centre feed — `minmax(0, 42rem)` (`--measure-reading`)
`<section aria-label="Your people">`, padding `var(--space-8) 0 var(--space-9)`, `min-width:0`. Contents in order:

1. **Masthead header** (`margin-bottom: var(--space-7)`)
   - **Eyebrow**: text **"People"** — `--text-micro`, weight 500, `--tracking-wide`, `--color-text-tertiary`.
   - **h1**: **"Your people."** — `--text-display`, weight 400, `--tracking-tight`, `--leading-tight`, `margin: var(--space-3) 0 0`.
   - **Subhead**: **"The relationships that make this home. Faces first, no audience, nothing to count."** — `--color-text-secondary`, `--text-body-sm`, `--leading-relaxed`, `margin: var(--space-3) 0 0`.

2. **Source note** (W1 honesty addition — keep from current impl). One quiet line after the masthead, before the first band. Copy per mode (from `SourceNote` in `live.tsx`, keep verbatim): live → "Live from the open social web · <source>"; cached → "Recent activity from the open social web"; sample → "Showing sample content — we couldn't reach the open social web just now." Styling `.t-sourcenote` (`--text-meta`, `--color-text-tertiary`, a small dot). This is the honest replacement for any implied "these are your friends" framing when data is live/sample rather than a real follow graph.

3. **Search** (honest addition, demoted). One search input row (`.t-search`) directly under the source note, above the first band: leading search glyph + `type="search"`, placeholder **"Search people by name or @handle"**, `aria-label="Search people"`. Filters the rendered people by name/handle (already works in `People.tsx`). When a query is active, collapse the three bands into a single flat filtered `.t-list` and show the empty state (§3) if nothing matches. This is truthful (search over the people shown), so it is retained — but it is NOT the template's primary layout; the banded layout is default when the search is empty.

4. **Band: "Around now"** — the presence band. A band label row then **featured rows**:
   - **Band label row** (`display:flex; align-items:center; gap:var(--space-3); margin-top:var(--space-2)`): a `<span>` **"Around now"** (`--text-micro`, weight 500, `--tracking-wide`, `--color-text-tertiary`, `flex:none`) + a hairline rule `<span aria-hidden="true">` filling the rest (`height: var(--border-hairline)`, `background: color-mix(in srgb, var(--color-hairline) 60%, transparent)`).
   - **Featured person rows** (2 in template): `display:flex; align-items:center; gap:var(--space-4); padding:var(--space-3) var(--space-2)`.
     - **Avatar** 44px, `--radius-full`.
     - **Body** (`min-width:0; flex:1`): a **presence line** = `<span>` presence dot (`width/height: var(--dot-presence)`, `--radius-full`, `background: var(--color-accent)`, `box-shadow: 0 0 8px var(--color-accent)`, `flex:none`) + name `<span>` (`--text-subheading`, weight 500, `--leading-snug`); then mono handle `<div>` (`--font-mono`, `--text-meta`, `--color-text-tertiary`, `margin-top: var(--space-1)`); then a relationship note `<div>` (`--text-body-sm`, `--color-text-secondary`, `margin-top: var(--space-1)`).
     - **Trailing control**: the **Following** pill (§5).
   - Template featured people + copy (exact):
     - **Alex Rivera** · `@alex@tacet.social` · "You talk most mornings." · Following
     - **Cassie Lin** · `@cassie@pixelfed.social` · "Sends the best film photos." · Following

5. **Band: "Your people"** — the main relationship list. Band label row (same pattern, text **"Your people"**), then compact person rows (no presence dot). Each row: avatar (44px), body = name (`--text-subheading`/500) + mono handle + a note line, trailing **Following** pill. Template people + copy (exact):
   - **Mara Ito** · `@mara · on tacet.social` · "A close friend. Writing something long at the moment." · Following
   - **Tobi Wren** · `@tobi@lemmy.ml` · "Slow mornings, good questions." · Following
   - **Maya Okonkwo** · `@maya@mastodon.social` · "Replies often, always kind." · Following
   - **Chris Hall** · `@chrish@mastodon.social` · "You met in a thread about the open web." · Following

   Note handle format: **Mara** uses `@mara · on tacet.social` (local handle + home phrasing) — everyone else uses full `@user@home`. Preserve whatever the live adapter returns; the template is showing the two valid identity shapes, not a required literal.

6. **Band: "New for you"** — discovery / requests band. Band label row (text **"New for you"**), then rows shaped like "Your people" but the note line is a **"follows you"** relationship chip and the trailing control is **Follow** (not Following). Template (exact):
   - **Julia Reyes** · `@julia@mastodon.online` · badge **"follows you"** · **Follow** button.
   The "follows you" chip is a small inline marker (`--text-micro`, `--color-text-tertiary`), not a count.

7. **Feed footer** — one quiet closing line: **"Your whole world, in one place. Nothing here is ranked."** — `--text-meta`/`--color-text-tertiary`, centred, top hairline separation, generous top margin. This is the honest calm-not-scoreboard closing statement; keep verbatim.

### 1.3 Right context column — 320px (`--context-width`)
`<aside aria-label="About the person in focus">`, `padding: var(--space-8) 0 var(--space-9) var(--space-6)`, `align-self:start`, **`border-left: var(--border-hairline) solid color-mix(in srgb, var(--color-hairline) 70%, transparent)`**. Inner content should be **sticky** to the top on scroll (wrap the module stack so it stays in view). Modules top→bottom:

1. **"In focus"** — `<h2>` **"In focus"** (`--text-heading`, weight ~500). Then a bordered card (`border: hairline`, `--radius-lg`, `--color-surface`):
   - Avatar (larger, ~56px, `--radius-full`).
   - Name **Mara Ito** (`--text-subheading`/500).
   - Mono handle `@mara · on tacet.social` (`--text-micro`, `--color-text-tertiary`).
   - Bio `<p>` **"Writer, editor, evening photographer. Keeps a weekly letter."** (`--text-body-sm`, `--color-text-secondary`).
   - Two controls in a row: **Following** pill (solid-surface pill, §5) + **Message** button (ghost: `background:none; border:none; --color-text-secondary`, `--text-label`/500). See §5 for the honest-disable decision on both.

2. **"You both know"** — `<h2>` **"You both know"**. A row of small overlapping avatars + text **"Alex, Cassie and Tobi"** (`--text-body-sm`/`--color-text-secondary`). This is a mutuals module — real data only; omit if not derivable.

3. **"Recently around"** — `<h2>` **"Recently around"**. A short list of compact presence rows, each: small avatar + name (`--text-body-sm`) + mono handle (`--text-micro`, `--color-text-tertiary`) + a trailing relative-time `<span>` (`--text-micro`). Template rows (exact):
   - **Maya Okonkwo** · `@maya@mastodon.social` · **earlier**
   - **Chris Hall** · `@chrish@mastodon.social` · **28m**

4. **Connectivity note card** — a bordered card (`border: hairline`, `--radius-lg`) at the column foot: a dot/glyph + text **"You're connected across the open social web."** + a link row **"Learn how it works"** (with a trailing chevron/arrow icon). This is the standing connectivity affordance; it already exists in the codebase as `ConnectivityPanel.tsx` — reuse it here rather than duplicate copy. W5: keep "open social web" (product-language), no protocol words.

---

## 2. Mobile layout

Chrome (from `AppShell.tsx`, matches template):
- **Top bar** (`.t-topbar`): wordmark **"tacet"** left; right = **Search** icon button (`aria-label="Search"`) + **Me** avatar/icon button (`aria-label="Me"`). (The current shell top bar shows only the theme toggle on the right — see gap G-M1: template mobile top bar carries **Search** + **Me**, not the theme toggle. Theme toggle moves into Me/settings on mobile.)
- **Bottom tab bar** (`.t-tabbar`, `aria-label="Primary"`): five destinations with the centre **New** FAB between them: **Today · People · [New] · Discover · Chats**. Note the template mobile tab labels are **Today / People / New(FAB) / Discover / Chats** — i.e. **"Chats"**, not "Conversations", and **Me is reached from the top bar**, not the tab bar. Reconcile: our tab bar currently lists Today/People/Discover/Conversations/Me. See gap G-M2. People is the active tab here.

Body (single column, `--measure-reading` capped, comfortable mobile padding — memory: mobile must stay cosy, never dense):
1. **Masthead**: eyebrow **"People"**, h1 **"Your people."**, subhead (SHORTER on mobile): **"Faces first. Nothing here is ranked or counted."**
2. **Source note** (W1) — same honest line as desktop.
3. **Search** input (honest addition) — same as desktop, full-width.
4. **Band "Around now"** — featured rows (avatar + presence dot + name + mono handle + Following). On mobile the note line is dropped for the featured rows (template shows avatar/name/handle/Following only):
   - **Alex Rivera** · `@alex@tacet.social` · Following
   - **Cassie Lin** · `@cassie@pixelfed.social` · Following
5. **Band "Your people"** — compact rows WITH the note line:
   - **Mara Ito** · `@mara · on tacet.social` · "A close friend." · Following
   - **Tobi Wren** · `@tobi@lemmy.ml` · "Slow mornings, good questions." · Following
   - **Maya Okonkwo** · `@maya@mastodon.social` · "Replies often, always kind." · Following
   - **Chris Hall** · `@chrish@mastodon.social` · "You met in a thread." · Following
6. **Band "New for you"**:
   - **Julia Reyes** · `@julia@mastodon.online` · **"follows you"** · **Follow**
7. **Feed footer**: **"Your whole world, in one place."** (shorter than desktop; drop the second sentence).

The **context column modules (In focus / You both know / Recently around) do NOT appear on mobile** — the template drops the aside entirely on mobile. Do not surface them elsewhere on the mobile People screen.

---

## 3. Empty / loading / error states (keep from current impl, retitle to match voice)
- **Loading**: `Loading` primitive, label **"Finding people"** (soft pulsing dot, no spinner; reduced-motion static — W4).
- **Error**: `EmptyState` icon `people`, title **"We couldn't load People"**, body **"Something interrupted the connection. Give it a moment and try again."**
- **Empty (no search)**: title **"No one to show yet"**, body **"The open web is quiet right now — check back soon."**
- **Empty (active search, no match)**: title **"No one by that name"**, body **"Try a different search."**

These are honest and already implemented — keep verbatim; they satisfy the sample-degradation requirement.

---

## 4. Interaction behaviors

- **Person row → profile**: the whole row (avatar + identity block) is a link to the person's profile (`profilePath(person.id)` — already wired via `LivePerson`'s `Link`/`.t-personrow__open`). Hover tints the name to `--color-accent` (`app.css:201`). Keep.
- **Follow / Following**: **NOT wired** (read-only milestone). The template renders both as live buttons — they must be **honestly disabled** ("coming soon"), never fake toggles. Current impl already does this (`LivePerson`: `<Button variant="secondary" size="sm" disabled title="Coming soon">Follow</Button>`). Extend the same honest-disable to the **Following** pills in the "Around now" / "Your people" bands and the **Follow** button in "New for you". Visual: keep the template pill styling (solid-surface `Following`, same outline `Follow`) but `disabled` + `title="Coming soon"` + accessible name suffixed "— coming soon".
- **Message** (context column "In focus"): messaging/compose is **not publishing** in this milestone (W1) — honestly disable ("coming soon"). Do not link it to a dead compose.
- **"Learn how it works"** (connectivity card): links to the connectivity/how-it-works panel or route that already backs `ConnectivityPanel.tsx`. If no destination exists, render as static text (no dead link) — must WORK or not be a link.
- **Search**: live client-side filter over rendered people (already works). Reduced-motion: no animated list reflow.
- **Presence dot** ("Around now" + rail Conversations): static accent glow, never a number. Under `prefers-reduced-motion` it must not pulse.
- **Theme**: rail/top-bar toggle only; unaffected here.

---

## 5. The pill / button family (exact template styling)

All three People controls share one pill shape:
```
padding: var(--space-2) var(--space-4);
border-radius: var(--radius-full);
font-size: var(--text-label); font-weight: 500;
```
- **Following** / **Follow** (outline pill): `background: var(--color-surface)`, `color: var(--color-text-primary)`, `border: var(--border-hairline) solid var(--color-hairline)`, `transition: border-color var(--dur-1) var(--ease-out)`. (Template renders "Following" and "Follow" with the SAME outline styling — the difference is label only, not a filled vs outline distinction. Do not invent a filled "Following" state.)
- **Message** (ghost): `background:none`, `border:none`, `color: var(--color-text-secondary)`, `transition: color var(--dur-1) var(--ease-out)`.

Map to our primitives: `Button variant="secondary" size="sm"` already produces the outline pill shape via `.t-btn`; `variant="ghost"` for Message. All disabled per §4. Do not hardcode any color/space — semantic tokens only (W3).

---

## 6. New tokens (add to `tokens.md` + `theme.css` if absent)
- `--rail-width: 250px`
- `--context-width: 320px`
- `--gutter: var(--space-6)`
- `--dot-presence: 8px`
- `--tracking-wide: 0.02em`, `--tracking-tight: -0.02em` (if not already present under other names)
- Leading tokens `--leading-tight: 1.15`, `--leading-snug: 1.30`, `--leading-relaxed: 1.60` (if not already present)
All values above are read directly from the template `:root`. No new colors are introduced — the presence-dot glow reuses `--color-accent`.

---

## 7. GAP LIST — concrete edits to make `People.tsx` + `live.tsx` match the template

Most important first.

**G1 — Introduce the 3-column canvas + right context column (shell-level).** The shell is single-column (`app.css:87`, `t-main`). Add the `--context-width` (320px) `aside` region and grid so People (and Me/Saved) can render a context column. Grid: `250px minmax(0, var(--measure-reading)) var(--context-width)`, `gap: var(--gutter)`, `justify-content:center`. If deferred, honestly OMIT §1.3 modules (do not stub with invented people).

**G2 — Replace the flat list with the three named bands.** `People.tsx` currently renders one `.t-list` of `LivePerson`. Restructure into bands **"Around now" → "Your people" → "New for you"**, each preceded by a band-label row (label span + hairline rule) per §1.2.4. When search is empty, render banded; when a query is active, collapse to a single filtered list.

**G3 — Add the masthead.** Replace the current `SectionHeading title="People"` with the template masthead: eyebrow "People", h1 **"Your people."** (`--text-display`/400/`--tracking-tight`), subhead **"The relationships that make this home. Faces first, no audience, nothing to count."** (desktop) / **"Faces first. Nothing here is ranked or counted."** (mobile).

**G4 — Add the "Around now" presence variant of the person row.** New featured-row variant with the accent presence dot before the name (`--dot-presence`, `box-shadow:0 0 8px var(--color-accent)`) and the relationship note line. `LivePerson` today has no presence dot and puts bio (not a relationship note) below identity. Add a `presence`/`featured` variant.

**G5 — Add the relationship note line to person rows.** Template rows carry a human note ("You talk most mornings.", "Replies often, always kind.") in `--text-body-sm`/`--color-text-secondary`. `LivePerson` renders `person.bio` in that slot — acceptable as the live equivalent, but the sample/band content must use these note strings. Keep bio for live data; use the template notes for the sample fallback.

**G6 — Add the "New for you" band with the "follows you" chip + Follow control.** Currently absent. Add the band, the inline "follows you" marker (`--text-micro`/`--color-text-tertiary`), and the outline **Follow** button (honestly disabled — G9).

**G7 — Add the feed footer line.** Append **"Your whole world, in one place. Nothing here is ranked."** (desktop) / **"Your whole world, in one place."** (mobile) as a quiet centred `--text-meta`/`--color-text-tertiary` closing line with a top hairline. Currently absent.

**G8 — Build the context column modules (desktop only):** "In focus" card, "You both know" mutuals row, "Recently around" list, and reuse `ConnectivityPanel.tsx` for the connectivity card. Per §1.3. Real data only; omit any module whose data isn't derivable rather than invent it. Do NOT render the aside on mobile.

**G9 — Honestly disable every Follow/Following/Message control.** The template shows them all as live buttons. Current `LivePerson` correctly disables its single "Follow"; extend to the "Around now"/"Your people" **Following** pills, the "New for you" **Follow**, and the context-column **Message** — all `disabled` + `title="Coming soon"` + accessible name "— coming soon" (W1). Following pills must NOT appear active/toggled.

**G10 — Reconcile the pill styling to the template family (§5).** Ensure "Following"/"Follow" use the outline pill (surface bg, hairline border, `--radius-full`, `--text-label`/500) and Message uses the ghost variant. No filled "Following" state.

**G11 — Keep search but demote it below the masthead + source note (W1 honest addition).** Do not remove it (search over your own people is truthful), but it is not the primary layout; banded view is default. Placeholder **"Search people by name or @handle"**, `aria-label="Search people"`.

**G12 — Keep the honest source note (`SourceNote`) and all four honest state strings (§3).** These satisfy the sample-degradation + honesty requirement (W1) and must survive the refactor unchanged. Never let the banded "your people" framing imply a real follow graph when data is live/sample — the source note carries that honesty.

**G-M1 — Mobile top bar: Search + Me, not theme toggle.** `AppShell.tsx` `.t-topbar__actions` renders only `<ThemeToggle/>`. Template mobile top bar carries a **Search** button (`aria-label="Search"`) and a **Me** button (`aria-label="Me"`). Move theme toggle into Me/settings on mobile; add Search + Me to the top bar. (Shell-level; shared across surfaces.)

**G-M2 — Mobile tab bar labels/set.** Template mobile tabs: **Today · People · [New FAB] · Discover · Chats** (Me reached from top bar; "Chats" not "Conversations"). Current `NAV` renders all five as tabs including Me and labels Conversations. Reconcile at shell level (note: this is shared chrome — coordinate with the Conversations/Me specs; do not silently rename in isolation). At minimum, People's tab is position 2 and active here.

**G13 — Add layout/leading tokens (§6)** to `theme.css`/`tokens.md` if absent: `--rail-width`, `--context-width`, `--gutter`, `--dot-presence`, tracking + leading tokens. No new colors.

---

## 8. Whitelist deviations applied (audit trail)
- **W1 honesty**: search retained + demoted (truthful, not a template lie); `SourceNote` + all four state strings kept; Follow/Following/Message honestly disabled ("coming soon"); the source note carries the honesty that banded "your people" is live/sample content, not a real follow graph; context modules omitted rather than faked when data isn't derivable.
- **W3**: semantic tokens only throughout; no hardcoded color/space.
- **W4**: reduced-motion static (presence dot no pulse, no list-reflow animation); AA contrast on all text tokens.
- **W5**: "open social web" kept (product language); no protocol words in any UI string.
