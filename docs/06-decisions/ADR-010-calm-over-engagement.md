# ADR-010: Calm over engagement — no engagement mechanics

## Status
Accepted (2026-07).

## Context
The dominant social products are, by construction, slot machines: infinite feeds, autoplay, variable-reward notifications, red badges, streaks, and manufactured urgency are not accidents but the mechanism. They work because human attention is exploitable and exploiting it is profitable. "Engagement" is the industry's word for compulsion dressed as value — it is easy to grow and it corrodes the relationships it claims to serve. We needed a single, standing decision that closes the door on the entire toolkit at once, rather than re-litigating each mechanic feature by feature (where the profitable answer would win by attrition). This ADR merges two things that are really one: *no engagement mechanics* and *calm over engagement*.

## Decision
Tacet refuses the attention-economy toolkit. Specifically and permanently:

- **No infinite scroll.** Today ends; "done" is a real, reachable state, and reaching it should feel good.
- **No autoplay.**
- **No compulsion loops** — no variable-reward mechanics tuned against the user's intent.
- **No manufactured urgency or FOMO** — no engineered "you missed this," no artificial scarcity.
- **No red-badge notifications** — correspondence arrives calmly in Conversations, not via anxiety-based badge counts.
- **No streaks or gamification.**

**Calm is the product**, not the absence of features — it is a designed, defended property. The governing test: **if a design only works because the user didn't notice, it does not ship**, no matter how well it "performs." We do not measure or optimize time-on-app; the metric we care about is whether the person left settled.

## Consequences
- We give up the highest-performing retention mechanics in the industry. Retention must instead come from being genuinely worth returning to. This is the trade, accepted deliberately.
- Design gains a hard, fast filter: any mechanic whose value depends on overriding the user's intent is out, which removes whole categories of debate and speeds decisions.
- Some conventionally "good" metrics (session length, return rate) will look worse than competitors'. That is expected and is not a signal to reverse course.
- Empty or quiet states become honest features (a short Today means a calm day), not problems to inflate away.
- This ADR is a standing veto: it outranks any individual feature request that reintroduces a banned mechanic under a new name.

## References
- [Founding principles](../00-manifesto/founding-principles.md) — Calm before addiction; Relationships before engagement.
- [Anti-patterns](../00-manifesto/anti-patterns.md) — the infinite feed, notification anxiety, dark patterns, the comparison machine.
- [Design principles](../02-human-interface-guidelines/design-principles.md) — Calm over dense; Honesty over manipulation.
- [ADR-009: People before posts — the five pillars](ADR-009-people-before-posts-five-pillars.md) — the spine calm defends.
- [ADR-011: Metrics are context, not rewards](ADR-011-metrics-are-context-not-rewards.md) — the metrics half of this stance.
- ADR-012 — the honesty/dark-patterns commitment that shares this test.
