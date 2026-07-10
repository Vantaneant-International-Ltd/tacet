# Components — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md).

**Purpose:** the canonical inventory of every Tacet component — what it is *for*, how it is built,
and every state it must define — expressed only in the token names from [tokens.md](./tokens.md) and
governed by the laws in [design-principles.md](./design-principles.md). No component here hardcodes a
value; if a number appears, it is a token. The library is small on purpose (L2 — *remove before
adding*). This doc supersedes the V1 set in [`../03-design-system/`](../03-design-system/) and closes
the [audit](./design-audit.md) §3.6 gaps: inputs, modal, menu, toast, semantic Badge, Tabs, and the
segmented control.

---

## 0. How to read this doc

Every interactive component defines **all** of these states — none may be skipped:
**rest · hover · focus-visible · active/pressed · disabled** (plus **loading**, **selected**, and
**error** where the component has them). Focus is always the same contract: `--color-focus-ring`,
`--border-strong` (or 2px), **2px offset**, visible in both themes (L10). Disabled always mixes
`--alpha-disabled` and sets `cursor: not-allowed`, never a `pointer-events: none` trap on real
controls. Motion spends the [tokens.md §9](./tokens.md) durations; every transition is
`prefers-reduced-motion`-complete (L4).

Three laws recur, so they are stated once here:
- **L1 — type carries hierarchy.** Cards shed chrome; a surface leans on **hairline OR elevation**,
  rarely both. Grouping is done with weight, colour, and whitespace before borders.
- **L3 — one accent action per view.** `--color-accent` marks the single primary action (two is the
  ceiling). Everything else is neutral.
- **Padding rhythm.** Exactly two card paddings: **comfortable `--space-5`**, **compact `--space-4`**.
  Never tighter, never a third value (audit T7).

---

## 1. Button — *Refine in V2*

**Purpose:** a calm affordance that invites, never demands. **Anatomy:** optional leading icon ·
label (`--text-label`, weight 500) · optional trailing icon; gap `--space-2`; `--radius-full` pill.
**Variants:** `primary` · `secondary` · `ghost` · `danger`. **Sizes:** `sm` 34px (`--space-3` pad),
`md` 42px (`--space-5` pad, default), `lg` 50px (`--space-6` pad, `--text-subheading`). Modifiers:
`full` (100% width), `icon-only` (square, requires `aria-label`). All sizes hold a ≥44px hit target
via padding.

| State | primary | secondary | ghost | danger |
|---|---|---|---|---|
| **rest** | `--color-accent` bg, `--color-on-accent` text | `--color-surface`, `--color-hairline` border, `--color-text-primary` | transparent, `--color-text-secondary` | transparent, `--color-danger` text + 40%-mix border |
| **hover** | `--color-accent-hover`, `--elevation-1` | border→`--color-text-tertiary`, `--elevation-1` | `--color-surface-sunken` bg, text→primary | `--color-danger` 10%-mix wash |
| **focus-visible** | `--color-focus-ring` 2px / 2px offset | same | same | same |
| **active** | `--color-accent-hover`; translateY(0.5px) scale(0.99) | fill deepens via `--alpha-pressed` | `--alpha-pressed` wash | fill deepens |
| **disabled** | `--alpha-disabled` mix, no shadow, `not-allowed` | same | same | same |
| **loading** | label holds width, quiet inline `Loading` dot replaces leading icon; no shimmer | same | — | — |

**Rules:** verbs, plainly ("Follow", "Reply", "Save"). Accent is intent, not decoration (L3).
`danger` sits apart from primary and confirms before irreversible acts. `ghost` is the default
*inside* content cards so actions stay quiet next to the voice.

## 2. IconButton — *Stable*

**Purpose:** an icon-only control for universally understood actions (close, more, theme). 44px
square, `--radius-full`, `--color-text-secondary`. **Requires** an accessible `label` (rendered as
`aria-label` + `title`). **States:** hover `--color-surface-sunken` bg + text→primary; focus
`--color-focus-ring` 2px/2px; active `--alpha-pressed`; `is-active` uses `--color-accent`; disabled
`--alpha-disabled`. Icon defaults to 22px (`--icon-md`).

## 3. Card (base) — *Refine in V2*

