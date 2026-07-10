# Today — Wireframes (Stage 4)

> **Fidelity: GREY** — structural only, per [00-overview.md](./00-overview.md). No colour, no real
> type, no final spacing. These frames fix layout, hierarchy, and flow. ASCII legend, the frozen
> frame, and all conventions are inherited from the overview and followed exactly: `▓` = media,
> `◯` = avatar, `[ Button ]`, `( pill )`, `‹ icon ›`, `···` = more/truncation, `▁▁▁` = skeleton,
> `·dot·` = quiet presence. Today is a **bounded digest that ends.**
>
> **Doctrine-reconciliation note (2026-07-09) — read this against the revised doctrine.** These grey
> frames predate the reframing. The canonical High-Fidelity plan is now
> [../hifi/today.md](../hifi/today.md): Today is a **calm editorial homepage** (still bounded, still
> chronological, never an opaque algorithm) and the wide-tier **context column is a *living* space** —
> *your world, never your score* — hosting people close to you, continue-where-you-left-off,
> represented momentum (framed, relationship-scoped), a calm onward door, and quiet open-web
> reassurance. It is **not** "continue-or-empty." Where a frame below shows the column empty or omits
> the world's life, prefer the hifi/today.md composition.

Doctrine held on every frame below, **as reconciled**: **no *self-directed* engagement furniture** —
no scoreboard of *your* likes / views, no reaction rail, no ranking of people, no red counts, no
streaks. That ban stands. **World-directed context is different and now allowed**: represented
momentum from your world (led by the thing, numbers softened to qualitative/range), shown calmly —
never a raw ascending tally or a top-N leaderboard ([ADR-011](../../11-decisions/ADR-011-metrics-are-context-not-rewards.md),
[design-principles L11](../design-principles.md)). Affordance row is **Reply · Share · Save** only;
**Save** is the private positive/`spark` signal. Story rings, if ever used, are your people's genuine
moments — never a streak. Presence is `·dot·`, never a red count. Attribution names a **human place**
(`on tacet.social`, a community's warm name, a source badge like *Pixelfed* read as a place), never a
server, instance, or software string. The word "Entry" is never used — these are *moments*.

---

## 1. Today — phone (`< 768`)

```
┌───────────────────────────────┐
│ Today                 ‹⌕›  ◯  │  top bar --topbar-height 56px, sticky, backdrop blur
│ A quiet Wednesday.            │  greeting --text-title / subline --text-body-sm --color-text-secondary
├───────────────────────────────┤
│ shared from tacet.social      │  SourceNote — human place, --text-meta mono --color-text-tertiary
│                               │
│ ┌───────────────────────────┐ │  ── Content Card (§4) · TEXT MOMENT ──
│ │ ◯  Mara Ito          ‹···›│ │  inline Person Card: name --text-subheading (loudest) · more IconButton
│ │    @mara@tacet.social     │ │  handle --text-meta mono --color-text-tertiary
│ │    on tacet.social · 8:12 │ │  source line (human place) + time · chronology as type, never ranked
│ │                           │ │
│ │ Finished the long edit at │ │  body --text-body 17px --leading-relaxed --color-text-primary
│ │ last. Letting it sit for  │ │  (largest, warmest element)
│ │ a day before I read it    │ │
│ │ back with fresh eyes.     │ │
│ │                           │ │
│ │ ‹reply› Reply  ‹share› Share  ‹save› Save │  affordance row — ghost, --color-text-secondary
│ └───────────────────────────┘ │  NO like/comment/repost counts (doctrine)
│                               │  cards separated by space --space-5, never flush
│ ┌───────────────────────────┐ │  ── Content Card · PHOTO MOMENT · 2-up gallery (media-system §3) ──
│ │ ◯  Jonas Vold        ‹···›│ │
│ │    @jonas@tacet.social    │ │
│ │    shared from pixel.town·9:40 │ media attribution = human place, not protocol
│ │                           │ │
│ │ Morning walk, before the  │ │  body --text-body
│ │ street woke up.           │ │
│ │ ┌────────────┬────────────┐ │  2 images → equal halves, both --ratio-square,
│ │ │    ▓▓▓▓    │    ▓▓▓▓    │ │  --space-1 hairline gutter, shared outer --radius-lg,
│ │ │    ▓▓▓▓    │    ▓▓▓▓    │ │  inner tiles --radius-md · alt text required
│ │ └────────────┴────────────┘ │
│ │ Two frames from the quay.  │ │  caption --text-meta --color-text-secondary, below media
│ │                           │ │
│ │ ‹reply› Reply  ‹share› Share  ‹save› Save │  (no counts on media, no scoreboard)
│ └───────────────────────────┘ │
│                               │
│ ┌───────────────────────────┐ │  ── Content Card · VIDEO MOMENT · poster + play, no autoplay (§7) ──
│ │ ◯  Reef Studio       ‹···›│ │
│ │    @reef@tacet.social     │ │
│ │    shared from tilvids.com·11:05 │ human-place attribution
│ │                           │ │
│ │ A three-minute look at the│ │  body --text-body
│ │ workshop.                 │ │
│ │ ┌───────────────────────┐ │ │  video → poster at --ratio-video (16/9), reserved frame
│ │ │▓▓▓▓▓▓▓ ⟨▶⟩ ▓▓▓▓▓▓▓▓│ │ │  single play mark: --on-media over --scrim-media disc
│ │ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 3:12 │ │ │  duration --text-micro bottom-right · NO autoplay, no hover-play
│ │ └───────────────────────┘ │ │
│ │                           │ │
│ │ ‹reply› Reply  ‹share› Share  ‹save› Save │
│ └───────────────────────────┘ │
│                               │
│      ·  ·  ·  (end below)      │  bounded — the feed has a floor; end-state (§4) follows
├───────────────────────────────┤
│  ◈     ◯     ⊕     ◇    ◯·    │  bottom tab bar --tabbar-height 72px, --z-nav
│ Today People (＋) Discvr Conv │  ⊕ = compose FAB (calm, never glowing) · Conv shows ·dot· not a count
└───────────────────────────────┘  labels 10px · safe-area-inset-bottom honoured
```

*Notes:* one primary action per card is unnecessary here — all three affordances are `ghost` so the
voice stays loudest (L3). Save flips to filled `spark` glyph + `--color-positive` when kept, with a
quiet Toast; it is the only positive colour on the card and is never a public number.

---

## 2. Today — desktop (`900–1199`) — rail + centred feed (no context column yet)

```
┌────────────┬──────────────────────────────────────────────┐
│  tacet     │                                              │  rail --rail-width 250px, sticky
│            │   Today                                      │  feed centred at --feed-measure 42rem
│  ◈ Today   │   A quiet Wednesday.                         │  greeting --text-title
│  ◯ People  │   shared from tacet.social                   │  SourceNote --text-meta mono
│  ◇ Discvr  │                                              │
│  ◈ Convos· │   ┌──────────────────────────────────────┐   │  Convos carries ·dot· presence (quiet)
│  ◯ Me      │   │ ◯  Mara Ito                     ‹···›│   │  ── TEXT MOMENT ──
│            │   │    @mara@tacet.social · 8:12         │   │
│            │   │    Finished the long edit at last.   │   │  body --text-body
│  [ ⊕ New ] │   │    Letting it sit for a day.         │   │  compose = calm rail button, not an orb
│            │   │    ‹reply› Reply ‹share› Share ‹save› Save │  Reply·Share·Save only
│            │   └──────────────────────────────────────┘   │
│            │   ┌──────────────────────────────────────┐   │  ── PHOTO MOMENT · 2-up ──
│            │   │ ◯  Jonas Vold                   ‹···›│   │
│            │   │    @jonas · shared from pixel.town·9:40│ │
│            │   │    ┌─────────────┬─────────────┐     │   │  2 images, equal halves --ratio-square
│            │   │    │    ▓▓▓▓     │    ▓▓▓▓     │     │   │  shared outer --radius-lg
│            │   │    └─────────────┴─────────────┘     │   │
│            │   │    ‹reply› Reply ‹share› Share ‹save› Save │
│            │   └──────────────────────────────────────┘   │
│            │                                              │
│            │        · · ·  That's today (see §4)  · · ·   │  bounded end sits here
│  ◯ you  ☾  │                                              │  identity + theme toggle, rail bottom
└────────────┴──────────────────────────────────────────────┘
```

*Rail:* active pillar (Today) = `--color-accent-subtle` bg, `--color-accent` icon, label weight 500;
inactive = `--color-text-secondary`. Reading measure is **fixed at 42rem** — the window grows, the
line length does not. No third column yet: below `--bp-xl` the "continue" content simply is not shown.

---

## 3. Today — wide (`≥ 1200`) — three-column: rail · feed · context

```
┌──────────┬────────────────────────────────┬────────────────────┐
│  tacet   │  Today                         │  Continue where    │  context --context-width 320px
│          │  A quiet Wednesday.            │  you left off      │  SectionHeading --text-heading
│ ◈ Today  │  shared from tacet.social      │                    │
│ ◯ People │                                │  ┌──────────────┐  │  ONE thing you were mid-way through
│ ◇ Discvr │  ┌──────────────────────────┐  │  │ ◇ Article    │  │  (Recently Viewed → continuity, IA §6)
│ ◈ Convos·│  │ ◯ Mara Ito         ‹···›│  │  │ "The slow    │  │  quiet inset card --color-surface-sunken
│ ◯ Me     │  │   @mara · 8:12          │  │  │  web"        │  │  hairline only, --elevation-0
│          │  │   Finished the long edit│  │  │ ▓▓▓ 6 min    │  │  progress hint --text-meta
│          │  │   at last.              │  │  │ left · Resume│  │  [ Resume ] ghost → reopens reader
│ [ ⊕ New ]│  │   ‹reply›Reply ‹share›Share ‹save›Save │  │·dot· new     │  │  ·dot· + qualitative phrase,
│          │  │                        │  │  │ replies from │  │  NEVER "N unread" — no count
│          │  │                        │  │  └──────────────┘  │
│          │  └──────────────────────────┘  │                    │
│          │  ┌──────────────────────────┐  │                    │  exactly ONE continuation — no
│          │  │ ◯ Jonas Vold       ‹···›│  │                    │  second card (Context Column Law)
│          │  │   @jonas·pixel.town·9:40│  │                    │
│          │  │   ┌──────────┬────────┐ │  │                    │
│          │  │   │  ▓▓▓▓    │ ▓▓▓▓   │ │  │                    │
│          │  │   └──────────┴────────┘ │  │                    │
│          │  │   ‹reply›Reply ‹share›Share ‹save›Save │                    │
│          │  └──────────────────────────┘  │  Nothing else here.│  law: context helps you RESUME,
│          │                                │  When you're done, │  then be done — never a dashboard,
│          │   · · ·  That's today  · · ·   │  it stays quiet.   │  never trending/federation tallies
│ ◯ you ☾  │                                │                    │
└──────────┴────────────────────────────────┴────────────────────┘
```

```
   CONTEXT COLUMN — EMPTY VARIANT (nothing in progress)
   ┌────────────────────┐
   │  Continue where    │   SectionHeading present, but…
   │  you left off      │
   │                    │
   │   (nothing here)   │   EmptyState — the column is genuinely EMPTY (Context Column Law):
   │  You're not mid-   │   no invented widgets, no "trending", no scoreboard. Feed simply
   │  way through       │   centres and the margin goes quiet. --text-body-sm --color-text-secondary
   │  anything.         │
   └────────────────────┘
```

*Feed measure is identical to desktop (42rem);* extra width became the context column, then quiet
margin — never longer lines. Ultra-wide (`≥1600`) caps content at `--canvas-max` 1440px.

---

## 4. Today — "You're done" end-state (the anti-infinite-scroll payoff)

```
┌───────────────────────────────┐
│ Today                 ‹⌕›  ◯  │
│ A quiet Wednesday.            │
├───────────────────────────────┤
│                               │
│   … (last moment card above)  │
│                               │
│         ─────────────         │  a quiet hairline rule closes the digest — a real floor
│                               │
│             ‹check›           │  single check glyph (not a trophy, not confetti)
│                               │
│       That's today.           │  --text-subheading --color-text-secondary — warm, plain
│       You're all caught up.   │  the calm, bounded ending
│                               │
│    Nothing more is waiting.   │  --text-body-sm --color-text-tertiary, ≤28rem measure
│    The rest of the day        │  reassurance that finishing is the point (product/today.md)
│    is yours.                  │
│                               │
│      [ Look around Discover ] │  ONE optional ghost onward-door — NOT "load more",
│                               │  NOT a streak, NOT "you missed 12 posts", NOT a nag
│                               │
├───────────────────────────────┤
│  ◈     ◯     ⊕     ◇    ◯·    │
│ Today People (＋) Discvr Conv │
└───────────────────────────────┘
```

*Explicitly rejected here:* "🔥 streak!", "keep scrolling", "you missed…", any manufactured
incompleteness or return-hook (product/today.md, L6). Reaching the end **feels good, not cut off.**
The best session ends with the person closing the app satisfied.

---

## 5. Today — empty (new user) — "bring your world"

```
┌───────────────────────────────┐
│ Today                 ‹⌕›  ◯  │
│ Welcome home.                 │  first-run greeting --text-title
├───────────────────────────────┤
│                               │
│                               │
│             ‹today›           │  EmptyState icon 28px --icon-lg --color-text-secondary
│                               │
│      Your Today is quiet      │  title --text-subheading --color-text-secondary
│      because it's new.        │
│                               │
│   Bring the people and        │  body --text-body-sm --color-text-tertiary, ≤28rem measure
│   places you already          │  a calm fact + invitation, never a nag
│   follow, and this becomes    │
│   yours.                      │
│                               │
│      [ Bring your world ]     │  primary CTA → search a name / paste an address (onboarding flow)
│      [ Find people ]          │  secondary ghost → Discover
│                               │
│   Nothing to catch up on —    │  honest: an empty Today is a feature, not a failure
│   and that's fine.            │
│                               │
├───────────────────────────────┤
│  ◈     ◯     ⊕     ◇    ◯     │  Conv has no ·dot· yet (no correspondence)
│ Today People (＋) Discvr Conv │
└───────────────────────────────┘
```

*Wide-tier note:* the context column on empty-Today is also **empty** — nothing to continue, nothing
invented. The welcome lives in the feed, not the sidebar.

---

## 6. Today — loading (calm skeletons, blur-up, zero layout shift)

```
┌───────────────────────────────┐
│ Today                 ‹⌕›  ◯  │  chrome renders instantly (no skeleton on the top bar)
│ ▁▁▁▁▁▁▁▁▁▁                    │  greeting/subline skeleton lines
├───────────────────────────────┤
│ ▁▁▁▁▁▁▁▁                      │  SourceNote skeleton
│                               │
│ ┌───────────────────────────┐ │  ── text-card skeleton: exact shape reserved ──
│ │ ◯  ▁▁▁▁▁▁▁▁          ▁▁   │ │  avatar circle + name/handle lines (no layout shift)
│ │    ▁▁▁▁▁▁                 │ │
│ │    ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁    │ │  body lines
│ │    ▁▁▁▁▁▁▁▁▁▁▁▁▁          │ │
│ │    ▁▁▁▁   ▁▁▁▁   ▁▁▁▁     │ │  affordance-row placeholders (Reply/Share/Save)
│ └───────────────────────────┘ │
│ ┌───────────────────────────┐ │  ── photo-card skeleton: media frame RESERVED at ratio ──
│ │ ◯  ▁▁▁▁▁▁▁▁          ▁▁   │ │
│ │    ▁▁▁▁▁▁                 │ │
│ │ ┌────────────┬────────────┐ │  2-up frame held at --ratio-square BEFORE pixels arrive
│ │ │            │            │ │  → blur-up: LQIP/BlurHash fades in over --dur-3 --ease-out
│ │ │  (reserved)│ (reserved) │ │  (media-system §5, motion.md) — resolves, never pops
│ │ └────────────┴────────────┘ │
│ │    ▁▁▁▁   ▁▁▁▁   ▁▁▁▁     │ │
│ └───────────────────────────┘ │
│ ┌───────────────────────────┐ │  ── video-card skeleton: 16/9 frame reserved ──
│ │ ◯  ▁▁▁▁▁▁▁▁          ▁▁   │ │
│ │ ┌───────────────────────┐ │ │
│ │ │       (reserved       │ │ │  --ratio-video box held; poster blur-ups in
│ │ │        16/9)          │ │ │  no spinner, no shimmer theatre
│ │ └───────────────────────┘ │ │
│ └───────────────────────────┘ │
│                               │
│           •                   │  Loading primitive: single soft-pulsing --color-accent dot
│      Gathering today          │  --text-meta --color-text-secondary · role="status"
├───────────────────────────────┤  reduced-motion → dot holds steady at 0.7 opacity, fades → swap
│  ◈     ◯     ⊕     ◇    ◯     │
│ Today People (＋) Discvr Conv │
└───────────────────────────────┘
```

*Zero layout shift is the rule:* every card and every media frame occupies its final aspect-ratio box
while skeletons show, so nothing jumps when content lands (media-system §5.1). Loading is calm — a
single pulsing dot and blur-up, **never a spinner, never shimmer** (L6, components §14).

---

*Cross-links:* [00-overview.md](./00-overview.md) (conventions + frozen frame) ·
[information-architecture.md](../information-architecture.md) (Today = bounded digest; context = continue/empty) ·
[responsive.md](../responsive.md) (three-column canvas, fixed measure, Context Column Law) ·
[components.md](../components.md) (Content Card, EmptyState, Loading, Toast) ·
[media-system.md](../media-system.md) (gallery layouts, no autoplay, blur-up) ·
[01-product/today.md](../../01-product/today.md) (bounded, finishable, respectful of leaving).
