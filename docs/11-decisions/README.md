# Architecture Decision Records

This folder is the **permanent index of Tacet's foundational decisions** — the *why* behind the
product, preserved so future contributors never have to rediscover it.

The [manifesto](../00-manifesto/), [product](../01-product/), [publishing philosophy](../01-product/publishing-philosophy.md),
[federation](../05-federation/), and [design](../10-design/) docs remain the **constitutional
documents** — the full reasoning, in depth. An ADR does **not** duplicate them; it records a single
decision in one page and *points* at the constitutional docs for the detail. ADRs answer **why**,
never **how**. They are added only for genuinely foundational decisions, not implementation details.

**You can understand Tacet by reading this folder in order.** The set is arranged so each decision
builds on the ones before it: identity → home → content → publishing → protocol → experience → process.

## Index

| ADR | Decision | In one line |
|---|---|---|
| [ADR-000](./ADR-000-adopt-architecture-decision-records.md) | Adopt ADRs | Preserve the reasoning behind the product as a permanent index |
| [ADR-001](./ADR-001-identity-before-platform.md) | Identity before platform | You own a portable identity; platforms are where it visits, not what it is |
| [ADR-002](./ADR-002-home-is-the-source-of-truth.md) | Home is the source of truth | Your content lives at your home; networks hold copies |
| [ADR-003](./ADR-003-entry-is-the-canonical-content-model.md) | Entry is the canonical content model | One internal content abstraction; kinds are human, not protocol |
| [ADR-004](./ADR-004-publishing-is-distribution.md) | Publishing is distribution | Creating ≠ distributing; there are no drafts, only distribution state |
| [ADR-005](./ADR-005-representation-not-degradation.md) | Representation, not degradation | Content is represented faithfully per destination, never "downgraded" |
| [ADR-006](./ADR-006-workspaces-own-published-content.md) | Workspaces own published content | The workspace is the author; switching is not re-login |
| [ADR-007](./ADR-007-protocols-are-replaceable-infrastructure.md) | Protocols are replaceable infrastructure | The product/domain leads; ActivityPub is a swappable adapter |
| [ADR-008](./ADR-008-human-language-over-protocol-language.md) | Human language over protocol language | Users see Thought/Photo/Article…; never server, instance, federation, "Entry" |
| [ADR-009](./ADR-009-people-before-posts-five-pillars.md) | People before posts (five pillars) | Today · People · Discover · Conversations · Me — the feed is never the organizing idea |
| [ADR-010](./ADR-010-calm-over-engagement.md) | Calm over engagement | No infinite scroll, no compulsion loops, no engagement mechanics |
| [ADR-011](./ADR-011-metrics-are-context-not-rewards.md) | Metrics are context, not rewards | No public vanity counts; numbers inform, never reward |
| [ADR-012](./ADR-012-the-context-column-law.md) | The Context Column Law | The desktop context column helps the current task, or is empty — never a dashboard |
| [ADR-013](./ADR-013-three-column-desktop-canvas.md) | Three-column desktop canvas | Rail · fixed-measure reading feed · context; width becomes context, not longer lines |
| [ADR-014](./ADR-014-design-system-before-screens.md) | Design system before screens | The system is defined and reviewed before any screen is polished |
| [ADR-015](./ADR-015-federation-citizenship.md) | Federation citizenship | Tacet gives back through Boost + Reply, never a like economy; write-actions are honestly gated |
| [ADR-016](./ADR-016-timeless-system-swappable-style.md) | Timeless system, swappable style | The system is built to last; accent/typeface/rounding are a thin swappable style layer, not sacred |

## Format

Every ADR is ~1 page and follows the same shape:

```
# ADR-NNN: Title
## Status        — Accepted (and when/why)
## Context       — why this decision became necessary (the forces)
## Decision      — the decision itself, stated plainly (the why)
## Consequences  — trade-offs, benefits, costs, future implications
## References    — the constitutional docs this indexes, and related ADRs
```

## Changing an ADR

ADRs are durable. A decision is not edited away — if it is reversed, a **new** ADR supersedes it and
this index records the supersession. That is how the reasoning stays legible over years.
