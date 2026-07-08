# Compose & Publishing — Wireframes (Stage 4)

> **Fidelity: GREY.** Structural only — layout, hierarchy, flow. No colour, no real type,
> no final spacing (those come in Stage 6). Read [00-overview.md](./00-overview.md) for the
> conventions used here (`▓` media, `◯` avatar, `[ Button ]`, `( pill )`, `‹icon›`, `·dot·`,
> `▁▁▁` skeleton). Every frame traces to [publishing-ui.md](../publishing-ui.md) and
> [publishing-philosophy.md](../09-product/publishing-philosophy.md), obeys the Context Column
> Law, and spends components from [components.md](../components.md).
>
> **The one truth these screens carry:** you make something, it is yours, and sharing is a
> separate deliberate act. Creation ≠ distribution. Private work is *complete*, never a draft.
> The words **Entry · post · server · federation · protocol · draft · degrade** never appear
> on any surface below — only human kinds (Thought/Photo/Article/Video/Event) and human verbs
> (Keep · Share · Update · Retract · Delete).

---

## 1. Compose chooser — "what are you making?"

Invoked from the calm compose affordance: the `⊕` **FAB** on mobile (`--fab-size` 56px, above
the tab bar, `plus` glyph only — *not* a glowing orb), or the **New** rail button on desktop
(inside the 250px rail, `plus` + label, belongs to the rail like any destination). It opens a
**sheet** on mobile (`--radius-xl` top corners, `--elevation-3`, scrim at `--alpha-scrim`,
spring-in `--dur-3`/`--ease-out`) or a centred **modal** on desktop (capped at `--measure-reading`
42rem). The first thing shown is **intent, never destination** — five legible rows, real words +
glyph, progressive disclosure, never a dense grid.

```
MOBILE — sheet rising from bottom edge          DESKTOP — centred modal (≤ 42rem)
              (scrim above)                            (scrim behind whole app)
┌───────────────────────────────────┐          ┌──────────────────────────────────────┐
│           ▁▁ grabber ▁▁            │ ‹radius  │  What would you like to make?   ‹✕›  │ ‹title
│                                   │  -xl     │                                      │  --text-
│  What would you like to make?     │ ‹--text- ├──────────────────────────────────────┤  heading
│                                   │  heading │                                      │
├───────────────────────────────────┤          │  ‹✍›  Thought                     ›  │ ‹row =
│  ‹✍›  Thought                  ›  │ ‹calm    │        A quick word to your people    │  Menu
│        A quick word               │  tappable│                                      │  item,
├───────────────────────────────────┤  rows,   │  ‹▤›  Photo                       ›  │  --text-
│  ‹▤›  Photo                    ›  │  not a   │        One image or a set            │  label +
│        One image or a set         │  grid    │                                      │  --text-
├───────────────────────────────────┤          │  ‹¶›  Article                     ›  │  meta
│  ‹¶›  Article                  ›  │  L3 —    │        Writing with room to breathe  │  sub
├───────────────────────────────────┤  legible │                                      │
│  ‹▷›  Video                    ›  │  choice  │  ‹▷›  Video                       ›  │
│        Moving image               │          │        A clip, titled                │
├───────────────────────────────────┤          │                                      │
│  ‹◷›  Event                    ›  │          │  ‹◷›  Event                       ›  │
│        A time and a place         │          │        A time and a place            │
└───────────────────────────────────┘          └──────────────────────────────────────┘
```

- **A11y:** `role="dialog"` `aria-modal="true"` `aria-label="Compose"`; focus moves into the
  sheet on open and is **trapped**; `Escape` closes; on close focus returns to the FAB / New button.
- Each row is a real semantic control (icon + **word**, never icon alone — L9). Tapping a row
  *becomes* that kind's composer in place (progressive disclosure). The chosen kind is always
  visible in the composer header and changeable before the first keystroke.
- No "advanced" drawer, no twelfth type. Five, chosen well.

---

## 2. Thought composer — text-first

