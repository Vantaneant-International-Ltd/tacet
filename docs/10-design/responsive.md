# Responsive — Design System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md §10](./tokens.md).
> Doctrine: *"Everything should feel intentionally designed. Never merely scaled."* Every tier is a
> designed layout, not a stretched or squeezed version of another.

---

## 1. Tiers

| Tier | Range | Layout | Chrome |
|---|---|---|---|
| **Phone** | `< 768px` | Single column, reading measure | Top bar (56px) + bottom tab bar (72px) + compose FAB |
| **Tablet** | `768–899px` (`--bp-md`) | Single **wide** column | Top bar + tab bar; measure widens toward `--measure-wide` |
| **Desktop** | `900–1199px` (`--bp-lg`) | **Rail + centred feed** | Left rail (250px) replaces tab bar; compose lives in rail |
| **Wide** | `≥ 1200px` (`--bp-xl`) | **Rail · Feed · Context** | Three-column canvas |
| **Ultra-wide** | `≥ 1600px` (`--bp-2xl`) | Same, **capped** | Content capped at `--canvas-max` (1440px); extra space → quiet margin |

Mobile-first, exactly as V1. The new work over V1 is a **real tablet tier** and the **three-column
wide canvas** (V1 stopped at rail + one column and wasted desktop width — audit §3.7).

---

## 2. The three-column canvas (wide, ≥ 1200px)

```
┌────────┬──────────────────────────┬─────────────────┐
│  RAIL  │        FEED              │     CONTEXT      │
│ 250px  │   centred, 42rem         │      320px       │
│        │   reading measure        │                  │
│ Today  │  ┌────────────────────┐  │  Contextual to   │
│ People │  │  moment / card     │  │  the current     │
│ Discvr │  └────────────────────┘  │  screen — helps  │
│ Convos │  ┌────────────────────┐  │  you understand  │
│ Me     │  │  moment / card     │  │  or continue.    │
│  ⊕     │  └────────────────────┘  │                  │
└────────┴──────────────────────────┴─────────────────┘
   nav          the reading column        context, not
                stays the same width       a dashboard
                as on desktop — the
                window grows, the
                reading measure doesn't
```

**Key decision:** widening the window does **not** widen the reading column. `--feed-measure`
stays at the 42rem reading measure at every tier ≥ desktop. Extra width becomes the context column,
then quiet margin — never longer line lengths. Reading comfort is fixed; the canvas breathes around
it.

---

## 3. The context column is a law, not a slot

> **Context Column Law.** The right-hand column is *contextual to what the person is doing right
> now*. Its only job is to help them **understand or continue the current thing**. It is never a
> dashboard, never a set of standalone widgets, never a scoreboard. When nothing genuinely helpful
> exists for the current view, the column is **empty** — the feed simply centres.

This is the single rule that keeps the wide canvas from becoming the reference mockups' sidebar of
trending tallies and "federation status." What appears is **derived from the current screen:**

| Current screen | Context column shows | It helps you… |
|---|---|---|
| **Today** | "Continue where you left off" — the last conversation or article you were reading; nothing else | resume, then be done |
| **People** | The selected person's quick card — avatar, name, a line of bio, "people you both know" | understand who you're about to open |
| **Profile (remote)** | About this person; where they post from (as a human place, not a server); people you both follow | understand this person before you follow |
| **Discover** | About the place you're exploring (a community's purpose in one human sentence); a few people there | understand a corner of the open web |
| **Conversation** | The participants; the moment the thread hangs off of | keep the thread's context in view while reading |
| **Me** | Quiet counts *as private context* (drafts, saved) and identity/workspace switch — never public vanity numbers | manage your own home |

Rules that keep it honest:
- **No content that isn't about the current view.** If you're reading Today, the column does not
  advertise Discover.
- **No metrics as rewards.** Any number here is private context for *you* (e.g. "3 drafts"), never a
  public tally.
- **Degrades to nothing.** Below `--bp-xl` the column's content either folds into the main flow
  (e.g. "people you both know" becomes a row on the profile) or is simply not shown. No feature
  *lives* only in the context column.

---

## 4. Rail (≥ 900px)

- Fixed width `--rail-width` (250px), sticky, full height.
- Brand mark (top) · the five pillars with icon + label · compose (a calm, legible button — **not**
  the glowing orb from the references) · at the bottom: current identity/workspace + theme toggle.
- Active pillar: `--color-accent-subtle` background, `--color-accent` icon, `--text-label` at
  weight 500. Inactive: `--color-text-secondary`. Hover: `--alpha-hover` wash.
- Presence signal (new correspondence) is a **quiet dot** beside Conversations — never a count,
  never red (doctrine).

---

## 5. Phone & tablet chrome

- **Top bar** (`--topbar-height` 56px, sticky, `backdrop-filter` blur): screen title / brand, search
  affordance, avatar. Blur is subtle, warm, and honoured only where supported.
- **Bottom tab bar** (`--tabbar-height` 72px, fixed, `--z-nav`): five pillars, icon + 10px label.
  Respects `env(safe-area-inset-bottom)`.
- **Compose FAB** (`--fab-size` 56px, `--z-fab`): a single calm affordance, bottom-right, above the
  tab bar. On tablet it may move into the top bar. It never pulses or glows.
- **Tablet gains:** wider reading measure, two-column media galleries earlier, a two-up People grid.
  It does **not** get the rail (that starts at 900px) — tablet is its own comfortable single-column
  tier.

---

## 6. Grid & gutters

- Desktop column gutter: `--gutter` (32px).
- Media galleries: 1 image = full measure at `--ratio-photo`; 2 = equal halves; 3 = one large + two
  stacked; 4+ = 2×2 grid with a `+N` overlay using `--scrim-media`. Breakpoints for collapse live in
  [media-system.md](./media-system.md), tokenised (no more inline `520px`).
- People grid: 1 col (phone) → 2 (tablet) → list-with-context (desktop) → list + detail in context
  column (wide).

---

## 7. Touch, pointer, and input

- Touch targets ≥ 44×44px on all tiers (achieved via padding, not font size).
- Hover states apply only under `(hover: hover)`; touch tiers use `:active` feedback instead of
  hover washes, so nothing sticks after a tap.
- Focus-visible rings render on every tier for keyboard/switch users (see
  [accessibility.md](./accessibility.md)).

---

## 8. What to verify (Stage 6 / implementation)

- The reading column measure is identical desktop → ultra-wide (no line-length creep).
- The context column is genuinely empty on views with nothing contextual, and never shows a metric
  as a reward.
- Nothing is *only* reachable in the context column.
- Every tier looks designed in isolation — screenshot each at 390 / 834 / 1024 / 1440 / 1728px.
