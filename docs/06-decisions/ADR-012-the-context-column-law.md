# ADR-012: The Context Column Law — "Your world, never your score"

## Status
Accepted (2026-07). **Revised (2026-07-09)** — the "contextual or empty" doctrine
is replaced by "your world, never your score." The anti-dashboard intent is kept and
sharpened; the reflex toward emptiness is retired. See *What changed and why* below.

## Context
The wide desktop canvas (ADR-013) has a third column to the right of the reading
feed. That column is the exact place where other social products quietly become
anxiety machines: it fills with trending tallies, standalone widgets, activity
counts, and "federation status" panels — the sidebar-of-metrics visible in the
reference mockups. Given real estate, the default gravity of the medium is to fill
it with a dashboard.

The first version of this law resisted that gravity by making **emptiness the
default** — the column showed a single task-continuation or nothing at all. That
over-corrected. It confused *calm* with *subtraction*, and it treated the open
social web's real life — people, communities, conversations, momentum — as noise to
be hidden rather than a world to be represented. A blank column on most screens most
of the time does not read as calm; it reads as unfinished, and it wastes the one
place a home could feel alive.

The correct dividing line is not *contextual vs. empty*. It is
**informing vs. manipulating** (see the design-principles law of the same name, and
ADR-011). The open social web genuinely has people close to you, communities active
today, conversations worth joining, and things worth exploring. Representing those
honestly *informs* a person about their world. The manipulation begins only when
those things are optimized to maximize attention rather than understanding — turned
into scores, rankings, leaderboards, or growth mechanics that pressure the person
about their *own* performance.

Tacet is calm the way Apple, Linear, Arc, and Notion are calm: **clear and
intentionally rich, never empty.** The context column should express that.

## Decision
The right-hand context column is a **living contextual space whose job is to help a
person understand and move through their world — never to show them their own
score.** It adapts per screen, is derived from the current view and the person's
real relationships, and is allowed to be genuinely rich. It is filled with intention
or, when nothing genuine belongs there, it is quiet — but *quiet* is a considered
composition, not a blank slot to be proud of.

**The governing test for anything in this column:** *does it help the person
understand their world (informing), or does it make a number about them go up
(manipulating)?* Informing belongs. Manipulating does not.

**Allowed — the column may host, when genuine and relevant to the current view:**
- **People close to you** — who's around, recent presence, relationships to return to.
- **Continue where you left off** — the article/thread/compose you were mid-way through.
- **Active conversations** — correspondence and threads with genuine life right now.
- **Communities active today** — a corner of the open web that moved, described humanely.
- **Worth exploring** — a calm, curated onward door into the open social web.
- **Across the open social web** — represented momentum: what your world is reading,
  watching, discussing — framed editorially (a topic, a conversation, a piece), scoped
  to relationships, never a race-to-the-top tally.
- **Calm system reassurance** — quiet, honest confirmation the open web is alive and
  reachable (shown as reassurance/education, not as a live-ticking dashboard).
- **Context about the room you're currently in** — participants, the moment a thread
  hangs off, a community's purpose, a person's shared context before you follow.

**Not allowed — the column never hosts:**
- **Creator rankings** or any "who's winning" ordering of people.
- **Follower / like / view leaderboards** or public vanity tallies.
- **Personal analytics** or a performance dashboard about *your* reach.
- **Engagement pressure** — streaks, "you're falling behind," manufactured urgency.
- **Growth mechanics** — anything whose real job is to make you post/return to move a number.
- **Anxiety furniture** — pulsing counts, red badges, urgency halos, a live-metrics stock ticker.

Any number the column shows must be **world-directed context** (about the world, to
help you understand it) or **private self-context** (e.g. "3 drafts," for you to
manage your own home) — never a **self-directed public score** that rewards or
pressures you (ADR-011). Nothing may *live* only in this column; below the wide tier
its content folds into the main flow or the person loses nothing essential.

## Consequences
- **Benefit:** desktop width finally serves the product's aspiration — a home that
  feels like a living city, where the world is present without being noisy. The column
  is where "the open social web is alive" becomes visible, calmly.
- **Cost / discipline:** every block earns its place by the informing/manipulating
  test, per screen. "Rich" is not license for a dashboard; the ban list is absolute and
  is an explicit test gate at implementation. Richness that cannot pass the test is cut,
  not softened.
- **Constraint on features:** no capability may depend on the context column existing;
  each must fold gracefully into the main flow below the wide tier.
- **Quiet is still allowed, but it is composed.** When a view genuinely has nothing to
  add, the column may rest — but resting is a designed state (considered spacing, a warm
  margin), not a blank slot celebrated as discipline.

## What changed and why
The original decision made **emptiness the sanctioned default** ("when nothing
genuinely helpful exists it stays empty — the feed simply centres"). We retired that
because it mistook *subtraction* for *calm*. The refusal it was protecting — no
dashboard, no scoreboard, no anxiety furniture — was correct and is kept in full. But
the refusal was over-applied to *all* standing context, including the humane,
informing content (people around you, what your world is reading, communities that
moved) that a home should show. The revised law keeps the exact same enemies and
lets the friends back in, policed by a sharper line: **informing vs. manipulating**,
not *contextual vs. empty*.

## References
- [../10-design/design-principles.md](../10-design/design-principles.md) — L11 Informing, not manipulating; "Calm is clarity, not subtraction."
- [../10-design/responsive.md](../10-design/responsive.md) — §3 The context column is a living space, governed by the informing/manipulating test.
- [../10-design/information-architecture.md](../10-design/information-architecture.md) — §3 the three-column contents per pillar.
- [ADR-010](./ADR-010-calm-over-engagement.md) — the engagement-mechanics veto this law does not weaken.
- [ADR-011](./ADR-011-metrics-are-context-not-rewards.md) — self-directed vs world-directed metrics; the number half of the same line.
- [ADR-013](./ADR-013-three-column-desktop-canvas.md) — the canvas this column sits within.
- [../10-design/stage-6-design-direction.md](../10-design/stage-6-design-direction.md) — the doctrine reframing that motivated this revision.