**Purpose:** Tacet's core surface — a physical, premium, calm object resting in warm space; a page
in a well-made book, not a box in a dashboard. **Anatomy:** header / body / footer slots;
`--radius-lg` (20px); padding **comfortable `--space-5`** or **compact `--space-4`**. Media nested
inside steps down to `--radius-md`. **V2 change (L1):** a card leans on **hairline OR elevation, not
both**. Default resting = `--color-surface` + `--elevation-1`, hairline dropped to a whisper; quiet
nested cards = `--color-surface-sunken` + hairline + `--elevation-0`.

| Variant | Surface / depth |
|---|---|
| **Resting** (default) | `--color-surface`, `--elevation-1` |
| **Interactive** | rest → `--elevation-2` + translateY(-1px) on hover; settles on active |
| **Quiet / inset** | `--color-surface-sunken`, hairline only, `--elevation-0` |
| **Raised** | `--color-surface-raised`, `--elevation-2` (menus, popovers) |

**States (interactive):** hover `--elevation-2`, hairline warms toward `--color-text-tertiary`;
focus-visible `--color-focus-ring` 2px/2px; active translateY(0). **Rules:** one primary action per
card (rest are `ghost`); cards separate by space (`--space-4`–`--space-6` gap), never flush like a
chat log; **no badges, count bubbles, or pulsing dots** on cards (L6).

## 4. Content Card — *Refine in V2*

**Purpose:** renders what a person made — Thought / Photo / Article / Video / Event (L9, never
"post") — chronologically, honestly, and **free of engagement furniture**. Second of the two most
important components alongside the Person Card.

**Anatomy (top to bottom):**
1. **Attribution as a human place** — inline Person Card: `Avatar` (`md` 44) · display name
   (`--text-subheading`, `--color-text-primary`, the loudest thing) · handle
   (`--text-meta` mono, `--color-text-tertiary`) · **source line** — where this moment lives on the
   open web (`on tacet.social`, or the remote server), reading like an address, not a badge. Tapping
   attribution opens the person. Trailing `more` IconButton.
2. **Meta** — `--text-meta` mono, `--color-text-tertiary`: time. Chronology is typography, always
   visible, never ranked.
3. **Body / media** — the voice: `--text-body` (17px), `--leading-relaxed`, `--color-text-primary`;
   the largest, warmest element. Media is full column width, `--radius-md`, honest `--ratio-*`,
   `--scrim-caption` for overlaid captions, alt text required, no autoplay (L5).
4. **Affordance row** — **Reply · Share · Save**. That is the whole row.

**The affordance row is actions, never a self-directed scoreboard.** On the card itself: no tally of
the reader's or author's *own* likes/comments/reposts/views sitting on the card as a standing score,
no reaction rail, no ranking. There is nothing to perform for (principle 2). The row carries *actions
the reader can take*, never *a self-directed score*.

**World-directed reception is a separate, allowed thing (reconciled 2026-07-09).** Representing that a
post *resonated in the world* — as calm, framed, world-directed context ("an active thread", "shared
widely"), not a raw ascending tally on the card — is **informing**, not chrome, and is governed by
[ADR-011](../11-decisions/ADR-011-metrics-are-context-not-rewards.md) and
[design-principles L11](./design-principles.md). It lives in editorial/context surfaces (the context
column, a curator moment), softened toward qualitative language; it is never a per-card leaderboard
and never a ranking of people. The enemy is the *self-directed score*, not the world's reality.

| Affordance | Icon | Treatment | State notes |
|---|---|---|---|
| **Reply** | `reply` | `ghost`, `--color-text-secondary` | hover text→primary, `--color-surface-sunken` |
| **Share** | `share` | `ghost`, `--color-text-secondary` | same; opens Menu (§9) |
| **Save** | `save` → `saved` | `ghost`; **when saved uses `--color-positive`** (the private/spark signal) | rest secondary; **saved** = `--color-positive` + filled `saved` glyph; a Toast (§10) confirms quietly |

**The positive signal:** Save is the only place the private positive/`spark` colour appears on the
card — it marks *kept-for-yourself*, seen by no one, never a number, never a public opposite. A
private "♥ you" acknowledgement reaches the **author alone**, attributed to a person, never tallied.

## 5. Person Card — *Refine in V2*

**Purpose:** a person as a first-class object — *who is this, where do they live on the open web,
what is my relationship?* People-first, **faces present**. **Anatomy:** `Avatar` (circular,
`--radius-full`; `lg` 64 on full card, `md` 44 in rows) · display name (`--text-subheading`, primary
— loudest) · handle (`--text-meta` mono, `--color-text-tertiary`, shown in full so the address is
honest) · home line (`on tacet.social` / remote server; a quiet `following you` sits here when
mutual) · **relationship control** · optional bio (`--text-body-sm`, 1–3 lines, truncates).

**Relationship control** (pill, `--radius-full`, the one accent on the card so L3 holds):

| State | Treatment |
|---|---|
| Not following | **Follow** — `primary`, `--color-accent` |
| Following | **Following** — `secondary` (hairline) + `check`; hover reveals "Unfollow" |
| Follows you | quiet `following you` label in the home line (not a button) |
| Requested | **Requested** — `ghost`, disabled-look via `--alpha-disabled` |

**Variants:** Full (profile header, People) · Row (lists; avatar `md`, no bio) · Inline (attribution
on a Content Card) · Federated (remote person, same anatomy, home-server line honest). **No vanity
counts:** never follower/following/post tallies. Identity and relationship before engagement.
Whole-card tap opens the profile; the Follow control is a separate target.

## 6. Avatar — *Stable*

**Purpose:** a warm face, never a broken image or grey blank. Circular (`--radius-full`), default
44px. **Fallback:** the name's first initial on a hue-derived low-saturation tint (stays inside the
calm palette). **`ring` option:** `--color-accent` ring on a `--color-canvas` gap (used sparingly,
e.g. active speaker). Clusters overlap at `--overlap-avatar`. Decorative (`aria-hidden`); the
accessible name lives on the surrounding link.

