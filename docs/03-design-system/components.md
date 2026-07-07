# Components

The component library is small on purpose. Each component is built entirely from the
foundation tokens — [color](color-tokens.md), [type](typography-scale.md),
[spacing](spacing-scale.md), [radius & elevation](radius-and-elevation.md) — so themes
and future evolution flow through without touching component code.

## Inventory

**Surfaces**
- [Card](cards.md) — the base physical surface everything sits on.
- [Person card](person-cards.md) — a person as a first-class object.
- [Content card](content-cards.md) — text, photo, video, and long-form content.

**Controls**
- [Button](buttons.md) — primary / secondary / tertiary / destructive.
- [Inputs](inputs.md) — text field, select, toggle, and the compose input.

**Supporting** (composed from the above; conventions below)
- Avatar — circular (`--radius-full`), sizes `sm 32` / `md 44` / `lg 64` / `xl 96`.
- Chip / tag — `--radius-xs`, `--text-micro`, subtle fill; used for community, media
  type, or federation source.
- Icon — permitted and encouraged for recognition; see
  [iconography HIG](../02-human-interface-guidelines/iconography.md).
- Nav (Today · People · Discover · Conversations · Me) — icon + label, calm, no badges
  or count dots; see [navigation HIG](../02-human-interface-guidelines/navigation.md).

## How components compose

Screens are cards in a reading column. The five destinations (Today, People, Discover,
Conversations, Me) each arrange person cards and content cards; Compose, Communities,
and Settings are overlays or sub-screens. "Home Feed" is not a governing concept — these
are distinct, purposeful views.

Composition rules:
- A card contains other components; controls live inside cards, not floating.
- One primary action per surface (see [buttons](buttons.md)).
- Nesting steps radius and elevation *down*, never up (media inside a card is calmer
  than the card).

## Shared states

Every interactive component defines all of these; none may be skipped:

| State | Treatment |
|---|---|
| Default | Resting tokens. |
| Hover | Gentle: `--color-accent-subtle` fill or one elevation step. |
| Active / pressed | Slightly deeper; `--color-accent-hover` on accented controls. |
| Focus (keyboard) | 2px `--color-focus-ring`, offset 2px. Always visible. |
| Selected | `--color-accent-subtle` fill; accent left-edge or check, not color alone. |
| Disabled | Reduced opacity (~0.45), no shadow, `cursor: not-allowed`. |
| Loading | Calm placeholder or a quiet inline indicator — no shimmer theatrics. |
| Error | `--color-danger` border + a text message; never color alone. |
| Empty | A quiet factual line; see [empty states HIG](../02-human-interface-guidelines/empty-states.md). |

## Shared conventions

- **Calm affordances.** Interactivity is signaled by soft state changes, not by loud
  color or bounce. Motion is short and eased; see
  [motion HIG](../02-human-interface-guidelines/motion.md).
- **No vanity counters.** Components do not render public like/dislike/repost
  scoreboards. Positive signal is private; see [content cards](content-cards.md).
- **Icons + labels.** Icons aid, they don't replace meaning — pair with text where the
  action isn't unambiguous.
- **Accessible by construction.** Real semantic elements, names on every control, 44px
  targets, visible focus. See [accessibility HIG](../02-human-interface-guidelines/accessibility.md).
