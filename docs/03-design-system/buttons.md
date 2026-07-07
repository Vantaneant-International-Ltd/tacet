# Buttons

Buttons are calm affordances. They invite, they don't demand. Hierarchy is expressed
mostly through *fill and weight*, with the purple/lavender accent reserved for the one
action that matters most on a screen.

## Hierarchy

| Level | Fill | Text | When |
|---|---|---|---|
| **Primary** | `--color-accent` | `--color-on-accent` | The single most important action here. |
| **Secondary** | transparent, 1px `--color-hairline` | `--color-text-primary` | Alternative or supporting action. |
| **Tertiary** | transparent, no border | `--color-text-secondary` | Low-emphasis / inline actions in cards. |
| **Destructive** | transparent, 1px `--color-danger` (fills `--color-danger` on confirm step) | `--color-danger` | Irreversible acts — delete, leave, block. |

**One primary per view.** Primary carries the accent; if two things are accented, the
person can't tell what the product wants them to do. Everything else steps down.

Tertiary is the default *inside* content cards (e.g. Reply) so actions stay quiet next
to the voice. See [content cards](content-cards.md).

## Sizes

| Token | Height | Padding (x) | Text | Radius |
|---|---|---|---|---|
| `--btn-sm` | 32px | `--space-3` (12px) | `--text-label` (14px) | `--radius-sm` |
| `--btn-md` | 40px | `--space-4` (16px) | `--text-label` (14px) | `--radius-sm` |
| `--btn-lg` | 48px | `--space-5` (24px) | `--text-label` / 15px | `--radius-sm` |

`--btn-md` is the default. All sizes keep a **≥44px hit target** via padding even when
the visual height is smaller (see [accessibility HIG](../02-human-interface-guidelines/accessibility.md)).
Pill buttons (`--radius-full`) are permitted for follow/segmented controls.

## Icons in buttons

Icons are welcome for recognition and pair with a label at `--space-2` gap. Icon-only
buttons require an accessible name (`aria-label`) and are reserved for universally
understood actions (close, more). See
[iconography HIG](../02-human-interface-guidelines/iconography.md).

## States

| State | Primary | Secondary / Tertiary |
|---|---|---|
| Default | `--color-accent` | as defined above |
| Hover | `--color-accent-hover` | `--color-accent-subtle` fill |
| Active / pressed | `--color-accent-hover`, slight scale 0.98 | subtle fill deepens |
| Focus (keyboard) | 2px `--color-focus-ring`, 2px offset | same |
| Disabled | opacity ~0.45, no shadow, `not-allowed` | same |
| Loading | quiet inline spinner or "…", label stays; width holds | same |

Transitions are ~120–160ms, eased — a settle, never a bounce. See
[motion HIG](../02-human-interface-guidelines/motion.md).

## Rules

- **Verbs, plainly.** "Follow", "Post", "Save", "Reply" — short and literal, no
  exclamation marks or coaching.
- **Accent is for intent, not decoration.** Never use a primary button to fill space.
- **Destructive is rare and guarded.** It uses `--color-danger`, sits apart from
  primary, and confirms before irreversible action.
- Built as real `<button>`/`<a>` elements. See
  [components: shared states](components.md#shared-states).
