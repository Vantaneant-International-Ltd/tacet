# Media Viewer & System States — Wireframes (Stage 4)

> **Milestone:** Visual System V2 · **Stage:** 4 (Low-fidelity wireframes) · **Fidelity: GREY.**
> Read [00-overview](./00-overview.md) first — it fixes the conventions (`▓` media, `◯` avatar,
> `▁▁▁` skeleton, `‹×›` icon), the frozen frame, and the reading-measure law used throughout. These
> frames trace media rules to [media-system.md](../media-system.md), motion to
> [motion.md](../motion.md), copy to [voice-and-tone.md](../../07-brand/voice-and-tone.md) and
> [empty-states.md](../../02-human-interface-guidelines/empty-states.md), and tiers to
> [responsive.md](../responsive.md). Grey only — no colour, no real type. Stage 6 renders survivors.

---

## 1. Media viewer — full-bleed overlay

Tapping any media (photo / gallery tile / video poster) opens a focused, full-bleed overlay. The
scrim is `--scrim-media`; every mark on top uses `--on-media` + `--media-shadow`. There is **NO**
like tally, comment count, view counter, or reaction rail here — only the content, its human source,
its caption, and a way out. Video shows poster + one play mark; nothing autoplays (L5, §7).

```
PHONE (<768) — full-bleed overlay, --z-modal                DESKTOP (≥900) — same law, centred plate
┌───────────────────────────────────┐                       ┌──────────────────────────────────────────────┐
│ ‹×›                          2 / 5 │ ← close IconButton     │ ‹×›                                     2 / 5  │
│                    ·  ·  ·  · ·    │   (--on-media),        │                                                │
│                                   │   position count       │        ‹‹        ┌───────────────┐      ››      │
│                                   │   (--text-micro,       │      prev arrow  │               │  next arrow │
│         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │    --on-media),        │      (--on-media)│    ▓▓▓▓▓▓▓▓▓   │ --scrim-    │
│         ▓▓  full-bleed  ▓▓        │   NO counts overlaid   │       over       │    ▓▓ native ▓▓ │  media disc │
│         ▓▓  native px   ▓▓        │                        │    --scrim-media │    ▓▓  ratio ▓▓ │            │
│         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │ ← swipe ‹ › for gallery│       disc       │    ▓▓▓▓▓▓▓▓▓   │            │
│                                   │                        │                  └───────────────┘            │
│                                   │                        │                    · · ● · ·  ← gallery dots  │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← --scrim-caption      │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ Caption sits here, real caption   │   gradient lifts       │ Caption in --on-media over --scrim-caption     │
│ type — --text-meta / --on-media   │   text off image       │ Shared from Pixelfed · Marta Okonkwo           │
│ Shared from Pixelfed · M. Okonkwo │ ← human source, never  │ Alt: "Two potters at a wheel, morning light."  │
│ Alt: "Two potters, morning light" │   a server/domain (L9) │                                                │
└───────────────────────────────────┘                       └──────────────────────────────────────────────┘
```

- **Close** `‹×›` top-left, IconButton, `aria-label="Close"`; Esc also closes; scrim-click closes.
- **Gallery affordance:** phone swipes L/R; desktop shows `‹‹ ››` arrows over `--scrim-media` discs +
  position dots. Count reads `2 / 5` in `--text-micro`, `--on-media`. Never a like/comment overlay.
- **Video:** poster at `--ratio-video`, one centred play mark (`--on-media` over `--scrim-media`
  disc), duration "2:14" bottom-right `--text-micro`. No autoplay, no scrubber pressure (§7).
- **Enter/exit:** modal open — scrim fades `--dur-2`, plate fades+rises `--dur-3` `--ease-out`;
  reduced-motion → fade only. Focus trapped; returns to the invoking tile.

---

## 2. Empty states — a gallery