## 7. Badge — *New in V2*

**Purpose:** a small **status** marker — the semantic half split out of the overloaded V1 Chip
(audit §3.6). A Badge states a fact about a thing (type, provenance, status); it never counts and
never rewards (L6). **Anatomy:** optional 13px icon + short label, `--text-micro`, weight 500,
`--tracking-wide`, `5px`/`--space-2` pad, `--radius-sm`. **Variants (semantic, meaning never by hue
alone — always icon or label):**

| Variant | Tokens | Use |
|---|---|---|
| **neutral** | `--color-surface`, hairline, `--color-text-secondary` | media type ("Photo", "Article") |
| **source** | `--color-surface-sunken`, `--color-text-tertiary` + `globe` | quiet federation origin |
| **accent** | `--color-accent-subtle`, `--color-accent` | community / audience tag |
| **positive** | `--color-positive` 10%-mix, `--color-positive` + `check`/`verified` | Saved, verified, success |
| **warning** | `--color-warning` 10%-mix, `--color-warning` | needs attention |
| **danger** | `--color-danger` 10%-mix, `--color-danger` | error / blocked |

Static (no interactive states). **Chip** is retired as a status carrier; if a *removable, selectable*
token is needed (compose audience), use a real control, not a Badge.

## 8. Text Input & Field family — *New in V2*

**Purpose:** where a person speaks and chooses — calm, legible, never ambiguous about state (the
compose surface deserves the most quiet). Covers **text field**, **textarea**, **select**, and
**toggle**. **Anatomy:** label (`--text-label`, `--color-text-secondary`, always present or
`aria-label`) · field · helper/error (`--text-meta`, tied via `aria-describedby`). Field is a sunken
well: `--color-surface-sunken`, hairline, `--radius-md`, 44px min height, `--space-3`/`--space-4`
pad, value in `--text-body-sm` `--color-text-primary`.

| State | Treatment |
|---|---|
| **rest** | `--color-surface-sunken` fill, `--color-hairline` border |
| **placeholder** | `--color-text-tertiary`, literal and quiet (never bait); not a label substitute |
| **hover** | border → `--color-text-tertiary` |
| **focus-visible** | border → `--color-accent` (`--border-strong`) + `--color-accent-subtle` 2px ring |
| **filled** | `--color-text-primary` value |
| **error** | `--color-danger` border + message below with an icon (never colour alone) |
| **disabled** | `--alpha-disabled` mix, `not-allowed` |
| **read-only** | no border, flat, `--color-text-secondary` |

**Select:** same shell + trailing chevron; the open list is a **raised** menu (§9); current option
marked `--color-accent-subtle` + `check` (not colour alone). **Toggle:** pill (`--radius-full`);
off = `--color-surface-sunken` track + `--color-surface-raised` knob; on = `--color-accent` track +
`--color-on-accent` knob; focus adds `--color-focus-ring`; state read by knob position *and* colour.
**Compose input:** a borderless `--text-body` area on `--color-surface-raised` — the page, not a
box; what you write looks like what you'll say; no character-count anxiety, no vanity metrics.

