# People & Profiles — Wireframes (Stage 4)

> **Milestone:** Visual System V2 · **Stage:** 4 · **Fidelity: GREY.** Structural, not beautiful.
> Reads with [00-overview.md](./00-overview.md) (conventions, the frozen frame, glyph legend), traces
> to the [IA](../information-architecture.md) (People context = focused person quick card + *people
> you both know*; Remote Profile context = *about this person* + mutuals), and obeys the
> [profile system](../profile-system.md): identity-forward **living space**, **no public vanity
> counts**, relationship context instead, and source shown as a **human place** (the V1
> `SourceBadge · Mastodon` suffix is retired). Components: Person Card, Content Card, Tabs, Badge,
> SegmentedControl, Button, EmptyState, Toast — see [components.md](./components.md).

Glyph legend (from overview): `◯` avatar · `▓` banner/media · `[ Button ]` · `( pill )` segment/chip
· `‹icon›` · `·dot·` quiet presence · `···` truncation. **No colour is implied.**

---

## 1. People — phone (faces-first list)

The relationship layer, not a leaderboard. Each row is a **Person Card (Row variant)**: a face, a
name (loudest), the full honest handle, and one human line. A calm segmented filter *you* shape —
never engagement-ranked. Search is an affordance, not a destination.

```
┌───────────────────────────────┐
│ ‹≡›   People            ‹⌕› ◯  │  topbar (frozen frame). ‹⌕› opens Search overlay.
├───────────────────────────────┤
│ People                        │  SectionHeading · --text-heading · weight 500
│ Keep the people you came for   │  subtitle · --text-body-sm · --color-text-secondary
│ close.                        │
│                               │
│ ( All )( Close )( Brands )(AI) │  SegmentedControl · neutral, NEVER accent (L3)
│  └ thumb on "All"             │  thumb slides --dur-2; you shape closeness, not an algorithm
│                               │
│ ┌───────────────────────────┐ │  Person Card · Row · padding --space-4 (compact)
│ │ ◯  Ana Solheim            │ │  name --text-subheading, --color-text-primary (loudest)
│ │md  @ana@social.coop       │ │  handle --text-meta mono --color-text-tertiary (full/honest)
│ │    Lives at social.coop   │ │  home line = human PLACE, no "· Mastodon" suffix (retired)
│ │    "Slow photos of Oslo." │ │  one human line · --text-body-sm · truncates
│ │              ( Following ✓)│ │  relationship control · secondary+check · the card's one pill
│ └───────────────────────────┘ │  whole-card tap → Remote Profile; pill is a separate target
│ ┌───────────────────────────┐ │
│ │ ◯  Devi Rao   following you│ │  "following you" = quiet label in home line, NOT a button
│ │    Lives at indieweb.social│ │
│ │    Writing about quiet UIs.│ │
│ │              ( Following ✓)│ │
│ └───────────────────────────┘ │
│ ┌───────────────────────────┐ │
│ │ ◯  Studio Møs     ( Follow)│ │  not-following → Follow · primary --color-accent (one accent)
│ │    Lives at pixel.town     │ │  a brand is "simply a person" (people.md) — same anatomy
│ │    Objects, light, wood.   │ │
│ └───────────────────────────┘ │
│              ···              │  more rows on scroll — cards separated by --space-4, never flush
└───────────────────────────────┘
```
**Annotations.** No follower/following/post tallies anywhere (rejecting *"432 Posts · 1.2K
Followers"*). Relationship is the only status shown: **Following ✓** / **Follow** / *following you*.
Presence, if ever shown, is `·dot·` weight — never a red count. Cards use **hairline OR elevation**,
not both (L1).

---

## 2. People — wide (three-column)

The context column obeys the [Context Column Law](../responsive.md): it holds the **focused person's
quick card + *people you both know***, or it is empty. It is never a dashboard of tallies.

```
┌────────┬───────────────────────────────┬──────────────────────┐
│ tacet  │  People                       │  Context             │  context 320px
│        │  Keep them close.             │                      │
│ ◈ Today│                               │  ── Focused person ──│  ← the row under focus
│▸People │ ( All )( Close )( Brands )(AI) │  ┌────────────────┐  │
│ Discvr │                               │  │   ▓▓▓ banner   │  │  quick card = mini
│ Convos │ ┌───────────────────────────┐ │  │  ◯ Ana Solheim │  │  Person Card (Full)
│ Me     │ │◯ Ana Solheim   (Following✓)│▸│  │  @ana@social..  │  │  ◯ lg 64
│        │ │  @ana@social.coop         │ │  │  Lives at       │  │  home = human place
│        │ │  Lives at social.coop     │ │  │  social.coop    │  │
│        │ │  "Slow photos of Oslo."   │ │  │  Joined 2023    │  │  orientation, not metric
│        │ └───────────────────────────┘ │  │  ( Following ✓ )│  │
│        │ ┌───────────────────────────┐ │  └────────────────┘  │
│        │ │◯ Devi Rao      (Following✓)│ │  People you both know│  SectionHeading
│        │ │  following you            │ │  ◯◯◯  overlap        │  --overlap-avatar cluster
│        │ │  Lives at indieweb.social │ │  "Devi, Jonah and 3  │  human line, not a score
│        │ └───────────────────────────┘ │   others you follow" │
│        │ ┌───────────────────────────┐ │                      │
│ ── ─── │ │◯ Studio Møs       ( Follow)│ │  (empty when no row  │  Law: empty > filler
│ ⊕ New  │ └───────────────────────────┘ │   is focused)        │
│ ◯ you  │            ···                │                      │
└────────┴───────────────────────────────┴──────────────────────┘
  rail 250px      list (faces-first)          context (contextual only)
```
**Annotations.** Reading measure stays fixed; extra width becomes context, then quiet margin. The
"both know" cluster is **shared world**, not a number. Rail `⊕ New` = calm compose affordance;
workspace `◯ you` sits at rail bottom. Selecting a row focuses it into the context column.

---

## 3. Remote Profile — phone (identity-forward)

Arriving at *where someone lives*. Same identity-forward header as your own profile (one shared
component) so *you* and *them* are visibly one product. **No scoreboard row** — relationship context
instead. One accent action per view: **Follow**.

```
┌───────────────────────────────┐
│ ‹‹ Back                       │  back to where you came from
├───────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  Banner · --ratio-banner (3/1) · --radius-lg on card
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  optional — a home without one is still a home
│   ◯◯◯                         │  Avatar overlaps banner · --radius-full
│  (◯◯◯) ring --color-hairline  │  ring for separation (accent ring only marks "this is you")
│                               │
│  Ana Solheim                  │  Name · --text-title · weight 500 · --tracking-tight
│  @ana@social.coop             │  Handle · --text-meta MONO · --color-text-secondary
│  Lives at social.coop         │  Home = human PLACE (§5) · NO "· Mastodon" suffix (retired)
│  ( following you )            │  relationship chip · --text-micro · --color-accent-subtle
│                               │
│  Slow photos of Oslo mornings.│  Human bio · --text-body · --leading-relaxed (the voice)
│  Coffee, fog, and film.       │
│  ‹link› solheim.photo         │  link/fields · quiet row · link text --color-accent
│  Joined March 2023            │  orientation, not a metric
│                               │
│         [   Follow   ]        │  Button · primary · --color-accent · the ONE accent action
│      ‹reply› Reply  ‹share›   │  secondary human verbs · ghost
│                               │
├── Posts ──── Media ── About ──┤  Tabs component · active "Posts" --border-strong accent underline
│                               │  underline slides --dur-2; role=tablist, arrow-key nav
│ ┌───────────────────────────┐ │  Content Card (Photo) — a "moment", never "post"/"Entry"
│ │ ◯ Ana Solheim  ‹more›     │ │  inline attribution = human place
│ │ 2 days ago                │ │  meta · --text-meta mono (chronology, never ranked)
│ │ ▓▓▓ Photo ▓▓▓             │ │  media full column · --radius-md · alt required
│ │ Morning fog over the fjord│ │  body · --text-body
│ │ ‹reply› ‹share› ‹save›    │ │  affordance row — Reply · Share · Save ONLY
│ └───────────────────────────┘ │  NO like tally, comment count, boost count, view counter
│ ┌───────────────────────────┐ │
│ │ ◯ Ana · 5 days ago  ‹more›│ │  next moment
│ │ (Thought) A quiet morning…│ │  Badge · neutral · media type label ("Thought")
│ └───────────────────────────┘ │
│            ···                │
└───────────────────────────────┘
```
**Annotations.** Follow / Reply / Share are human verbs (L9). About tab holds bio + quiet fact rows
incl. the **Home** place row (value = the place, no protocol suffix). Media tab = editorial gallery,
not a thumbnail wall. Nothing here is a score to perform for.

---

## 4. Remote Profile — wide (with context column)

```
┌────────┬───────────────────────────────┬──────────────────────┐
│ tacet  │ ‹‹ Back                       │  Context             │
│        │ ▓▓▓▓▓▓▓▓▓▓ banner ▓▓▓▓▓▓▓▓▓▓ │  About this person   │  SectionHeading
│ ◈ Today│   ◯ Ana Solheim               │  Slow photos of Oslo │  bio echo · --text-body-sm
│▸People │   @ana@social.coop            │  mornings.           │
│ Discvr │   Lives at social.coop        │                      │
│ Convos │   ( following you )           │  Where they post from│  humane label
│ Me     │   Slow photos of Oslo…        │  ‹place› social.coop │  a home/PLACE, not a server
│        │   ‹link› solheim.photo        │  (no "instance",     │  NEVER server/instance/
│        │   [ Follow ] ‹reply› ‹share›  │   never "Mastodon")  │  federation/software terms
│        │                               │                      │
│        │ ── Posts ── Media ── About ── │  People you both     │  SectionHeading
│        │ ┌───────────────────────────┐ │  follow              │
│        │ │ ◯ Ana · 2 days ago        │ │  ◯◯◯  overlap        │  --overlap-avatar cluster
│        │ │ ▓▓▓ Photo ▓▓▓             │ │  "Devi, Jonah and 3  │  shared world · human line
│ ── ─── │ │ ‹reply› ‹share› ‹save›    │ │   others you follow" │  NOT a mutuals count
│ ⊕ New  │ └───────────────────────────┘ │                      │
│ ◯ you  │            ···                │  ‹link› View original│  visiting THEIR place, browser
└────────┴───────────────────────────────┴──────────────────────┘
   rail 250px    reading measure fixed 42rem      context 320px
```
**Annotations.** Context column exists to help you **understand someone before you follow** (IA §3).
Its three quiet blocks — *about · where they post from (human place) · people you both follow* — are
orientation, never a tally. "View original" opens their home in the browser, phrased as a visit.

---

## 5. Public Profile — your own ("View as public")

Reached deliberately from **Me → View as public**. Rendered by the **same header + tabs** as a remote
profile, so what you show the world is honestly previewed. The difference from **Me**: this is the
*doorway view* — public-facing content only, no private tools, no saved/notes/history, no counts.

```
┌───────────────────────────────┐
│ ‹‹ Back to Me                 │
├───────────────────────────────┤
│ ·dot· This is your public     │  Inline hint (calm, not a nag) · --text-body-sm
│ face — what visitors see.     │  presence dot ·dot·, never red
│                    [ Edit ]   │  Edit → returns you to Me (private tools live there)
├───────────────────────────────┤
│ ▓▓▓▓▓▓▓▓ your banner ▓▓▓▓▓▓▓▓ │  same identity-forward header component
│   (◯) ring --color-accent     │  accent ring HERE = "this is you" (the one place accent ring earns)
│  Renato Gusani                │  Name · --text-title
│  @renato@tacet.social         │  Handle · mono
│  Lives at tacet.social        │  your own home place
│  Joined 2024                  │
│  Building calmer software.    │  bio · --text-body
│  ‹link› vnta.xyz              │
│                               │
│  (no Follow button — it's you)│  as owner previewing: no Follow; an Edit affordance instead
├── Posts ──── Media ── About ──┤  same Tabs
│ ┌───────────────────────────┐ │
│ │  ‹compose›                │ │  honest placeholder until publishing ships
│ │  Your posts will appear   │ │  EmptyState · --text-subheading --color-text-secondary
│ │  here.                    │ │
│ │  When you publish, what   │ │  quiet factual body · ≤28rem measure
│ │  you share shows here.    │ │
│ └───────────────────────────┘ │
│      [ Edit your identity ]   │  secondary Button → Me
└───────────────────────────────┘
```
**Difference from Me (annotate).** Me is *walking into your own home*: editable identity in place,
your **owned** Entries **and** your **kept** Moments, plus **private** counts as context ("3 drafts",
"42 saved"). This Public Profile shows **only what a visitor sees** — published work and public
fields — and enforces it (V1 `PublicPreview` already strips saved/notes/history/counts). Saved/kept
state and private counts never render here.

---

## 6. Follow flow (calm confirmation micro-state)

Tap a person **anywhere** (People row, a Content Card's inline attribution, Discover) → **Remote
Profile** → **Follow** → a quiet positive confirmation → they join **People**. Protocol never named.
Following is reversible; unfollowing is quiet and carries no drama.

```
  [A] tap a person anywhere        [B] Remote Profile          [C] press Follow
  ┌─────────────────────┐         ┌──────────────────┐         ┌──────────────────┐
  │ ◯ Ana Solheim  ‹›   │  tap →  │ ▓ banner ▓       │  press  │ ▓ banner ▓       │
  │   @ana@social.coop  │  card,  │  ◯ Ana Solheim   │  ─────► │  ◯ Ana Solheim   │
  │           ( Follow )│  or the │  @ana@social.coop │  Follow │  @ana@social.coop │
  └─────────────────────┘  Follow │  ( following you )│         │  ·  ·  ·          │  button holds width,
                           target │  [   Follow   ]   │         │  [ ▁▁ Following ] │  quiet inline dot
                                  └──────────────────┘         └──────────────────┘  (Button loading, no shimmer)

  [D] confirmation micro-state              [E] they're in People now
  ┌────────────────────────────┐            ┌───────────────────────────────┐
  │ ▓ banner ▓                 │            │ People                        │
  │  ◯ Ana Solheim             │            │ ( All )( Close )( Brands )(AI) │
  │  [  Following ✓  ]         │  settles → │ ┌───────────────────────────┐ │
  │                            │            │ │ ◯ Ana Solheim (Following✓)│ │  ← newly joined,
  │  ┌──────────────────────┐  │            │ │   Lives at social.coop    │ │    at the top
  │  │ ✓ Following Ana      │  │  Toast     │ │   "Slow photos of Oslo."  │ │
  │  └──────────────────────┘  │  --color-  │ └───────────────────────────┘ │
  └────────────────────────────┘  positive  │            ···                │
     Toast · --elevation-2         ~4s,      └───────────────────────────────┘
     role=status aria-live=polite  no reward-animation, no streak, no confetti
```
**Annotations.** The positive signal is **quiet acknowledgement, not celebration** (L6): a `check`
Toast in `--color-positive`, honest and brief. Button transitions **Follow → Following ✓** in place;
hover on **Following** later reveals **Unfollow** (calm, reversible). No "You gained a connection!"
theatre. "Follows you" (if mutual-inbound) shows as the quiet chip, never a tally increment.

---

## 7. People — empty (welcoming EmptyState)

The first-run relationship layer. A calm invitation — *bring your world* — never a nag, never a
"grow your following" pitch. This is the migration front door.

```
┌───────────────────────────────┐
│ ‹≡›   People           ‹⌕› ◯   │
├───────────────────────────────┤
│                               │
│                               │
│            ‹people›           │  EmptyState icon · --icon-lg 28px
│                               │
│      Bring your world.        │  title · --text-subheading · --color-text-secondary
│                               │
│   The people you already      │  body · --text-body-sm · ≤28rem measure · a calm fact
│   follow across the open web  │  (people.md: keep relationships warm, not grow a number)
│   can come with you. Search a  │
│   name, or paste where someone │
│   already lives.              │
│                               │
│   [ Search for people ]       │  primary Button → Search overlay (the ONE accent action)
│   [ Paste an address ]        │  secondary Button → import/lookup by @handle@place
│                               │
│   ·  Following is calm and    │  quiet reassurance line · --text-meta
│      always reversible.       │
└───────────────────────────────┘
```
**Annotations.** Welcoming, not empty-scary. Two doors: **search a name** (find people on the open
web via Discover) and **paste an address** (`@you@place` — the protocol stays invisible, exactly like
email). One accent action (L3). No follower goals, no suggested-to-grow-reach lists, no counts.

---

*Cross-links:* [00-overview.md](./00-overview.md) · [information-architecture.md](../information-architecture.md)
· [profile-system.md](../profile-system.md) · [components.md](./components.md) ·
[../01-product/people.md](../01-product/people.md) · [responsive.md](../responsive.md).
