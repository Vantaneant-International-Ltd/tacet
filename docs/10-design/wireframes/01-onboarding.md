# Onboarding — Wireframes (Stage 4)

> **Fidelity: GREY.** Structure, hierarchy, flow — not beauty. Conventions, the frozen frame, and the
> annotation rules are fixed by [00-overview](./00-overview.md): `▓` media, `◯` avatar, `[ Button ]`,
> `( pill )`, `‹icon›`, `▁▁▁` skeleton, `·dot·` presence. Every frame is annotated with the
> component and token it uses. This set satisfies the [IA §8](../information-architecture.md) first-run
> flow: **Landing → Welcome home → Create identity (`@you@tacet.social`) → Bring your world → Today**,
> in **≤ 4 steps to a populated Today**. Protocol is never surfaced (no *instance / server /
> federation / ActivityPub*); the address is shown plainly, never explained.

---

## 1. Landing — the keynote surface

Landing is a **distinct surface** (decision **D10**): it keeps its own dark visual language and is *not*
inside the frozen app frame. It is the only marketing-voiced screen. Shown at low fidelity — hero,
five value props, one CTA — then we hand off to the calm app.

```
PHONE (<768) · keynote surface                DESKTOP (≥900) · keynote surface
┌───────────────────────────┐                 ┌───────────────────────────────────────────┐
│  Tacet                     │  wordmark       │  Tacet                          [ Enter ]  │  --text-label
│                            │  --text-label   │                                             │
│                            │                 │        Your home on the                     │  --text-display
│   Your home on the         │  --text-display │        open social web.                     │  wt 300, hero-only
│   open social web.         │  wt 300         │                                             │
│                            │                 │   One identity you own. One place your      │  --text-body
│   One identity you own.    │  --text-body    │   people live. One calm window.             │  --color-text-secondary
│   One place your people    │  secondary      │                                             │
│   live. One calm window.   │                 │        [ Make yourself at home ]            │  Button primary, size lg
│                            │                 │                                             │
│  [ Make yourself at home ] │  Button primary │   ─────────── the five, in a calm row ───── │
│                            │  size lg, full  │   ◇ One identity   ◇ Your people, one place │  value props
│  · One identity you own    │  value props    │   ◇ A calm window  ◇ It's yours to keep     │  --text-heading + body-sm
│  · Your people, one place  │  stacked:       │   ◇ Leave any time                          │
│  · A calm window, no feed  │  --text-heading │                                             │
│  · Everything, kept        │  + --text-body- │        [ Make yourself at home ]            │  repeat CTA, calm
│  · Yours to leave with     │  sm secondary   │                                             │
│                            │                 │  Already have a handle?  Sign in            │  text link, --text-label
│  Already home? Sign in     │  quiet link     └───────────────────────────────────────────┘
└───────────────────────────┘
```

- **Voice:** hero line is verbatim brand (`first-visit.md`); CTA is a verb-phrase invitation, not
  "Sign up". No counters, no urgency, no cookie wall (keynote calm).
- **Value props** lead with the home, never with the list of removed things (`voice-and-tone.md`).
- Tapping the CTA leaves the keynote surface and enters the frozen app frame at frame 2.

---

## 2. First-run — Welcome home

The calm entry the instant someone chooses to join. One warm line, one clear CTA. This is the
`FirstRun` step 0 (`FirstRun.tsx`), rendered as its own centred surface — no rail, no tabs yet.

```
PHONE (<768)                                   DESKTOP (≥900) — same, wider measure, still centred
┌───────────────────────────┐                 ┌───────────────────────────────────────────┐
│                            │                 │                                             │
│                            │                 │                                             │
│         Tacet              │  --text-label   │                  Tacet                       │  wordmark
│                            │  tertiary       │                                             │
│                            │                 │             Welcome home.                    │  --text-display
│      Welcome home.         │  --text-display │                                             │  wt 300, tracking-tight
│                            │  wt 300         │   One calm place for your people and the     │  --text-body
│  One calm place for your   │  --text-body    │   things you love. It takes a minute to      │  secondary, reading
│  people and the things     │  secondary      │   make it yours.                             │  measure 42rem
│  you love. It takes a      │                 │                                             │
│  minute to make it yours.  │                 │             [ Make it yours ]                │  Button primary, size lg
│                            │                 │                                             │
│    [ Make it yours ]       │  Button primary │             Skip for now                     │  ghost text button,
│                            │  size lg, full  │                                             │  never a grey trap
│      Skip for now          │  ghost link     │   ● ○ ○ ○                                    │  step dots (·dot·),
│                            │  --text-label   │                                             │  4-step progress
│   ● ○ ○ ○                  │  step dots      └───────────────────────────────────────────┘
└───────────────────────────┘
```

