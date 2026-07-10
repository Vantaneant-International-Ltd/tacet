# ADR-005: Representation, not degradation

## Status

Accepted (2026-07).

## Context

Tacet's content model is a **superset** of what any single protocol supports: it expresses
what humans want to make — a titled Article, a multi-image Photo, an Event with a time and a
place — not the intersection of features every wire format happens to share. When such
content is shared to a destination that supports *less* (an Article to a protocol with no
long-form, an Event to one with no structured date/place), something has to give at the edge.

The conventional framing for this is **"degradation"** — the content is "downgraded," "lost,"
"stripped to fit." That framing is both technically misleading and, for a calm product,
quietly corrosive: it tells the author their work was diminished, and it implies the network
copy is the real thing that fell short. Neither is true in Tacet, where the full work always
stays home and only a *copy* ever goes out. We need to settle the mental model — and the
language — before the first publish adapter bakes the wrong one in.

## Decision

**When content goes to a destination that supports less, it is *represented faithfully*
within that destination's capabilities — never "degraded."** Each adapter produces the
truest representation its protocol can hold, typically with a link back to the canonical copy
at home (e.g. an Article becomes a short piece that points to the full one). The canonical
content at Home is unchanged and undiminished; nothing is deleted to fit a format.

This is deliberately a **language-and-mental-model decision as much as a technical one.**
"Represent" is chosen over "degrade," "downgrade," "strip," or "lose" throughout the product,
the domain, and the docs. The *why*: because home is the source of truth (ADR-002), a
per-destination rendering is a faithful *view* of a whole work, not a lossy copy of a lesser
one. The read side already establishes the honest habit — unknown values are *absent, never
fabricated*; the write side is the mirror: capability limits are *represented, never
apologized for as loss*.

## Consequences

**Benefits.** The author is never told their work was harmed by sharing it. The model stays
honest: divergence between the rich home copy and a leaner network copy is a first-class,
legible, expected state, not an error. Canonical-back-links make home-as-source-of-truth
visible and reinforce portability.

**Costs.** Discipline in wording — "degrade" is the reflexive engineering verb, and it must
be kept out of copy, code, and design. Each adapter must *declare* how each kind is
represented (including the best-effort case with no exact match), which is more design work
per protocol than a lowest-common-denominator squeeze would be.

**Future implications.** Adding a protocol means declaring representations, not defining
losses. The compatibility matrix's `◑ Partial` / `○ N/A` entries are read as *"represented
within limits,"* never as failures of the content.

## References

- [01-product/publishing-philosophy.md](../01-product/publishing-philosophy.md) — Law 5
  (superset, not intersection); represent faithfully within each destination's capabilities.
- [05-federation/compatibility.md](../05-federation/compatibility.md) — the per-implementation
  capabilities each adapter represents against; "absent, not fabricated" precedent.
- [ADR-003: Entry is the canonical content model](./ADR-003-entry-is-the-canonical-content-model.md)
  — the superset object being represented.
- [ADR-007: Protocols are replaceable infrastructure](./ADR-007-protocols-are-replaceable-infrastructure.md)
  — the adapter layer where representation happens.
