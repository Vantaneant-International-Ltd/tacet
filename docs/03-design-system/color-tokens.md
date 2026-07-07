# Color Tokens

Color in Tacet carries meaning and warmth. We never hard-code hex values in
components — components speak in **semantic tokens**, and each theme maps those tokens
to concrete values. Light and dark are peers.

## Semantic tokens

These are the names components use. Their values change per theme; their meaning does
not.

| Token | Meaning |
|---|---|
| `--color-canvas` | The page behind everything. |
| `--color-surface` | A card or panel resting on the canvas. |
| `--color-surface-raised` | An overlay, popover, or composer above surfaces. |
| `--color-surface-sunken` | Inset wells: input fields, code, quoted content. |
| `--color-hairline` | Dividers and 1px borders. |
| `--color-text-primary` | Body and content a person wrote. The voice. |
| `--color-text-secondary` | Supporting and system text. |
| `--color-text-tertiary` | Metadata, timestamps, captions. |
| `--color-accent` | Brand action: primary buttons, links, selection. |
| `--color-accent-hover` | Accent under pointer/press. |
| `--color-accent-subtle` | Accent-tinted fills (selected rows, chips, focus glow). |
| `--color-on-accent` | Text/icons on an accent fill. |
| `--color-positive` | The quiet private signal (see [content cards](content-cards.md)). |
| `--color-warning` | Caution, non-destructive. |
| `--color-danger` | Destructive actions only; used sparingly. |
| `--color-focus-ring` | Keyboard focus outline. |

## Light theme — warm

The default. Not stark white: a warm paper canvas that feels lamplit, not clinical.

```css
--color-canvas:         #F7F4EF; /* warm ivory, never #FFF */
--color-surface:        #FFFDFA; /* card, a shade brighter than canvas */
--color-surface-raised: #FFFFFF;
--color-surface-sunken: #F1EDE6;
--color-hairline:       #E7E1D8;
--color-text-primary:   #23201C; /* warm near-black */
--color-text-secondary: #6B655C;
--color-text-tertiary:  #948D83;
--color-accent:         #7A5CD0; /* lavender-purple */
--color-accent-hover:   #6B4BC4;
--color-accent-subtle:  #EFE9FB;
--color-on-accent:      #FFFFFF;
--color-positive:       #4E9E7E;
--color-warning:        #B9862E;
--color-danger:         #C0453E;
--color-focus-ring:     #7A5CD0;
```

## Dark theme — lamplit

Seeded from the historical near-black tokens, warmed and given the accent. Still a
quiet room, but now with temperature and a pulse.

```css
--color-canvas:         #0D0D0D; /* historical --canvas, near-black */
--color-surface:        #161614; /* historical --panel */
--color-surface-raised: #1E1E1B;
--color-surface-sunken: #100F0E;
--color-hairline:       #2A2A27; /* historical --hairline */
--color-text-primary:   #F5F5F2; /* historical --voice */
--color-text-secondary: #8A8A86; /* historical --secondary */
--color-text-tertiary:  #55554F; /* historical --dim */
--color-accent:         #A88FE6; /* lavender lifts off dark surfaces */
--color-accent-hover:   #BBA6EE;
--color-accent-subtle:  #221D33; /* accent-tinted, very low */
--color-on-accent:      #16121F;
--color-positive:       #6FBE9C;
--color-warning:        #D6A24E;
--color-danger:         #E06B63;
--color-focus-ring:     #A88FE6;
```

> Note: `--color-warning` in dark is `#D6A24E`. Both themes reserve `--color-danger`
> for genuinely destructive acts — it should be rare on screen. See [dark mode HIG](../02-human-interface-guidelines/dark-mode.md).

## The accent

Purple/lavender is Tacet's signature. It marks the *primary* action, links, selection,
and focus — the places the person's intent lives. Rules:

- One accent action per view is ideal; two is a ceiling. If everything is accented,
  nothing is.
- Never use the accent for decoration, dividers, or backgrounds of whole regions.
- `--color-accent-subtle` carries selected/focused *states* without shouting.

## Accessibility

- Body text (`--color-text-primary`) on `--color-surface`/`--color-canvas` meets
  **WCAG AA** in both themes; `--color-text-secondary` meets AA at its sizes.
- `--color-on-accent` on `--color-accent` meets AA for button labels in both themes.
- Never encode meaning in color alone — pair with an icon, label, or shape
  (see [accessibility HIG](../02-human-interface-guidelines/accessibility.md)).
- `--color-focus-ring` is always visible on keyboard focus; never removed.
