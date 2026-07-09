# Visual System V2 — Overview & Index

> **Milestone:** Visual System V2 · **Owner:** Head of Design · **Status:** Stage 2 in progress.
> *"Make Tacet feel like the product it was always meant to be."* Refinement, not redesign.
> Navigation, IA, features, and product concepts are **frozen**. This system makes every
> interaction feel intentional — WWDC-inevitable, calm, timeless, warm.

---

## What this is

Visual System V2 is Tacet's design language, intended to hold for the next decade. It is defined in
documents first (this corpus), then wireframed, then built in **Claude Design** (our High-Fidelity
tool and prototype environment; it replaces Figma), then implemented. **System first, product second,
polish last.** A beautiful screen without a coherent system does not ship.

This corpus supersedes nothing in `03-design-system/` — it *matures* it. Where V1 defined tokens,
V2 completes them; where V1 shipped primitives, V2 specifies every state; where V1 left gaps (motion
in use, media, tablet, form/overlay components, the desktop canvas), V2 fills them.

---

## The corpus

| Doc | Covers | Status |
|---|---|---|
| [design-audit.md](./design-audit.md) | Stage 1 — what works / unfinished / must remain / open to change | ✅ |
| [tokens.md](./tokens.md) | **Canonical** — every token (type, space, colour, radius, elevation, motion, media, layout, z) | ✅ |
| [design-principles.md](./design-principles.md) | The five founding principles + ten V2 visual laws | ✅ |
| [responsive.md](./responsive.md) | Five tiers; the three-column desktop canvas; the **Context Column Law** | ✅ |
| [typography.md](./typography.md) | Type scale in use, hierarchy, pairing, reading | ⏳ |
| [spacing.md](./spacing.md) | Rhythm, card padding, section spacing, vertical grid | ⏳ |
| [motion.md](./motion.md) | The motion library built on V1 tokens; reduced-motion contract | ⏳ |
| [navigation.md](./navigation.md) | Rail, tab bar, presence signal, transitions between pillars | ⏳ |
| [accessibility.md](./accessibility.md) | AA contrast, focus, keyboard, screen readers, reduced motion | ⏳ |
| [components.md](./components.md) | Every primitive + all states; the gaps V2 fills | ⏳ |
| [media-system.md](./media-system.md) | Editorial media: crop, ratio, scrim, galleries, loading, captions | ⏳ |
| [profile-system.md](./profile-system.md) | A person's space: private home, public profile, remote profile | ⏳ |
| [conversation-system.md](./conversation-system.md) | Correspondence layout: threads, replies, calm presence | ⏳ |
| [publishing-ui.md](./publishing-ui.md) | Compose by intent (Thought/Photo/Article/Video/Event); distribution, not drafts | ⏳ |

---

## The decisions log (what V2 has committed to)

Recorded so future contributors understand **why**, not just what.

- **D1 — Refinement, not redesign.** Sizes, spacing, radius, colour values, motion durations are
  kept as audited-correct. V2 *completes* the token set and *uses* what was idle.
- **D2 — Type carries hierarchy, not borders.** (L1) Widen perceived hierarchy via weight/colour/
  tracking/space so cards can shed chrome.
- **D3 — One card padding rhythm.** Comfortable (`--space-5`) / compact (`--space-4`). The three
  drifting paddings the audit found are collapsed.
- **D4 — Motion becomes real.** A used, coherent library on the existing tokens; reduced-motion
  complete.
- **D5 — Media becomes editorial.** Tokenised scrims, ratios, blur-up, captions.
- **D6 — Full three-column desktop canvas.** Rail · reading feed (fixed measure) · context column.
  *(User decision.)*
- **D7 — The Context Column Law: your world, never your score.** The right column is a living
  contextual space — people close to you, what your world is reading, active conversations,
  communities that moved, a calm onward door. Rich when genuine, quiet when not. Never a dashboard, a
  leaderboard, or anxiety furniture; gated by informing-vs-manipulating, not by emptiness.
  *(Revised 2026-07-09 — [ADR-012](../06-decisions/ADR-012-the-context-column-law.md),
  [stage-6-design-direction.md](./stage-6-design-direction.md).)*
- **D8 — Extract the references' craft, reject their casino — but represent the world.** Depth,
  media-first, desktop canvas, and the open web's *real life* (people, momentum, communities) in;
  self-directed vanity counts, people-rankings, story-ring streaks, and the live federation-status
  ticker out. The line is informing vs manipulating, not rich vs empty. *(Revised 2026-07-09;
  supersedes the earlier "reject trending/federation entirely" reading — see
  [ADR-011](../06-decisions/ADR-011-metrics-are-context-not-rewards.md).)*
- **D9 — Both themes designed.** Light gets its own loving pass, not an inversion.
- **D10 — Landing stays a distinct "keynote surface."** It keeps its own dark visual language; the
  boundary is documented rather than merged.

---

## Stage map

1. **Design Audit** ✅ · 2. **Design System V2 (this corpus)** ⏳ · 3. **Information Architecture** ·
4. **Low Fidelity / Wireframes (~30–50, grey)** · 5. **Review & Reduction** ·
6. **High Fidelity + Prototype in Claude Design** (desktop/tablet/mobile, components, variables,
prototype) · 7. **Claude Design → Repository handoff** (repo stays the source of truth).
See [stage-6-design-direction.md](./stage-6-design-direction.md) for the full workflow.

## The bar

> Would Apple ship this? Would Linear accept it? Will it feel modern in five years? Does it feel
> unmistakably like Tacet? If any answer is no — keep refining.
