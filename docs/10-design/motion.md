# Motion — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md §9](./tokens.md).

V1 *defined* motion tokens and then barely spent them — a single page fade was the whole
library. This doc is where V2 finally builds a real, coherent motion system **on the tokens
that already exist**. It does not invent a single new duration or easing. Its job is to say,
for every named interaction in the product, exactly which token moves it and why.

---

## 1. Philosophy — motion communicates, it does not perform

Motion in Tacet has one job: to make change *understandable*. It tells you where you went,
that something loaded, that your action was received. Nothing more.

- **Never decoration.** If an animation exists only to be admired, it has the wrong job and
  is cut. *(Design principle L4; L6 — the interface disappears behind the content.)*
- **Never spectacle.** No parallax, no confetti, no hero flourish, no glowing orb pulling the
  eye. Delight comes from calm and clarity, not from a show.
- **Never autoplay.** The user starts motion; motion never starts on the user. Media and
  animation wait to be asked.
- **Never attention-grabbing.** No pulsing badges, no bouncing icons, no looping shimmer that
  wants you back. Movement never manufactures urgency — that is a dark pattern.

The feel we are after: **slow enough to feel deliberate, fast enough to never block.** This is
Apple, not the attention economy. A person should *feel* ease and *understand* change — and
never remember the effect afterward.

---

## 2. Motion library

Every interaction below maps to an existing token. `--ease-out` is the default (things that
enter and settle); `--ease-in-out` is only for movement that leaves and returns.

| Interaction | Duration | Easing | What it communicates |
|---|---|---|---|
| **Page / pillar transition** | `--dur-4` 480ms | `--ease-out` | You moved to a new place. Content fades up ~8px; the arriving screen settles, the leaving one fades. Enter and leave are staggered, never a hard cut. |
| **Sheet spring-in** | `--dur-3` 320ms | `--ease-out` | A surface rose from an edge. Translate from off-screen to rest; `--ease-out`'s late curve gives the "spring feel" without a literal bounce or overshoot. |
| **Sheet / sidebar dismiss** | `--dur-3` 320ms | `--ease-in-out` | It went back where it came from. Same axis in reverse; `--ease-in-out` because it leaves and returns. |
| **Modal open / close** | `--dur-3` 320ms | `--ease-out` in / `--ease-in-out` out | A focused, blocking surface. Scrim fades (`--alpha-scrim`) while the dialog fades + rises ~4px. Close reverses. |
| **Hover wash** | `--dur-1` 120ms | `--ease-out` | This is interactive. Background eases to `--alpha-hover`. Fast, near-instant, never a fade you can watch. |
| **Focus ring** | `--dur-1` 120ms | `--ease-out` | Keyboard focus is here. Ring (`--color-focus-ring`, `--border-strong`) fades in. Appears instantly enough to track keyboard movement; never lags the caret. |
| **Button press** | `--dur-1` 120ms | `--ease-out` | Your touch registered. Scale to ~0.98 on press-down, release on lift. Transform only — the control never reflows. |
| **Save / pin acknowledgement** | `--dur-2` 200ms | `--ease-out` | *This is now kept.* The quiet positive signal: the glyph fills toward `--color-positive` and the spark glyph settles in with a single, small scale-and-fade. Confirmation, not celebration — it happens once and is done. No burst, no particles, no repeat. |
| **Skeleton loading shimmer** | `--dur-4` 480ms | `--ease-in-out` | Content is on its way. A slow, low-contrast sweep across placeholder blocks. Calm and non-looping in feel — it reads as *breathing*, not *spinning*. Removed the instant real content arrives. |
| **Empty-state reveal** | `--dur-3` 320ms | `--ease-out` | There is genuinely nothing here (by design). Copy and any illustration fade up gently — a soft arrival, never a "look at me." |
| **Toast in / out** | `--dur-2` 200ms in / `--dur-2` 200ms out | `--ease-out` in / `--ease-in-out` out | A transient acknowledgement (`--z-toast`). Fades + rises a few px, holds, then leaves the way it came. Never demands a tap; never stacks into a wall. |
| **Avatar / media blur-up** | `--dur-4` 480ms | `--ease-out` | The image is resolving. A blurred placeholder cross-fades to the loaded asset (opacity only). Editorial, unhurried — media is content, not a thumbnail (L5). |