The whole surface is one generous text area (`--text-body`/`--leading-relaxed` — the reading
voice). Shared chassis: close · kind title · primary action (header); author row; distribution
footer. Primary action reads **Keep** while Private — never "Post".

```
┌───────────────────────────────────────────────┐
│ ‹✕›   Thought                     [ Keep ]     │ ‹header: close IconButton (aria "Close
│                                   ‹secondary   │  composer") · kind name --text-heading ·
├───────────────────────────────────────────────┤  primary = Keep while Private (§7)
│ ◯ Renato  ‹⌄›                                  │ ‹author row = workspace switcher (§7);
├───────────────────────────────────────────────┤  avatar + name + chevron. Calm switch.
│                                               │
│  Say something to your people…                │ ‹placeholder --color-text-tertiary,
│                                               │  borderless area on --color-surface-raised
│  ▏                                            │  (the page, not a box). No char-count.
│                                               │
│                                               │
├───────────────────────────────────────────────┤
│ ‹▤ Add photo›                                 │ ‹media is secondary here — words lead.
│                                               │  IconButton carries aria-label.
├───────────────────────────────────────────────┤
│ Visibility  ( Private ) ( Shared ) ( Sched )  │ ‹distribution footer, SegmentedControl §7;
│ ‹✓› Private — stays at your home.             │  Private is default + resting. Honest line
└───────────────────────────────────────────────┘  --text-meta. NOT "draft".
```

- No title, no ceremony. `--color-positive` marks Private as *complete work kept*, never greyed.
- `Escape` closes; unsaved-work guard fires **only** if there is genuinely unsaved text (Tacet
  keeps your work, so this is rare).

---

## 3. Photo composer — media-first

The media well leads at the top of the body (`--radius-md`, `--ratio-photo` 3/2 default; a single
tall image may use `--ratio-portrait` 4/5; a set tiles at `--ratio-square`). Blur-up on load
(`--dur-4`). Below: a caption field, and a **mandatory alt-text** field per image (L10).

```
┌───────────────────────────────────────────────┐
│ ‹✕›   Photo                       [ Keep ]     │
├───────────────────────────────────────────────┤
│ ◯ Renato  ‹⌄›                                  │ ‹author row (workspace)
├───────────────────────────────────────────────┤
│  ┌───────────────┐ ┌───────────────┐          │ ‹media well leads. Multi-image tiles
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│          │  share one outer --radius-lg; each tile
│  │▓▓▓  ‹✕›  ▓▓▓▓▓│ │▓▓▓  ‹✕›  ▓▓▓▓▓│          │  --radius-md. ‹✕› removes a tile.
│  └───────────────┘ └───────────────┘          │  Ratio per media-system §2–3.
│  [ ‹＋› Add another image ]                    │ ‹secondary button
├───────────────────────────────────────────────┤
│ Describe for screen readers (image 1)         │ ‹alt-text field — REQUIRED per image (L10).
│ ┌───────────────────────────────────────────┐ │  Missing alt is flagged in authoring, never
│ │ A quiet street at dusk…                   │ │  shipped blank. --text-body-sm, sunken well.
│ └───────────────────────────────────────────┘ │
│ Caption (optional)                            │
│ ┌───────────────────────────────────────────┐ │ ‹caption --text-body-sm, supports the image
│ │ …                                         │ │  which is the subject.
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ Visibility  ( Private ) ( Shared ) ( Sched )  │ ‹distribution footer (§7)
│ ‹✓› Private — stays at your home.             │
└───────────────────────────────────────────────┘
```

- Alt-text is the accessibility floor, not a tier: every image (and, in §5, the poster) carries it.
- Media loads calm — reserved frame, blur-up, never a spinner (media-system §5).

---

## 4. Article composer — long-form reading composer

A **title** field (`--text-title`), then a long-form body constrained to `--measure-reading`
(42rem, ~66–72 chars) at `--text-body`/`--leading-relaxed`. Writing happens at the same measure
the piece will be read at — writing and reading are one continuous surface. The surface may grow
to a comfortable height.