## 9. Menu / Dropdown — *New in V2*

**Purpose:** a short list of actions or options anchored to a trigger (the `more` overflow, Share,
Select). **Anatomy:** a **Raised** surface (`--color-surface-raised`, `--elevation-2`, `--radius-md`,
`--space-2` pad, `--z-nav`+ layer via `--z-sheet`) holding items. **Item anatomy:** optional 20px
leading icon · label (`--text-label`) · optional trailing state; `--space-2`/`--space-3` pad,
`--radius-sm`. Enters with `--dur-2` / `--ease-out` (fade + 4px rise), reduced-motion → fade only.

| Item state | Treatment |
|---|---|
| **rest** | transparent, `--color-text-primary` |
| **hover / roving focus** | `--color-surface-sunken` bg (`--alpha-hover` mix), text→primary |
| **focus-visible** | `--color-focus-ring` 2px inset ring (keyboard) |
| **active** | `--alpha-pressed` wash |
| **selected** | `--color-accent-subtle` bg + trailing `check` (not colour alone) |
| **danger item** | `--color-danger` text; hover `--color-danger` 10%-mix |
| **disabled** | `--alpha-disabled`, not focusable |

Full keyboard path (arrow roving, Esc closes, focus returns to trigger); dismiss on outside-click.
Real `role="menu"`/`menuitem`.

## 10. Modal / Dialog — *New in V2*

**Purpose:** an interruptive, focused decision or short task that must be resolved or dismissed
(confirm destructive act, small form). Distinct from the existing **sheet** (bottom, `--radius-xl`,
gestural): a modal is centred and deliberate. **Anatomy:** scrim (`--scrim-media` / `--alpha-scrim`
over content) · panel (`--color-surface-raised`, `--elevation-3`, `--radius-xl`, `--space-6` pad,
`--z-modal`) · title (`--text-heading`) · body (`--text-body-sm`, `--color-text-secondary`) · action
row (right-aligned; **one** `primary`, rest `secondary`/`ghost`; destructive uses `danger`, sits
apart). **States:** enter — scrim fades `--dur-2`, panel rises + fades `--dur-3` / `--ease-out`;
exit reverses; reduced-motion → fade only. Focus **trapped** inside; Esc and scrim-click dismiss
(unless a destructive confirm requires an explicit choice); focus returns to the invoker. Never
stack modals. `role="dialog"`, `aria-modal`, labelled by its title.

## 11. Toast / Inline confirmation — *New in V2*

**Purpose:** a transient, honest acknowledgement that an action landed ("Saved", "Reply sent") —
calm, never a reward animation (L6). **Anatomy:** small pill/card, `--color-surface-raised`,
`--elevation-2`, `--radius-md`, `--space-3`/`--space-4` pad, `--text-body-sm`; optional 20px status
icon; optional single **Undo** `ghost` action. Layer at `--z-toast`. **States:** enter — rise + fade
`--dur-2` / `--ease-out`; rest — holds ~4s (longer if it has an action); exit — fade `--dur-1`;
reduced-motion → appear/disappear without travel. **Icon + tone by intent:** positive `check` /
`--color-positive` (Saved), neutral (info), `--color-danger` + icon (failed — with a retry path).
`role="status"` `aria-live="polite"`; danger → `role="alert"`. One toast at a time; never used for
marketing or streak nudges. **Inline confirmation** is the quiet in-place variant (e.g. a field's
"Saved" tick) using the same tokens.

## 12. Tabs — *New in V2*

**Purpose:** switch between sibling *views* of the same place (Me / Profile sections), replacing the
hand-rolled versions. **Anatomy:** a row of tab labels (`--text-label`) over a hairline baseline; the
active tab carries a `--border-strong` `--color-accent` underline and `--color-text-primary`; the
indicator slides `--dur-2` / `--ease-out`. **States:** rest `--color-text-secondary`; hover
text→primary; focus-visible `--color-focus-ring` 2px/2px; active/selected accent underline +
primary text; disabled `--alpha-disabled`. Overflowing tab rows scroll horizontally, they never
wrap. Real `role="tablist"`/`tab`/`tabpanel`, arrow-key navigation, `aria-selected`.

