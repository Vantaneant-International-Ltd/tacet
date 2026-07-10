# ADR-016: A timeless system with a swappable style layer

## Status

Accepted (2026-07). Emerged from the timelessness audit conducted before freezing the design corpus
for high-fidelity work.

## Context

Tacet intends to be a defining product of the open social web for a decade or more. Any design system
carries two kinds of decision that age very differently: **structural** decisions (how the product is
organised, what it values, how it reads) that can stay right for a very long time, and **stylistic**
decisions (a specific accent hue, a typeface, an amount of corner-rounding, a surface effect) that are
inevitably coloured by the taste of the year they were made.

Reviewed through a ten-year lens, Tacet's structure is unusually timeless, but a handful of *values*
are of-this-decade: a lavender accent (2020s tech colour), the typefaces Hanken Grotesk and Spline
Sans Mono (swapped from Jost + Space Mono in 2026-07 — a value change, exactly as this ADR intends), the
larger corner radii, and a frosted-glass blur. Left unexamined, two failure modes loom: treating those
values as **sacred** (so the product ages with the decade and can't be refreshed without a rebuild),
or **chasing trends** (so it churns with every season and never feels settled). Both are avoidable —
but only if the boundary between the timeless system and the swappable style is made explicit and
enforced.

## Decision

Design for **timelessness at the level of the system, and treat visual style as a swappable layer.**

1. **The system is timeless and protected.** Semantic token *names*, the type/space/radius *scales*,
   one restrained accent, humanist-sans-for-reading, mono-for-meta-only, the fixed reading measure,
   AA contrast, and the product principles are built to last. Components bind to token **names**,
   never raw values.
2. **Style is a thin, swappable layer.** The specific accent *hue*, the specific *typefaces*, and the
   *amount* of rounding are Tacet's current identity but are explicitly **not sacred**. Any of them
   can be re-tuned in one place (a token value / a Claude Design variable) without structural change —
   because nothing depends on the value, only the name.
3. **Remove what is fashionable-only.** Anything that exists solely because it is in vogue *and* earns
   nothing structural is cut. (First application: the frosted-glass `backdrop-filter` blur, removed in
   favour of a solid surface + hairline, which also better honours "depth from contrast, not
   effects.")
4. **Do not chase trends.** New style is adopted only when it serves the principles, never to look
   current. Refresh is allowed; churn is not.

## Consequences

**Benefits.** Tacet can stay recognisably itself for a decade while its surface is refreshed cheaply
and safely — a hue swap or a typeface change is one edit, not a redesign. The product is insulated
from ageing with any single year's taste, and from the opposite failure of restless trend-chasing.
The boundary gives future contributors a clear, calm answer to "can we change the purple?": yes, it is
the style layer — change the token, nothing structural moves.

**Costs / trade-offs.** It requires discipline: no component may hardcode a style value, and the team
must resist both sacralising the current look and chasing the next one. Judging what is "fashionable-
only" versus "fundamental" is a matter of taste that this ADR guides but cannot fully automate.

**Future implications.** When Tacet's look is next refreshed, this ADR is the contract: change the
style layer ([tokens.md §14](../10-design/tokens.md)), leave the system alone. Should a future value
ever prove structural after all, that is a new decision recorded as its own ADR.

## References

- [10-design/timelessness-audit.md](../10-design/timelessness-audit.md) (the audit that produced this)
- [10-design/tokens.md §14](../10-design/tokens.md) (the style-layer boundary in the tokens)
- [ADR-014 Design system before screens](./ADR-014-design-system-before-screens.md)
- [ADR-008 Human language over protocol language](./ADR-008-human-language-over-protocol-language.md)
  (the sibling timelessness decision — words that don't date)
