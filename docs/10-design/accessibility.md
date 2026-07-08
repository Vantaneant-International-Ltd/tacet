# Accessibility — Design System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md).

Accessibility is the **floor, not a tier** — this is Law L10 in
[design-principles.md](./design-principles.md), and it is non-negotiable. This doc makes that
law concrete for the V2 visual system: exact tokens, exact behaviours, one checklist. The frame
that guides every choice: **calm is also accessible.** Low noise, clear hierarchy, honest
controls, and no manufactured urgency are the same things that make Tacet usable for people with
disabilities. Restraint and access point the same way.

---

## 1. Contrast — WCAG AA is the minimum, in both themes

- Meet **WCAG AA** for all text and for meaningful non-text (icons, focus rings, state dots) —
  in *both* the warm-ivory light theme and the lamplit dark theme
  ([tokens.md §6](./tokens.md)). Both themes are first-class; neither is an afterthought (L8).
- `--color-on-accent` on `--color-accent` passes AA for button labels in **both** themes —
  this is the sanctioned pairing for the compose button and any accent action. Do not place
  accent text on accent-subtle, or body text on media without the `--scrim-media` / `--on-media`
  system.
- Warm and cosy is never an excuse for low contrast. Test the *real* tokens against the *real*
  surfaces (`--color-canvas`, `--color-surface`, `--color-surface-raised`), in the actual theme.
- `--color-text-tertiary` is for genuinely de-emphasised meta only; never use it for content a
  person must read.

---

## 2. Never encode meaning by colour alone

- State, hierarchy, selection, and status must **also** read through icon, label, weight, or
  shape — never hue alone. This protects colour-blind users and keeps hierarchy intact when a
  theme changes ([design-principles.md L1](./design-principles.md)).
- **Status colours especially:** `--color-positive`, `--color-warning`, `--color-danger` never
  stand on their own. Positive (Saved / save-complete) always carries its icon or the word
  *Saved*; warning and danger always carry a label and, where it helps, a shape. This is already
  a tokens.md usage law — restated here as an access requirement.
- The **presence dot** beside Conversations (see [navigation.md](./navigation.md)) is meaning by
  a dot's *presence*, not by its colour — it is paired with position and, for AT, an accessible
  name ("new correspondence"). Colour reinforces; it never carries the message alone.

---

## 3. Focus states

- **Every interactive element** shows a visible `--color-focus-ring` at **2px, 2px offset,
  `--radius-xs`** on focus-visible — pillars, compose, buttons, links, inputs, toggles, cards
  that act as buttons, and every control in the context column. No exceptions.
- Focus order follows reading/DOM order and is **logical and predictable**; focus is **never
  trapped** in a surface a person cannot leave.
- **`Esc` reliably dismisses** transient surfaces (sheets, modals, popovers) and returns focus
  to the element that opened them.
- A **skip-to-content link** is the first focusable element on every screen, jumping past the
  rail / top bar to `main`.
- Never remove a focus outline without replacing it with something equally clear. Focus is a
  designed, calm, legible visual — not an afterthought that clashes with the interface.

---

## 4. Real, semantic controls

- A button is a `<button>`, a link is an `<a>`, a field is a **labelled** input. No `div`
  pretending to be interactive, ever.
- Every control has an accessible **name**, and an accessible **description** where the name
  alone is not enough. Icon-only controls (the compose FAB, top-bar search) carry a name.
- State — pressed, selected, expanded, disabled, current — is exposed **programmatically**
  (`aria-current` for the active pillar, `aria-pressed`, `aria-expanded`, `disabled`), not only
  through the visual treatment in [navigation.md](./navigation.md).

---

## 5. Full keyboard operability

- **Every** destination, action, and setting is operable by keyboard alone — all five pillars,
  compose, every item action (Follow / Reply / Share / Save), every setting under Me. There is
  **no mouse-only path**, and no gesture-only path.
- Keyboard shortcuts exist only where they genuinely help, never as a hidden requirement for a
  task; the pointer/keyboard/switch user all reach the same places.
- Hover-revealed affordances also appear on focus, so nothing important hides from a keyboard
  user.

---

## 6. Screen readers

- Structure each screen with correct **landmarks** (`banner` top bar, `navigation` rail/tab bar,
  `main` feed, `complementary` context column) and a **sane heading outline** so a person can
  move by region and heading. Screen titles map to `--text-title`; section headings to
  `--text-heading`.
- Announce **meaningful** changes with appropriately polite **live regions**: a new conversation
  arriving, a save completing. Informative, **never spammy** — calm applies to the audio
  experience too. A scrolling feed is *not* a live region; a background sync is *not* announced.
- Human words only in the accessible names, matching L9 — *Thought / Photo / Article*, *Follow /
  Reply / Save* — never "post", "entry", "instance", or "federation".

---

## 7. Images, avatars, and decorative imagery

- Content images and **avatars carry meaningful alt text** (who the person is, what the media
  shows) — media is editorial (L5), and its meaning must reach AT.
- **Decorative** imagery (background textures, the AtmosphereBackground, purely aesthetic
  flourishes) is hidden from assistive tech (`alt=""` / `aria-hidden`), so screen-reader users
  aren't read noise.
- Text over media relies on the `--scrim-media` / `--media-shadow` / `--on-media` tokens for
  legibility, but the *meaning* still lives in real text, not baked into the image.

---

## 8. Reduced motion

- Honour `prefers-reduced-motion` **completely** ([motion.md](./motion.md), L4). Decorative
  motion stops; pillar transitions (`--dur-3` / `--ease-in-out`) collapse to a simple fade or an
  instant cut.
- The reduced-motion experience is **fully functional, never degraded** — every place is still
  reachable, every state still legible, nothing depends on an animation the person opted out of.
  This is where calm and accessibility most visibly meet.

---

## 9. Targets, scaling, and zoom

- **Touch targets ≥ 44×44px** on every tier, achieved through padding, not font size
  ([responsive.md §7](./responsive.md)).
- The layout survives **font scaling and browser zoom to 200%** without clipping, overlap, or
  loss of function. Nothing relies on a fixed pixel height that traps text; the reading measure
  and spacing scale gracefully.
- Nothing important is hidden behind hover-only or pointer-only interaction (see §5).

---

## 10. Per-screen audit checklist

Designers and engineers run this on **every** screen before it is called done.

| # | Check | Pass when… |
|---|---|---|
| 1 | **Contrast** | All text + meaningful non-text meets AA in light *and* dark, using real tokens. |
| 2 | **Colour-independence** | Every status/selection/state also reads via icon, label, weight, or shape. |
| 3 | **Focus visible** | Every interactive element shows `--color-focus-ring` (2px / 2px offset / `--radius-xs`) on focus-visible. |
| 4 | **Focus order** | Order is logical, never trapped; `Esc` dismisses transients; skip link present. |
| 5 | **Semantics** | Real `<button>`/`<a>`/labelled inputs; state exposed via ARIA (`aria-current` on active pillar). |
| 6 | **Keyboard** | Every destination, action, and setting reachable and operable by keyboard alone. |
| 7 | **Screen reader** | Correct landmarks, sane heading outline, polite (not spammy) live regions for real changes. |
| 8 | **Images** | Meaningful alt on content/avatars; decorative imagery hidden from AT. |
| 9 | **Reduced motion** | Fully functional with `prefers-reduced-motion`; no reliance on animation. |
| 10 | **Targets & zoom** | Touch targets ≥ 44px; usable at 200% zoom / font scaling with no breakage. |

If any row fails, the screen is not finished. An interface that respects the user respects
*every* user — that is the standard of care, applied to bodies and abilities.
