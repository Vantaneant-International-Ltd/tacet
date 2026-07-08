# ADR-011: Metrics are context, not rewards

## Status
Accepted (2026-07).

## Context
Public numbers are the attention economy's most durable hook. Like counts, follower tallies, view counts, and leaderboards reframe connection as competition: they turn friends into an audience, a relationship into a score, and posting into performance for a number. Their real function is to make you perform for them or come back to protect them. Yet numbers are not inherently harmful — a private count ("3 drafts") can genuinely help a person manage their own things. We needed a decision that draws the line precisely, so we can keep numbers that serve the person while banning numbers that serve the metric. Federation complicates this: remote posts arrive carrying engagement counts, and we had to decide what to do with them.

## Decision
**No public vanity metrics.** Tacet does not show like counts, follower/following tallies, view counts, boost counts, leaderboards, or streaks. Numbers may exist only as **private context for the person themselves** — information that helps you manage your own world (for example, "3 drafts," or a private count of who you follow used as a management tool) — and **never as a public reward or social-pressure signal**.

The distinguishing question is not "is it a number?" but **"who is this number for, and does it reward or pressure?"** Context for you: allowed. Reward or comparison shown to others: banned.

**Incoming remote engagement counts are ingested as context but never rendered as public tallies.** When a federated post arrives with like or boost counts, Tacet may use that data internally, but it does not surface it as a public score. Openness does not obligate us to import the attention economy's scoreboard.

## Consequences
- Relationships are never displayed as tallies; closeness is something you shape, not a leaderboard position. This directly protects the People surface.
- We lose the "social proof" signals that platforms lean on to drive posting and following. Accepted: those signals are the comparison machine we reject.
- Federation requires ongoing discipline — every ingestion path must strip or privatize incoming counts before display, and this is a standing constraint on rendering code, not a one-time filter.
- Any genuinely useful count must pass the test above before it ships; when in doubt, it stays private or is removed.
- This gives designers a clear rule that resolves most "should we show a number here?" debates without escalation.

## References
- [Founding principles](../00-manifesto/founding-principles.md) — Relationships before engagement; vanity metrics that reframe connection as competition.
- [Anti-patterns](../00-manifesto/anti-patterns.md) — engagement metrics that drive compulsion; the comparison machine.
- [ADR-009: People before posts — the five pillars](ADR-009-people-before-posts-five-pillars.md) — the relationship layer these tallies would corrupt.
- [ADR-010: Calm over engagement](ADR-010-calm-over-engagement.md) — the mechanics half of the same refusal.
