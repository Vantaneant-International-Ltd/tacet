# Content Cards

The content card renders what a person made — text, photo, video, or long-form — whether
it originates on `tacet.social` or arrives from anywhere on the Fediverse. It renders
that content **honestly and calmly**: chronological, unranked, and free of the vanity
machinery that turns reading into a scoreboard.

It is the second of the two most important components, alongside the
[person card](person-cards.md).

## Anatomy

```
┌───────────────────────────────────────────────┐  ← --radius-lg
│  (avatar) Ada Lovelace                 · · ·   │  ← inline person + more
│           @ada@tacet.social · 09:41 · 3 Jul    │  ← meta, quiet
│                                                 │
│  The Analytical Engine weaves algebraic         │  ← body, the voice
│  patterns just as the loom weaves flowers.      │
│                                                 │
│  [ media — --radius-md ]                        │  ← optional
│                                                 │
│  Reply        Save             (private ♥ you)  │  ← footer: calm actions
└───────────────────────────────────────────────┘
```

- **Attribution** — an inline [person card](person-cards.md): avatar, name, handle.
  Tapping it goes to the person. People before posts, even here.
- **Meta** — `--text-meta` mono, `--color-text-tertiary`: handle · time. Time is
  typography, not a badge, and chronology is always visible.
- **Body** — the voice. `--text-body` (17px) at line-height 1.6,
  `--color-text-primary`. The largest, warmest element on the card — content over chrome.
- **Media** — full column width, `--radius-md`, honest aspect ratios; alt text
  required for accessibility. Video does not autoplay.
- **Footer** — calm, tertiary actions (see below).

## Content types

| Type | Rendering |
|---|---|
| **Text** | Body only; generous measure (`--measure-reading`). |
| **Photo** | Body + one or more images; captions in `--text-meta`. |
| **Video** | Body + player; poster frame, tap to play, no autoplay, no view counter. |
| **Long-form** | Title (`--text-heading`) + lead + "Read" affordance; opens a spacious reading view. |

All types share one anatomy so a mixed, chronological column reads as one calm surface.

## The private positive signal — not public counts

Tacet does **not** render public like/dislike/repost scoreboards. Reactions and vanity
counts are retired by default. Instead:

- **Save** keeps something for yourself. It is private; no one sees a tally.
- A **quiet private acknowledgement** ("♥ you") tells *the author alone* that someone
  valued their post — attributed to a person to that author privately, **never shown as a
  number, never a public opposite**. Relationships before engagement.
- No card ever displays "1.2k likes", trending badges, or ranked positions. There is
  nothing to perform for.

This is the load-bearing calm rule: signal exists so people feel seen, not so posts
compete. See [components: no vanity counters](components.md#shared-conventions).

## Federation, rendered honestly

- Content from other servers uses the **same card** — federation feels like email, the
  protocol stays invisible. The person's home server is legible via their inline handle,
  with an optional quiet **source chip** when origin is worth surfacing.
- Remote formatting is sanitized and re-rendered into Tacet's calm type and spacing, so
  a federated post feels native without hiding where it came from.
- Content is **chronological**. No algorithmic ranking, no "you may have missed",
  no reordering to maximise time-on-app. Calm before addiction.

## Rules

- **The voice is loudest;** meta and actions stay quiet beneath it.
- **Actions are tertiary** (Reply, Save) — plain verbs, `--color-text-secondary`,
  no accented buttons competing with the words. See [buttons](buttons.md).
- Whole-card or body tap opens the conversation; attribution and each action are
  separate targets ([accessibility HIG](../02-human-interface-guidelines/accessibility.md)).
- Built on the base [card](cards.md) with foundation tokens
  ([color](color-tokens.md) · [type](typography-scale.md) · [spacing](spacing-scale.md) ·
  [radius & elevation](radius-and-elevation.md)).
