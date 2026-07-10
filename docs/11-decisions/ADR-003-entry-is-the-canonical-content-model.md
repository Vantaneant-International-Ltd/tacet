# ADR-003: Entry is the canonical content model

## Status
Accepted (2026-07).

## Context
Home holds a person's authoritative work (ADR-002), and that work must be expressible by any protocol adapter without reshaping the product. If we modeled content after a protocol's post type — an ActivityPub Note, a Bluesky record — the protocol would dictate the domain, human expression would be capped at whatever the wire format supports, and swapping protocols would mean re-architecting the core. We need one internal shape for content that is true to what people want to make, independent of where (or whether) it is ever sent.

## Decision
Internally, all owned content is one canonical model — the **Entry** — expressing what humans want to make, modeled after human intent and **not** after any protocol's post type.

The Entry is a **superset, not an intersection**: the content model holds the full richness of human expression, and each adapter *represents* that content as faithfully as its destination allows, never shrinking it to a lowest common denominator. An Entry has a *kind* — Thought, Photo, Article, Video, Event — organized around what a person wants to make, not a platform's tab structure. Kind is data in a registry, not schema: adding a kind is a governed definition plus an adapter mapping, never a migration of the core. Crucially, **"Entry" is an engineering word users never see** (see ADR-008); in the product people make a Thought, a Photo, an Article — the interface always speaks in human terms.

## Consequences

**The core schema barely moves.** An Entry carries a `kind` (data) and a typed body. New kinds — Audio, Poll, Review, Recipe — are configuration plus an adapter mapping, not structural change. This is the single most important structural decision and follows directly from "superset, not intersection."

**Read and write share one domain.** An Entry authored *out* becomes the same object the read side renders *in* as a Moment. Publishing reuses existing profiles, conversations, and counts with no parallel universe.

**Protocols stay at the edge.** Any future protocol is a new publish adapter and nothing else — the Entry, its kinds, and the act of sharing are unchanged. Where a destination cannot hold a kind (e.g. long-form Article on a short-form protocol), the adapter represents it faithfully and links back to the canonical home copy; the rich original never leaves home.

**Extensibility is disciplined, not a free-for-all.** A new kind earns its place only if it is a genuinely distinct human act of expression, not a platform feature in disguise. Five, chosen well, extensible with care.

## References
- Product (publishing): [publishing-philosophy.md](../01-product/publishing-philosophy.md) — Entry as internal abstraction, Law 5 "content is a superset, not an intersection," and the Entry kinds
- Engineering: [domain-model.md](../06-engineering/domain-model.md) — the protocol-agnostic domain and adapter-at-the-edge rule
- Related: ADR-004, ADR-005, ADR-008 (the human words users actually see)