```
┌──────────────────────────────────────────────────────────────┐
│ ‹✕›   Article                                   [ Keep ]      │ ‹chassis header
├──────────────────────────────────────────────────────────────┤
│ ◯ Renato  ‹⌄›                                                 │ ‹author row (workspace)
├──────────────────────────────────────────────────────────────┤
│        ┌────────────────────────────────────────────┐        │ ‹body constrained to
│        │  Give it a title                           │        │  --measure-reading (42rem);
│        │  ‹--text-title placeholder›                 │        │  extra width is quiet margin,
│        └────────────────────────────────────────────┘        │  NOT wide lines.
│        ┌────────────────────────────────────────────┐        │
│        │  Start writing…                            │        │ ‹body --text-body /
│        │                                            │        │  --leading-relaxed — the
│        │  ▏                                         │        │  sacred reading voice.
│        │                                            │        │  Room to breathe.
│        │                                            │        │
│        │                                            │        │
│        └────────────────────────────────────────────┘        │
├──────────────────────────────────────────────────────────────┤
│ Visibility  ( Private ) ( Shared ) ( Scheduled )             │ ‹distribution footer (§7).
│ ‹✓› Private — stays at your home until you choose to share.   │  When Shared, honesty about
└──────────────────────────────────────────────────────────────┘  faithful representation (§7).
```

- Title placeholder: *"Give it a title"*. A private Article is a finished, dignified piece — a
  shelf item, never a "failed post".

---

## 5. Video composer — poster + video, no autoplay

A media well at `--ratio-video` (16/9), a **title** (`--text-subheading`), a description
(`--text-body-sm`). Video **never autoplays** in the composer — a static poster with a `play`
affordance stands in until asked (media-system §7).

```
┌───────────────────────────────────────────────┐
│ ‹✕›   Video                       [ Keep ]     │
├───────────────────────────────────────────────┤
│ ◯ Renato  ‹⌄›                                  │ ‹author row (workspace)
├───────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐ │ ‹poster at --ratio-video 16/9. Play
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │  disc = ‹▷› in --on-media over
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ‹▷›  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  2:14  │ │  --scrim-media. Duration whispered
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │  bottom-right. NO autoplay, no
│  └───────────────────────────────────────────┘ │  hover-to-play.
│  [ ‹＋› Replace video ]                        │
├───────────────────────────────────────────────┤
│ Title                                         │ ‹--text-subheading field
│ ┌───────────────────────────────────────────┐ │
│ │ …                                         │ │
│ └───────────────────────────────────────────┘ │
│ Describe for screen readers (poster)          │ ‹alt-text on the poster (L10)
│ ┌───────────────────────────────────────────┐ │
│ │ …                                         │ │
│ └───────────────────────────────────────────┘ │
│ Description (optional)                        │ ‹--text-body-sm
│ ┌───────────────────────────────────────────┐ │
│ │ …                                         │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ Visibility  ( Private ) ( Shared ) ( Sched )  │ ‹distribution footer (§7)
│ ‹✓› Private — stays at your home.             │
└───────────────────────────────────────────────┘
```

---

## 6. Event composer — when & where

Structured but calm. **Title**, **When** (date/time), **Where** (place or link), optional
description (`--text-body-sm`). When/where lead — an Event is a happening. Real semantic inputs
spaced at `--space-5`, hierarchy from type and whitespace, never a cramped form (L1).

```
┌───────────────────────────────────────────────┐
│ ‹✕›   Event                       [ Keep ]     │
├───────────────────────────────────────────────┤
│ ◯ Renato  ‹⌄›                                  │ ‹author row (workspace)
├───────────────────────────────────────────────┤
│ Title                                         │
│ ┌───────────────────────────────────────────┐ │
│ │ …                                         │ │
│ └───────────────────────────────────────────┘ │
│                                               │ ‹generous --space-5 between fields
│ When            ‹◷›                            │ ‹the emphasis — time leads
│ ┌─────────────────────┐ ┌───────────────────┐ │
│ │ Fri 8 Aug 2026      │ │ 19:00             │ │ ‹date · time inputs
│ └─────────────────────┘ └───────────────────┘ │
│                                               │
│ Where           ‹⌖›                            │ ‹place or link
│ ┌───────────────────────────────────────────┐ │
│ │ Add a place or a link.                    │ │ ‹placeholder
│ └───────────────────────────────────────────┘ │
│                                               │
│ Description (optional)                        │ ‹--text-body-sm, supports the happening
│ ┌───────────────────────────────────────────┐ │
│ │ …                                         │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ Visibility  ( Private ) ( Shared ) ( Sched )  │ ‹distribution footer (§7)
│ ‹✓› Private — stays at your home.             │
└───────────────────────────────────────────────┘
```

