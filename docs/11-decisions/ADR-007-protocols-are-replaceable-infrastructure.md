# ADR-007: Protocols are replaceable infrastructure

## Status
Accepted (2026-07).

## Context
Tacet lives on the open social web, and today it speaks ActivityPub. The
temptation in any federated product is to let the wire protocol seep upward:
to model a "post" the way ActivityPub models a `Note`, to design screens around
inboxes and instances, to make the network the thing the product *is*. That is
the mistake Mastodon's UI encodes, and it is precisely the mistake Tacet exists
to avoid. Meanwhile the landscape is not static — AT Protocol (Bluesky) is a
credible second open protocol, and others may follow. We needed to settle, once,
whether the protocol leads the product or the product leads the protocol, before
any write-side or federation code hardened the answer by accident.

## Decision
**The product and its domain model lead; the protocol is a replaceable adapter
at the edge, never the product.**

The domain — `Person`, `Connection`, `Moment`, `Entry`, `Publication`,
`Destination` — is defined once, protocol-agnostic, and would still be correct
if ActivityPub vanished. Everything that touches the open social web is an
adapter that *maps onto* that domain: the read adapter normalizes the world in,
the publish adapter maps the work out. The layering is strict and one-directional:

```
UI  →  Domain  →  Adapter  →  Open Social Web
```

Dependencies point inward. No UI component knows a protocol; no domain object
knows a wire format. Adding or replacing a protocol — an `AtprotoPublishAdapter`
beside the ActivityPub one — must not touch the product, the domain, the
workspace model, or the act of sharing. The reason is not architectural fashion:
it is that Tacet is a *home*, and a home outlives every network it ever reaches.
Identity outlives the protocol; content outlives the protocol; only the way
things go out and come in is allowed to change.

## Consequences
- **Benefit — durability.** A person's identity and everything they make survive
  the death or replacement of any protocol. Portability stops being a feature and
  becomes a structural guarantee.
- **Benefit — a second protocol is additive, not surgical.** Supporting Bluesky
  is "write one adapter, add one destination," with zero product change. This is
  the acceptance test: *if the protocol were swapped tomorrow, would home,
  entries, workspaces, and Share be unchanged? The answer must be yes.*
- **Cost — the adapter carries the impedance.** Because the domain is a superset
  of what any one protocol supports, each adapter must faithfully *represent*
  richer content on a poorer wire (e.g. an Article that links home), not shrink
  the work to a lowest common denominator. That mapping work lives entirely at
  the edge, by design.
- **Cost — discipline over convenience.** It is often quicker to reach for a
  protocol concept in the UI or domain. That shortcut is prohibited; the seam
  must be honored even when it costs a little now.
- **Future implication.** New protocols and new content kinds are both governed,
  additive acts — a new adapter, a new kind definition — never a re-architecture
  of the core.

## References
- [ActivityPub as infrastructure](../05-federation/activitypub-as-infrastructure.md)
- [Architecture principles](../06-engineering/architecture-principles.md)
- [Product vision](../01-product/product-vision.md)
- [Publishing philosophy](../01-product/publishing-philosophy.md) — the mirror
  "complete product / replaceable adapter" law on the write side.
- ADR-003 (identity before platforms), ADR-005, ADR-008 (human language over
  protocol language — the UI-facing expression of this decision).
