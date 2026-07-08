# ADR-015: Federation citizenship — read fully, give back through Boost and Reply

## Status

Accepted (2026-07). Emerged from the pre-Figma design review, which surfaced that Tacet's stance on
*what it sends back* to the open social web was undefined.

## Context

Tacet reads the open social web richly — it shows people, moments, and media from across the network.
But a client that only *reads and replies* while returning no amplification is a **taker**: it
benefits from the commons without giving back, which is corrosive to the open web Tacet exists to
honour. A reviewer taking the perspective of a person migrating from Mastodon found that Tacet's
give-back behaviour was unspecified — in particular, "Share" was undefined (link-share? boost?), and
there was no answer to whether Tacet sends the *favourite/like* that remote authors are used to
receiving.

This is a foundational question — it defines Tacet's *relationship to the network*, not a UI detail —
and it sits at the intersection of two existing decisions: [ADR-007](./ADR-007-protocols-are-replaceable-infrastructure.md)
(the protocol is infrastructure) and [ADR-011](./ADR-011-metrics-are-context-not-rewards.md) (no
public vanity metrics). It needed its own record.

## Decision

Tacet participates as a **good citizen** of the open social web, and it does so in a way that stays
true to the calm doctrine:

1. **Publishing your own content federates as a first-class creation.** Sharing something you made
   distributes it to the open web (`Create`).
2. **Sharing someone else's moment is a Boost.** "Share" on another person's moment re-broadcasts it
   to your followers — the ActivityPub `Announce` — so remote authors receive real amplification. In
   the UI this is simply **Share**; the word "boost" and the protocol never surface
   ([ADR-008](./ADR-008-human-language-over-protocol-language.md)).
3. **Tacet does not send or display public Likes/favourites.** Appreciation is a private **Save**
   ([kept](./ADR-002-home-is-the-source-of-truth.md), not tallied). To signal to an author, you
   **Share** (boost) or **Reply**. This keeps Tacet consistent with the no-vanity-metrics decision
   while still giving authors meaningful signal.
4. **Interactive write-actions are the target state, honestly gated.** Follow, Reply, and Share are
   designed as first-class, but the adapter is read-only until write-federation ships. Until then
   these render in a truthful "not yet — coming" state — **never dead buttons that fail silently**,
   which would violate the honesty principle.

Tacet therefore gives back through **Boost and Reply**, never through a like economy.

## Consequences

**Benefits.** Tacet is a net contributor to the open web: boosts and replies amplify and engage
remote authors. A Mastodon-shaped expectation (boost, reply) is met in human words. The deliberate
absence of favourites keeps Tacet off the vanity treadmill and consistent with ADR-011 — and it is
stated honestly to the user rather than hidden.

**Costs / trade-offs.** Some people expect to "like" things and to be liked; Tacet asks them to Save
(privately) or Share (publicly) instead — a small re-learning, and a deliberate one. Remote authors
accustomed to fav-counts receive none from Tacet users; this is an intentional stance, not an
omission. Delivering interactive Follow/Reply/Share requires **write-federation** to be built — the
adapter is read-only today — so the honesty gate is load-bearing until then.

**Future implications.** If a future protocol ([ADR-007](./ADR-007-protocols-are-replaceable-infrastructure.md))
models sharing differently, the *human* actions (Share, Reply) stay put and the adapter maps them —
the citizenship stance is protocol-independent. Whether Tacet ever sends a private, uncounted signal
(a non-public appreciation) is left open; the firm decision is only that no *public tally* is ever
sent or shown.

## References

- [ADR-007 Protocols are replaceable infrastructure](./ADR-007-protocols-are-replaceable-infrastructure.md)
- [ADR-008 Human language over protocol language](./ADR-008-human-language-over-protocol-language.md)
- [ADR-010 Calm over engagement](./ADR-010-calm-over-engagement.md) ·
  [ADR-011 Metrics are context, not rewards](./ADR-011-metrics-are-context-not-rewards.md)
- [05-federation/compatibility.md](../05-federation/compatibility.md) (current read-only status)
- [10-design/pre-figma-resolutions.md](../10-design/pre-figma-resolutions.md)
