# Discover & Search — Wireframes (Stage 4)

> **Milestone:** Visual System V2 · **Stage:** 4 · **Fidelity: GREY.** Structure only — no colour,
> no final type. Read [00-overview.md](./00-overview.md) for conventions (`▓` media, `◯` avatar,
> `( pill )` chip, `‹icon›`, `···` more, `▁▁▁` skeleton, `·dot·` presence). Every block is a grey
> block; annotations name the [component](../components.md) and token it becomes in Stage 6.
> Discover is the **neighbourhood walk** — an *editorial exploration* of the open social web
> ([discover.md](../../01-product/discover.md), [stage-6-design-direction.md](../stage-6-design-direction.md)):
> corners worth visiting, people worth meeting, communities that moved, framed by a curator's voice.
> Not a directory, not a leaderboard. Search is a **global overlay, not a pillar**
> ([IA §4](../information-architecture.md)). Communities are a **demoted supporting surface**
> ([communities.md](../../01-product/communities.md)), never the spine.

---

## Doctrine banner (governs every frame below)

- **Discover is a curated neighbourhood walk, not a hot-list.** It represents the open web's real life
  — people, places, communities active today, things worth exploring — with a **human editorial
  hand**, relationship-scoped. What it rejects is the *manipulative* form: a raw ascending
  leaderboard, "12.4K talking" as a headline, a ranking of people, engagement pressure. Represent the
  neighbourhood's life; never manufacture a race ([ADR-011](../../06-decisions/ADR-011-metrics-are-context-not-rewards.md),
  [design-principles L11](../design-principles.md)).
- **No "Federation status" / server / instance *dashboard*.** Federation is invisible plumbing like
  email. Open-web platforms appear as **human places you can be**, never as protocol, software, or a
  live-metrics panel. A one-time "you're connected to a live open web" reassurance (educational, on
  demand) is fine; a persistent server/user ticker is not.
- **Human words only** — a place is *"where writers gather"*, not *"a WriteFreely instance"*; never
  "Entry", "post", "instance", "server", "ActivityPub" in the UI (L9).

---

## 1. Discover — phone (`<768`)

The human recommendation gateway. You arrive with a question and leave with a person or a place.

```
┌───────────────────────────────────┐
│ ‹≡›   Discover            ‹⌕› ◯    │  topbar · ‹⌕› opens Search overlay (frame 4)
├───────────────────────────────────┤
│ A door to the wider open web.      │  SectionHeading subtitle --text-body-sm
│ People and places worth knowing.   │  --color-text-secondary  (NO "trending" claim)
│                                     │
│ ── People to meet ──────────────    │  SectionHeading --text-heading (§14)
│ ┌─────────────────────────────────┐ │
│ │ ◯  Ana Ríos                     │ │  Person Card · Row variant (§5)
│ │    @ana@social.coop             │ │  handle --text-meta mono --color-text-tertiary
│ │    Lives at social.coop         │ │  home line = HUMAN place (§5), no software suffix
│ │    Devi & 2 you follow know her │ │  shared-world line, NOT a follower count
│ │                     [ Follow ]  │ │  the one accent action on the card (L3)
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ◯  Marco Vidal      ( follows   │ │  "follows you" = quiet chip in home line,
│ │    @marco@indieweb.social  you )│ │     not a button (Person Card table)
│ │    Lives at indieweb.social     │ │
│ │                     [ Follow ]  │ │
│ └─────────────────────────────────┘ │
│                        Meet more ···│  quiet "more", never infinite scroll
│                                     │
│ ── Communities ─────────────────    │  demoted successor to "rooms" (communities.md)
│ ┌─────────────────────────────────┐ │
│ │ Slow Photography        ( Photo)│ │  Community card · accent Badge = audience tag
│ │ For people who shoot on film    │ │  purpose in ONE sentence --text-body-sm
│ │ ◯◯◯ Ana, Devi & others here     │ │  members as FACES (§6 overlap), not a count
│ │                      [ Visit ]  │ │  secondary action
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Dublin Makers           ( Local)│ │
│ │ Neighbours who build things     │ │
│ │ ◯◯◯ 3 you follow are here       │ │  relationship framing, not magnitude
│ │                      [ Visit ]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ── Places across the open web ──    │  platforms shown as HUMAN PLACES
│ ┌─────────────────────────────────┐ │
│ │ ◈  Where photographers gather   │ │  = Pixelfed, NAMED HUMANLY, no software word
│ │    Share a photo, meet people   │ │  --text-body-sm description of the vibe
│ │    who see the way you do       │ │
│ │                     [ Explore ] │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ◈  Where writers keep a journal │ │  = WriteFreely, humanly
│ │    Long-form, quiet, unhurried  │ │
│ │                     [ Explore ] │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ◈  Where video makers post      │ │  = PeerTube, humanly
│ │    Film, talks, and hobby reels │ │
│ │                     [ Explore ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ‹globe› Tacet begins with the open  │  honest open-vs-closed note (discover.md)
│ web. Closed platforms stay walled   │  --text-meta --color-text-tertiary
│ until they open a real door.        │
├───────────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ◯             │  tabbar · Discover = ◇ active
└───────────────────────────────────┘
```

