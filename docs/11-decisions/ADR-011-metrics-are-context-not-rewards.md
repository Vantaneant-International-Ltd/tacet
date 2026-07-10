# ADR-011: Metrics — self-directed pressure vs. world-directed context

## Status
Accepted (2026-07). **Revised (2026-07-09)** — the blanket "no public metrics /
strip all incoming counts" rule is replaced by a sharper line: **separate
self-directed metrics from world-directed context.** The ban on vanity scores is
kept; the reflex to hide the world's real signals is retired. See *What changed and
why*.

## Context
Public numbers are the attention economy's most durable hook. Like counts, follower
tallies, view counts, and leaderboards *about you* reframe connection as
competition: they turn friends into an audience, a relationship into a score, and
posting into performance for a number. Their real function is to make you perform for
them or come back to protect them.

But not every number is that number. The first version of this ADR drew the line at
"public vs. private" and, to be safe, ruled that **incoming remote engagement counts
are ingested as context but never rendered.** That was too blunt. It conflated two
genuinely different things:

- A count on **your own** post pressures **you** — perform, come back, protect the
  score. This is self-directed, and it is the hook we refuse.
- A count on **someone else's** post *informs you about the world* — "this landed
  with a lot of people," the way a crowded café tells you something without pressuring
  you. This is world-directed, and hiding it is not calm; it is *incomplete*. It is the
  read-side equivalent of fabricating absence, which our publishing doctrine
  (ADR-005, "absent, not fabricated") forbids in spirit.

The distinguishing question was never "is it a number?" or even "is it public?" It
is **"who is this number about, and does it reward or pressure the person seeing
it?"**

## Decision
**Separate self-directed metrics from world-directed context. Ban the first; allow
the second, honestly framed.**

- **Self-directed metrics are banned.** Tacet does not show you a public tally of your
  own likes, followers, boosts, or views; no leaderboard of your reach; no streaks; no
  personal-performance dashboard. Nothing exists to make a number *about you* go up.
- **World-directed context is allowed** — numbers and signals *about the world*, shown
  to help a person understand it, not to pressure them about themselves. What resonated
  on the open web, what a conversation's activity is, that a community moved today. These
  *inform*.
- **Private self-context is allowed** — numbers *for you* that help you manage your own
  world (e.g. "3 drafts," a private count of who you follow used as a management tool).
  Never surfaced to others as a score.

**Framing discipline for world-directed numbers.** Because a raw ascending tally
still *reads* like a scoreboard even when it's about others, prefer the calmest true
representation: lead with the thing (the topic, the conversation, the piece), not the
number; soften exact tallies toward ranges or qualitative language ("many people are
reading this," "an active thread") where the exact figure serves pressure more than
understanding; and never rank *people* against each other. Represent momentum; never
manufacture a race.

**Incoming remote engagement counts are world-directed by default** — a count on a
federated post is information about that post's reception in the world, and may be
represented as such under the framing discipline above. What we still strip is any
transformation of that data into a **self-directed** score about the viewer, or into a
ranking of people.

## Consequences
- Relationships are never displayed as tallies about *you*; closeness is something you
  shape, not a leaderboard position. This still protects the People surface.
- The open web's real life — momentum, popular media, active discussion — becomes
  representable, which is what lets Today and the context column feel alive (ADR-012).
- Federation requires ongoing discipline, but the discipline changes shape: every
  ingestion path must ask "is this being shown as world-context or as a self-score?" and
  route accordingly, rather than blank-stripping every number.
- Every genuinely useful count must still pass the test: *who is it about, and does it
  reward or pressure?* When in doubt, it stays private, softens to qualitative, or is
  removed.
- Designers get a clearer rule than before — the debate moves from "can we show a
  number at all?" to "is this number informing or manipulating?", which resolves most
  cases cleanly.

## What changed and why
The original decision banned **public** metrics and, defensively, hid **all** incoming
counts. That protected against self-directed vanity pressure — correctly — but it also
erased world-directed information the open social web genuinely has, and which a
faithful home should represent. The revised rule keeps the exact enemy (self-directed
scores, people-rankings, engagement pressure) and permits the friend (world-directed
context, honestly framed), policed by the **informing vs. manipulating** line rather
than a blanket hide.

## References
- [Founding principles](../00-manifesto/founding-principles.md) — Relationships before engagement; vanity metrics that reframe connection as competition.
- [Anti-patterns](../00-manifesto/anti-patterns.md) — engagement metrics that drive compulsion; the comparison machine (still banned — these are the self-directed case).
- [../10-design/design-principles.md](../10-design/design-principles.md) — L11 Informing, not manipulating.
- [ADR-005: Representation, not degradation](ADR-005-representation-not-degradation.md) — "absent, not fabricated"; the representation principle extended to the read side.
- [ADR-009: People before posts — the five pillars](ADR-009-people-before-posts-five-pillars.md) — the relationship layer self-directed tallies would corrupt.
- [ADR-010: Calm over engagement](ADR-010-calm-over-engagement.md) — the mechanics half of the same refusal.
- [ADR-012: The Context Column Law](ADR-012-the-context-column-law.md) — where world-directed context is allowed to live.
