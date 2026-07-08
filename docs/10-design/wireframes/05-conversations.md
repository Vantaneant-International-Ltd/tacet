# Conversations — Wireframes (Stage 4)

> **Fidelity: GREY** — structure only, per [00-overview.md](./00-overview.md). No colour is implied.
> `◯` avatar · `( pill )` segmented control · `·dot·` quiet presence signal · `‹ icon ›` icon ·
> `···` truncation. Every block is annotated with the component + token it becomes in Stage 6.
> Traces to [IA §3/§5](../information-architecture.md) and [conversation-system.md](../conversation-system.md):
> correspondence, **not** notifications; presence is a dot, never a red count.

---

## 1. Conversations — list — phone

```
┌─────────────────────────────────────────────┐
│ ‹≡›   Conversations              ‹⌕›   ◯     │  topbar (frozen frame). Title --text-title.
├─────────────────────────────────────────────┤
│  (  All  · Mentions · Replies · Messages  )  │  SegmentedControl (§13). --radius-full track,
│                                              │  raised thumb on active. NEUTRAL — never accent,
│                                              │  never shows a per-tab count. --dur-2 cross-fade.
├─────────────────────────────────────────────┤
│  ◯   Maria Okafor            @maria… ·dot·   │ ← row: unread. quiet ·dot· = --space-2,
│  46   replied to your Thought          2h    │   --color-accent. NEVER a red number.
│       "the part about slow mornings…"        │   name --text-subheading w500; handle
│                                              │   --text-meta mono; latest line --text-body-sm
│ ─────────────────────────── hairline ─────── │   secondary, 1-line ellipsis; time --text-meta
│  ◯   Tomás Rin                 @tomas         │   MONO --color-text-tertiary, right, unhurried.
│  46   mentioned you               yesterday   │   Read row: no dot, preview stays secondary —
│       "worth reading @you@tacet.social on…"  │   the list SETTLES, it does not reward clearing.
│ ─────────────────────────── hairline ─────── │
│  ◯   Aoife Dunne             @aoife  ·dot·   │   Rows separated by --color-hairline only (L1),
│  46   sent you a message              3d      │   no card border per row. Touch target ≥44px
│       "did you keep the piece we talked…"    │   via padding (--space-4 vertical rhythm).
│ ─────────────────────────── hairline ─────── │
│  ◯   Jun Park                  @jun           │
│  46   replied                         Apr 2   │   Older times relax to date, still mono, still
│       "yes — exactly what I meant."          │   calm. No live-ticking counter anywhere.
│                                              │
├─────────────────────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ◯·                       │  tabbar. Conversations glyph carries ·dot·
│ Today People (+)  Disc  Convo·               │  (see frame 5). NOT a numbered badge.
└─────────────────────────────────────────────┘
```
*Rejected here:* the reference apps' "Activity" tab with running like/follow tallies. Tacet has
**no Activity tab** (L9): vanity pings are retired legacy. What is genuinely *for you* lands as
correspondence in these rows; everything else never generates a personal ping.

---

## 2. Conversations — list — wide (three-column)

```
┌──────────┬────────────────────────────────┬───────────────────────┐
│ tacet    │  Conversations                 │  Context              │  Context Column Law:
│          │  ( All · Mentions · Replies ·  │  (participants of the │  participants + the
│ ◈ Today  │    Messages )   SegmentedCtrl  │   SELECTED thread +   │  moment the thread
│ People   │ ────────────── hairline ────── │   the source moment)  │  hangs off. Nothing
│ Discover │  ◯ Maria Okafor    @maria ·dot·│                       │  else lives here (L7).
│ Convos·  │    replied · your Thought   2h │  In this conversation │
│ Me       │  ─────────── hairline ──────── │   ◯◯◯  ◯  +2          │  Avatars, --overlap-
│          │ [◯ Tomás Rin   @tomas       ]  │   4 people            │  avatar stacking.
│          │ [   mentioned you   yesterday] ←│  --text-meta, PRIVATE │  "4 people" is private
│          │  ─────────── hairline ──────── │   context, not a      │  context — NOT a
│          │  ◯ Aoife Dunne  @aoife    ·dot·│   scoreboard.         │  scoreboard tally.
│          │    message              3d     │                       │
│          │  ─────────── hairline ──────── │  ── hairline ──       │
│          │  ◯ Jun Park     @jun           │  The moment           │
│          │    replied           Apr 2     │  ┌──────────────────┐ │  Compact reference to
│          │                                │  │ ◯ You · a Thought│ │  the post the selected
│  ⊕       │  selected row = --color-       │  │ "slow mornings…" │ │  thread hangs off, so
│ Compose  │  surface-raised, hairline warm │  │ ▓ (blur-up)      │ │  context stays in view.
│          │  toward --color-text-tertiary  │  └──────────────────┘ │  Same editorial media
│ ◯ you    │  (selected state, not accent). │                       │  treatment (L5).
└──────────┴────────────────────────────────┴───────────────────────┘
  rail 250px          feed 42rem (--feed-measure)        context 320px
```
Feed holds the reading measure (42rem) even when a thread is selected in-place; extra width becomes
context, then quiet margin. The context column is **never a dashboard** — no reply-race tallies, no
"activity," no federation status.

