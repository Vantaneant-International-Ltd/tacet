# ADR-000: Adopt Architecture Decision Records

## Status

Accepted (2026-07).

## Context

Over its first months, Tacet accumulated a large body of permanent architectural, product, and design
decisions — identity ownership, the source-of-truth model, the protocol stance, the five pillars, the
engagement doctrine, the design-system-first process. Each was made deliberately and for good reasons.

Those reasons currently live only inside large constitutional documents — the
[manifesto](../00-manifesto/), the [publishing philosophy](../09-product/publishing-philosophy.md),
the [product](../01-product/) and [design](../10-design/) corpora. Those documents are excellent, but
they are long, and a decision's *rationale* is often woven through prose rather than stated as a
discrete, citable fact. As the project grows and contributors change, the risk is that the **why**
behind a hard-won decision is lost, re-litigated, or accidentally reversed by someone who never saw
the argument — the most expensive kind of mistake, because it undoes deliberate design by accident.

## Decision

Adopt lightweight **Architecture Decision Records** as the permanent index of Tacet's foundational
decisions, in [`docs/06-decisions/`](./README.md).

- Each ADR is **one page** and records a **single** decision in a fixed format (Status · Context ·
  Decision · Consequences · References).
- ADRs answer **why**, never **how**. They are not tutorials, specs, or implementation guides.
- ADRs **reference** the constitutional documents; they do **not** duplicate them. The philosophy
  docs remain the source of depth; the ADRs are the source of *legibility* — the map to the reasoning.
- ADRs are created **only for genuinely foundational decisions** — ones that shape the product's
  identity and would be costly to rediscover or reverse. Temporary implementation details do not get
  ADRs.
- Decisions are **durable**: an ADR is not edited away. If a decision is reversed, a new ADR
  supersedes it, and the index records the supersession — so the history of the reasoning is preserved.

## Consequences

**Benefits.** A new contributor can understand Tacet's foundations by reading one folder in order,
in under an hour, instead of reverse-engineering intent from thousands of lines of prose and code.
Decisions become citable (`per ADR-010`), which makes reviews and disagreements faster and calmer —
the argument was already had and recorded. The reasoning survives staff turnover.

**Costs.** A small, ongoing discipline: foundational decisions must be captured as they are made, and
the set must be kept lean. The main failure mode is **ADR sprawl** — recording so many minor decisions
that the folder stops being a legible index. This is resisted by the "foundational only" rule.

**Future implications.** The initial set (ADR-001…014) captures decisions already made. Future
foundational decisions get their own ADRs. This document is itself the first ADR, establishing the
practice by using it.

## References

- Index and format: [docs/06-decisions/README.md](./README.md)
- Constitutional documents this practice indexes: [00-manifesto](../00-manifesto/),
  [09-product/publishing-philosophy.md](../09-product/publishing-philosophy.md),
  [01-product](../01-product/), [10-design](../10-design/), [05-federation](../05-federation/).
- Prior art: Michael Nygard, *Documenting Architecture Decisions* (the ADR pattern).