- **Vertical rhythm:** stack gap `--space-6` between wordmark / title / lead / CTA; page padding
  `--space-5`. Content is optically centred, top-weighted slightly (Apple-setup feel).
- **`Skip for now`** is a real, visible button (honest "not now"), never a ghosted trap
  (`sign-up.md`).
- **Progress:** `·dot·`-style step indicator, 4 steps (this flow: Welcome · Identity · World · Today).

---

## 3. Create identity — choose your handle

Name, handle, avatar. The handle resolves into `@you@tacet.social` shown **plainly** — an address,
never explained as a protocol. Validation is calm: available / taken states as quiet inline text,
no red shouting, no "34% complete" meter (`create-identity.md`).

```
PHONE (<768)                                   ── available state (inline, calm) ──
┌───────────────────────────┐                  handle field, on valid + free:
│  ‹‹ back        ● ●○○      │  back + dots     ┌───────────────────────────────────┐
│                            │                  │ @  maya          @tacet.social     │  Field, --text-body
│   Who are you here?        │  --text-title    │ ‹✓› maya@tacet.social is yours     │  --color-positive,
│                            │                  └───────────────────────────────────┘  --text-body-sm
│   ◯ +   Add a photo        │  ◯ avatar,       ── taken state (calm, offers a path) ──
│         (optional)         │  [ + ] upload    ┌───────────────────────────────────┐
│                            │  Button ghost    │ @  maya          @tacet.social     │
│  ┌──────────────────────┐  │                  │ ‹○› maya is taken. Try mayak, or   │  --color-text-secondary
│  │ Your name            │  │  Field           │     maya.reads — both are free.     │  offers, never blocks
│  └──────────────────────┘  │  --text-body     └───────────────────────────────────┘
│                            │
│  ┌──────────────────────┐  │  handle Field    DESKTOP (≥900) — same fields, centred card,
│  │ @ maya  @tacet.social │  │  @ prefix +      reading measure 42rem, avatar left of the
│  └──────────────────────┘  │  suffix pinned   name/handle stack. No protocol copy anywhere.
│  ‹✓› maya@tacet.social     │  --color-positive
│      is yours              │  --text-body-sm  Suffix `@tacet.social` is fixed, muted
│                            │                  (--color-text-tertiary, --text-meta mono).
│  ┌──────────────────────┐  │  bio Field,      The user types only the name part.
│  │ A line about you      │  │  optional,
│  │ (optional)            │  │  --text-body    Below the fields, one quiet true line:
│  └──────────────────────┘  │                  "This is how your people reach you —
│                            │                   here and everywhere on the open web."
│      [ This is me ]        │  Button primary   No word "handle-as-protocol", no @-explainer.
│                            │  size lg, full
│   ● ●○○                    │  step 2 of 4
└───────────────────────────┘
```

- **Handle field:** `@` prefix and `@tacet.social` suffix are chrome, not editable; caret sits in
  the middle segment. Address styled as an address (mono `--text-meta` for the resolved handle line).
- **States:** *available* → `‹✓›` + `--color-positive`; *taken* → `‹○›` + `--color-text-secondary`
  with **suggested free alternatives** (calm, forward). *Checking* → `▁▁▁` shimmer on the status line.
- **Avatar:** `◯ +` opens picker; skippable. Bio optional. Primary CTA is a verb of ownership
  ("This is me"), reflecting `create-identity.md`'s "moving in" feeling.

---

## 4. Bring your world — the migration front door

The key step: it makes Today **populated** before landing. Search a name, or paste an address like
`@friend@mastodon.social`, to find people. Results are **Person Cards** you follow. Protocol never
named; a person's home shows as a *human place*, not a "server".