---

## 3. Conversation reader (thread) — phone

```
┌─────────────────────────────────────────────┐
│ ‹‹ Back                                      │  --text-label ghost. Returns to the list.
├─────────────────────────────────────────────┤
│  How it started                              │  --text-meta, --color-text-secondary. The
│  ┌─────────────────────────────────────────┐ │  SOURCE MOMENT the thread hangs off, gently
│  │ ◯ You  @you@tacet.social       Apr 1    │ │  distinguished at the top so you never lose
│  │ Slow mornings are the whole point.      │ │  what it's all about. Editorial media
│  │ ▓▓▓ (blur-up, one scrim, no autoplay)   │ │  treatment (L5): --radius-md, --ratio-*.
│  └─────────────────────────────────────────┘ │
│                                              │
│  ── the thread ──────────── hairline ─────── │
│                                              │
│  ◯ Maria Okafor  @maria         2h           │  TURN as a reading BLOCK, not a chat bubble.
│  46                                          │  Attribution line: face ~30px · name
│  The part about slow mornings landed for     │  --text-subheading · handle --text-meta mono
│  me — I've been trying to protect the        │  secondary · time --text-meta mono tertiary.
│  first hour and it changes the day.          │  Body --text-body, --leading-relaxed (1.60).
│                                              │
│      ‹ one-step indent, hairline guide ›     │  ← --space-5 (24px) BETWEEN TURNS. Never
│      ◯ You  @you             1h              │    stacked tight like a chat log.
│      Exactly. The trick is not reaching                Nested reply indents ONE step only
│      for the phone before the kettle.        │      (hairline guide, --color-hairline) —
│                                              │      not the deep chat staircase.
│  ◯ Tomás Rin  @tomas            40m          │
│  46                                          │
│  Saving this. @you@tacet.social always       │  Handles shown as human addresses, never as
│  writes the quiet ones.                      │  server strings. Person shown as a person.
│                                              │
│           ‹ Show 3 more replies ›            │  Progressive reveal (carried from V1) so long
│                                              │  branches never overwhelm.
├─────────────────────────────────────────────┤
│  ◯  Reply…                          [ Reply ]│  Inline compose (frame 6) pinned at foot.
│      This reply is public — it goes out to   │  --color-accent Reply = the one action (L3).
│      the open web.                           │  Honesty note --text-meta secondary.
└─────────────────────────────────────────────┘
```
*Rejected:* right/left bubble tails, message density, live-ticking timestamps. If a turn reads like
a text message, it is styled wrong — err hard toward reading comfort.

---

## 4. Conversation reader — wide

```
┌──────────┬────────────────────────────────┬───────────────────────┐
│ tacet    │  ‹‹ Back                        │  Context              │
│          │  How it started                 │                       │
│ ◈ Today  │  ┌────────────────────────────┐ │  In this conversation │
│ People   │  │ ◯ You @you        Apr 1     │ │   ◯ ◯ ◯               │
│ Discover │  │ Slow mornings are the       │ │   Maria · You · Tomás │  Participants cluster
│ Convos·  │  │ whole point.  ▓▓▓           │ │   3 people            │  (each an avatar link
│ Me       │  └────────────────────────────┘ │   --text-meta private │  to that person).
│          │  ── the thread ──── hairline ── │                       │  "3 people" = private
│          │  ◯ Maria Okafor  @maria    2h   │  ── hairline ──       │  context, never a
│          │  The part about slow mornings   │  The moment           │  scoreboard (L7, §8).
│          │  landed for me — protecting     │  ┌──────────────────┐ │
│          │  the first hour changes it.     │  │ ◯ You · a Thought│ │  Source moment stays
│          │                                 │  │ "slow mornings…" │ │  visible while you
│          │     ◯ You  @you         1h      │  │ ▓ (blur-up)      │ │  scroll deep replies —
│          │     Exactly. Don't reach for    │  └──────────────────┘ │  its ONLY job. No
│          │     the phone before the kettle.│                       │  trending, no tallies,
│          │  ◯ Tomás Rin  @tomas    40m     │                       │  no federation status.
│          │  Saving this.                   │                       │
│  ⊕       │       ‹ Show 3 more replies ›   │                       │  Below --bp-xl this
│ Compose  │  ┌────────────────────────────┐ │                       │  column folds into the
│          │  │ ◯ Reply…          [ Reply ]│ │                       │  top of the thread and
│ ◯ you    │  │ Public — goes to open web  │ │                       │  simply isn't shown.
└──────────┴────────────────────────────────┴───────────────────────┘
  rail 250px          feed 42rem                        context 320px
```
Reader sits in the feed column; participants + source moment sit in the context column. Turns keep
`--leading-relaxed` and `--space-5` regardless of tier — the reading measure never widens into long
lines.