---

## 7. Distribution controls — Private ↔ Shared ↔ Scheduled

There is **no** "Publish" toggle and **no** "Draft" switch — only **distribution state**, a calm
`SegmentedControl` (neutral track, never `--color-accent`; word + glyph, never hue alone). Moving
from Private toward Shared is the moment creation becomes distribution — a **deliberate act**, so
the primary button *changes verb* (**Keep** → **Share**). Audience + destinations appear **only**
once Shared is chosen (progressive disclosure — a private note never sees them).

```
STATE A — Private (default, resting)         STATE B — Shared (reveals audience + destinations)
┌───────────────────────────────────────┐   ┌───────────────────────────────────────────────┐
│ Author                                │   │ Author                                        │
│ ┌───────────────────────────────────┐ │   │ ┌───────────────────────────────────────────┐ │
│ │ ◯ Renato          ‹⌄›  Change     │ │   │ │ ◯ VNTA            ‹⌄›  Change              │ │ ‹workspace = author.
│ └───────────────────────────────────┘ │   │ └───────────────────────────────────────────┘ │  Calm switch of
│  ‹switch identity — not a re-login›   │   │  ‹switching changes destinations below›       │  identity, NOT a
├───────────────────────────────────────┤   ├───────────────────────────────────────────────┤  re-login. Never an
│ Visibility                            │   │ Visibility                                    │  ambient "current
│ ( ‹✓ Private ) ( Shared ) ( Sched )   │   │ ( Private ) ( ‹✓ Shared ) ( Scheduled )       │  user".
│                                       │   │                                               │
│ ‹✓› Private — this stays at your home │   │ Who can see this                              │ ‹AUDIENCE — human
│     until you choose to share it.     │   │ ┌───────────────────────────────────────────┐ │  words, plain
│  ‹--color-positive quiet mark. This   │   │ │ The open web                        ‹⌄›   │ │  selector. Never a
│   is complete work, not a draft.›     │   │ └───────────────────────────────────────────┘ │  growth lever, never
├───────────────────────────────────────┤   │  ‹never nudged wider›                         │  nudged wider.
│               [ Keep ]                │   │                                               │
│  ‹primary VERB = Keep while Private›  │   │ Where it goes                                 │ ‹DESTINATIONS —
└───────────────────────────────────────┘   │ ┌───────────────────────────────────────────┐ │  human "wheres",
   Keep/pin acknowledgement (§ micro):       │ │ ‹✓ The open social web                     │ │  NEVER a protocol.
   glyph fills toward --color-positive,       │ │ ‹✓ Your Mastodon home                      │ │  Word + check.
   the ‹✦ spark› settles once — confirmation, │ └───────────────────────────────────────────┘ │
   not celebration; --dur-2 / --ease-out.     │ ( ‹🌐› Shares to the open web )                │ ‹Badge tone=open —
   Reduced-motion: lands instantly.           │                                               │  states the truth
                                             │ Long pieces are shown in full at your home;    │  plainly.
                                             │ open networks get a faithful preview that      │ ‹faithful
                                             │ links back.  ‹--text-body-sm, honest›          │  representation,
                                             ├───────────────────────────────────────────────┤  never "degrade" /
                                             │              [ Share ]                        │  "lost".
                                             │  ‹primary VERB changes: Keep → Share›         │
                                             └───────────────────────────────────────────────┘  ‹Scheduled: first-
                                                                                                 class option, adds
                                                                                                 a when-picker; not
                                                                                                 a hidden setting.›
```

