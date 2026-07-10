# Wireframes — Visual System V2, Stage 4 (Overview & Conventions)

> **Milestone:** Visual System V2 · **Stage:** 4 (Low-fidelity wireframes) · **Fidelity: GREY.**
> These are structural, not beautiful. They fix *layout, hierarchy, and flow* — where things go and
> why — before any pixel is polished. Colour, real type, and final spacing come in Stage 6 (**Claude
> Design** — our High-Fidelity tool, replacing Figma). Every screen here traces to the
> [IA](../information-architecture.md), obeys the revised
> [Context Column Law](../../11-decisions/ADR-012-the-context-column-law.md) (*your world, never your
> score* — a living space, not "contextual-or-empty"), and uses components from
> [components.md](../components.md).
>
> **Doctrine note (2026-07-09):** these grey frames predate the doctrine reframing. Where a frame
> assumes the context column is *empty by default* or that momentum/trending is banned outright, read
> it against the revised doctrine — the column is a *living* world-directed space, and the open web's
> real life may be **represented** (framed, relationship-scoped), never scored. See
> [stage-6-design-direction.md](../stage-6-design-direction.md) and
> [hifi/today.md](../hifi/today.md).

---

## How to read these

- **ASCII boxes are grey blocks.** No colour is implied. `▓` = image/media placeholder; `◯` =
  avatar; `[ Button ]` = a button; `( pill )` = chip/segmented control; `‹ icon ›` = an icon;
  `···` = truncation/more; `▁▁▁` = skeleton/loading; `·dot·` = quiet presence signal.
- **Every screen is annotated** with the component and token names it uses (e.g. *card padding
  `--space-5`*, *`--text-title`*), so Stage 6 has an unambiguous spec.
- **Tiers shown:** phone (`< 768`), and desktop/wide (`≥ 900` / `≥ 1200` with context column) where
  the layout meaningfully differs. Tablet is called out only when it diverges.
- **States are first-class:** empty, loading, and error are wireframed as their own frames, not
  afterthoughts.

## The frozen frame (every in-app screen sits inside this)

```
PHONE (<768)                         WIDE (≥1200) — three-column canvas
┌───────────────────────────┐        ┌────────┬────────────────────┬──────────────┐
│ ‹≡›   Title        ‹⌕› ◯   │ topbar │ tacet  │      Title         │  Context     │
├───────────────────────────┤        │        │                    │  (your world:│
│                           │        │ ◈ Today│   ┌──────────────┐  │  people,     │
│      screen content       │        │ People │   │   content    │  │  momentum,   │
│      (reading measure)    │        │ Discvr │   └──────────────┘  │  continue)   │
│                           │        │ Convos │   ┌──────────────┐  │              │
│                           │        │ Me     │   │   content    │  │              │
├───────────────────────────┤        │        │   └──────────────┘  │              │
│  ◈    ◯    ⊕    ◇    ◯    │ tabbar │  ⊕     │                    │              │
│ Today People Disc Conv Me  │ ← 5 pillars only; ⊕ Compose floats above, not a slot        │ ◯ you  │                    │              │
└───────────────────────────┘        └────────┴────────────────────┴──────────────┘
   FAB = ⊕ (compose)                   rail 250px   feed 42rem        context 320px
```

Rules encoded in the frame (**canonical — supersedes any individual frame that differs**):
- **The tab bar holds the five pillars only** — Today · People · Discover · Conversations · Me — in
  that order, on every tier. It is never four-plus-compose (Stage-5 fix A1).
- **Compose** floats: a FAB `⊕` bottom-right *above* the bar on phone/tablet, a labelled "New"
  button in the rail on desktop. Never a tab-bar slot, never a glowing centre orb.
- **Presence** shows as `·dot·` beside Conversations, never a red count.
- The **reading measure is fixed** (42rem) at every tier ≥ desktop; extra width becomes context,
  then quiet margin. The feed never widens into long lines.

## The wireframe set

| # | File | Screens |
|---|---|---|
| 01 | [onboarding](./01-onboarding.md) | Landing (ref), First-run welcome, Create identity, Bring your world |
| 02 | [today](./02-today.md) | Today (phone/desktop/wide), "You're done" end-state, empty, loading |
| 03 | [people-profiles](./03-people-profiles.md) | People, Remote Profile, Public Profile, Follow flow, empty |
| 04 | [discover-search](./04-discover-search.md) | Discover (phone/desktop/wide), Community, Search overlay |
| 05 | [conversations](./05-conversations.md) | Conversations list, Conversation reader, presence, reply, empty |
| 06 | [me-home](./06-me-home.md) | Me/Home, Saved, Collections, Collection detail, Reading Later, Recently Viewed, Workspace switcher, Settings, Identity editing |
| 07 | [compose-publishing](./07-compose-publishing.md) | Compose chooser, Thought, Photo, Article, Video, Event, Distribution, Retract vs Delete |
| 08 | [media-states](./08-media-states.md) | Media viewer, Empty states, Loading skeletons, Error, 404, responsive matrix |

Target: **~45 unique screens.** Focus on flow, not beauty. Stage 5 critiques and reduces this set;
Stage 6 renders the survivors in **Claude Design** (our High-Fidelity tool, replacing Figma; the
repository remains the source of truth — see
[stage-6-design-direction.md](../stage-6-design-direction.md)).