---

## 5. The presence signal

```
   RAIL (wide)                        TAB BAR (phone)
   ┌──────────────┐                   ┌──────────────────────────────┐
   │ ◈ Today      │                   │  ◈    ◯    ⊕    ◇    ◇·       │
   │ People       │                   │ Today People (+) Disc Convo· │
   │ Discover     │                   └──────────────────────────────┘
   │ Convos  ·    │  ← ·dot·                    ▲
   │ Me           │    trails the label         │  a single quiet ·dot· sits just off the
   └──────────────┘                             │  Conversations glyph.
```

Annotation — **the whole doctrine in one object:**
- The dot is `--space-2`, `--color-accent` (or `--color-positive` for the subtlest treatment).
- **NEVER red. NEVER a number. NEVER pulsing** (L6). It says only "there is new correspondence."
- It is the signal that **absorbs the notification centre's job** ([IA §5](../information-architecture.md)):
  there is no Notifications screen and no red badge anywhere in Tacet.
- *Rejected:* `Convos ⁵` / a red `5` bubble / a growing tally. A red badge with a count is the most
  manipulative object in modern social software; it does not exist here.
- Dot clears when the correspondence is read — quietly, no celebratory clear-all animation.

---

## 6. Reply compose (inline)

```
┌─────────────────────────────────────────────┐
│  ◯  Reply to Maria…                          │  Borderless --text-body, --leading-relaxed on
│  46                                          │  --color-surface-raised — the page, not a box.
│     ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁       │  No character-count anxiety. No formatting
│     ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁                        │  circus. Placeholder literal + quiet.
│                                              │
│  This reply is public — it goes out to the   │  DISTRIBUTION HONESTY, once, --text-meta
│  open web.                                   │  --color-text-secondary. Truthful, never
│                                              │  buried, never alarmist (Principle 5).
│                                    [ Reply ] │  ONE accent action (L3), --color-accent.
└─────────────────────────────────────────────┘   No "send now" pressure, no countdown.

  Replying to a friend elsewhere on the open web — identical gesture:
┌─────────────────────────────────────────────┐
│  ◯  Reply to Sena…                           │  Sena lives on another home. Shown as a
│  46                                          │  PERSON: face, name, handle as a human
│     ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁                 │  address — their place shown as a place,
│                                              │  not a server string.
│  This reply is public — it goes out to the   │
│  open web.                                   │  Doctrine, verbatim & humanly framed:
│                                    [ Reply ] │  "Reply to a friend on Mastodon the same
└─────────────────────────────────────────────┘   way you'd reply here." Protocol NEVER named
                                                   (no instance / server / federation / Entry).
```
Where a reply is a private **message** instead, that is stated just as plainly ("This is a private
message"). Sending is acknowledged with the quiet `--color-positive` Toast used for Save (§11) — a
warm nod, never a send-and-earn reward. On phone the composer may rise as a `--radius-xl` sheet.

---

## 7. Conversations — empty

```
┌─────────────────────────────────────────────┐
│ ‹≡›   Conversations              ‹⌕›   ◯     │
├─────────────────────────────────────────────┤
│  (  All  · Mentions · Replies · Messages  )  │  SegmentedControl stays present + calm.
├─────────────────────────────────────────────┤
│                                              │
│                    ‹ ✉ ›                     │  EmptyState (§14): 28px conversations icon,
│                                              │  --icon-lg.
│              No new correspondence           │  Title --text-subheading, --color-text-
│                                              │  secondary. A calm, welcoming FACT.
│      When someone writes to you, replies,    │  Body --text-body-sm, --color-text-secondary,
│      or mentions you, it'll wait for you     │  ≤28rem measure.
│      here — quietly.                         │
│                                              │
│                                              │
├─────────────────────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ◇                        │  No ·dot· on Convos — nothing new is the
│ Today People (+)  Disc  Convo                │  resting, healthy state.
└─────────────────────────────────────────────┘
```
*Rejected:* "You're all caught up!", a zero-badge, a streak, an inbox-zero trophy — gamified relief
engineered to make emptiness feel like an achievement. Emptiness here simply *is*.

---

*The test ([conversations.md](../01-product/conversations.md)): if opening this surface lowers your
shoulders instead of raising them, it's doing its job.*
