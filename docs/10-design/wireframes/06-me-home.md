# Me / Home — Wireframes (Stage 4)

> **Milestone:** Visual System V2 · **Stage:** 4 · **Fidelity: GREY.** Structural only — no colour,
> no final type. Read [`00-overview.md`](./00-overview.md) for the glyph legend (`▓` media, `◯`
> avatar, `( pill )` chip, `‹icon›`, `·dot·`, `▁▁▁` skeleton), the frozen frame, and the Context
> Column Law. Every screen here traces to [IA §2/§6](../information-architecture.md) and
> [profile-system.md §4](../profile-system.md). **Me is walking into your own home, not opening
> settings.** Owned (what you *made*) and kept (what you *saved*) are always distinguished; any count
> is *private context for you*, never public vanity; the word "Entry" and the word "draft" never
> appear in UI — private work is shown as complete work. Portability is a calm, prominent door out.

---

## 1. Me / Home — phone

Your home, not a settings page. Identity header first, then **your work** and **what you kept**, kept
visibly distinct. Private items appear as finished things labelled `( Private )`, never "draft".

```
┌───────────────────────────────┐
│ ‹≡›   Me              ‹⌕›  ◯   │  topbar — no title vanity, just "Me"
├───────────────────────────────┤
│ ┌───────────────────────────┐ │  ProfileHeader (Card, raised, --space-5)
│ │ ▓▓▓▓ banner  --ratio-banner│ │  banner optional; home without one is still home
│ │      ◯  ← avatar overlaps  │ │  Avatar --radius-full, ring in --color-accent = "this is you"
│ │  Renato Gusani            │ │  name --text-title, weight 500, --tracking-tight
│ │  @renato@tacet.social     │ │  handle --text-meta --font-mono --color-text-secondary
│ │  Building calm software.  │ │  bio --text-body --leading-relaxed
│ │  [ Edit ]  [ View as public ]│ │ two secondary/ghost btns; edit → §10, preview → public profile
│ └───────────────────────────┘ │
│                               │
│  ( Made )  ( Kept )           │  Tabs (§12) — owned vs kept, the top-level split; weight+underline
│  ─────────                    │  active "Made" carries --color-accent underline
│                               │
│  ‹filter› Thoughts Photos ··· │  SegmentedControl (§13, neutral) — kind filter within Made
│                               │
│  ┌───────────────────────────┐│  Content Card (§4) — an owned Thought, SHARED
│  │ ◯ Renato · 2d             ││  no source badge — YOU are the source
│  │ Quiet week. Shipped the…  ││  --text-body
│  │ ‹reply› ‹share› ‹save›    ││  own row: edit/share live in ‹more›
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│  owned Photo, PRIVATE — complete work, NOT a draft
│  │ ◯ Renato · 5d  ( Private )││  Badge neutral "Private" = home-only, dignified, not lesser
│  │ ▓▓▓▓▓ --ratio-photo       ││  shown in full, exactly as finished
│  │ Morning fog over the bay. ││
│  └───────────────────────────┘│
│                               │
│         ▁ (more) ▁            │  quiet lazy-load, never "load more" nag
├───────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ●Me      │  tabbar — Me active (● weight, not a count)
└───────────────────────────────┘
```

- **Empty (new home):** EmptyState (§14) under Made — *"Nothing here yet. What you make lives here,
  private until you choose to share."* Under Kept — *"Save something you love and it's yours, here,
  even if the original disappears."* Calm facts, never nags.
- **Made vs Kept is the primary hierarchy.** Tabs carry it; a kept Moment always shows *its* author +
  home place, an owned item never carries a source badge (profile-system §4.1).
- **"Private" not "Draft."** The badge states a true fact (home-only); it never implies unfinished.

---

## 2. Me / Home — wide (three-column)

Rail · your home (fixed reading measure) · **context column = private context for YOU**
(profile-system §4.1; [Context Column Law](../responsive.md)). Never a public tally, never a dashboard.

