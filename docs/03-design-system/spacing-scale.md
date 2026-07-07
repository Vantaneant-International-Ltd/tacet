# Spacing Scale

Whitespace is how Tacet feels calm. Space is not empty — it is the pause that makes
reading, watching, and speaking unhurried. **Density is a failure mode.** When in doubt,
add space.

## The scale

An 8px-based scale with two half-steps for fine control. Every margin, padding, and gap
references a token; no pixel literals in components.

| Token | Value | Typical use |
|---|---|---|
| `--space-0` | 0 | Reset. |
| `--space-1` | 4px | Icon–label gap, tight inline. |
| `--space-2` | 8px | Within a control; chip padding. |
| `--space-3` | 12px | Compact stacks; meta rows. |
| `--space-4` | 16px | **Base unit.** Default gap; card inner padding (compact). |
| `--space-5` | 24px | Card padding (comfortable); between related blocks. |
| `--space-6` | 32px | Between cards; section inner spacing. |
| `--space-7` | 48px | Between sections. |
| `--space-8` | 64px | Screen top/bottom breathing room. |
| `--space-9` | 96px | Rare, large editorial rest. |

The base unit is `--space-4` (16px). Reach for `--space-5` (24px) before crowding.

## Rhythm

- **Cards breathe.** Content cards and person cards use `--space-5` (24px) inner padding
  on comfortable layouts, `--space-4` at their tightest. Never below `--space-4`. See
  [cards](cards.md).
- **Between cards**, `--space-4`–`--space-6`. In a chronological, calm timeline, err
  toward `--space-5`+ so posts don't stack like a chat log.
- **Vertical over horizontal.** Content flows in a single generous reading column;
  side margins stay wide. Don't reclaim margins to fit more.
- **Group by proximity.** Related meta (name, handle, time) sits at `--space-1`–`--space-2`;
  distinct blocks separate at `--space-5`+. Space, not lines, is the primary separator;
  hairlines are the exception, not the rule.

## The reading column

The content column has a comfortable maximum measure:

```css
--measure-reading: 42rem;  /* ~672px; body caps ~66–72 chars */
--measure-wide:    56rem;  /* media, grids, wider surfaces   */
```

The column is centred with generous side gutters (`--space-5`+ on phones, more on
larger screens). Mobile-first: every screen must feel cosy at 380px wide — reduce
count, never reduce breathing room.

## Touch and hit targets

Interactive targets are at least **44×44px** (see
[accessibility HIG](../02-human-interface-guidelines/accessibility.md)). Padding, not
font size, achieves this — keep labels calm and targets generous.

Spacing pairs with [radius & elevation](radius-and-elevation.md) to make surfaces feel
physical, and with [spacing HIG](../02-human-interface-guidelines/spacing.md).
