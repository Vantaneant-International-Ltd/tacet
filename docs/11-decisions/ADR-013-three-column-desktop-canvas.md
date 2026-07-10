# ADR-013: The three-column desktop canvas

## Status
Accepted (2026-07).

## Context
Tacet is mobile-first. The earlier system (V1) stopped at a rail plus a single
column and, on desktop, either wasted the extra width or let it stretch the
reading column. Both are failures of the same kind: treating desktop as scaled
mobile rather than as a tier that deserves its own design. Wide monitors are a
real place people read, and the doctrine is explicit — *"everything should feel
intentionally designed, never merely scaled."* We needed a desktop layout that
uses the width without punishing the reader with ever-longer lines.

## Decision
Desktop is a **designed tier, not scaled mobile**: a three-column canvas of
**rail · centred reading feed · context column**.

Crucially, the reading feed's measure is **fixed** (~42rem) at every tier ≥
desktop. Widening the window does **not** widen the reading column. Extra window
width becomes the context column (ADR-012), then quiet margin, and at ultra-wide
the whole canvas is capped so surplus space becomes margin — line length is
**never** the variable that absorbs extra width.

The WHY: reading comfort is a constant, not a function of monitor size. A
comfortable measure is a comfortable measure whether the window is 1200px or
1728px wide. So we hold the reader's experience still and let the *canvas*
breathe around it. The rail carries navigation and compose; the centre carries
reading; the right carries only what helps the current task. Each column earns
its place, so no width is spent merely because it exists.

## Consequences
- **Benefit:** desktop feels authored at every width. The reader gets the same
  calm measure on a laptop and a large monitor; the extra pixels serve context
  and margin, not line-length creep.
- **Trade-off:** more layout work — tablet, desktop, wide, and ultra-wide are
  each designed in isolation rather than derived by stretching one grid. This is
  accepted as the cost of "designed, not scaled."
- **Constraint:** because the measure is fixed, the context column and margin are
  the only places surplus width can go; this makes the Context Column Law
  (ADR-012) structurally necessary rather than optional — without it, the freed
  width would tempt a dashboard.
- **Verification:** the reading measure must be pixel-identical from desktop
  through ultra-wide (no line-length creep), and every tier must read as designed
  when screenshotted in isolation.

## References
- [../10-design/responsive.md](../10-design/responsive.md) — §1 Tiers, §2 The three-column canvas
- [ADR-012](./ADR-012-the-context-column-law.md) — the law governing the third column
- [ADR-014](./ADR-014-design-system-before-screens.md) — related
