# Inputs

Inputs are where a person speaks and chooses. They must be **calm, legible, and
unmistakably accessible** — never noisy, never ambiguous about state. The compose input
is the most important surface in the product; it deserves the most quiet.

## Text field

```
Label                                    ← --text-label, --color-text-secondary
┌─────────────────────────────────────┐  ← --radius-sm (10px)
│  value / placeholder                 │     --color-surface-sunken
└─────────────────────────────────────┘     1px --color-hairline
Helper or error text                     ← --text-meta
```

- **Fill:** `--color-surface-sunken` — an inset well, so fields read as "type here."
- **Border:** 1px `--color-hairline`; **focus:** border → `--color-accent` plus a 2px
  `--color-accent-subtle` ring.
- **Height:** 44px min; **padding:** `--space-3`/`--space-4`; **text:**
  `--text-body-sm` in `--color-text-primary`.
- **Placeholder:** `--color-text-tertiary`, literal and quiet (e.g. "Search people",
  never an exhortation). It is not a substitute for a label.

## Select

Same shell as the text field, with a trailing chevron icon
([iconography HIG](../02-human-interface-guidelines/iconography.md)). The open menu is a
**raised card** (`--color-surface-raised`, `--elevation-2`, `--radius-md`); the current
option is marked with `--color-accent-subtle` and a check — not color alone. Keyboard
navigable; focus visible on each option.

## Toggle

A pill switch (`--radius-full`) for on/off settings.

| State | Track | Knob |
|---|---|---|
| Off | `--color-surface-sunken`, hairline | `--color-surface-raised` |
| On | `--color-accent` | `--color-on-accent` |
| Focus | + 2px `--color-focus-ring` | — |
| Disabled | opacity ~0.45 | — |

Always paired with a text label; state is conveyed by knob position *and* color, never
color alone. Use toggles for immediate settings; use buttons for actions.

## The compose input

Compose is a first-class destination, opened as a sheet (`--radius-xl`,
`--color-surface-raised`, `--elevation-3`). It is spacious and reading-first:

- A large, borderless text area on `--color-surface-raised` — the page, not a boxed
  field. Text is `--text-body` (17px) at line-height 1.6, the same size the person's
  words will render at. What you write looks like what you'll say.
- Placeholder is quiet and situational (audience or community name), never "What's
  happening?!"-style bait.
- A calm toolbar of icon actions (attach photo/video, audience, community) with
  accessible names, and **one primary** "Post" button (see [buttons](buttons.md)).
- Audience/community selection is explicit and legible — the person always knows who
  will see this. No hidden default reach.
- No character-count anxiety UI, no live vanity metrics, no engagement nudges.

## States (all fields)

| State | Treatment |
|---|---|
| Default | sunken fill, hairline border |
| Focus | accent border + `--color-accent-subtle` ring |
| Filled | `--color-text-primary` value |
| Error | `--color-danger` border + message below; icon, not color alone |
| Disabled | opacity ~0.45, `not-allowed` |
| Read-only | no border, flat, `--color-text-secondary` |

See [components: shared states](components.md#shared-states) and
[accessibility HIG](../02-human-interface-guidelines/accessibility.md). Labels are
always present (visually or via `aria-label`); error text is programmatically tied to
its field.
