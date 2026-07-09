# High Fidelity — Today (desktop + mobile)

> **Milestone:** Visual System V2 · **Stage:** 6 (High Fidelity + Prototype, built in Claude Design)
> · **Status:** Direction — the concrete plan the Claude Design build follows. Governed by
> [stage-6-design-direction.md](../stage-6-design-direction.md), the revised
> [Context Column Law (ADR-012)](../../06-decisions/ADR-012-the-context-column-law.md), and the
> [metrics doctrine (ADR-011)](../../06-decisions/ADR-011-metrics-are-context-not-rewards.md).

This is Today rebuilt to the corrected doctrine: **Today is a calm editorial homepage** — it respects
chronology, is never an opaque algorithm, still *ends* (bounded, finishable), but it feels **alive**.
The reference GPT mockups (desktop dashboard; mobile "For You / Following / Local / Trending") are
the raw energy; this plan keeps their warmth and life and removes their casino.

---

## 1. Intent

| Before (drifted doctrine) | After (this plan) |
|---|---|
| Bounded chronological *dump* | Bounded, curated **editorial homepage** with a visible human hand |
| Context column empty by default | Context column is a **living space**: your people, your world's momentum, continue |
| No counts anywhere, ever | **Self-directed** counts on your own posts: still none. **World-directed** reception: represented, framed, calm |
| "No trending, ever" | **Represented momentum**, relationship-scoped, editorial — the thing first, the number softened |
| Feels like a still, empty product | Feels like **where everything comes together** — present, warm, confident, not noisy |

Unchanged: no infinite scroll (Today ends), no autoplay, no red badges, no streaks, protocol
invisible, human words only, one primary action per view, 42rem fixed reading measure.

---

## 2. What "editorial homepage" means for Today

Today is composed, not just concatenated. It has a **shape**:

1. **A warm masthead** — greeting + one honest line about the day ("A quiet Wednesday." / "Your world
   is busy today."). The line is *descriptive of reality*, never a nag or a hook.
2. **The digest** — the chronological body of moments from your people and world. Chronology is the
   legible default; any grouping ("Earlier today", "While you were away") is stated plainly and is
   never opaque ranking. Media-first cards (V1 Content Card, editorial media system).
3. **Gentle editorial texture** — occasional, honestly-labelled curator moments woven into the
   chronology (not ads, not injected virality): *"A conversation worth joining"*, *"From a community
   you're in"*, *"Worth a look on the open web."* These are **represented reality**, framed by a human
   voice, each clearly what it is.
4. **A real end** — the bounded "That's today" payoff stays exactly as specced (a floor, a check, "the
   rest of the day is yours"). Editorial richness does **not** mean infinite.

The craft line: **alive, not noisy.** Every added element must pass L11 (informing, not manipulating).
If a curator moment can't be honestly labelled and relationship-justified, it's out.

---

## 3. Desktop / wide (≥1200px) — rail · editorial feed · living context column

```
┌────────────┬──────────────────────────────────┬───────────────────────────┐
│  tacet     │  Today                           │  People close to you      │  CONTEXT COLUMN
│            │  A quiet Wednesday.              │  ◯ Mara · around now      │  --context-width 320px
│  ◈ Today   │  ─────────────────────────────  │  ◯ Jonas · earlier        │  living, world-directed
│  ◯ People  │                                  │  ◯ Wren · yesterday       │
│  ◇ Discovr │  ┌────────────────────────────┐  │  → See your people        │  ghost link, no count
│  ◈ Convos· │  │ ◯ Mara Ito           ‹···› │  │                           │
│  ◯ Me      │  │   @mara · on tacet · 8:12  │  │  ── Continue ──           │  SectionHeading
│            │  │   Finished the long edit…  │  │  ◇ "The slow web"         │  the ONE thing mid-read
│            │  │   ▓▓▓▓ (media, editorial)  │  │  ▓▓ 6 min left · Resume   │  quiet inset, hairline
│ [ ⊕ New ]  │  │   ‹reply› ‹share› ‹save›   │  │                           │
│            │  └────────────────────────────┘  │  ── Across your world ──  │  represented momentum
│            │                                  │  · A conversation on      │  the THING leads;
│            │  ┌─ From a community you're in ─┐ │    "designing for calm"   │  no "12.4K"; soft phrase
│            │  │ ◯ Indie Makers · warm name │  │    · active now           │  "active now" not a tally
│            │  │   … moment …               │  │  · A film shared widely   │  "shared widely" (range),
│            │  │   ‹reply› ‹share› ‹save›   │  │    on the open web        │  never a raw ascending count
│            │  └────────────────────────────┘  │  → Look around Discover   │  ghost onward door
│            │                                  │                           │
│            │  ┌────────────────────────────┐  │  ── The open web ──       │  calm reassurance,
│            │  │ ◯ Jonas Vold · pixel.town  │  │  You're connected across  │  shown as a quiet line,
│            │  │   ▓▓▓ 2-up gallery         │  │  the open social web.     │  NOT a live ticker/map.
│            │  │   ‹reply› ‹share› ‹save›   │  │  Learn how it works →     │  educational link only
│            │  └────────────────────────────┘  │                           │
│            │                                  │                           │
│            │     · · ·  That's today  · · ·   │  When there's nothing to  │  the column rests as a
│ ◯ you  ☾   │     The rest of the day is yours.│  add, this rests quietly. │  composed quiet, not blank
└────────────┴──────────────────────────────────┴───────────────────────────┘
```

**Context column blocks (all world-directed / relationship-derived — pass L11):**
- **People close to you** — faces of who's around/recently present. Presence is a *quiet dot / soft
  phrase*, never "N online", never a ranking of people.
- **Continue** — the single article/thread you were mid-way through (continuity, IA §6). One item.
- **Across your world** — 2–3 *represented* momentum items, **relationship-scoped** ("among people you
  follow" / "in your communities"). Lead with the conversation/piece; soften any number to qualitative
  ("active now", "shared widely"). Never a top-N leaderboard, never raw ascending tallies, never
  people ranked against each other.
- **The open web** — one calm reassurance line + "Learn how it works" (education/wonder shown once, not
  a persistent federation dashboard with server/user counters and a pulsing map).

**Explicitly still banned in this column:** creator rankings, follower/like/view leaderboards, personal
analytics about your reach, streaks, engagement pressure, red counts, urgency halos, a live-ticking
federation panel. (ADR-012 not-allowed list.)

**Desktop (900–1199px, no context column):** rail + centred editorial feed. The context blocks are not
shown (nothing *lives* only there); "continue" and momentum fold away gracefully. Reading measure fixed
at 42rem — the window grows, the line length does not.

---

## 4. Mobile (<768px) — an editorial homepage in the thumb zone

The mobile mockup's **segmented lens row (For You · Following · Local · Trending)** is a genuinely good,
*informing* idea and is adopted — with honest, calm framing:

```
┌───────────────────────────────┐
│ ☰   tacet          ‹⌕›   ◯    │  top bar 56px, solid surface + hairline (no glass)
│ A quiet Wednesday.            │  editorial masthead: greeting + honest day-line
├───────────────────────────────┤
│ ( For You )( Following )( Local )( ⟲ )│  LENS ROW — segmented, calm. Legible words, one active.
│                               │  NOT engagement tabs: each is an honest *view of reality*:
│                               │  · For You = curated from your world (legible, not opaque)
│                               │  · Following = strictly your people, chronological
│                               │  · Local = your home community / place on the open web
│                               │  · Trending = represented momentum, relationship-scoped, framed
├───────────────────────────────┤
│ shared from tacet.social      │  SourceNote — human place, mono meta
│ ┌───────────────────────────┐ │  ── Content Card · editorial media-first ──
│ │ ◯ Lena Rivera   ( Pixelfed )│ │  SOURCE BADGE = a *human place* cue (Pixelfed/Mastodon/PeerTube)
│ │   @lena@pixelfed.social·2h │ │  — this INFORMS ("where on the open web this lives"), it is
│ │   Golden hour in the       │ │  not a protocol string and not a vanity mark. Allowed.
│ │   mountains ✨             │ │
│ │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │  media at --ratio-photo, editorial crop, blur-up
│ │   ‹reply› Reply ‹share› Share ‹save› Save │  affordance row — Reply · Share · Save only
│ └───────────────────────────┘ │  NO like/comment/repost COUNTS on your feed cards (self-adjacent
│                               │  vanity). Reception, if ever shown, is world-directed & framed.
│ ┌─ A conversation worth joining ┐│  editorial curator moment (honestly labelled), woven in
│ │ ◯ Chris Hall  ( Mastodon )  ││
│ │   Thread: building for the  ││
│ │   open web · active now     ││  "active now" — qualitative, not "42 replies"
│ │   ‹reply› ‹share› ‹save›    ││
│ └───────────────────────────┘ │
│         · · ·  end below       │  bounded — "That's today" payoff follows (unchanged spec)
├───────────────────────────────┤
│  ◈     ◯     ⊕     ◇    ◯·    │  bottom tab bar: 5 pillars + compose FAB; Conv ·dot· not a count
│ Today People (＋) Discvr Conv │
└───────────────────────────────┘
```

**Lens row rules (so it informs, never manipulates):**
- Each lens is an **honest, legible view of reality**, not an algorithmic slot machine. "For You" is
  *curated and explainable* (you can always see why something is here), never an opaque outrage engine.
- Switching lens **never** resets to an infinite feed; every lens is still **bounded** and ends.
- "Trending" shows **represented, relationship-scoped momentum** (framed, softened numbers), never a
  global raw leaderboard, never "12.4K people talking" as the headline.
- No red counts on the lenses, no "unread" badges, no auto-advancing.

**Source badges** ("Pixelfed / Mastodon / PeerTube") are **kept** — but re-read as *human-place*
attribution ("where on the open web this lives"), consistent with human-words doctrine. They inform
provenance; they are not the protocol made the user's problem. Label them by the place's warm name
where one exists.

**Deliberately dropped from the mobile mockup:** the per-card like/comment/repost/bookmark **count
row** as a standing scoreboard on your feed. Affordances stay (Reply · Share · Save); the *tallies*
about each post do not sit on the card as a default scoreboard. Any reception signal that ships later
is world-directed and framed per ADR-011.

---

## 5. The metrics decisions, made concrete for Today

| Element on the mockups | Verdict | How it ships |
|---|---|---|
| Like/comment/repost counts on each card | **Modify** | Affordances yes; standing per-card tally no. Reception, if shown, is world-directed & softened. |
| "Trending across the open web · 12.4K people talking" | **Modify** | Represented momentum kept; relationship-scoped; lead with the topic; number softened to qualitative/range or dropped. |
| Story rings ("Your story", people's rings) | **Modify (careful)** | Allowed only as your people's *genuine* moments; never a streak, never "post daily or lose it." Revisit in a dedicated spec before building. |
| "Connections" presence panel | **Keep** | Becomes "People close to you" — informing, quiet presence, no "N online", no ranking. |
| Federation status (servers/active users, world map) | **Modify** | Wonder shown once / on-demand ("Learn how it works"); no persistent live-metrics ticker. |
| Source badge (Pixelfed/Mastodon/PeerTube) | **Keep** | Human-place provenance; informs where content lives. |
| Segmented lens row (For You/Following/Local/Trending) | **Keep** | Honest, bounded, explainable views; not engagement slots. |
| Compose inline ("What's on your mind?") | **Keep** | Calm composer entry; no vanity scaffolding (no predicted reach/optimal time). |

---

## 6. Build order in Claude Design (Stage 6)

1. **Desktop wide** three-column editorial Today — masthead, editorial feed with one curator moment,
   full living context column (all four blocks + the quiet-rest variant).
2. **Mobile** editorial Today — masthead, lens row, media-first cards with source badges, one curator
   moment, bounded end.
3. **Desktop 900–1199** (no context column) and **tablet** — derive the graceful folds.
4. **States** — loading (calm skeletons, blur-up, zero layout shift), empty/new-user ("bring your
   world"), the "That's today" end-state. (Reuse the specs in
   [../wireframes/02-today.md](../wireframes/02-today.md); update its "no trending ever" header note per
   the patch list.)
5. **Prototype** the lens switch, the "Resume"/continue action, and the compose entry.

Each screen is held to the Stage-6 bar: **calm *and* rich · alive · informing not manipulating · a
home not a magazine · no refusal broken.**

---

*Cross-links:* [stage-6-design-direction.md](../stage-6-design-direction.md) ·
[ADR-012](../../06-decisions/ADR-012-the-context-column-law.md) ·
[ADR-011](../../06-decisions/ADR-011-metrics-are-context-not-rewards.md) ·
[design-principles.md](../design-principles.md) (L11) ·
[wireframes/02-today.md](../wireframes/02-today.md) · [01-product/today.md](../../01-product/today.md).