**Rejected here, on purpose:**
- ✗ **NO "Trending · 12.4K talking" leaderboard.** Discover recommends *people/places*, never ranks
  *content* by heat (discover.md; L6). The reference mockup's hot-list does not exist in Tacet.
- ✗ **NO "Federation status" dashboard** — no server health, uptime, instance list, or protocol
  readout. Federation is invisible plumbing (discover.md "Federation is infrastructure, not the
  product"). Any such panel is a **doctrine violation** and is deleted, not restyled.
- Platforms (Mastodon/Pixelfed/PeerTube/WriteFreely) surface **only** as "Places across the open web"
  described by what people *do* there — never by software name in the UI (L9).

---

## 2. Discover — wide (`≥1200`, three-column)

Rail · recommendations · **context column bound by law** (IA §3): *about the place you're exploring*.

```
┌──────────┬───────────────────────────────┬────────────────────────┐
│ tacet    │        Discover               │  About this place      │  context col 320px
│          │                               │                        │  (IA Context Law §3)
│ ◈ Today  │  A door to the open web.      │  ┌────────────────────┐│
│ ◯ People │  People and places worth      │  │ Slow Photography   ││  the community/place
│ ◇ Discvr●│  knowing.                     │  │ in focus (hovered  ││  currently in focus
│ ◯ Convos │                               │  │ or last visited)   ││
│ ◯ Me     │  ── People to meet ────────   │  │                    ││
│          │  ┌───────────────────────────┐│  │ "For people who    ││  purpose in ONE
│          │  │ ◯ Ana Ríos                ││  │  shoot on film and ││  sentence
│          │  │   @ana@social.coop        ││  │  develop it slow." ││  --text-body-sm
│          │  │   Lives at social.coop    ││  │                    ││
│          │  │   Devi & 2 know her       ││  │ A few people here: ││  "a few people
│          │  │              [ Follow ]   ││  │  ◯ Ana Ríos        ││   there" (§5 rows),
│          │  └───────────────────────────┘│  │  ◯ Devi Kaur       ││   faces-first
│          │  ┌───────────────────────────┐│  │  ◯ Sam Ochoa       ││
│          │  │ ◯ Marco Vidal   (follows  ││  │  ◯◯ +4 you follow  ││  shared world, not
│          │  │   @marco@indieweb  you)   ││  │                    ││  a member tally
│          │  │              [ Follow ]   ││  │      [ Visit ]     ││  one accent action
│          │  └───────────────────────────┘│  └────────────────────┘│
│          │                               │                        │
│          │  ── Communities ──────────    │  If nothing is in      │  Context Law:
│          │  ┌─────────┐ ┌─────────┐      │  focus, this column    │  helps you understand
│          │  │ Slow    │ │ Dublin  │      │  is EMPTY — never a    │  the current thing OR
│  ⊕ Compose  │ Photo   │ │ Makers  │      │  trending sidebar,     │  it is empty (never a
│          │  │ ◯◯◯     │ │ ◯◯◯     │      │  never a "federation   │  dashboard, L7)
│ ◯ you    │  │[ Visit ]│ │[ Visit ]│      │  status" panel.        │
│  ‹switch›│  └─────────┘ └─────────┘      │                        │
│          │  reading measure held; extra  │                        │
│          │  width → context, then margin │                        │
└──────────┴───────────────────────────────┴────────────────────────┘
   rail 250px          feed 42rem                context 320px
```

**Annotations:** rail = same nav as the frozen frame; Compose is the calm `⊕` rail button, never a
glowing orb. Community cards fall to a 2-up grid at width (`--space-4` gap). The context column shows
**one place at a time** — its purpose sentence + a few real faces — and **collapses to empty** with
nothing in focus. It is forbidden from becoming a trending or federation dashboard (IA §3, L7).

---

## 3. Community view — a group space (demoted successor to "rooms")

Calm, not a subreddit: a purpose line, the people, and recent moments. No karma, no vote arrows.

```
┌───────────────────────────────────┐
│ ‹←›   Slow Photography     ‹⌕› ◯   │  topbar · back to Discover
├───────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  optional banner --ratio-banner, --radius-lg
│                                     │
│ Slow Photography          ( Photo) │  name --text-title · accent Badge audience tag
│ For people who shoot on film and    │  PURPOSE in one sentence (communities.md:
│ develop it slow.                    │    "clear reason to exist") --text-body
│                                     │
│ ◯◯◯◯◯  Ana, Devi & others          │  members as FACES (§6 overlap cluster) +
│        3 you follow are here        │  a human relationship line — NOT "1.2K members"
│                                     │
│              [ Join ]   ‹more›      │  one accent action (L3); ‹more›=Share/Mute/Leave
│                                     │
│ ── Recent moments ──────────────    │  SectionHeading; the community's own feed
│ ┌─────────────────────────────────┐ │
│ │ ◯ Devi Kaur                     │ │  Content Card (§4) · inline attribution
│ │   @devi@social.coop · 2h        │ │  handle mono + time; chronology, never ranked
│ │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │ │  a Photo, full column, --radius-md
│ │   "First roll off the new lens."│ │  --text-body voice
│ │   ‹reply›  ‹share›  ‹save›       │ │  affordance row ONLY — no like/vote tally (§4)
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ◯ Sam Ochoa                     │ │
│ │   @sam@pixelfed.place · 5h      │ │  remote member, home shown honestly as a place
│ │   A Thought, quietly kept.      │ │  named "Thought" in human terms, never "Entry"
│ │   ‹reply›  ‹share›  ‹save›       │ │
│ └─────────────────────────────────┘ │
│                        Read more ···│  bounded; "glad to visit and glad to leave"
├───────────────────────────────────┤
│  ◈    ◯    ⊕    ◇    ◯             │  tabbar
└───────────────────────────────────┘
```

**Annotations:** governed by the same calm rules as everywhere — bounded attention, legible
chronological ordering, **no vanity scoreboards, no vote arrows, no karma** (communities.md "Calm by
construction"). Wide tier puts *members + the community's purpose* in the context column. A community
is human-scaled and human-tended, not "content in a room".

---

## 4. Search overlay — phone (`<768`)

Full-screen overlay from the top-bar `‹⌕›`. One input, then **grouped** results as calm sections.

```
┌───────────────────────────────────┐
│  ‹⌕›  film cameras          ‹✕›   │  single Text Input (§8), autofocus · ‹✕› closes clean
├───────────────────────────────────┤     overlay: --z-sheet, focus-trapped, Esc closes
│ People ─────────────────────────    │  grouped result section header --text-label
│ ◯ Ana Ríos      @ana@social.coop   │  Person Card Row (§5), tap → Remote Profile
│ ◯ Film Club     @film@indieweb     │
│                                     │
│ Moments ────────────────────────    │  human word; never "posts", never "Entry"
│ ‹photo› "Loaded a new roll…" · Devi │  Content result: type glyph + snippet + author
│ ‹article› "Why I still shoot film"  │
│                                     │
│ Collections ────────────────────    │  your groupings (Me)
│ ◇ Film & grain          12 kept    │  count here is PRIVATE context, not a public tally
│                                     │
│ Saved ──────────────────────────    │  your kept moments
│ ‹save› "Metering by eye" · Sam     │  saved glyph in --color-positive (the quiet signal)
│                                     │
│ Notes ──────────────────────────    │  your own notes on kept things
│ ‹note› "try the 50mm wide open"    │
│                                     │
│              See all matches ···    │  quiet expander, never an infinite result wall
└───────────────────────────────────┘
```

**Annotations:** scope reads *within* the current surface (search People, or your keeps in Me) but
**never becomes a screen you dwell in** (IA §4). Groups appear in this fixed order — **People ·
Moments · Collections · Saved · Notes** — each a quiet section, no result counts-as-status, no
"trending searches". Closing returns focus to the invoking `‹⌕›` (Modal focus contract, §10).

---

## 5. Search overlay — desktop (`⌘K`) — command-style, spotlight-like

A centred overlay floating over the current surface. Grouped results, keyboard hints. Calm, not a
doomscroll.

```
        ┌──────────────────────────────────────────────────┐
        │ ‹⌕›  film cameras                          ⌘K  ✕ │  centred panel --color-surface-raised
        ├──────────────────────────────────────────────────┤     --elevation-3, --radius-xl, --z-modal
        │ PEOPLE                                            │  section label --text-label --tracking-wide
        │  ◯ Ana Ríos          @ana@social.coop            │  ‹— roving focus row (--color-accent-subtle)
        │  ◯ Film Club         @film@indieweb.social       │
        │ MOMENTS                                           │
        │  ‹photo›  "Loaded a new roll…"          · Devi   │
        │  ‹article› "Why I still shoot film"     · Marco  │
        │ COLLECTIONS                                       │
        │  ◇ Film & grain                        12 kept   │  private context count, not vanity
        │ SAVED                                             │
        │  ‹save›  "Metering by eye"              · Sam    │  saved glyph --color-positive
        │ NOTES                                             │
        │  ‹note›  "try the 50mm wide open"                │
        ├──────────────────────────────────────────────────┤
        │  ↑↓ move   ↵ open   esc close      scoped: Discover│  keyboard hints --text-meta mono
        └──────────────────────────────────────────────────┘
              scrim (--scrim-media) dims the surface behind; click-out closes
```

**Annotations:** built on the Modal contract (§10) — scrim + raised panel, focus **trapped**, Esc and
scrim-click dismiss, focus returns to the invoker. Same five groups, same order as phone. Full
keyboard path (arrow roving, ↵ opens, Esc closes). A scope hint ("scoped: Discover") shows what
you're searching within. **No trending queries, no result-count leaderboard, no infinite scroll** —
you find what you came for and dismiss.

---

## 6. Search — empty / initial state (warm)

Before you type: recent searches and a few warm suggestions. A calm fact, never a nag.

```
┌───────────────────────────────────┐
│  ‹⌕›  Search                ‹✕›   │  empty input, placeholder quiet & literal (§8)
├───────────────────────────────────┤
│ Recent ─────────────────────────    │  --text-label section header
│ ‹clock› film cameras                │  recent query rows, tap to re-run
│ ‹clock› ana ríos                    │  ‹clock› = history glyph
│ ‹clock› dublin makers               │
│                        Clear recent │  quiet ghost action, right-aligned
│                                     │
│ Try ────────────────────────────    │  warm suggestions, human-phrased
│ ‹people› Find people your friends   │  scoped suggestions, not "trending searches"
│          already follow             │
│ ‹globe›  Explore places across the  │  → Discover's open-web places
│          open web                   │
│ ◇ Look through your own keeps        │  → your Saved / Collections (Me)
│                                     │
│ ┌─────────────────────────────────┐ │  ── if truly nothing yet ──
│ │ ‹⌕›  Nothing searched yet.      │ │  EmptyState (§14): icon --icon-lg,
│ │      Search people, moments,    │ │  title --text-subheading --color-text-secondary,
│ │      and your own keeps.        │ │  body ≤28rem — a calm fact, never a nag
│ └─────────────────────────────────┘ │
└───────────────────────────────────┘
```

**Annotations:** "Recent" is *your* history, cleared with one quiet action (honesty, portability).
"Try" suggestions are warm and human — pointing to *people*, *open-web places*, and *your keeps* —
**never** a "trending searches" list or an engagement bait row. The empty state is the calmest
frame in the set: one soft line, no illustrations shouting, no counts. Loading uses the single soft
pulsing `--color-accent` dot (§14 Loading), never a spinner.

---

*Cross-links:* [00-overview.md](./00-overview.md) · [information-architecture.md](../information-architecture.md)
(§3 Context Law, §4 Search-as-overlay) · [components.md](../components.md) (Person/Content Card, Badge,
Text Input, Menu, Modal, Tabs, EmptyState) · [profile-system.md](../profile-system.md) (human places,
no vanity counts) · [discover.md](../../01-product/discover.md) · [communities.md](../../01-product/communities.md).