Each is an **EmptyState** (§14): optional `--icon-lg` glyph · title (`--text-subheading`,
`--color-text-secondary`) · quiet body (`--text-body-sm`, ≤28rem) · at most one plain action.
A calm fact, never a nag — no mascot, no FOMO, no exclamation. Reveal fades up `--dur-3` `--ease-out`.

```
TODAY — caught up (success, not a gap)      PEOPLE — no one yet
┌───────────────────────────────┐           ┌───────────────────────────────┐
│                               │           │                               │
│              ‹◈›              │           │              ‹◯›              │
│      You're all caught up.    │           │       No one here yet.        │
│  You've seen everything since  │           │  When you follow people, they │
│  you were last here. Come back │           │  live here — across the open  │
│      whenever you like.        │           │  social web, in one place.    │
│                               │           │                               │
│      (no action — silence      │           │        [ Find people ]        │ ← one door,
│       is allowed; L: done)     │           │         ghost button          │   ghost (in-content)
└───────────────────────────────┘           └───────────────────────────────┘

CONVERSATIONS — nothing new                  SAVED — nothing kept yet
┌───────────────────────────────┐           ┌───────────────────────────────┐
│              ‹◇›              │           │              ‹spark›          │
│    No new correspondence.     │           │      Nothing saved yet.       │
│  When someone writes, you'll   │           │  Anything you keep for later  │
│  find them here. No badges,    │           │  rests here — quietly, seen   │
│  no counts — just people.      │           │  by no one but you.           │
│                               │           │                               │
│  (presence is a ·dot·, never   │           │      (no action — filling     │
│   a red number)                │           │       it happens as you read) │
└───────────────────────────────┘           └───────────────────────────────┘

SEARCH — initial (before a query)
┌───────────────────────────────┐
│              ‹⌕›              │  ← icon --icon-lg
│      Search the open web.     │  ← title
│  Find people, communities, or │  ← body: says what you can do,
│  something someone shared.    │     plainly; never bait
│                               │
│  (recent searches may list     │  ← optional quiet recents,
│   below, quietly, if any)      │     not a trending scoreboard
└───────────────────────────────┘
```

- Copy pattern is voice-true: **state the fact, then offer the next step once** (or stay silent).
- "Caught up" reads as completion, not absence — Today is bounded; reaching the end is success.
- Only one EmptyState carries an action per view; the rest end in a calm fact. No cross-promotion.

---

## 3. Loading skeletons

Skeletons hold the **exact** shape and aspect ratios of the real content, so nothing shifts when
pixels arrive (§5, zero layout shift). Motion is a slow, low-contrast breathing sweep (`--dur-4`
`--ease-in-out`) — never a spinner, never a flash. **Reduced-motion → the skeleton holds static** at
rest opacity. `role="status"`.

```
MOMENT CARD skeleton (Content Card shape)     PROFILE HEADER skeleton
┌───────────────────────────────────┐         ┌───────────────────────────────────┐
│ ◯   ▁▁▁▁▁▁▁▁▁▁▁▁▁        ‹ ›      │         │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │ ← banner
│ ◯   ▁▁▁▁▁▁▁            more slot   │ ← attrib │ ▁▁▁▁▁ --ratio-banner (3/1) reserved │
│     ▁▁▁▁ meta line                │         ├───────────────────────────────────┤
│                                   │         │  ◯◯◯   ▁▁▁▁▁▁▁▁▁▁▁▁                │ ← avatar lg 64
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │ ← body   │  ◯◯◯   ▁▁▁▁▁▁  (handle)            │
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁          │   lines  │  ◯◯◯                    [ ▁▁▁▁ ]  │ ← relationship
│ ┌───────────────────────────────┐ │         │        ▁▁▁▁▁▁▁▁▁▁▁▁▁▁ (bio)         │   pill reserved
│ │  ▓  --ratio-photo (3/2)       │ │ ← media  │        ▁▁▁▁▁▁▁▁▁                    │
│ │  ▓  box reserved BEFORE load  │ │   frame  └───────────────────────────────────┘
│ └───────────────────────────────┘ │           (no vanity-count skeletons — there
│ ‹reply› ‹share› ‹save›            │ ← row      are none to load)
└───────────────────────────────────┘

CONVERSATION LIST skeleton (rows, no counts)
┌───────────────────────────────────┐
│ ◯   ▁▁▁▁▁▁▁▁▁▁          ▁▁▁       │ ← name + quiet time; NO unread number
│ ◯   ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁            │   (presence, if any, is a ·dot·)
│───────────────────────────────────│
│ ◯   ▁▁▁▁▁▁▁▁            ▁▁▁       │
│ ◯   ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁          │
│───────────────────────────────────│
│ ◯   ▁▁▁▁▁▁▁▁▁▁▁▁        ▁▁▁       │
└───────────────────────────────────┘
```

