# Stage 6 — Design Direction

> **Milestone:** Visual System V2 · **Stage:** 6 (High Fidelity + Prototype) · **Status:** Direction
> set 2026-07-09; pixels not yet begun. This document is the brief that governs High Fidelity. It
> records the doctrine reframing that precedes it, the north star, the tool and workflow change
> (Claude Design replaces Figma), and the standard every Stage-6 screen is held to.

Read [FOUNDING_PRINCIPLES.md](../../FOUNDING_PRINCIPLES.md) and
[design-principles.md](./design-principles.md) first. This assumes both.

---

## Why this document exists

A pre–High-Fidelity audit found that Tacet's *architecture, philosophy, and product direction are
strong*, but the **design doctrine had drifted**. In the effort to avoid becoming traditional social
media, the doctrine over-corrected: it began to equate **calm with subtraction**, and it removed
concepts (momentum, the open web's real life, a living context column) because the *incumbents
implemented them manipulatively* — not because the concepts were themselves incompatible with Tacet.

This document corrects the drift before a single pixel is drawn, so High Fidelity builds the Tacet we
envisioned rather than a reaction against what we reject.

---

## The correction, in two sentences

1. **Calm is clarity, not subtraction.** Apple, Linear, Arc, and Notion are calm *and* intentionally
   rich. None of them are empty. That is the standard.
2. **Informing is not manipulating.** Faithfully representing the open social web's reality — people,
   communities, conversations, photos, videos, articles, events, momentum, popular discussions, active
   relationships — is honest representation, not engagement optimization. Manipulation begins only when
   those things are optimized to maximize *attention* rather than *understanding*.

These two ideas now govern every design decision. See
[design-principles.md](./design-principles.md) L11 and principles 1–2, and
[ADR-011](../06-decisions/ADR-011-metrics-are-context-not-rewards.md) /
[ADR-012](../06-decisions/ADR-012-the-context-column-law.md).

---

## The north star: a living city, not a minimalist magazine

Tacet should feel like **coming home to a living city** — an ecosystem with people, communities,
relationships, conversations, culture, unexpected discoveries, and different neighbourhoods. The open
social web *is* that city; Tacet is the calmest, warmest, most beautiful window onto it ever built.

- The **feed is one room** inside the home, not the whole home.
- **People, Discover, Conversations, and the context column** are what make the world feel alive —
  present and warm, **without ever becoming noisy.**
- "Alive without noise" is the whole craft: momentum you can feel, not a leaderboard; people around
  you, not a presence-surveillance panel; a neighbourhood worth walking, not a directory.

The failure mode on one side is the incumbents' casino. The failure mode on the other — the one we
are correcting — is the empty show-home. Stage 6 aims precisely between them: **rich, warm, calm,
clear.**

---

## What this changes for specific surfaces

These are the design intents Stage 6 works toward. Product IA and the five pillars are unchanged and
frozen; what changes is how alive each surface is allowed to feel.

- **Today → a calm editorial homepage.** It still respects chronology and is never an opaque
  algorithm, and it still *ends* (bounded, finishable — [ADR-010](../06-decisions/ADR-010-calm-over-engagement.md)
  stands). But it should feel **alive**: curated with a visible human hand, media-first, with a warm
  greeting and a sense that the world is present. Not a bare chronological dump. See
  [hifi/today.md](./hifi/today.md).
- **Discover → the neighbourhood walk.** Not a directory, not a leaderboard — an **editorial
  exploration** of the open social web. Corners worth visiting, people worth meeting, communities
  that moved, framed by a curator's voice.
- **The context column → your world, never your score.** A living space: people close to you,
  continue-where-you-left-off, active conversations, communities active today, worth-exploring, calm
  system reassurance, context about the room you're in. Never rankings, leaderboards, analytics,
  engagement pressure, or anxiety furniture ([ADR-012](../06-decisions/ADR-012-the-context-column-law.md)).
- **Metrics → world-directed context is allowed; self-directed scores are not.** A count on your own
  post is banned; representing what resonated in the world (framed, softened where a raw tally reads
  as a scoreboard) is allowed ([ADR-011](../06-decisions/ADR-011-metrics-are-context-not-rewards.md)).
- **Momentum / trending → represented, relationship-scoped, editorial.** "What your world is reading
  / discussing," led by the thing not the number. Never "12.4K people talking" as the hook, never a
  race-to-the-top ranking.
- **Federation reassurance → wonder shown once, not a ticker installed.** A one-time or on-demand
  "you're connected to a live open web" moment (onboarding, or behind "how federation works") — never
  a persistent live-metrics dashboard.

---

## What does NOT change (the refusals still stand in full)

The correction widens what *informing* content is allowed; it does not weaken a single refusal.

- No infinite scroll; Today still ends. No autoplay. No compulsion loops. No manufactured urgency.
  No red-badge notifications. No streaks or gamification. ([ADR-010](../06-decisions/ADR-010-calm-over-engagement.md).)
- No **self-directed** vanity metrics — no scoreboard of your likes/followers/views, no personal
  analytics, no ranking of people. ([ADR-011](../06-decisions/ADR-011-metrics-are-context-not-rewards.md).)
- No dark patterns, no lock-in, no dishonest integration claims, protocol stays invisible.
  ([anti-patterns](../00-manifesto/anti-patterns.md).)
- The five pillars, the IA spine, and all founding principles are frozen.
  ([FOUNDING_PRINCIPLES.md](../../FOUNDING_PRINCIPLES.md).)

---

## The design workflow (Stages 1–7)

Design proceeds through seven stages. **Claude Design is now the primary design tool and the
High-Fidelity implementation environment** — it replaces Figma, which earlier documents named as the
Stage-6 destination.

| Stage | Name | Where it happens | Output |
|---|---|---|---|
| 1 | **Design Audit** | repo (markdown) | what works / unfinished / must remain / open to change |
| 2 | **Design System V2** | repo (markdown) | canonical tokens, principles, components, laws |
| 3 | **Information Architecture** | repo (markdown) | surface map, three-column canvas, placements |
| 4 | **Low Fidelity / Wireframes** | repo (markdown, grey) | structural frames — layout, hierarchy, flow |
| 5 | **Review & Reduction** | repo (markdown) | self-critique, cut duplication, decisions log |
| 6 | **High Fidelity + Prototype** | **Claude Design** | pixel-perfect screens, components, variables, interactive prototype |
| 7 | **Claude Design → Repository handoff** | Claude Design → repo | specs/tokens/components implemented; repo is the source of truth |

**Roles of the two homes:**
- **The repository remains the source of truth** — for doctrine, tokens, decisions, and shipped code.
- **Claude Design is the canonical place for visual exploration, iteration, prototype refinement, and
  pixel-perfect specification** *before* implementation. Nothing designed in Claude Design is real
  until it lands back in the repo at Stage 7.

Where older docs say "built in Figma," "high fidelity in Figma," or "Figma is the visual source of
truth," read **Claude Design**. Historical review artifacts that record a *pre-Figma* review (a
review that literally happened under that name) keep their names as a matter of honest record; only
the *forward-looking workflow* is updated. See the patch list in
[doctrine-revision-2026-07.md](./doctrine-revision-2026-07.md).

---

## The Stage-6 bar (every screen is held to this)

Before any High-Fidelity screen is "done", it must pass all of
[design-principles.md](./design-principles.md) §"final-review questions", and specifically:

1. **Calm *and* rich?** Would Apple ship it, would Linear accept it, would Arc? Is it clear and
   unhurried — *without* being empty?
2. **Alive?** Does the open social web feel present — people, momentum, neighbourhoods — the way a
   living city feels alive when you walk into it?
3. **Informing, not manipulating?** Every element that shows the world or a number passes L11.
4. **A home, not a magazine?** Warm, personal, inhabited — not a sterile editorial layout.
5. **No refusal broken?** No self-directed score, ranking, engagement mechanic, or anxiety furniture
   slipped in under a new name.

If any answer is no — keep refining. Calm, rich confidence is the bar.

---

*Cross-links:* [design-principles.md](./design-principles.md) ·
[ADR-012](../06-decisions/ADR-012-the-context-column-law.md) ·
[ADR-011](../06-decisions/ADR-011-metrics-are-context-not-rewards.md) ·
[doctrine-revision-2026-07.md](./doctrine-revision-2026-07.md) ·
[hifi/today.md](./hifi/today.md) · [visual-system-v2.md](./visual-system-v2.md).
