# Dark mode

Tacet ships **light and dark as first-class**, equal citizens. This is a deliberate
correction to the repo's early dark-only `DESIGN.md`, which is now historical. A
[home](README.md) has daylight and lamplight; the product should be at home in both.

Neither theme is the "real" one with the other as a variant. Both are designed,
both are warm, and both express the same [calm](design-principles.md).

## Light is expected, not optional

The [warmth over austerity](design-principles.md) principle makes light mode a
requirement. Many people prefer light, most reading happens comfortably in light,
and a near-black-only product reads as austere and clinical — the opposite of the
feeling we want. Design light mode with the same care as dark, and default
thoughtfully (respect the OS preference rather than imposing one).

## The old near-black is a starting point, not the system

Early Tacet leaned on a near-black palette. Treat those tokens as a **seed for dark
mode, not the whole design language.**

- Dark mode is a designed theme in its own right — considered surfaces, elevation,
  and warmth — not "the light UI with the lights off," and not a single flat
  near-black void.
- Near-black may inform the *darkest* surface, but a good dark theme uses a range of
  dark tones for depth and legibility, not one color.
- Do not let the historical dark palette quietly become the default identity again.
  Both themes are deliberate.

## Warmth in both

Warmth is a property of the *brand*, so it must survive the theme switch.

- **Light** should feel soft and inviting — warm off-whites and gentle neutrals, not
  a clinical pure-white glare.
- **Dark** should feel like a warm, dim room — near-blacks with a little warmth in
  them, not a cold blue-black. Avoid pure `#000` as the everyday surface; it reads
  as harsh and flattens depth.
- The character — the sense that this is *your* calm home — is identical in both. A
  person switching themes should feel the lights change, not the house.

## How to think about theming

- **Semantic tokens, not raw colors.** Design against roles — surface, elevated
  surface, primary text, secondary text, accent — and let each theme supply values.
  Never hardcode a hex in a component; that is what breaks dark mode.
- **Meaning survives the switch.** Because [hierarchy is built in type and
  space](typography.md) and never [color alone](accessibility.md), the structure of
  a screen reads identically in both themes.
- **Contrast holds in both.** Every pairing meets [accessibility](accessibility.md)
  contrast in light *and* dark — test both, not just the one you designed in.
- **One source of truth.** The concrete color tokens for both themes live in the
  [design system](../03-design-system/README.md). This page sets the intent; the
  tokens implement it, so the two never drift.
