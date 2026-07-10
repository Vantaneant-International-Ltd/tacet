# ADR-004: Publishing is distribution, not creation

## Status

Accepted (2026-07).

## Context

Every mainstream social product fuses two acts into one instant: you compose *into a box
that belongs to a platform*, and the moment you finish is the moment it is published. Under
that model content is *born as a post* — it exists because a platform hosts it, its whole
purpose is to go out, and anything unpublished is a lesser, provisional "draft" waiting to
become real. This is the single assumption Tacet's read side was deliberately built around
avoiding: everything so far stayed read-only precisely so that when creation finally arrived,
the relationship between making and sending could be got right.

Before any compose UI or publish adapter exists, we must settle what it *means* to create in
Tacet — otherwise the implementation will silently inherit the platform "post" and its draft.

## Decision

**Making something is complete in itself; publishing is a separate, deliberate act.** An
Entry exists and is fully real from the first keystroke, owned by its author, whether or not
it is ever sent anywhere. Distribution — sharing a copy to the open social web — is an
optional, explicit second act that never brings the work into being and never transfers
ownership.

Two consequences are stated as decisions, not merely observations:

- **There are no drafts — only distribution state.** An Entry is always a whole thing; what
  varies is whether a copy is out. The states are **private** (home only, the default),
  **shared**, and **scheduled**. "Draft" is a platform concept that frames unpublished work
  as unfinished; Tacet rejects it. Private is a first-class, dignified, permanent state, not
  a waiting room for a post.
- **Retract is not Delete.** Retracting *unshares a distributed copy* while the original
  survives at home; Deleting removes *the original work itself*. These are never conflated
  in the model or in the UI — one touches a copy on the network, the other touches the source
  of truth.

The *why*: if creation and distribution are one act, the network owns the meaning of your
work. Separating them is what makes home the source of truth and the network merely a place a
copy can visit.

## Consequences

**Benefits.** Writing is always safe, private, and yours; nothing is provisional. A person
who never publishes is still fully at home. The model gains a clean, honest vocabulary
(private/shared/scheduled; retract/delete) that maps directly onto how people actually think.

**Costs.** We must resist re-importing "draft" language and UI at every turn, and be honest
about the limit of retraction: once a copy is on the open web we can *request* removal but
cannot *guarantee* erasure across caches and other servers. We say this plainly rather than
implying a delete button over the whole internet.

**Future implications.** Compose creates a *private* Entry; Share is a distinct action;
scheduling is simply another reserved state, not a new subsystem. Deleting an Entry can offer
to retract every copy first, but the two acts stay separate in the user's mind.

## References

- [01-product/publishing-philosophy.md](../01-product/publishing-philosophy.md) — creation ≠
  distribution, the death of the draft, distribution state, retract vs delete.
- [ADR-002: Home is the source of truth](./ADR-002-home-is-the-source-of-truth.md) — the home
  this publishing model distributes *from*.
- [ADR-003: Entry is the canonical content model](./ADR-003-entry-is-the-canonical-content-model.md)
  — the object that carries a distribution state.
- [ADR-005: Representation, not degradation](./ADR-005-representation-not-degradation.md) —
  how a shared copy is rendered per destination.