## 13. SegmentedControl — *New in V2*

**Purpose:** pick **one** option from a small fixed set that filters the current view (the Today
filter row) — a single control, not a nav. **Anatomy:** a `--radius-full` track
(`--color-surface-sunken`) holding 2–5 segments; the selected segment is a raised "thumb"
(`--color-surface-raised`, `--elevation-1`, `--radius-full`) that slides between positions
`--dur-2` / `--ease-out`. Segment label `--text-label`. **States:** unselected
`--color-text-secondary`; hover text→primary; selected `--color-text-primary` on the thumb;
focus-visible `--color-focus-ring` 2px/2px on the focused segment; disabled `--alpha-disabled`.
Selection is carried by the thumb position *and* text weight/colour, never colour alone. This is a
neutral control — it never uses `--color-accent` (that stays reserved for the view's one primary
action, L3). Real radiogroup semantics; arrow keys move selection.

## 14. SectionHeading · Loading · EmptyState — *Stable*

- **SectionHeading:** title (`--text-heading`, weight 500) · optional subtitle
  (`--text-body-sm`, `--color-text-secondary`) · optional trailing action; `--space-5` bottom
  margin. Static.
- **Loading:** a single soft pulsing `--color-accent` dot (`t-pulse`, `--ease-in-out`) — never a
  spinner, never shimmer theatrics; `role="status"`, reduced-motion holds it steady at 0.7 opacity.
- **EmptyState:** optional 28px icon · title (`--text-subheading`, `--color-text-secondary`) ·
  quiet factual body (`--text-body-sm`, ≤28rem measure). A calm fact, never a nag.

---

## 15. Icon usage rules

The 22-glyph set (24px grid, 1.75 stroke, round caps, `currentColor`) is Tacet's own language. It
supports words; it never replaces meaning (L3 — *legible over clever*).

- **Words carry meaning; icons aid recognition.** Any action whose meaning isn't universal ships
  **icon + label**. Icon-only is reserved for the truly unambiguous (`close`, `more`, `back`) and
  always carries an `aria-label`.
- **Size tokens:** `--icon-sm` 18px (inside `sm` buttons, meta rows) · `--icon-md` 22px (default,
  IconButton, nav) · `--icon-lg` 28px (EmptyState). Chips/Badges use 13px inline. Icons inherit
  `currentColor`, so state colour flows from the parent control's tokens.
- **Pairing:** icon + label share a `--space-2` gap and baseline-align; the label, not the icon,
  is the accessible name.
- **`spark` is the one filled glyph — the private positive signal.** It is never decoration and
  never a public heart-count; it appears only where Tacet marks something *kept* or *privately
  valued* (Save, the author-only acknowledgement). No glowing, no pulsing, no urgency halos (L6).
- No badges or count dots layered on icons in nav or on cards.

---

## 16. Component status

| Component | Status | Note |
|---|---|---|
| Button | Refine in V2 | states restated in tokens; `ghost` is the in-card default |
| IconButton | Stable | unchanged |
| Card (base) | Refine in V2 | L1 — hairline **or** elevation; two paddings only |
| Content Card | Refine in V2 | engagement furniture removed; Reply/Share/Save only |
| Person Card | Refine in V2 | faces-first; no vanity counts; one accent control |
| Avatar | Stable | fallback + `ring` unchanged |
| Badge | **New in V2** | semantic split from the overloaded Chip |
| Text Input & Field family | **New in V2** | field/textarea/select/toggle/compose, full states |
| Menu / Dropdown | **New in V2** | overflow, Share, Select |
| Modal / Dialog | **New in V2** | centred, focus-trapped; distinct from sheets |
| Toast / Inline confirmation | **New in V2** | calm, honest, `aria-live` |
| Tabs | **New in V2** | replaces hand-rolled Me/Profile tabs |
| SegmentedControl | **New in V2** | the Today filter row; neutral, never accent |
| SectionHeading | Stable | unchanged |
| Loading | Stable | soft pulsing dot |
| EmptyState | Stable | unchanged |
| ~~Chip~~ | **Retired** | status → Badge; selectable tokens → real controls |

---

## 17. New V2 components: ContentNote, AltMarker, VerifiedLink, WorkspaceCue

Four small pieces the pre-Figma review surfaced — each carries a fact humanely and none of them
counts, ranks, or rewards (L6). All values are tokens from [tokens.md](./tokens.md).

