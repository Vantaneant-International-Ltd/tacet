# Spacing — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md).

How Tacet spends space: the 8px scale in use, the one card-padding rhythm V2 mandates, and the vertical rhythm that keeps a timeline from stacking like a chat log. Whitespace is the primary material, not leftover margin.

Space is where [calm](./design-principles.md) actually lives, and breathing is what separates a home from a casino. This doc is the *how*; the values live in [tokens.md §3](./tokens.md) and are never restated here.

## The scale in use

Eight steps on an 8px base with half-steps at the small end — `--space-0` through `--space-9` ([tokens.md §3](./tokens.md)). Use the scale; ad-hoc pixel values read as sloppiness.

| Token | Typical job |
|---|---|
| `--space-1` | Icon-to-label, chip inner padding |
| `--space-2` | Tight pairs (avatar-to-name), inline gaps |
| `--space-3` | Control internals, list-item gaps |
| `--space-4` | **Base unit** — compact card padding, minimum card breathing |
| `--space-5` | Comfortable card padding, between-card gap |
| `--space-6` | Generous between-card gap, desktop gutter |
| `--space-7` | Between sections |
| `--space-8` | Screen breathing, top/bottom of a view |
| `--space-9` | Hero and empty-state air |

`--space-4` (16px) is the base everything else relates to.

## The one card-padding rhythm

The [audit](./design-audit.md) found three drifting inner paddings across `.t-post`, `.t-personrow`, and `.t-convorow` (finding T7). V2 collapses them to exactly two values — **and nothing else**:

| Card density | Inner padding |
|---|---|
| Comfortable (default) | `--space-5` |
| Compact | `--space-4` |

**Never below `--space-4` inside a card.** Below 16px a card stops feeling like a place a moment can live and starts feeling like a row in a spreadsheet. There is no third padding to reach for; if a card feels wrong, change what's *in* it, not the padding. This single rhythm is what makes cards feel like one family and is the physical half of [type carries hierarchy, borders don't](./design-principles.md) (L1) — a card with consistent generous padding needs no border to read as a discrete object.

## Vertical rhythm

The eye should move down a screen in even, restful steps, never in jolts. Space groups; reach for a border only when space genuinely can't.

| Between | Space |
|---|---|
| Cards (general) | `--space-4`–`--space-6` |
| Cards in a timeline | `--space-5`+ |
| Sections | `--space-7` |
| Screen edges / top & bottom | `--space-8` |

**The timeline errs to `--space-5` and up on purpose.** Packed tighter, posts stack like a chat log — a throughput surface, the exact feeling Tacet rejects. Extra air between moments says "these are separate things worth their own attention," which is [people over content chrome](./design-principles.md) made physical. Let the end be the end: trailing whitespace at the bottom of a bounded view is correct, not wasted — it says "you're caught up."

## Touch targets

Every interactive control is **≥44px**, achieved through **padding, not font-size**. A label stays at `--text-label` ([typography.md](./typography.md)); the tappable area grows via `--space-3`/`--space-4` padding around it. Growing the type to hit 44px would break the [type scale](./typography.md) and shout; growing the padding keeps the type calm and the target honest (Law **L10**). Space tap targets apart, too — never a dense grid of tiny hits.

## Mobile is more generous, not less

Small screens tempt compression; resist it. Mobile spacing is *more* generous than desktop, never less — one clear thing per screen with room around it, comfortable targets with space between them. Mobile should feel cosy in the hand, never dense, cramped, or stressful.

## Why: calm over dense, remove before adding

Density is the failure mode, not a feature. When a screen feels full, the fix is almost never "make it smaller to fit more" — it is "show less." Whitespace is the **primary material** here: it is how the product breathes, how it signals that a person and their moment matter, and how it stays a home rather than a feed optimising for supply.

This is why spacing serves **remove before adding** (Law **L2**): when tempted to add a divider, a box, or a badge to separate things, add space instead. Chrome is debt; air is free and calm. A border is the last resort, never the first — group by space, and most of the boxes disappear.

## Do / Don't

| Do | Don't |
|---|---|
| Use only `--space-5` / `--space-4` for card padding | Invent a third card padding |
| Keep timeline gaps at `--space-5`+ | Tighten the timeline toward a chat log |
| Separate groups with space | Add a border or box where space would do |
| Hit 44px targets via padding | Enlarge font-size to reach 44px |
| Give screens `--space-8` top-and-bottom breathing | Fill trailing whitespace to "use the space" |
| Make mobile more generous | Compress on small screens to fit more |
