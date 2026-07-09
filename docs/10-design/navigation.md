# Navigation — Design System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md).

How a person moves through Tacet is a statement of values, so this doc refines *how
navigation feels* — its spacing, weight, typography, feedback, and transitions — without
touching *what it is*. The structure is frozen: five pillars, one mental model, two shapes.
The visual work here is to make moving between places feel calm, legible, and unhurried, and
to keep the chrome quiet enough that the person remembers the conversation, not the menu.

---

## 1. The five pillars — places, not tabs

Navigation is **spatial**. The pillars are *places you move between*, each answering a human
question — not a toolbar of features. They never change, never reorder, and read the same on
every tier (one mental model, two shapes).

| Pillar | The question it answers |
|---|---|
| **Today** | What matters right now, calmly? |
| **People** | Who are my people, and how are we? |
| **Discover** | Who and what might I want to bring closer? |
| **Conversations** | Who is speaking to me? |
| **Me** | This is mine — identity, presence, controls. |

Because pillars are *places*, moving between them is a gentle traversal of space (§6), never a
modal interruption. You always know where you are, and finishing a task returns you where you
were — navigation never hijacks intent.

---

## 2. Where the pillars live (per tier)

The shape is set by [responsive.md](./responsive.md); this doc governs how each shape *reads*.

- **Rail (≥ 900px, `--bp-lg`).** Fixed `--rail-width` (250px), sticky, full height. Brand mark
  at top · the five pillars (icon + label) · compose · at the bottom the identity/workspace
  switch + theme toggle. Extra desktop width buys whitespace, not more nav.
- **Phone & tablet (< 900px).** A sticky **top bar** (`--topbar-height` 56px: title/brand,
  search affordance, avatar) plus a fixed **bottom tab bar** (`--tabbar-height` 72px, `--z-nav`:
  five pillars, icon + `--text-micro` label) that honours `env(safe-area-inset-bottom)`. A
  single **compose FAB** (`--fab-size` 56px, `--z-fab`) sits bottom-right above the tab bar; on
  tablet it may fold into the top bar.

Pillar labels use `--text-label` (14px / weight 500) in the rail and `--text-micro` (12px /
weight 500) under tab-bar icons, on `--leading-normal`. Rail pillar rows are spaced at
`--space-2` internal padding with `--space-1` between rows — cosy, never cramped.

---

## 3. Active / inactive / hover states

State is carried by **weight and colour**, not by boxes or borders (L1). One consistent
language across rail and tab bar:

| State | Treatment |
|---|---|
| **Active** | `--color-accent-subtle` background (soft rail pill at `--radius-md`), `--color-accent` icon and label, label weight held at 500. The current place is unmistakable. |
| **Inactive** | `--color-text-secondary` icon and label on the bare surface — present, legible, quietly recessive. |
| **Hover** | An `--alpha-hover` wash mixed into the surface (only under `(hover: hover)`), settled over `--dur-1` with `--ease-out`. Touch tiers use `:active` feedback instead, so nothing sticks after a tap. |

Active state never adds a glow, underline sweep, or a second accent — colour is signal, not
decoration (L3). Focus is separate from hover/active: every pillar shows the visible
`--color-focus-ring` when reached by keyboard (see [accessibility.md](./accessibility.md)).

---

## 4. The Presence Signal Law

> **Presence Signal Law.** New correspondence is shown by a **quiet dot** or a subtle weight
> change beside **Conversations** — *never* a red count badge, *never* a number. This is
> doctrine.

The reference HIG frames this as awareness *without anxiety*, and V2 makes the visual form
exact: a single dot rendered in `--color-accent` (or a lift of the label from
`--color-text-secondary` toward `--color-text-primary` at weight 500) sitting beside the
Conversations pillar. It says *"something is here"* — it does not say *"you are behind."*

**We explicitly reject the reference mockups' "Activity / Notifications tab with counts."** A
counting-up number is manufactured urgency — a variable-reward mechanic dressed as
helpfulness — and a pulsing badge is exactly the spectacle L6 forbids. Tacet has no Activity
pillar and no count anywhere in navigation. The dot has no digit, no red, and no pulse; when
you've read your correspondence, it simply goes away.

---

## 5. Compose — one calm affordance

Composing is one legible action, not a centrepiece:

- **Rail:** a single calm, legible **button** — `--text-label`, `--color-on-accent` on
  `--color-accent`, `--radius-md` — sitting below the pillars. It is the one accent action in
  the nav (L3).