- **Honesty about the open web** is body copy (`--text-body-sm`), not fine print. Sharing goes to
  the open social web — Mastodon, Pixelfed, PeerTube et al — never to closed walls; the UI never
  implies cross-posting to platforms that don't open.
- The workspace switcher shows *who is making this* at all times. Switching changes author,
  available destinations, and the public face — no silent cross-identity sharing.

---

## 8. Retract vs Delete — two distinct, honest actions

Both live on a shared item's overflow (`more`) menu, **visually separated**, **never the same
word, never the same button**. Each carries plain-language consequence copy — calm, no
confirm-shaming, but truthful. **Retract** is neutral (unsharing is ordinary). **Delete** uses
`--color-danger` (genuinely destructive).

```
OVERFLOW MENU on a shared item          RETRACT confirm (neutral — a Modal §10)
┌─────────────────────────────┐         ┌───────────────────────────────────────────────┐
│ ‹✎›  Edit                    │         │  Retract from the open web?                   │ ‹--text-heading
│ ‹↻›  Update the shared copy  │         │                                               │
│ ─────────────────────────── │         │  Your Thought stays here at your home — you're │ ‹body copy,
│ ‹⤺›  Retract from the web    │ ‹neutral│  only unsharing the copy that went out.        │  --text-body-sm.
│ ‹🗑›  Delete                  │ ‹DANGER │                                               │  NOT fine print.
└─────────────────────────────┘  item,   │  Once something has been on the open web we    │
   ‹two separate items, spaced,  sits    │  request its removal, but other servers may    │ ‹honesty:
    never conflated; danger item apart›  │  have kept a cached copy. We can't guarantee   │  requested, not
                                         │  it's gone everywhere.                         │  guaranteed.
                                         │                                               │
                                         │            [ Keep sharing ]  [ Retract ]      │ ‹Retract = neutral
                                         └───────────────────────────────────────────────┘  action, not red.
                                                                                            Original untouched.

DELETE confirm (danger — a Modal §10)
┌───────────────────────────────────────────────┐
│  Delete this Article?                          │ ‹--text-heading. --color-danger reserved
│                                                │  for genuinely destructive act.
│  This removes the original from your home for  │ ‹plain consequence: this is your only
│  good — this is your only copy.                │  copy. No confirm-shaming, but truthful.
│                                                │
│  It's currently shared in 2 places; we'll ask  │ ‹Delete OFFERS to retract every copy
│  those to remove their copies too, though      │  first — never silently orphans copies.
│  cached copies elsewhere may remain.           │ ‹honesty: cached copies may persist.
│                                                │
│              [ Cancel ]   [ Delete everywhere ]│ ‹danger button sits apart from Cancel.
└───────────────────────────────────────────────┘  Retract ≠ Delete, never the same word.
```

- **Never conflate:** Retract keeps the original at Home; Delete removes the original itself.
- **Never mislead:** Retract never implies the original is gone; Delete never silently leaves
  distributed copies live without saying so.
- Both dialogs are real `role="dialog"` `aria-modal`, focus-trapped, labelled by title; danger
  is carried by **word + glyph**, never hue alone (L10).

---

## Micro-interaction — Keep / pin acknowledgement (applies to §2–7)

When work is saved to Home the glyph fills toward `--color-positive` and the `spark` (`✦`) settles
in with one small scale-and-fade — **confirmation, not celebration** (`--dur-2`/`--ease-out`; no
burst, no toast demanding a tap). Under `prefers-reduced-motion` the state lands instantly (glyph
turns `--color-positive`, spark appears without the scale). Because saving is **not** sharing, this
means *"kept, safe, yours"* — never *"published"*.

---

*See also: [publishing-ui.md](../publishing-ui.md) (the spec), [publishing-philosophy.md](../09-product/publishing-philosophy.md)
(the constitution), [media-system.md](../media-system.md), [components.md](../components.md),
[00-overview.md](./00-overview.md) (conventions).*
