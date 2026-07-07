# Tacet Design System

*Your home on the open social web.* The interface should feel the way the network
promises: **warm, rich, calm, and alive.** Not austere, not loud, not addictive.

This is the authoritative design system. It supersedes the historical
[`DESIGN.md`](../../DESIGN.md), which described an austere, words-only, near-black
product. That system's dark tokens survive here only as the seed of our dark theme;
its posture does not.

## Philosophy

- **Warm before clinical.** Surfaces have temperature. Even the dark theme reads as a
  lamplit room, not a void. Corners are soft, elevation is gentle, whitespace is
  generous.
- **Calm before addiction.** Nothing pulses, counts up, or begs to be opened. We do
  not design around public like/dislike scoreboards. Positive signal is private and
  quiet — see [content cards](content-cards.md).
- **People before posts.** A person is a first-class object with its own card type.
  See [person cards](person-cards.md). Identity travels across the open web; the
  handle `@you@tacet.social` is shown with care, the protocol stays invisible.
- **Alive, not decorated.** Motion is meaningful and soft, never theatrical. Icons are
  permitted and welcome — they aid recognition. See [HIG iconography](../02-human-interface-guidelines/iconography.md).
- **Light and dark are both first-class.** Neither is an afterthought. They are the
  same system evaluated against two sets of values, never two different designs.

## How this system is built

Everything is a **semantic token**. Components never reference a raw hex value or a
pixel literal — they reference a token like `--color-surface`, `--space-4`, or
`--radius-lg`. Themes are value swaps behind those tokens, so light and dark, and any
future themes, are configuration, not rewrites.

```
raw values  →  semantic tokens  →  components  →  screens
(#..,px)       (--color-surface)   (Card, Button)  (Today, People…)
```

A subtle **purple/lavender accent** is the brand-forward thread running through the
whole system — the primary action color, focus, and selected states. It is a signature,
not a paint job: used sparingly, it should feel like the product's pulse.

## The documents

**Foundations**
- [Color tokens](color-tokens.md) — semantic colors, warm light + dark themes, the accent.
- [Typography scale](typography-scale.md) — reading-first type roles, sizes, weights.
- [Spacing scale](spacing-scale.md) — the rhythm; density is failure.
- [Radius & elevation](radius-and-elevation.md) — soft, physical, premium surfaces.

**Components**
- [Components overview](components.md) — inventory, shared conventions, states.
- [Cards](cards.md) — the card system: physical, premium, calm.
- [Buttons](buttons.md) — hierarchy, sizes, states; primary carries the accent.
- [Inputs](inputs.md) — fields, selects, toggles, the compose input.
- [Person cards](person-cards.md) — a person as a first-class object.
- [Content cards](content-cards.md) — local and federated content, rendered honestly.

## Related

- [Human Interface Guidelines](../02-human-interface-guidelines/README.md) — Apple HIG
  is a *quality* reference for us, not a clone target.
- [Product](../01-product/) · [Manifesto](../00-manifesto/)
