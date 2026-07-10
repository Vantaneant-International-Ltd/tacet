# Typography Scale

Tacet is a place to read, watch, and speak. Type is the primary material. It is
**reading-first**: generous line-height, comfortable measure, warm color. Nothing is
cramped, nothing shouts.

## Fonts

The system pairs **Hanken Grotesk** (voice) with **Spline Sans Mono** (system labels) —
the vendored brand kit (`docs/10-design/tacet-brand/`). It earlier used Jost + Space Mono;
that swap was always anticipated (fonts are a value change, not a rebuild). What must hold
regardless of the family chosen:

- **Sans, reading grade** for content and UI (currently Hanken Grotesk). Humanist, warm,
  legible at body sizes. Weights 400/500/600; 300 reserved for large display only.
- **Mono, restrained** for handles, timestamps, and code (currently Spline Sans Mono). Used
  sparingly and *not* uppercased-letterspaced across the interface anymore — that was
  chrome we removed.

Set tokens so a font swap is a value change:

```css
--font-sans: "Hanken Grotesk", system-ui, sans-serif;
--font-mono: "Spline Sans Mono", ui-monospace, monospace;
```

## The scale

A modular scale, roughly 1.2 ratio, tuned by hand for reading. Sizes in rem (16px base).

| Token | Size | Line-height | Weight | Role |
|---|---|---|---|---|
| `--text-display` | 2.25rem / 36px | 1.15 | 300–400 | Rare hero moments, onboarding. |
| `--text-title` | 1.625rem / 26px | 1.2 | 500 | Screen titles (Today, People). |
| `--text-heading` | 1.25rem / 20px | 1.3 | 500 | Section and card headings. |
| `--text-subheading` | 1.0625rem / 17px | 1.4 | 500 | Person name, card lead. |
| `--text-body` | 1.0625rem / 17px | **1.6** | 400 | Post body, the voice. |
| `--text-body-sm` | 0.9375rem / 15px | 1.55 | 400 | Secondary body, replies. |
| `--text-label` | 0.875rem / 14px | 1.4 | 500 | Buttons, controls, nav. |
| `--text-meta` | 0.8125rem / 13px | 1.4 | 400 | Handle, timestamp, captions (mono). |
| `--text-micro` | 0.75rem / 12px | 1.4 | 500 | Smallest allowed. Chips, overline. |

Never smaller than `--text-micro` (12px) for anything a person must read.

## Roles and rules

- **Body is sacred.** `--text-body` at line-height 1.6 in `--color-text-primary` is the
  reading experience. Measure caps around 66–72 characters; see
  [spacing](spacing-scale.md) for the reading column.
- **Content over chrome.** The largest, warmest type belongs to what a person wrote —
  not to system labels. If a system label is bigger than the voice near it, that's wrong.
- **Handles and time** use `--text-meta` in mono, `--color-text-tertiary` — legible,
  quiet, never competing with the name or the words.
- **Weight, not size, for most hierarchy.** Prefer stepping 400→500→600 over jumping
  sizes. Avoid weights above 600.
- **No italics for system text.** Italics are permitted in a person's prose only.
- Line-length, spacing, and rhythm defer to [spacing scale](spacing-scale.md); see also
  [typography HIG](../02-human-interface-guidelines/typography.md).
