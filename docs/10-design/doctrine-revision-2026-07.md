# Doctrine Revision — 2026-07-09

> **Type:** revision log + documentation patch list. **Status:** doctrine documents updated; patch
> list tracks the remaining, mostly-mechanical propagation. Documentation-only; no product code or
> pixels changed. This is the map of what the pre–High-Fidelity audit changed and what still needs to
> follow.

---

## What changed (the two doctrine shifts)

1. **Calm is clarity, not subtraction.** The design doctrine had drifted into equating calm with
   emptiness. Corrected: calm is *unhurried clarity*, and the product should be **intentionally rich**
   like Apple / Linear / Arc / Notion. North star: *the definitive product for the open social web —
   where everything comes together.* ("Home" is a **product principle, not a visual metaphor** —
   refined 2026-07; we do not design a house, room, city, or magazine.)
2. **Informing, not manipulating** becomes a core design law (L11). Faithfully representing the open
   social web's reality is honest; only optimizing it for attention is manipulation.

Downstream: the **Context Column Law** flips from "contextual or empty" to "**your world, never your
score**", and the **metrics rule** flips from "hide all public metrics" to "**separate self-directed
metrics from world-directed context.**"

Full rationale: [stage-6-design-direction.md](./stage-6-design-direction.md).

---

## Documents already updated in this revision

| Document | Change |
|---|---|
| [ADR-012](../11-decisions/ADR-012-the-context-column-law.md) | Rewritten: "your world, never your score"; allowed/not-allowed lists; informing/manipulating gate. |
| [ADR-011](../11-decisions/ADR-011-metrics-are-context-not-rewards.md) | Revised: self-directed (banned) vs world-directed (allowed) vs private self-context (allowed); framing discipline. |
| [design-principles.md](./design-principles.md) | Principle 1 → "Calm is clarity, not subtraction"; principle 2 & 4 reworded; L2, L6→L7 reworded; **new L11 Informing, not manipulating**; final-review questions updated. |
| [responsive.md](./responsive.md) | §3 rewritten to the living-space law; §8 verify item updated. |
| [information-architecture.md](./information-architecture.md) (10-design) | §3 per-pillar context-column table rewritten to world-directed content. |
| [stage-6-design-direction.md](./stage-6-design-direction.md) | **New** — the Stage-6 brief, north star, and 7-stage Claude Design workflow. |
| [hifi/today.md](./hifi/today.md) | **New** — concrete High-Fidelity plan for Today (desktop + mobile). |

---

## Patch list — documents that still reference the old doctrine or Figma

### A. Old context-column / metrics doctrine to reconcile — ✅ RESOLVED 2026-07-09

All §A items are done. The wireframe ASCII frames are kept as historical structural references; each
now carries a doctrine-reconciliation banner pointing to the revised law and to
[hifi/today.md](./hifi/today.md), rather than being redrawn.

| File | Change made | Status |
|---|---|---|
| [02-human-interface-guidelines/design-principles.md](../02-human-interface-guidelines/design-principles.md) | Principle 1 → "Calm is clarity, not emptiness"; principle 2 split self-directed vs world-directed; L11 cross-refs added. | ✅ |
| [wireframes/02-today.md](./wireframes/02-today.md) | Header rewritten: editorial homepage + living context column; self-directed ban kept, world-directed momentum allowed; points to hifi/today.md. | ✅ |
| [wireframes/04-discover-search.md](./wireframes/04-discover-search.md) | Reframed as **editorial exploration** of the open web (not a directory/leaderboard); doctrine banner distinguishes represented momentum from a leaderboard; federation reassurance vs dashboard. | ✅ |
| [wireframes/00-overview.md](./wireframes/00-overview.md) | Figma → Claude Design; frozen-frame context note → "your world" (people, momentum, continue); doctrine-reconciliation banner. | ✅ |
| [components.md](./components.md) · Content Card §4 | Split: per-card self-directed scoreboard banned; world-directed reception, framed, allowed in editorial/context surfaces. | ✅ |
| [design-audit.md](./design-audit.md) | §6 reconciliation note + per-item "reject the manipulation / represent the reality" rewrite; stage map → Claude Design + Stage 7. | ✅ |
| [visual-system-v2.md](./visual-system-v2.md) D7/D8 | D7 → "your world, never your score"; D8 → "reject casino, represent the world"; stage map → Claude Design. | ✅ |

### B. Figma → Claude Design (forward-looking workflow references)

Change these to **Claude Design**:

| File / line | Reference |
|---|---|
| [visual-system-v2.md](./visual-system-v2.md):13 | "then wireframed, then built in Figma" |
| [visual-system-v2.md](./visual-system-v2.md):72 | Stage map — "High-fidelity in Figma" |
| [design-audit.md](./design-audit.md):267 | Stage map — "Stage 6 — High-fidelity in Figma" |
| [stage-5-design-decisions.md](./stage-5-design-decisions.md):6–8 | "Figma is now the visual source of truth" header |
| [ADR-014](../11-decisions/ADR-014-design-system-before-screens.md):24 | "only then taken to high fidelity in Figma" |
| [wireframes/00-overview.md](./wireframes/00-overview.md):5,65 | "come in Stage 6 (Figma)" / "renders the survivors in Figma" |
| [tokens.md](./tokens.md):311 | "code and Figma variables share one vocabulary" → Claude Design variables |
| [ADR-016](../11-decisions/ADR-016-timeless-system-swappable-style.md):34 | "a Figma variable" example → Claude Design variable |
| [STATE.md](../../STATE.md):158 | build-state note referencing Figma/Claude Design workspace |

### C. Figma → LEAVE AS HISTORICAL RECORD (do **not** rename)

These name a review or milestone that *literally happened under that name*. Renaming would rewrite
history, which this repo deliberately avoids (cf. `DESIGN.md` kept as "historical"). Keep the names;
optionally add a one-line banner that the tool going forward is Claude Design.

- `pre-figma-resolutions.md`, `pre-figma-design-review.md` (filenames + all their internal
  "before-Figma / pre-Figma review" references).
- [ADR-015](../11-decisions/ADR-015-federation-citizenship.md):5,71 — "Emerged from the pre-Figma
  design review" (a true historical origin).
- `profile-system.md`:235, `components.md`:326, `tokens.md`:141,152 — "the pre-Figma review found…"
  (historical attributions of where a finding came from).
- `stage-5-design-decisions.md` references to the Figma *screen inventory / reduced set* — the counts
  are still valid; only the tool name in forward-looking sentences changes (see §B).

**Recommendation:** do §B now (forward-looking, safe); treat §A as the substantive next editing pass
(it changes design intent, so it should be reviewed screen-by-screen alongside the Stage-6 work);
leave §C as-is unless you want a cosmetic banner. This split is itself a decision for you to confirm.

---

## Open forks this revision interacts with

`PRODUCT_DIRECTION.md` items **4 (reactions)** and **10 (dislike)** remain the founder's open forks.
This revision does **not** reopen them: public dislike stays retired, and self-directed public like
scoreboards stay retired. What this revision *adds* is that **world-directed** reception (what
resonated, represented calmly) is distinct from a **self-directed** score and is allowed — which is
consistent with, not a reversal of, the recommendation on those items.
