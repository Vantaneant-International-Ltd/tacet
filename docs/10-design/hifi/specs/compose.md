# Compose — fidelity spec

Surface: the composer. Templates: `docs/10-design/hifi/handoff/Compose Desktop.html`,
`docs/10-design/hifi/handoff/Compose Mobile.html`. Current impl:
`client/src/app/ComposeSheet.tsx` (the composer) mounted by `client/src/app/AppShell.tsx`
(rail "New" button + mobile FAB). Type system is LOCKED (Hanken Grotesk + Spline Sans Mono;
tokens `--font-sans` / `--font-mono`). Deviations only where a Whitelist item (W1/W3/W4/W5) is cited.

The composer is not a route. It is an overlay opened from the rail's primary "New" button
(desktop) and the FAB (mobile), and dismissed on route change. It overlays whatever canvas is
behind it (the template shows it over Today). No new context-column module is introduced by this
surface — the 3-column canvas (left rail 250px / centre feed `--measure-reading` 42rem /
right context column 320px) belongs to the surface underneath and is unchanged here.

---

## A. Desktop layout — CENTERED MODAL (not a bottom sheet)

Template markup (verbatim structure):

```
<div [scrim] position:fixed; inset:0; z-index:50;
     background: color-mix(in srgb, #000 62%, transparent);
     display:flex; align-items:center; justify-content:center; padding: var(--space-6)>
  <div role="dialog" aria-modal="true" aria-label="New"
       width:640px; max-width:100%; max-height:90vh; overflow:auto;
       background: linear-gradient(180deg, color-mix(in srgb, var(--color-surface-raised) 80%, var(--color-surface)) 0%, var(--color-surface) 100%);
       border: var(--border-hairline) solid color-mix(in srgb, var(--color-hairline) 60%, transparent);
       border-radius: var(--radius-xl);
       box-shadow: var(--elevation-3), var(--edge-highlight);
       padding: var(--space-6)>
```

Order of modules inside the dialog (top to bottom):

1. **Header row** — `display:flex; align-items:center; margin-bottom: var(--space-5)`.
   - `<h2>New</h2>` — `--text-heading`, weight 500, `line-height: var(--leading-snug)`, `margin:0`.
   - Close button pushed right (`margin-left:auto`), 44×44, `aria-label="Close"`, radius-full,
     `--color-text-secondary`; hover `background: var(--color-surface-sunken); color: var(--color-text-primary)`.
   - NOTE: on desktop the header has NO primary action. Share lives in the footer.

2. **Post-type selector** — `role="radiogroup" aria-label="What are you making?"`.
   Segmented control: `display:flex; gap: var(--space-1); padding: var(--space-1);
   background: var(--color-surface-sunken); border: var(--border-hairline) solid
   color-mix(in srgb, var(--color-hairline) 60%, transparent); border-radius: var(--radius-lg);
   margin-bottom: var(--space-5)`.
   Five `role="radio"` buttons, each `flex:1`, **icon-above-label column**
   (`flex-direction:column; align-items:center; gap: var(--space-2); padding: var(--space-3) var(--space-2);
   border-radius: var(--radius-md); font-size: var(--text-micro); weight 500`).
   Order and labels: **Thought · Photo · Article · Video · Event**.
   Selected = **Thought** (`aria-checked="true"`): fill
   `linear-gradient(180deg, color-mix(in srgb, var(--color-accent-subtle) 70%, transparent) 0%, var(--color-accent-subtle) 100%)`,
   border `color-mix(in srgb, var(--color-accent) 25%, var(--color-hairline))`, color `--color-accent`.
   Unselected: `background:none; border: hairline transparent; color: var(--color-text-secondary)`;
   hover `color: var(--color-text-primary)`; transition `color var(--dur-1) var(--ease-out)`.

