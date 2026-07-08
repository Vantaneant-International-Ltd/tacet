# ADR-012: The Context Column Law

## Status
Accepted (2026-07).

## Context
The wide desktop canvas (ADR-013) has a third column to the right of the reading
feed. That column is the exact place where other social products quietly become
anxiety machines: it fills with trending tallies, standalone widgets, activity
counts, and "federation status" panels — the sidebar-of-metrics visible in the
reference mockups. Given real estate, the default gravity of the medium is to
fill it with a dashboard. Tacet is a calm product on the open social web, and a
dashboard on the right would undo, in one column, the discipline the rest of the
IA fought for (no notification center, no vanity counts, correspondence over
alerts). A rule was needed strong enough to resist that gravity every time a new
screen is designed.

## Decision
The right-hand context column is **contextual to what the person is doing right
now**, and its only job is to help them **understand or continue the current
task**. It adapts per screen, is derived entirely from the current view, and
when nothing genuinely helpful exists it stays **empty** — the feed simply
centres.

This is stated as a *law*, not a slot, because the WHY is refusal: the column
must never become a dashboard, never host standalone widgets, never show
metrics-as-rewards, never carry a public tally, and never surface a "federation
status" panel. Any number it shows is private context for *you* (e.g. "3
drafts"), never a public scoreboard. Nothing may *live* only in this column;
below the wide tier its content folds into the main flow or disappears. This was
a deliberate user decision, made to keep the one surface most prone to
metric-creep honest by default.

## Consequences
- **Benefit:** the calmest possible use of desktop width — help when it exists,
  quiet emptiness when it does not. The column can never regress into a
  scoreboard, because emptiness is the sanctioned state, not a failure.
- **Cost / discipline:** every new screen must answer "what here helps the person
  understand or continue *this*?" and accept "nothing — leave it empty" as a
  correct answer. Designers cannot reach for the column to park orphan features.
- **Constraint on features:** no capability may depend on the context column
  existing; each must fold gracefully into the main flow below the wide tier.
- **Verification:** the column must be genuinely empty on views with nothing
  contextual and must never show a metric as a reward — this is an explicit test
  gate at implementation.

## References
- [../10-design/responsive.md](../10-design/responsive.md) — §3 The context column is a law, not a slot
- [../10-design/information-architecture.md](../10-design/information-architecture.md) — §3 the three-column contents per pillar
- [ADR-010](./ADR-010-calm-over-engagement.md) — related
- [ADR-011](./ADR-011-metrics-are-context-not-rewards.md) — related
- [ADR-013](./ADR-013-three-column-desktop-canvas.md) — the canvas this column sits within