- Media boxes reserve their `--ratio-*` frame first; blur-up (LQIP/BlurHash) cross-fades `--dur-4`
  `--ease-out` when the asset lands (§5). No column jump, ever.
- Skeleton is removed the instant real content arrives — it never lingers as chrome.

---

## 4. Error state — calm, in-surface

An error is Tacet being honest: **say what happened, then what to do.** Never cute, never blaming
the person, never a stack trace. It offers a retry and gets out of the way. Uses the EmptyState
frame with a quiet `--color-danger` glyph (meaning by icon + words, never colour alone).

```
IN-SURFACE ERROR (replaces the feed/section that failed)
┌───────────────────────────────────┐
│                                   │
│              ‹!›                  │ ← quiet danger glyph, --icon-lg
│       Something didn't load.      │ ← title: what happened, plainly
│   Check your connection, or give   │ ← body: what to do — calm,
│           it a moment.            │    honest, no blame
│                                   │
│         [ Try again ]             │ ← retry, secondary button;
│                                   │    re-fetches this surface only
└───────────────────────────────────┘
```

- Voice: "Something didn't load." — a fact. Not "Oops!", not "You broke it", not "Error 500".
- Scope is the failed surface; the rest of the app stays usable. Retry re-runs that fetch and swaps
  to the skeleton (§3) while it works.

---

## 5. 404 / not found

Warm and on-brand — a wrong turn, calmly handled, with a way home. Not a jokey 404, no mascot, no
"you're lost!" theatre. EmptyState frame, one door back to a real place.

```
NOT FOUND (full screen inside the frozen frame)
┌───────────────────────────────────┐
│              ‹◇›                  │ ← quiet glyph, --icon-lg
│      This page isn't here.        │ ← title: plain fact
│  It may have moved, or it never   │ ← body: honest possibilities,
│  existed. Either way, you're not   │    reassuring, no blame
│  lost — Today is where you were.  │
│                                   │
│        [ Back to Today ]          │ ← one accent-free door home
└───────────────────────────────────┘
```

---

## 6. Toast / inline confirmation

The quiet acknowledgement that an action landed — "Saved to Reading Later". Subtle, positive,
auto-dismissing, **never blocking** and never a reward burst (L6). Toast component (§11):
`--color-surface-raised`, `--elevation-2`, `--radius-md`, `--z-toast`, `--text-body-sm`, optional
`--color-positive` `check` glyph, optional single **Undo** `ghost` action.

```
PHONE — toast sits above the tab bar, does not cover it
┌───────────────────────────────────┐
│                                   │
│         (screen content —         │
│          fully interactive,       │
│          nothing blocked)         │
│                                   │
│   ┌─────────────────────────────┐ │ ← rises + fades in --dur-2 --ease-out
│   │ ‹✓› Saved to Reading Later  Undo │ │   holds ~4s (longer with action),
│   └─────────────────────────────┘ │   fades out --dur-1; reduced-motion
│  ◈    ◯    ⊕    ◇    ◯           │ │   → appear/disappear, no travel
└───────────────────────────────────┘
```