```
┌──────────┬────────────────────────────┬──────────────────┐
│ tacet    │            Me              │  Your context    │  context 320px — private, for you
│          │                            │                  │
│ ◈ Today  │ ┌────────────────────────┐ │ ◯ Renato Gusani  │  identity echo (workspace author)
│ People   │ │ ▓▓ banner --ratio-banner│ │ @renato@tacet…   │
│ Discover │ │    ◯  Renato Gusani    │ │ ────────────────  │
│ Convos   │ │    @renato@tacet.social │ │ Workspace         │  §8 switcher lives here (rail-bottom
│ ● Me     │ │    Building calm…      │ │ ┌──────────────┐  │  on ≥900; same place across tiers)
│          │ │    [Edit] [View public]│ │ │◯ Personal  ✓ ││  active = quiet --color-accent check
│  ⊕ New   │ └────────────────────────┘ │ │◯ VNTA        ││  tap → calm cross-fade, no logout
│          │                            │ │ [ Switch… ]  ││
│ ◯ you ⌄  │ ( Made )  ( Kept )         │ └──────────────┘  │
│          │ ─────────                  │ ────────────────  │
│          │ ‹filter› Thoughts Photos…  │ Private to you    │  the counts — CONTEXT not vanity
│          │ ┌────────────────────────┐ │  3 private        │  --text-meta, quiet; you only
│          │ │ ◯ Renato · 2d          │ │  12 saved         │  never "followers", never public
│          │ │ Quiet week. Shipped…   │ │  2 reading later  │
│          │ │ ‹reply›‹share›‹save›   │ │ ────────────────  │
│          │ └────────────────────────┘ │ Continue          │  modest continuity (Recently Viewed
│          │ ┌────────────────────────┐ │  ◯ Ana · article  │  as context, IA §6) — resume, don't
│          │ │ ◯ Renato · 5d (Private)│ │  "The slow web…"  │  scroll
│          │ │ ▓▓ Morning fog…        │ │                  │
│          │ └────────────────────────┘ │                  │
└──────────┴────────────────────────────┴──────────────────┘
   rail 250px      feed 42rem (never widens)     context 320px
```

- **Context column obeys the law:** identity + workspace switch + *your private counts* + *continue*.
  If there is nothing to continue, that block is simply **empty** — never filled with trending.
- Counts are phrased for you ("3 private", "12 saved"), never "3 posts / 200 followers".
- The rail-bottom `◯ you ⌄` is the same switcher as the context block — one behaviour, two reaches.

---

## 3. Saved — kept moments

What you **kept** from the open web. Every card keeps its original author + home place; the Save state
is the quiet positive/`spark` signal (`--color-positive`), never a number.

```
┌───────────────────────────────┐
│ ‹←›  Saved                 ◯   │
├───────────────────────────────┤
│  ( All )  ( Reading Later )    │  Tabs — Saved / the Later queue (§6)
│  ──────                        │
│  ‹⌕› Search your keeps         │  scoped search (IA §4) — within Me only
│                               │
│  ┌───────────────────────────┐│  kept Moment — Content Card (§4)
│  │ ◯ Ana Pérez               ││  ORIGINAL author — attribution stays theirs
│  │ @ana · lives at social.coop││  home as a PLACE, never "instance/server"
│  │ The slow web is the good…  ││  --text-body
│  │ ‹spark saved›  ‹collect›  ‹⋯›││ save = filled spark, --color-positive; "kept for you"
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│
│  │ ◯ Devi · lives at indieweb…││
│  │ ▓▓▓▓ --ratio-video        ││  media honest ratio, --radius-md
│  │  ‹spark saved› ‹collect›  ‹⋯›││
│  └───────────────────────────┘│
├───────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ●Me      │
└───────────────────────────────┘
```

- **Save uses the spark/positive signal** (components §4, §15): the one filled glyph, private,
  seen by no one, never tallied. Toast (§11) *"Saved"* confirms quietly.
- **Never blurs owned/kept:** a Saved card *always* carries its author and home place; there is no
  path here to publish it as your own (profile-system §4.1).
- **Empty:** EmptyState — *"Nothing saved yet. Save a moment from Today and it lives here — yours,
  even if the original disappears."*

---

## 4. Collections — named groups of keeps

```
┌───────────────────────────────┐
│ ‹←›  Collections           ◯   │
├───────────────────────────────┤
│  ┌───────────────────────────┐│  new-collection field (§8 input) — calm, inline
│  │ Name a collection…  [Make]││  primary btn only enabled when named
│  └───────────────────────────┘│
│                               │
│  ┌───────────────────────────┐│  Collection card (Card, interactive)
│  │ Photography               ││  name --text-subheading
│  │ 14 kept                   ││  count = private context, --text-meta --color-text-tertiary
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│
│  │ Recipes                   ││
│  │ 6 kept                    ││
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│
│  │ To read on the train      ││
│  │ 3 kept                    ││
│  └───────────────────────────┘│
├───────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ●Me      │
└───────────────────────────────┘
```

- A collection groups **kept** Moments only (owned work is not "collected" — it just lives in Made).
- "14 kept" is quiet private context; never a leaderboard.
- **Empty:** EmptyState — *"No collections yet. Group your keeps — like Photography or Recipes."*

---

## 5. Collection detail — inside one collection