**Reading the table:** micro-feedback lives on `--dur-1`, small controls on `--dur-2`, surfaces
and page content on `--dur-3`, and the largest reveals on `--dur-4`. If an interaction isn't
in this table, it borrows the row it most resembles — it does not get a bespoke duration.

---

## 3. The `prefers-reduced-motion` contract

This is non-negotiable, and it is where calm and accessibility meet (L10). When a person has
asked their system for reduced motion, Tacet honours it **completely** — and the reduced
experience is **fully functional, never a lesser or broken version.**

The contract:

- **Replace movement with instant state, or a gentle opacity fade only.** A sheet that slid
  now simply *appears* (or cross-fades at `--dur-1`). A page transition becomes a quiet fade,
  not a slide.
- **No translate, no scale, no spring.** Nothing travels across the screen and nothing bounces.
- **No parallax. No shimmer.** The skeleton holds as a static placeholder; the blur-up snaps to
  the loaded image with, at most, a `--dur-1` fade.
- **State always still lands.** The save acknowledgement still turns `--color-positive` and
  shows the spark glyph — it just does so instantly, without the scale. Meaning is never carried
  by the motion that got removed.

The rule of thumb: reduced motion removes the *travel*, never the *information*. Everything a
person needed to understand still arrives — it just arrives at rest.

---

## 4. Performance

Motion must never make the UI *feel* slower than no motion at all.

- **Animate `transform` and `opacity` only.** These are GPU-composited and don't trigger layout
  or paint. This is why the library above expresses every move as translate / scale / fade.
- **Never animate layout properties** — no `width`, `height`, `top`, `margin`, or anything that
  reflows the page. If something needs to resize, it fades between states rather than growing.
- **Hold 60fps.** A dropped frame reads as jank and breaks the calm. Prefer shorter, cheaper
  motion over ambitious motion that stutters.
- **Motion is on the critical path of *feel*, not function.** An interaction is "done" the moment
  the user's intent is registered; the animation is the acknowledgement, and it never delays the
  result behind itself.

---

## 5. Microinteraction principles

Every action the person takes is acknowledged — **quietly.**

- **Subtle over noticeable.** A hover wash, a 0.98 press, a glyph that fills. If you have to
  point it out, it is too much.
- **Never playful, never distracting.** No wobble, no elastic overshoot, no personality-for-its-
  own-sake. Warmth here comes from *responsiveness*, not from character animation.
- **One acknowledgement per action.** A save fills once. A toast appears once. Nothing repeats
  or loops to keep reminding you it happened.
- **Reject the spectacle references.** The glowing-orb, urgency-halo, celebratory-burst pattern
  from mainstream social is explicitly out of scope (L6). Our positive signal is a single quiet
  fill toward `--color-positive` — the opposite of a fireworks show.

---

## 6. Do / Don't

**Do**
- Spend the existing tokens — pick the `--dur` that matches the interaction's *scale*.
- Default to `--ease-out`; reserve `--ease-in-out` for things that leave and return.
- Animate `transform` and `opacity`, and nothing else.
- Make every reduced-motion path fully functional with instant state or a gentle fade.
- Let motion confirm an action, then get out of the way.

**Don't**
- Don't invent a new duration or easing. If the library lacks a row, reuse the nearest one.
- Don't autoplay anything — media, shimmer, or otherwise.
- Don't animate layout, and don't ship motion that can't hold 60fps.
- Don't loop, pulse, bounce, or spark to pull attention back.
- Don't let motion sit on the critical path — it acknowledges, it never blocks.

> The bar (from the [HIG](../02-human-interface-guidelines/motion.md)): motion should be *felt as
> ease and understood as change*, and never *remembered as an effect*.
