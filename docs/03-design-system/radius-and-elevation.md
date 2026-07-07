# Radius & Elevation

Surfaces in Tacet feel **physical, soft, and premium** — objects resting in a calm,
warm space. Not flat-austere (the old posture), and not skeuomorphic-heavy. The goal is
a gentle sense of layering you feel more than notice.

## Corner radius

Soft, consistent, generous. Round corners read as friendly and cared-for.

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 6px | Chips, tags, small inputs, tight controls. |
| `--radius-sm` | 10px | Buttons, inputs, avatars-as-square. |
| `--radius-md` | 14px | Nested elements inside a card; media thumbnails. |
| `--radius-lg` | 20px | **Cards** — person cards, content cards, panels. |
| `--radius-xl` | 28px | Sheets, modals, the composer overlay. |
| `--radius-full` | 999px | Pills, toggles, circular avatars. |

Cards default to `--radius-lg` (20px). Media *inside* a card steps down to `--radius-md`
so the nesting reads correctly. Avatars are `--radius-full` (people are round; see
[person cards](person-cards.md)).

## Elevation

Elevation is expressed with **soft, warm, low-contrast shadows** plus a hairline — never
a hard drop shadow, never a glow. In dark mode, shadows do less work; a slightly lighter
`--color-surface-raised` carries most of the lift (see
[color tokens](color-tokens.md) and [dark mode HIG](../02-human-interface-guidelines/dark-mode.md)).

| Token | Level | Shadow (light) | Meaning |
|---|---|---|---|
| `--elevation-0` | Flat | none; hairline only | On-canvas, non-raised. |
| `--elevation-1` | Resting | `0 1px 2px rgba(35,32,28,.05), 0 2px 8px rgba(35,32,28,.04)` | Cards at rest. |
| `--elevation-2` | Raised | `0 4px 12px rgba(35,32,28,.07), 0 2px 4px rgba(35,32,28,.05)` | Hover/active cards, popovers. |
| `--elevation-3` | Floating | `0 12px 32px rgba(35,32,28,.12), 0 4px 8px rgba(35,32,28,.06)` | Modals, sheets, composer. |

Shadow color is warm (tinted toward the text-primary hue), never neutral gray or black.

### Dark theme elevation

```css
/* rely on surface value + a faint ambient shadow */
--elevation-1: 0 1px 2px rgba(0,0,0,.30);
--elevation-2: 0 6px 16px rgba(0,0,0,.40);
--elevation-3: 0 16px 40px rgba(0,0,0,.55);
```

Pair each level with `--color-surface`, `--color-surface-raised`, etc., so the *surface
color* and the shadow move together.

## Rules

- **One step at a time.** A hovered card goes `--elevation-1` → `--elevation-2`, not to
  floating. Motion between levels is gentle; see [motion HIG](../02-human-interface-guidelines/motion.md).
- **Elevation is not decoration.** Raise a surface only when it is genuinely above
  others (interactive, overlaid, or focused). A calm screen has little elevation.
- **Hairline + shadow together.** The 1px `--color-hairline` defines the edge; the soft
  shadow gives it weight. Neither alone reads as premium.
- **No inner glows, no neon, no long dramatic shadows.** Physical and calm, always.