```
┌───────────────────────────────┐
│ ‹←›  Photography          ‹⋯›  │  ‹⋯› Menu (§9): Rename · Delete collection (danger item)
├───────────────────────────────┤
│  14 kept · your grouping       │  --text-meta subtitle; private context
│                               │
│  ┌───────────────────────────┐│  kept Moment cards — author + home place preserved
│  │ ◯ Ana · social.coop       ││
│  │ ▓▓▓▓ --ratio-photo        ││
│  │ ‹spark saved› ‹remove›    ││  "remove" = remove FROM this collection (still saved)
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│
│  │ ◯ Kai · lives at pixel.place││
│  │ ▓▓▓▓                      ││
│  │ ‹spark saved› ‹remove›    ││
│  └───────────────────────────┘│
├───────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ●Me      │
└───────────────────────────────┘
```

- Deleting the collection (via ‹⋯› → Modal §10, danger confirm) **never deletes the keeps** — they
  return to Saved. State this in the confirm copy so nothing feels destructive.
- **Empty:** EmptyState — *"Empty collection. Open a saved moment and add it here."*

---

## 6. Reading Later — kept long-form queue

A calm queue of kept Articles / long-form, so returning to reading is one tap — not a backlog nag.

```
┌───────────────────────────────┐
│ ‹←›  Reading Later         ◯   │
├───────────────────────────────┤
│  3 waiting · read at your pace │  --text-meta; no "unread" red count, no streak
│                               │
│  ┌───────────────────────────┐│  long-form kept card — reading-oriented
│  │ ◯ Ana · social.coop       ││  author + home place
│  │ The slow web is the good  ││  title --text-subheading
│  │ web                       ││
│  │ ~ 8 min · saved 3d ago    ││  helpful facts, not pressure
│  │ ‹spark saved› ‹mark read› ││  "mark read" removes from the queue, keeps the save
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│
│  │ ◯ Devi · indieweb.social  ││
│  │ On leaving platforms      ││
│  │ ~ 5 min · saved 1w ago    ││
│  │ ‹spark saved› ‹mark read› ││
│  └───────────────────────────┘│
├───────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ●Me      │
└───────────────────────────────┘
```

- Reachable both as a tab within Saved (§3) and its own list; wide tier surfaces it in the Me context
  column count ("2 reading later").
- **Empty:** EmptyState — *"Nothing to read later. Mark a saved article 'Later' and it waits here."*

---

## 7. Recently Viewed — the modest Me list

Continuity history — *"take me back to what I was doing."* The full-history expression of IA §6; its
primary job lives in the context column, this is the calm overflow list.

```
┌───────────────────────────────┐
│ ‹←›  Recently viewed  [Clear]  │  [Clear] ghost btn — a private log, yours to wipe
├───────────────────────────────┤
│  A private, local history      │  --text-body-sm --color-text-secondary
│                               │
│  ◯ Ana Pérez            2h    │  flush list rows (t-list--flush), not cards
│  The slow web is the good web │  --text-body-sm truncates
│  ─────────────────────────    │  hairline separator only (L1)
│  ◯ Devi                 5h    │
│  On leaving platforms         │
│  ─────────────────────────    │
│  ◯ Kai                  1d    │
│  ▓ photo — Morning fog        │
├───────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ●Me      │
└───────────────────────────────┘
```

- **Not a top-level destination** (IA §6): reached only inside Me; carries no nav weight.
- Rows are quiet and history-shaped (who · when · what); tapping resumes where you were.
- **Empty:** EmptyState — *"Nothing here yet. Things you open will show up here."*

---

## 8. Workspace switcher — calm, Notion-like

Switching *who you author as*, not logging out (profile-system §6). Lives at rail-bottom (≥900) and in
Me on phone — same place across tiers. A small sheet, one accent, no badges/counts.

```
Phone — bottom sheet (--radius-xl, --elevation-3, --z-sheet)
┌───────────────────────────────┐
│           ▁▁▁ grabber          │  gestural sheet, dismiss by swipe/scrim
│  Your workspaces               │  --text-heading
│                               │
│  ┌───────────────────────────┐│
│  │ ◯ Personal — Renato    ✓  ││  active carries quiet --color-accent check (§6)
│  │ @renato@tacet.social      ││  handle mono
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│
│  │ ◯ VNTA                    ││  a business workspace — different identity entirely
│  │ @vnta@tacet.social        ││
│  └───────────────────────────┘│
│                               │
│  [ + Create a workspace ]      │  ghost; not the accent
└───────────────────────────────┘
        ↓ tap VNTA
  identity chrome cross-fades  --dur-3   (no re-auth, no logout screen)
  header, author, public face all become VNTA — "sliding between rooms of one home"
```

- **Not an account menu.** No "Sign out" as the headline act; switching ≠ leaving.
- **Portable identity shown plainly** — `@you@tacet.social`; the protocol is invisible, you never
  "pick a server to be yourself" (profile-system §6).
- After switch, Compose authors *as* the current workspace — no ambient identity leaks
  (publishing-philosophy §workspaces). Switching feels like Notion workspaces, not a session change.