3. **Author row** — `display:flex; align-items:center; gap: var(--space-3); margin-bottom: var(--space-4)`.
   - Avatar 36×36, radius-full (template uses a radial-gradient placeholder; impl uses the
     `Avatar` primitive with `me.name`).
   - Name/handle stack (`min-width:0; flex:1`): line 1 `Renato Gusani` (`--text-label`, weight 500);
     line 2 `@renato · Personal` (`--font-mono`, `--text-micro`, `--color-text-tertiary`).
   - **Change author** button pushed right (`flex:none`): `padding: var(--space-2) var(--space-4);
     background:none; border:none; radius-full; color: var(--color-text-secondary); weight 500`;
     hover `color: var(--color-text-primary); background: var(--color-surface-sunken)`.

4. **Editor** — `role="textbox" aria-label="What's on your mind?" tabindex="0"`,
   `min-height:160px; padding: var(--space-2) 0 var(--space-5); font-size: var(--text-body);
   line-height: var(--leading-relaxed); color: var(--color-text-tertiary); cursor:text`.
   Placeholder-state text is the literal `What's on your mind?` in tertiary. In impl this is a real
   `<textarea>` (empty → placeholder `What's on your mind?`).

5. **Footer toolbar** — one row, `display:flex; align-items:center; gap: var(--space-2);
   border-top: var(--border-hairline) solid color-mix(in srgb, var(--color-hairline) 60%, transparent);
   padding-top: var(--space-4)`.
   - **Add-a-photo** icon button, 44×44, `aria-label="Add a photo"`, radius-full, secondary color;
     hover `background: var(--color-surface-sunken); color: var(--color-text-primary)`. (Photo/frame icon.)
   - **Audience pill** — `inline-flex; gap: var(--space-2); padding: var(--space-2) var(--space-4);
     border: var(--border-hairline) solid var(--color-hairline); radius-full; color: secondary; weight 500`.
     Contents: small globe icon (~13px) + `<span>Shared with everyone</span>` + small chevron (~14px).
     Hover `border-color: var(--color-text-tertiary); color: var(--color-text-primary)`.
   - Right cluster `margin-left:auto; display:flex; gap: var(--space-2)`:
     - **Save draft** — ghost button, `padding: var(--space-2) var(--space-4); background:none; color:
       secondary; radius-full; weight 500`; hover `color: primary; background: var(--color-surface-sunken)`.
     - **Share** — primary button, `padding: var(--space-2) var(--space-5);
       background: linear-gradient(180deg, var(--color-accent-hover) 0%, var(--color-accent) 100%);
       color: var(--color-on-accent); radius-full; weight 500; box-shadow: var(--glow-accent)`;
       hover `filter: brightness(1.06)`.

6. **Honesty note** (below footer, last child) — `--font-mono; --text-micro;
   --color-text-tertiary; margin-top: var(--space-4)`:
   `No character anxiety. No predicted reach. What you write is what they read.`

Dismiss: click on the scrim (outside the dialog) closes; Escape closes. Focus starts in the editor.

## B. Mobile layout — FULL-SCREEN PAGE (not a bottom sheet)

Root: `width:100%; max-width:430px; min-height:100vh; display:flex; flex-direction:column;
background-color: var(--color-canvas); background-image: var(--glow-ambient) [no-repeat];`
with left/right hairlines. It replaces the whole viewport (no visible canvas behind it, no tab bar).

1. **Top bar** — `position:sticky; top:0; z-index: var(--z-content); height: var(--topbar-height);
   display:flex; align-items:center; gap: var(--space-2); padding: 0 var(--space-3);
   background: color-mix(in srgb, var(--color-surface) 92%, var(--color-canvas));
   border-bottom: var(--border-hairline) solid var(--color-hairline)` — SOLID surface, no glass/blur.
   - **Cancel** — ghost text button (`padding: var(--space-2) var(--space-4); background:none;
     color: secondary; radius-full; weight 500; flex:none`); hover as ghost.
   - Title `New` centered (`margin: 0 auto; --text-subheading; weight 500`).
   - **Share** — primary button (`padding: var(--space-2) var(--space-5)`, accent gradient,
     `--color-on-accent`, radius-full, `box-shadow: var(--glow-accent)`); hover `brightness(1.06)`.

