# Cards

The card is Tacet's core surface. A card is a **physical, premium, calm object** resting
in a warm space — a page in a well-made book, not a box in a dashboard. Everything a
person reads, watches, or acts on lives in or as a card.

Two specialized cards get their own docs: [person cards](person-cards.md) and
[content cards](content-cards.md). This doc defines the shared base they extend.

## Anatomy

```
┌─────────────────────────────────────┐  ← --radius-lg (20px)
│  [ header slot ]                     │     --color-surface
│                                      │     --elevation-1
│  [ body slot — the content ]         │     1px --color-hairline
│                                      │
│  [ footer slot — actions / meta ]    │
└─────────────────────────────────────┘
   └──────── --space-5 padding ────────┘
```

- **Surface:** `--color-surface` on `--color-canvas`; a subtle lift, brighter than the
  page in light, warmer than the void in dark.
- **Radius:** `--radius-lg` (20px). Media *inside* steps down to `--radius-md`.
- **Border:** 1px `--color-hairline`, paired with `--elevation-1` (see
  [radius & elevation](radius-and-elevation.md)).
- **Padding:** `--space-5` (24px) comfortable, `--space-4` (16px) compact. Never tighter.
- **Header / body / footer** are slots; simple cards use only body.

## Variants

| Variant | Surface / elevation | Use |
|---|---|---|
| **Resting** | `--color-surface`, `--elevation-1` | Default. Content and person cards at rest. |
| **Interactive** | resting → `--elevation-2` on hover | Whole-card tap targets (open a profile/thread). |
| **Quiet / inset** | `--color-surface-sunken`, `--elevation-0`, hairline only | Nested content: quoted post, embedded reply. |
| **Raised** | `--color-surface-raised`, `--elevation-2` | Popovers, menus, floating pickers. |
| **Feature** | resting + accent left-edge (3px `--color-accent`) | Rare highlight; one per screen at most. |

## Behavior and rules

- **Interactive cards** raise one elevation step on hover and settle on press — gentle,
  eased motion, never a jump. Keyboard focus draws `--color-focus-ring`. See
  [components: shared states](components.md#shared-states).
- **One primary action** per card. Additional actions are tertiary
  (see [buttons](buttons.md)).
- **Whitespace inside cards is generous** — content should breathe; a cramped card
  betrays the whole posture. See [spacing](spacing-scale.md).
- **Cards separate by space, not by heavy rules.** In a list, gap cards at
  `--space-4`–`--space-6`; avoid stacking flush like a chat log.
- **No badges, no count bubbles, no pulsing dots** on cards. Calm before addiction.
- **Cards are honest about origin.** A federated card may carry a small, quiet source
  chip (e.g. the home server); the protocol stays invisible, but provenance is never
  hidden. See [content cards](content-cards.md).