---

## 9. Settings — calm, grouped

Not a wall of toggles — a few clearly-named rooms. **Portability sits high and reads as an easy door**
(profile-system §7, "leaving is easy").

```
┌───────────────────────────────┐
│ ‹←›  Settings              ◯   │
├───────────────────────────────┤
│  Account                       │  SectionHeading (§14)
│  ┌───────────────────────────┐│
│  │ Identity & handle       ‹›││  → §10 Identity editing
│  │ Workspaces              ‹›││  → §8 switcher / manage
│  └───────────────────────────┘│
│                               │
│  Privacy                       │
│  ┌───────────────────────────┐│
│  │ Who can find you        ‹›││  plain-language rows, not toggle soup
│  │ What stays private      ‹›││  Saved/notes/history are private by default
│  └───────────────────────────┘│
│                               │
│  Appearance                    │
│  ┌───────────────────────────┐│
│  │ Theme  ‹System | Light | Dark›││ SegmentedControl (§13) — light & dark both first-class
│  └───────────────────────────┘│
│                               │
│  Your data — leaving is easy   │  the calm door; NOT buried, NOT a dark pattern
│  ┌───────────────────────────┐│
│  │ Export everything       ‹›││  identity + people + your work, intact & portable
│  │ Take your world elsewhere ‹›││ migration front door — a real exit, phrased kindly
│  └───────────────────────────┘│
│                               │
│  ┌───────────────────────────┐│
│  │  Sign out                 ││  ghost, quiet, at the very bottom — never the headline
│  └───────────────────────────┘│
├───────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ●Me      │
└───────────────────────────────┘
```

- **Four calm groups** (Account · Privacy · Appearance · Your data). No federation/server terms
  anywhere — Export speaks of "your world", "your work", never protocols.
- **Export is prominent and warm**, not a hidden legal switch: "leaving is easy" is a promise the UI
  keeps (L5 honesty; publishing-philosophy §portability).
- Rows are navigational (`‹›` chevron), not inline toggles; only Theme is an inline control.

---

## 10. Identity editing — calm form

Edit name, handle, avatar, bio, banner. A quiet, unintimidating form — editing your home, not filling
a database sheet (profile-system §2). Reached from the Me header [Edit] or Settings → Identity.

```
┌───────────────────────────────┐
│ ‹✕›  Edit identity      [Save] │  Save = one accent action (L3); ✕ cancels
├───────────────────────────────┤
│  ┌───────────────────────────┐│  live banner + avatar preview (what your home looks like)
│  │ ▓▓▓▓ banner  --ratio-banner││  --ratio-banner (3/1), --radius-lg; [ Change banner ]
│  │      ◯  [ Change avatar ]  ││  avatar overlaps; --radius-full
│  └───────────────────────────┘│
│                               │
│  Name                          │  Field family (§8 inputs): label --text-label, sunken well
│  ┌───────────────────────────┐│
│  │ Renato Gusani             ││  --text-body-sm value
│  └───────────────────────────┘│
│  Handle                        │
│  ┌───────────────────────────┐│
│  │ @ renato                  ││  mono; helper below
│  └───────────────────────────┘│
│  └ Your address: @renato@tacet.social — this comes with you.  (--text-meta helper, portable)
│                               │
│  Bio                           │
│  ┌───────────────────────────┐│  textarea — the person's voice, not a tagline
│  │ Building calm software.   ││
│  │                           ││
│  └───────────────────────────┘│
│                               │
│  Links & fields                │  up to a few labelled rows (quiet, --color-text-secondary)
│  ┌──────────┬────────────┬─┐ │
│  │ Label    │ Value / URL │✕│ │  e.g. Website · GitHub
│  └──────────┴────────────┴─┘ │
│  + Add a field                 │  ghost, until a small cap
│                               │
│  [ Cancel ]         [ Save ]   │  Save primary; Cancel ghost — reversible, calm
└───────────────────────────────┘
```

- **Field states** per components §8: rest sunken well, focus → `--color-accent` border + subtle
  ring, error shows an icon + message (never colour alone). 44px min targets.
- The handle helper makes **portability visible** ("this comes with you") — reinforces the door out.
- Saving returns you to your home (§1), not to a settings tree — editing is *in place*.

---

*Cross-links:* [information-architecture.md §2/§6](../information-architecture.md) ·
[profile-system.md §4/§6/§7](../profile-system.md) ·
[publishing-philosophy.md](../../09-product/publishing-philosophy.md) (owned vs kept; no "Entry"/"draft") ·
[components.md](../components.md) · [responsive.md](../responsive.md) (Context Column Law) ·
[00-overview.md](./00-overview.md) (glyph legend + frozen frame).
```
