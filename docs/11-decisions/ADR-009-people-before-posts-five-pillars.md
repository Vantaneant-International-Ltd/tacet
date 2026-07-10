# ADR-009: People before posts — the five pillars

## Status
Accepted (2026-07).

## Context
Every modern social product organizes itself around a home feed: a bottomless stream of content that is the front door, the reason to open the app, and the thing the whole product exists to serve. People are demoted to sources that supply the stream. We needed to fix the spine of Tacet before any surface, screen, or line of code was designed — because the organizing concept silently decides everything downstream. If the feed is the center, the product becomes an engagement machine no matter what the manifesto says. This decision names the spine so that later choices have a fixed thing to be measured against.

## Decision
Tacet's spine is **five pillars — Today, People, Discover, Conversations, Me** — and nothing else sits on the spine. The foundational commitment underneath them is **people before posts / relationships before engagement**: the atom of Tacet is a person and your standing with them, not a post or a feed.

The "home feed" is deliberately **not** the organizing concept. A feed still exists in Tacet, but only as a component that lives *inside* surfaces — the way a home has a window: useful, present, never the reason you're there. **Today** is the calm entry point (bounded, finishable), not a home feed under a nicer name. **People** is the reason to stay — the relationship graph is a primary, designed surface, not a byproduct computed from your engagement history. The moment the feed becomes the reason you're in the app, we have violated this ADR.

## Consequences
- Every surface must answer "whose relationship does this serve?" before "how much content can we show?" This constrains design permanently and by intent.
- Relationships get first-class engineering cost: People is built and maintained as a surface, not derived cheaply from interaction logs.
- We forgo the easiest growth lever in the industry — the infinite home feed that maximizes time-on-app. This is a deliberate cost, accepted up front.
- The five-pillar spine is load-bearing for navigation, IA, and roadmap prioritization: supporting surfaces (Compose, Communities, Settings) serve the five and never join them.
- Future features that need a bottomless stream to work are structurally out of scope; that constraint is a feature, not a limitation to be engineered around.

## References
- [Information architecture](../01-product/information-architecture.md) — the canonical spine this ADR indexes.
- [Why Tacet exists](../00-manifesto/why-tacet-exists.md) — People before posts; Relationships before engagement.
- [People](../01-product/people.md) — the reason to stay.
- [Today](../01-product/today.md) — the entry point that is not a home feed.
- [ADR-010: Calm over engagement](ADR-010-calm-over-engagement.md) — how the spine refuses the attention-economy toolkit.
- [ADR-011: Metrics are context, not rewards](ADR-011-metrics-are-context-not-rewards.md) — why relationships are never rendered as tallies.