```
PHONE (<768)                                   DESKTOP (≥900)
┌───────────────────────────┐                 ┌───────────────────────────────────────────┐
│  ‹‹ back        ● ● ●○     │  step 3 of 4    │  ‹‹ back                        ● ● ●○     │
│                            │                 │                                             │
│   Bring your world.        │  --text-title   │   Bring your world.                          │  --text-title
│                            │                 │                                             │
│  The same people, one      │  --text-body    │   Search a name, or paste an address like    │  --text-body
│  home. Search a name, or   │  secondary      │   @friend@mastodon.social, to find your      │  secondary
│  paste an address like     │                 │   people and bring them here.                │
│  @friend@mastodon.social.  │                 │                                             │
│                            │                 │  ┌────────────────────────────────────────┐ │  Search Field
│  ┌──────────────────────┐  │  Search Field   │  │ ‹⌕›  name or @you@home.example        │ │  --text-body,
│  │ ‹⌕› name or @address │  │  --text-body    │  └────────────────────────────────────────┘ │  ‹⌕› leading icon
│  └──────────────────────┘  │  ‹⌕› icon       │                                             │
│                            │                 │  ── found ──────────────────────────────── │  section label
│  ── found ───────────────  │  --text-micro   │  ┌──────────────────────┐ ┌──────────────┐ │  --text-micro overline
│  ┌──────────────────────┐  │  Person Card    │  │ ◯  Ada Chen          │ │ ◯  Jae Park  │ │  Person Card grid
│  │ ◯ Ada Chen           │  │  name:          │  │    @ada@pixelfed     │ │  @jae@mas... │ │  (2-up ≥900),
│  │   @ada@pixelfed.social│  │  --text-       │  │    Photographer.     │ │  Writes about│ │  card padding
│  │   Photographer,       │  │  subheading;    │  │    Lisbon.           │ │  slow food.  │ │  --space-5
│  │   Lisbon.             │  │  handle:        │  │       [ Follow ]     │ │   [ Follow ] │ │
│  │        [ Follow ]     │  │  --text-meta    │  └──────────────────────┘ └──────────────┘ │  Button primary sm
│  └──────────────────────┘  │  mono, tertiary;│  ┌──────────────────────┐ ┌──────────────┐ │
│  ┌──────────────────────┐  │  bio:           │  │ ◯  Ren Oduya  ‹✓›     │ │ ◯  Mira Sol  │ │  ‹✓› = following
│  │ ◯ Jae Park           │  │  --text-body-sm │  │    @ren@writefreely  │ │  @mira@peer..│ │  (Follow → Following,
│  │   @jae@mastodon.social│  │  secondary      │  │    Essays, weekly.   │ │  Films.      │ │   calm swap, no toast)
│  │   Writes slow food.   │  │                 │  │      [ Following ]   │ │   [ Follow ] │ │
│  │        [ Follow ]     │  │  ‹✓› following  │  └──────────────────────┘ └──────────────┘ │
│  └──────────────────────┘  │  swap state     │                                             │
│                            │                 │   Ada and Jae are coming with you. Add more, │  faces coming,
│  Ada and Jae are coming    │  --text-body-sm │   or —                                       │  no tally --text-body-sm
│  with you.                 │  secondary      │             [ Take me home ]                 │  Button primary lg,
│    [ Take me home ]        │  Button primary │                                             │  enabled from 1st follow
│                            │  size lg, full  └───────────────────────────────────────────┘
│   ● ● ●○                   │  step 3 of 4
└───────────────────────────┘

── empty / pre-search state (EmptyState) ──        ── searching (skeleton) ──
┌───────────────────────────┐  EmptyState:         ┌───────────────────────────┐
│   ‹⌕›                       │  quiet glyph        │  ▁▁▁▁▁▁▁▁▁   ◯ ▁▁▁▁▁       │  Person Card
│   Find your people.         │  --text-heading     │  ▁▁▁▁▁▁     ◯ ▁▁▁▁▁▁▁     │  skeletons ▁▁▁
│   Start with one name or    │  --text-body-sm     │  ▁▁▁▁▁▁▁▁                   │  during resolve
│   an address you know.      │  secondary          └───────────────────────────┘
└───────────────────────────┘

── address not found (calm, never a dead end) ──
┌───────────────────────────────────────────────┐
│  ‹○›  We couldn't reach @friend@typo.example.   │  --color-text-secondary, not danger
│       Check the address, or search their name.  │  offers the next move
└───────────────────────────────────────────────┘
```

