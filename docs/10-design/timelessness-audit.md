# Timelessness Audit — the ten-year lens

> **Milestone:** Visual System V2 · **Purpose:** the final review before the corpus is frozen. Imagine
> Tacet is a defining product of the open social web a decade from now. What still feels inevitable —
> and what reveals the year it was made? The rule: **remove or refine anything that exists only because
> it is fashionable today rather than fundamental to Tacet.** Do not chase trends; optimise for
> timelessness. Codified as [ADR-016](../11-decisions/ADR-016-timeless-system-swappable-style.md).

---

## The finding in one paragraph

Tacet is unusually timeless **where it matters** — its principles, architecture, information
architecture, and typography are the parts a person still lives inside in ten years, and they are
almost entirely fashion-independent. Its fashion risk is **concentrated in the surface style layer**
(one accent hue, two typefaces, the amount of corner-rounding, one translucency effect), which the
token architecture already isolates behind semantic names. So the honest audit is not "much of this
will age" — it is "one effect exists only because it is fashionable and should go, and a handful of
values are of-this-decade and should be *labelled* as swappable rather than treated as eternal."

---

## 1. Which ideas still feel timeless?

These would be defensible on a stage in 2035 as easily as today:

- **The five pillars and people-before-posts** ([ADR-009](../11-decisions/ADR-009-people-before-posts-five-pillars.md)).
  Organising around people and a bounded day, not an infinite feed, is a stance about human
  attention, not a UI trend.
- **Calm over engagement; metrics as context, not rewards** ([ADR-010](../11-decisions/ADR-010-calm-over-engagement.md),
  [ADR-011](../11-decisions/ADR-011-metrics-are-context-not-rewards.md)). The attention economy will
  look *more* dated in ten years, not less; refusing it ages well.
- **Home as source of truth; identity before platform; publishing is distribution**
  ([ADR-002](../11-decisions/ADR-002-home-is-the-source-of-truth.md),
  [ADR-001](../11-decisions/ADR-001-identity-before-platform.md),
  [ADR-004](../11-decisions/ADR-004-publishing-is-distribution.md)). Ownership and portability are
  structural, not stylistic.
- **Typography carries hierarchy; a fixed reading measure (66–72 chars); generous whitespace; an 8px
  rhythm.** These are typographic fundamentals with centuries behind them.
- **WCAG AA as a floor; warmth over austerity; two real themes; a semantic token architecture.**
  Accessibility and warmth only compound in value; semantic tokens are *how* the rest stays swappable.
- **The Context Column Law** ([ADR-012](../11-decisions/ADR-012-the-context-column-law.md)) — a rule
  about serving the current task, not a visual motif. It outlives any layout.

## 2. Which ideas feel fashionable / tied to today's trends?

Named honestly, strongest signal first:

- **The lavender/purple accent** — purple is *the* 2020s tech/AI-era accent. It is brand, not pure
  fashion, so it stays — but it is the most era-coded colour choice in the system.
- **Jost + Space Mono** — a geometric-sans revival and a characterful indie mono. **Space Mono is the
  most fashion-bound token in the whole system** and the one most likely to be swapped first.
- **The amount of corner-rounding** (`--radius-lg` 20 / `--radius-xl` 28, pills everywhere) — soft-UI
  rounding is a 2020s signature. Moderate rounding is timeless; the top of this scale leans to now.
- **The frosted-glass `backdrop-filter` blur** on the top bar — glassmorphism, an iOS/VisionOS-era
  effect. This one is *pure* fashion **and contradicts our own doctrine**. → removed (see §6).

## 3. Which interactions would age poorly?

- **Frosted-glass chrome** — would instantly read "early-2020s." (Removed.)
- **Spring/bounce motion** — a Framer/iOS-era tic. Tacet already forbids literal bounce/overshoot; the
  motion system is opacity + gentle translate, which is durable. Only the *word* "spring" was
  trend-coded; the behaviour is fine. (Reworded lightly.)
- **Nothing structural.** The interaction *model* — reply / share / keep, bounded Today, quiet
  presence — is calm and durable. There is no gesture here that depends on a passing convention.

## 4. Which terminology is unnecessarily contemporary?

Very little, because [ADR-008](../11-decisions/ADR-008-human-language-over-protocol-language.md)
already banned the jargon that dates fastest (protocol terms) and
[ADR-011](../11-decisions/ADR-011-metrics-are-context-not-rewards.md) banned growth-speak. The pillar
names (Today, People, Discover, Conversations, Me) are plain, ancient words. No "vibe/drop/stories/
reels" slang appears. The one mild borrow is **"Workspace"** (a Notion-era framing) — but it is a
generic, durable word for a genuine concept, so it stays. Terminology is clean.

## 5. Which parts survive if ActivityPub disappears?

**Everything a person sees.** This is the whole point of
[ADR-007](../11-decisions/ADR-007-protocols-are-replaceable-infrastructure.md) and
[ADR-008](../11-decisions/ADR-008-human-language-over-protocol-language.md): the protocol is a
replaceable adapter at the edge, and its vocabulary never reaches the UI. If ActivityPub vanished,
the domain model, the five pillars, the publishing model, and every human word would stand unchanged;
only the adapter would be rewritten. Tacet is *already* built for the day its protocol dies.

## 6. Which parts survive if new protocols replace today's ones?

The same parts — and by design. The **Entry** content model
([ADR-003](../11-decisions/ADR-003-entry-is-the-canonical-content-model.md)) is a *superset* of what
any protocol supports, not a mirror of ActivityPub's post type, and
[ADR-005](../11-decisions/ADR-005-representation-not-degradation.md) says content is *represented*
into each destination's capabilities. So a new protocol (AT Protocol, or something not yet named) is
another adapter mapping *out* — the product does not move. Tacet's federation citizenship
([ADR-015](../11-decisions/ADR-015-federation-citizenship.md)) is likewise stated in human actions
(Share, Reply), not protocol verbs, so it too survives the swap.

---

## 7. What was removed or refined (the actual changes)

- **Removed: frosted-glass blur.** The top bar is now a **solid surface + hairline**; depth comes from
  contrast, not a translucency effect. It existed only because it was fashionable and it violated the
  "depth from contrast, not effects" principle. 📄 [responsive.md](./responsive.md).
- **Refined: the "spring" framing** in motion is described as *a settled arrival* rather than a
  "spring feel"; the easing (opacity + gentle translate, no bounce) is unchanged and durable. 📄
  [motion.md](./motion.md).
- **Labelled, not removed: the style layer.** The accent hue, the two typefaces, and the largest radii
  are marked as the **swappable style layer** — Tacet's current identity, but tunable in one place
  without structural churn, precisely because components bind to token *names*. 📄
  [tokens.md §14](./tokens.md), [ADR-016](../11-decisions/ADR-016-timeless-system-swappable-style.md).

What was **kept unchanged**: everything in §1. Nothing timeless was touched. The purple, Jost, and the
radius scale remain Tacet's face today — the audit only insists they are known to be *a* face, not
*the* face for all time.

## 8. Verdict

Tacet is built to last at the level that decides whether a product feels timeless — its ideas, its
architecture, its words, its type. Its style will and should evolve; the system is what makes that
evolution cheap and safe. With the one fashionable effect removed and the style layer honestly
labelled, **the design corpus optimises for timelessness rather than for this year's taste**, and is
ready to be frozen for Stage 6.