2. **Body** — `display:flex; flex-direction:column; gap: var(--space-4);
   padding: var(--space-4) var(--space-4) var(--space-8)`.
   - **Post-type selector** — `role="radiogroup" aria-label="What are you making?"`,
     horizontal **scrolling pills** (`display:flex; gap: var(--space-2); overflow-x:auto;
     padding-bottom: var(--space-1)`). Each `role="radio"` is a **pill**
     (`padding: var(--space-2) var(--space-4); radius-full; --text-label; weight 500; flex:none`),
     NOT the icon-column style used on desktop. Same order/labels/selection (Thought selected).
     Selected fill/border same accent-subtle recipe as desktop; unselected `background:none;
     border: hairline var(--color-hairline); color: secondary`, hover `color: primary`.
   - **Author row** — `display:flex; align-items:center; gap: var(--space-3)`. Avatar 36×36,
     name `Renato Gusani`, handle `@renato · Personal` (mono/micro/tertiary). Button label is
     **`Change`** (mobile) — shorter than desktop's `Change author`.
   - **Editor** — `role="textbox" aria-label="What's on your mind?"`, `min-height:180px;
     --text-body; line-height: var(--leading-relaxed); color: tertiary; cursor:text`,
     placeholder `What's on your mind?`.
   - **Footer toolbar** — `display:flex; align-items:center; gap: var(--space-2);
     border-top: hairline color-mix(...60%...); padding-top: var(--space-4)`.
     - Add-a-photo icon button, 44×44, `aria-label="Add a photo"`.
     - Audience pill: globe + `<span>Everyone</span>` + chevron (mobile label is **`Everyone`**,
       shorter than desktop's `Shared with everyone`).
     - Right cluster `margin-left:auto`: **Save draft** ghost button (no Share here; Share is in the top bar).
   - **Honesty note** (last, outside the toolbar row) — mono/micro/tertiary:
     `No character anxiety. No predicted reach. What you write is what they read.`

Dismiss on mobile: the **Cancel** top-bar button (Escape also, for keyboard users).

---

## C. Exact human copy (both breakpoints)

| Slot | Desktop | Mobile |
|---|---|---|
| Title | `New` | `New` |
| Close / cancel | `Close` (icon aria-label) | `Cancel` (text button) |
| Type options | `Thought` `Photo` `Article` `Video` `Event` | same |
| Selected type | `Thought` | `Thought` |
| Author name | `Renato Gusani` | `Renato Gusani` |
| Author handle | `@renato · Personal` | `@renato · Personal` |
| Change author | `Change author` | `Change` |
| Editor placeholder | `What's on your mind?` | `What's on your mind?` |
| Add photo (aria) | `Add a photo` | `Add a photo` |
| Audience | `Shared with everyone` | `Everyone` |
| Draft | `Save draft` | `Save draft` |
| Publish | `Share` | `Share` |
| Radiogroup aria | `What are you making?` | `What are you making?` |
| Honesty note | `No character anxiety. No predicted reach. What you write is what they read.` | same |

Note (W1): the impl author name in `me.ts` is `Renato`. Template renders full `Renato Gusani`.
The composer author block should render `me.name` (currently "Renato") — keep it honest to the
mock; do not hardcode a different name. If parity of the two lines is wanted, `me.name` is the
name line and `@{me.user} · Personal` (i.e. `@renato · Personal`) is the handle line. The
` · Personal` workspace tag is honest (personal workspace exists in `me.ts`/mock).

---

## D. Semantic tokens used (W3 — names only, no raw values)

- Type: `--font-sans` (Hanken Grotesk), `--font-mono` (Spline Sans Mono, for handle + honesty note);
  sizes `--text-heading` (title), `--text-subheading` (mobile title), `--text-body` (editor),
  `--text-label` (name / pills / buttons), `--text-micro` (type-column labels, handle, note);
  `--leading-snug` (title), `--leading-relaxed` (editor).
- Colour: `--color-canvas`, `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`,
  `--color-hairline`, `--color-text-primary/-secondary/-tertiary`,
  `--color-accent`, `--color-accent-hover`, `--color-accent-subtle`, `--color-on-accent`,
  `--color-focus-ring`.
- Radius: `--radius-md` (type columns), `--radius-lg` (segmented track), `--radius-xl` (dialog),
  `--radius-full` (pills, avatar, icon buttons).
- Spacing: `--space-1…--space-8` per module (see A/B).
- Border/alpha: `--border-hairline`; `color-mix(... var(--color-hairline) 60%, transparent)` for softened dividers.
- Elevation/atmosphere: `--elevation-3`, `--edge-highlight`, `--glow-accent`, `--glow-ambient`
  (mobile bg), `--surface-gradient`-style dialog fill (built from `--color-surface-raised`/`--color-surface`).
- Scrim (desktop): `color-mix(in srgb, #000 62%, transparent)` — matches `--alpha-scrim: 0.62`.
- Motion: `--dur-1` + `--ease-out` for hover color transitions. z-index `50` desktop scrim
  (`--z-modal`); mobile is a `--z-content` sticky top bar within a full page.

---

## E. Interaction behaviors

- **Open**: rail primary "New" button (desktop) and FAB (mobile) set `composing=true` (already wired).
- **Focus**: editor is focused on open (already wired via `areaRef`).
- **Dismiss**: Escape closes (wired). Desktop: click on scrim closes (wired via backdrop onClick +
  `stopPropagation` on dialog). Mobile: `Cancel` button closes.
- **Type selector**: `role="radiogroup"` with `role="radio"` children; selecting one sets
  `aria-checked` and moves the accent-subtle fill. Roving state in React (`useState`), keyboard:
  arrow keys move selection, Space/Enter select. Purely local UI state; changes only the visual
  affordance (no separate composer body yet). Honest and functional.
- **Editor**: real `<textarea>` bound to state; empty shows placeholder.
- **Audience pill / Change author**: these imply choosing a workspace/audience. Publishing is not
  live, so these are decorative-not-functional in the template. Per doctrine, make them **honestly
  disabled** (`disabled` + `title="Coming soon"`), OR wire them to a small popover that only
  previews the (single, honest) option "Everyone / Personal". Do NOT present a picker that promises
  audiences the product cannot enforce (W1/W5 — no capability claims, no protocol words).
- **Add a photo**: no upload/publish path exists → **honestly disabled** (`disabled`,
  `aria-disabled`, `title="Coming soon"`). Do not render a dead file input.
- **Share (primary)**: publishing to the open web is NOT live. Keep the button **disabled** with an
  honest reason. The current impl already disables "Post"; keep that behaviour but relabel to
  `Share` and keep the honesty note visible. (W1)
- **Save draft**: no persistence path exists → **honestly disabled** (`disabled`, `title="Coming soon"`)
  unless a real local-draft store is added. Do not fake a save toast.
- **Reduced motion (W4)**: the global `@media (prefers-reduced-motion: reduce)` already kills the
  slide/fade; keep the modal appearing statically. No parallax on the mobile `--glow-ambient`.
- **Contrast (W4)**: honesty note and handle are tertiary on surface — verify AA; if the mono note
  fails at `--text-micro`, bump to `--color-text-secondary` (still calm).

---

## F. GAP LIST — concrete edits to conform `ComposeSheet.tsx` (+ AppShell wiring, + app.css)

Current `ComposeSheet.tsx` renders a bottom-sheet with: header (Close / "New post" / disabled
"Post"), body (Avatar + textarea "Say something to your people…"), footer (plus + globe icon
buttons + a single Chip note). It is missing most of the template and uses glass. Edits:

1. **Retitle + relabel.** Header title `New post` → `New`. Primary button label `Post` → `Share`
   (keep `disabled`). Placeholder `Say something to your people…` → `What's on your mind?`.

2. **Desktop must be a centered modal, not a bottom sheet.**
   - `.t-sheet-backdrop`: scrim is currently `#000 45%` with `align-items:flex-end`. Change desktop
     (≥900px) to centered (already does `align-items:center`) but set scrim to
     `color-mix(in srgb, #000 62%, transparent)` and `z-index:50` (currently 60). Add
     `padding: var(--space-6)`.
   - `.t-sheet`: mobile currently a `max-width:40rem` bottom sheet. On desktop it must be
     `width:640px; max-height:90vh; overflow:auto; border-radius: var(--radius-xl)` (all four
     corners), `padding: var(--space-6)`, fill = surface-raised→surface gradient,
     `box-shadow: var(--elevation-3), var(--edge-highlight)`.
   - REMOVE the `backdrop-filter: saturate(...) blur(...)` glass on the composer scrim/sheet —
     template is explicit "solid surface + hairline, no glass". (This blur is at app.css ~line 19/43;
     confirm which rule the sheet inherits and drop it for this surface.)

3. **Mobile must be a full-screen page, not a bottom sheet.** Under `--bp-md`/`--bp-lg` render a
   full-viewport container (`min-height:100vh; max-width:430px` centered) with a **sticky top bar**
   (`Cancel` / `New` / `Share`), body, and no tab bar/canvas behind. Replace the `t-slide-up` bottom
   sheet on mobile. Keep the desktop modal path separate.

4. **Add the post-type selector** (`role="radiogroup" aria-label="What are you making?"`, options
   `Thought Photo Article Video Event`, Thought selected). Two visual variants:
   desktop = segmented icon-column control on `--color-surface-sunken` track (radius-lg);
   mobile = horizontal scrolling pills (radius-full). Local `useState` for selection; arrow-key roving.

5. **Add the author row**: Avatar 36 + name (`me.name`) + handle (`@{me.user} · Personal`, mono/micro)
   + a **Change author** button (`Change` on mobile). Button honestly disabled (`title="Coming soon"`)
   until workspace switching exists — or wired to the existing workspace list if present.

6. **Rework the footer toolbar** to one row: Add-a-photo icon button (`aria-label="Add a photo"`,
   disabled/coming-soon), an **audience pill** (globe + `Shared with everyone`/`Everyone` + chevron,
   disabled/coming-soon), then right cluster with **Save draft** (disabled) + **Share** (disabled,
   desktop only — on mobile Share is in the top bar). Replace the current two bare IconButtons.

7. **Honesty note**: the template renders it as plain mono/micro/tertiary text at the bottom, NOT a
   Chip. Replace the `<Chip icon="globe">Publishing isn't live yet — this is a preview</Chip>` with a
   mono text line `No character anxiety. No predicted reach. What you write is what they read.`
   KEEP the "publishing isn't live" truth somewhere honest — since `Share` is disabled, add a short
   honest reason via `title`/helper text (W1): e.g. disabled Share with tooltip "Publishing to the
   open web is coming soon." Do not let the template's confident tagline erase the honest disclosure.

8. **Icons needed but missing from `icons.tsx`** (currently: today, people, discover, conversations,
   me, compose, search, settings, sun, moon, check, save, saved, reply, share, more, globe, spark,
   back, close, plus, verified). The template needs: a **photo/frame** icon (add-a-photo), a
   **chevron/caret** (audience pill), and per-type glyphs for **Thought / Photo / Article / Video /
   Event**. Add these to the Tacet icon set (24px grid, 1.75 stroke, round caps) rather than
   importing another set. Until added, reuse the closest existing (`globe` for audience is already in
   template; `plus`/`more` are poor stand-ins for photo) — but prefer adding the real glyphs.

9. **Disabled-state honesty (W1) — required, dead controls in the template:** Share, Save draft,
   Add a photo, Change author, and the audience pill are all non-functional in the template. Every
   one must either WORK or be rendered `disabled` with `title="Coming soon"` (or an honest reason).
   No control may look live and do nothing.

10. **Copy source of truth**: author line uses `me.name` from `client/src/app/mock.ts` (currently
    "Renato"), handle uses `@{me.user}` (`@renato`). Do not hardcode "Renato Gusani"; render the mock.
    The `· Personal` suffix is honest (personal workspace). No protocol words anywhere (W5).

11. **Keep AppShell wiring**: `onClose`/`composing` already handled; `onPost` currently navigates to
    `/today` on a disabled button (dead). Since Share is disabled, `onPost` never fires — safe, but
    remove the implication of a working post by keeping Share disabled and the note visible.