- `role="status"` `aria-live="polite"` (a failure toast would be `role="alert"`).
- One toast at a time; never stacks into a wall; never used for streaks, nudges, or marketing.
- **Inline** variant: a field's small "Saved ✓" tick using the same tokens, in place.

---

## 7. Responsive matrix — Today across the five tiers

One representative screen (Today) at every tier, to prove each is **designed, not scaled**
(responsive.md §1). The reading measure is **identical** desktop → ultra-wide; extra width becomes
context, then quiet margin — line length never creeps.

```
PHONE (<768)        TABLET (768–899)      DESKTOP (900–1199)         WIDE (≥1200)                 ULTRA (≥1600)
single column       single WIDE column    rail + centred feed        rail · feed · context        same, capped
┌──────────────┐    ┌──────────────────┐  ┌────┬──────────────┐      ┌────┬──────────┬───────┐    ┌──┬──────────┬──┬──┐
│ ‹≡› Today ⌕◯ │    │ ‹≡›  Today   ⌕ ◯ │  │tacet│   Today      │      │tacet│  Today   │Continue│    │  │  Today   │Cx│  │
├──────────────┤    ├──────────────────┤  │────│              │      │────│          │where…  │    │  │          │  │  │
│ ┌──────────┐ │    │ ┌──────────────┐ │  │◈Tdy│ ┌──────────┐ │      │◈Tdy│┌────────┐│ ┌────┐ │    │Q │┌────────┐│  │Q │
│ │  card    │ │    │ │    card      │ │  │Ppl │ │  card    │ │      │Ppl ││ card   ││ │last│ │    │u ││ card   ││  │u │
│ └──────────┘ │    │ └──────────────┘ │  │Dsc │ └──────────┘ │      │Dsc ││        ││ │read│ │    │i │└────────┘│  │i │
│ ┌──────────┐ │    │ ┌──────────────┐ │  │Cnv │ ┌──────────┐ │      │Cnv │└────────┘│ └────┘ │    │e │          │  │e │
│ │  card    │ │    │ │    card      │ │  │Me  │ │  card    │ │      │Me  │┌────────┐│        │    │t │┌────────┐│Cx│t │
│ └──────────┘ │    │ └──────────────┘ │  │ ⊕  │ └──────────┘ │      │ ⊕  ││ card   ││        │    │  ││ card   ││  │  │
├──────────────┤    ├──────────────────┤  │◯you│              │      │◯you│└────────┘│        │    │m │└────────┘│  │m │
│◈ ◯ ⊕ ◇ ◯    │    │◈ ◯ ⊕ ◇ ◯        │  └────┴──────────────┘      └────┴──────────┴───────┘    └──┴──────────┴──┴──┘
└──────────────┘    └──────────────────┘  rail 250 · feed 42rem       + context 320px             feed capped 1440;
 topbar+tabbar+FAB   wider measure,        tabbar→rail; compose         context: "Continue where     extra → quiet
 measure ~reading    2-up media, no rail    moves into rail              you left off" (Ctx Law)      margin, not width
```

| Tier | Range | What is *designed* (not stretched) |
|---|---|---|
| **Phone** | `< 768` | Single reading column; top bar 56px + tab bar 72px + compose FAB. |
| **Tablet** | `768–899` | Own tier: wider measure, 2-up media galleries — still no rail. |
| **Desktop** | `900–1199` | Rail (250px) replaces tab bar; compose lives in the rail; feed centres. |
| **Wide** | `≥ 1200` | Rail · Feed · Context; context = "Continue where you left off" (Context Column Law). |
| **Ultra-wide** | `≥ 1600` | Same three columns, content capped at `--canvas-max` (1440px); surplus → quiet margin. |

- **The proof:** the feed measure (42rem) is the same from desktop out to ultra-wide. The window
  breathes around a fixed reading column; the context column is contextual only, never a dashboard,
  and folds to nothing below `--bp-xl`.