- **Mobile:** a single **FAB** (`--fab-size` 56px, `--z-fab`), bottom-right, above the tab bar.

**This is explicitly NOT the glowing centre-orb** from the reference mockups. A haloed,
pulsing compose orb is spectacle competing for attention — it violates L6 (the interface
disappears behind the content). Tacet's compose never pulses, never glows, never breathes; it
waits quietly until you want it. The words are human — you compose a *Thought / Photo /
Article / Video / Event*, never a "post" (L9).

---

## 6. Pillar-to-pillar transitions

Moving between places is a gentle traversal, tuned in [motion.md](./motion.md):

- Content crossfades / settles over `--dur-3` (320ms) with `--ease-in-out` — the easing for
  moves that *leave and return*, matching the sense of moving between destinations (the pillars are
  distinct places in the product, not a visual metaphor of rooms).
- The rail and tab bar themselves stay put; only the destination content moves. Nav chrome is
  a fixed frame, so the person's anchor never shifts.
- Motion here *means something* — it says "you arrived at a different place" (L4). It never
  blocks input and is never decorative. Under `prefers-reduced-motion` the traversal collapses
  to a simple fade or instant cut with zero loss of function
  (see [accessibility.md](./accessibility.md)).

No surprise modals, no interstitial pulls back to Today, no "while you were away" takeover.
The app never begs; when you're done, it lets you go.

---

## 7. Secondary surfaces — hung off pillars, never new pillars

The nav stays five pillars forever. Everything else is reachable *through* a pillar or Me, so
navigation stays calm rather than feature-rich (L2 — remove before adding):

| Surface | Where it lives |
|---|---|
| **Search** | The search affordance in the top bar (mobile) or reached from within Discover / People — a way *into* places, not a pillar of its own. |
| **Settings** | Under **Me**. Your controls belong with your identity. |
| **Saved** | Under **Me** (and marked with the quiet `--color-positive` private signal), reachable from any item's Save action. |
| **Collections** | Under **Me** / alongside Saved — a private way to keep, never a public shelf. |
| **Communities** | Reached through **Discover** (shared spaces you bring closer), not elevated to top level. |

The rule: a secondary surface *hangs off* the pillar whose question it answers. If a feature
seems to need its own nav item, first ask which of the five questions it truly belongs to — it
almost always has a home already. A calm map of five places beats a crowded shelf of eleven.

---

## 8. What to verify (Stage 6 / implementation)

- The five pillars, in the same order, on every tier; no sixth pillar has crept in.
- No number, no red, no pulse anywhere in navigation — presence is a quiet dot only.
- Compose is a calm button / FAB; there is no glowing orb.
- Active state reads through `--color-accent` + `--color-accent-subtle` and weight, not a box.
- Pillar transitions honour `--dur-3` / `--ease-in-out` and collapse cleanly under reduced
  motion.
- Every pillar, the compose action, and every secondary surface is fully keyboard-reachable
  with a visible focus ring.

---

## 9. Tab bar & FAB geometry (resolved)

The mobile bottom bar and the compose FAB have one settled geometry; this closes it.

- **The tab bar holds the five pillars only** — Today · People · Discover · Conversations · Me —
  and nothing else. Compose is **never a tab slot** (§5): the bar carries places, not actions, so a
  sixth item never creeps in even when the five ≥ 44px targets leave room to spare. A calm map of
  five beats a crowded shelf.
- **The FAB floats above the bar, offset.** The compose FAB (`--fab-size` 56px, `--z-fab`) sits
  bottom-right *above* the `--tabbar-height` bar, deliberately offset so its **56px hit area never
  overlaps** the rightmost pillar's (**Me**'s) 44px zone. The two touch targets stay cleanly
  separated — no ambiguous tap, no accidental compose.
- **Labels are legible.** Tab labels are **≥ `--text-micro` (12px)**, weight 500, on
  `--leading-normal` — **never 10px**. Small enough to be quiet, never so small they strain.
- **The bar flexes, it doesn't clip.** `--tabbar-height` is a comfortable resting height, not a hard
  ceiling: under font-scaling or 200% zoom the bar **grows to fit** icon + label rather than clipping
  the words (accessibility.md §9). It always honours `env(safe-area-inset-bottom)`.

And, restated because it matters: compose is a calm FAB, **never a glowing centre-orb** (§5). It
waits quietly bottom-right; it never pulses, glows, or claims the middle of the bar.