- **Person Card** is the reused component (People, Discover, Remote Profile). Here it is the
  *follow surface*: `◯` avatar, name `--text-subheading`, address `--text-meta` mono tertiary, one
  bio line `--text-body-sm`, `[ Follow ]` → `[ Following ]` `‹✓›` (calm in-place swap, no red count,
  no toast).
- **A person's home is a human place** ("Lisbon", "Essays, weekly") — never "server" or "instance".
- **`[ Take me home ]`** activates on the first follow, so Today lands populated (≤ 4 steps). Skipping
  is allowed but the copy gently encourages bringing at least one person.

---

## 5. Landing on Today — first populated (the payoff)

The reward: you arrive inside the frozen app frame and Today already holds the people you brought.
Brief — full Today lives in [02-today](./02-today.md). No tour, no confetti; a calm, warm arrival.

```
PHONE (<768) — now inside the frozen frame       DESKTOP (≥900) — rail + feed
┌───────────────────────────┐                 ┌────────┬────────────────────────────┐
│ ‹≡›   Today         ‹⌕› ◯  │  topbar         │ tacet  │  Today                      │  --text-title
├───────────────────────────┤                 │        │  You're home. Here's your   │  --text-body-sm
│  You're home.              │  --text-title   │ ◈ Today│  world, in order.           │  secondary subtitle
│  Here's your world,        │  --text-body-sm │ People │                             │  (count-free)
│  in the order it happened. │  secondary      │ Discvr ├─────────────────────────────┤
├───────────────────────────┤                 │ Convos │  ◯ Ada Chen    ·9:14         │  Content Card,
│  ◯ Ada Chen      ·9:14·    │  Content Card   │ Me     │  @ada@pixelfed.social        │  handle --text-meta
│  @ada@pixelfed.social      │  handle mono    │        │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │  ▓ media
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │  ▓ media        │        │  Morning light, Lisbon.      │  --text-body (sacred)
│  Morning light, Lisbon.    │  --text-body    │  ⊕     │  ‹reply›  ‹share›  ‹spark save›         │  calm actions
│  ‹reply› ‹share› ‹spark save›        │  quiet actions  │ ◯ you  ├─────────────────────────────┤
├───────────────────────────┤                 │        │  ◯ Ren Oduya   ·yesterday    │  Content Card
│  ◯ Ren Oduya    ·yest.·    │  Content Card   │        │  @ren@writefreely.social     │
│  @ren@writefreely.social   │                 │        │  On paying attention →        │  article lead
│  On paying attention →     │  article lead   │        │                             │
├───────────────────────────┤                 │        ├─────────────────────────────┤
│      ‹◇›  That's today.    │  end-state,     │        │    ‹◇›  That's today.        │  bounded-digest
│   You're all caught up.    │  --text-body    │        │   You're all caught up.      │  end-state, no
├───────────────────────────┤                 │        │                             │  infinite scroll
│  ◈    ◯    ⊕    ◇    ◯    │  tabbar          └────────┴─────────────────────────────┘
│ Today People (⊕) Disc  Me  │                  Context column: "Continue where you
└───────────────────────────┘                  left off" — empty on first arrival.
```

- **First moment names the win:** "You're home" / "Here's your world, in order" — the order is
  time, nothing reordered it (`voice-and-tone.md`). The people from step 4 populate the feed.
- **Today is bounded:** it ends with a calm end-state (`‹◇› That's today.`), not an infinite scroll —
  the digest concludes, the payoff is *finishing*, not *feeding*.
- **Presence** is `·dot·` beside Conversations only; no red counts, no Notifications surface
  (IA §5). Compose is the calm `⊕` FAB / rail button, never a glowing orb.
- Context column is honestly **empty** on first arrival (Context Column Law): nothing to continue yet.