### 17.1 ContentNote — *New in V2*

**Purpose:** a calm way to fold a summary over content that a reader may want to open deliberately (a
content warning, a spoiler, sensitive media) — honest, never bait. **Anatomy:** a note line
(`--text-body-sm`, `--color-text-secondary`) + a **"Show"** control (`ghost` Button, §1), wrapping
the real content which stays collapsed until asked for. **Sensitive-media variant:** the media
renders behind a blur over `--scrim-media`, with the "Show" control centred; revealing is one quiet
action, and it can be re-hidden. **States:** collapsed (rest) · revealed · (media) blurred → shown.
The reader is told plainly what's behind it; the summary is human words, never a tease. Real
`aria-expanded` on the control; revealed content is not hidden from AT while collapsed inappropriately
(the summary names it).

### 17.2 AltMarker — *New in V2*

**Purpose:** a quiet **"ALT"** affordance on an image that, when opened, reveals the author's image
description — so alt text is honoured *and* legible to sighted readers. **Anatomy:** a small
`--text-micro`, weight 500, `--tracking-wide` marker in a `--scrim-caption` chip at the image corner,
`--radius-sm`; tapping opens the description in a small popover/inline panel
(`--color-surface-raised`, `--elevation-2`). **States:** rest · hover text→primary · focus-visible
`--color-focus-ring` 2px/2px · open. **AT contract:** the marker is never the image's accessible
name — the description **is** the image's `alt`; the marker is a supplementary control with its own
`aria-label` ("Show image description"). An image with no description shows no marker (no nag).

### 17.3 VerifiedLink — *New in V2*

**Purpose:** a link a person or workspace has **proven they own**, rendered with a quiet confirmed
check — the trust surface from [profile-system.md §9](./profile-system.md), and explicitly **NOT a
vanity badge**. **Anatomy:** link text (`--color-accent`) + trailing `check`/`verified` glyph in
`--color-positive`, `--icon-sm`; a human `title`/tooltip *"confirmed theirs"* (or *"confirmed
vnta.xyz"* on a workspace). **States:** rest · hover (underline, text→`--color-accent-hover`) ·
focus-visible `--color-focus-ring` 2px/2px. An **unconfirmed** link is the plain link with no glyph —
absence is not a demerit. Meaning never rides on hue alone: the glyph + tooltip word carry it (L10).
It states one fact (ownership proven); it never ranks, tiers, or awards a blue-check status (L6).

### 17.4 WorkspaceCue — *New in V2*

**Purpose:** a quiet indicator that an account is a **workspace / business** rather than a person —
orientation, not status (profile-system §9.2). **Anatomy:** a subtle *"Workspace"* label
(`--text-micro`, `--color-text-secondary`) beside the name, and/or the **squared-avatar** treatment
(a business Avatar steps from `--radius-full` toward `--radius-md`). Static (no interactive states).
It never implies a business outranks a person; pair it with VerifiedLink so an official company reads
as legible and honest in the feed and on its profile.

### 17.5 Content Card contract update

The **Content Card** (§4) may now render a **ContentNote** wrapper around its body/media (collapsed
summary + "Show", or the sensitive-media blur over `--scrim-media`), and a per-image **AltMarker** on
each media item. These additions change nothing about its economy: the action row **remains
Reply · Share · Save with NO counts** — no like tally, comment count, or view counter (L6). **Save**
stays the private `spark`/`--color-positive` signal, *kept-for-yourself*, and the author-only "♥ you"
acknowledgement remains a **spark for others' moments**, reaching the author alone, never tallied.

| Component | Status | Note |
|---|---|---|
| ContentNote | **New in V2** | collapsed summary + Show; sensitive-media blur over `--scrim-media` |
| AltMarker | **New in V2** | quiet "ALT" reveal; description is the image `alt`, marker is supplementary |
| VerifiedLink | **New in V2** | confirmed `check`; a fact, not a vanity badge |
| WorkspaceCue | **New in V2** | workspace label / squared avatar; orientation, not status |

---

*Cross-links:* [tokens.md](./tokens.md) (canonical values) · [design-principles.md](./design-principles.md)
(the laws) · [typography.md](./typography.md) · [media-system.md](./media-system.md) ·
[motion.md](./motion.md) · [responsive.md](./responsive.md) · [accessibility.md](./accessibility.md) ·
[profile-system.md](./profile-system.md) (trust surface §9).
