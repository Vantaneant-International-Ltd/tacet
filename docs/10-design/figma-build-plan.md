# Figma Build Plan — Visual System V2 (Stages 4–6 execution)

> **Milestone:** Visual System V2 · **Purpose:** the deterministic execution spec for building Tacet
> in Figma once an editable (Full/Dev) seat is live. Figma is the **visual source of truth**; this
> doc is the build order and conventions the MCP `use_figma` calls follow. It exists so execution is
> fast and call-efficient (a Full seat caps at ~200 MCP calls/day). Nothing here is built yet —
> this is the plan.

---

## 0. The key idea: grayscale and hi-fi are the SAME components in different variable *modes*

The user's constraint — *"hi-fi should evolve directly from the wireframes, reusing the exact same
components, not rebuilding"* — is made literally true with **Figma variable modes**:

- The **Color** variable collection has **three modes: `Grayscale`, `Light`, `Dark`.**
- Every component paints from color *variables* (never raw hex).
- **Stage 4 (wireframes)** builds screens with their frames set to **`Grayscale` mode** → everything
  renders in neutral greys automatically. No colour, no branding — enforced by the mode, not by
  discipline.
- **Stage 6 (hi-fi)** switches the same frames to **`Light`/`Dark` mode** → the identical components
  instantly become the full warm Tacet palette. Typography, elevation, and media styles are layered
  on. **Zero rebuild.** The wireframes literally *are* V1 of the product.

This is the spine of the whole build. Everything else serves it.

---

## 1. File & page structure

One Figma file: **`Tacet — Visual System V2`**. Pages, in order:

| Page | Contents |
|---|---|
| **00 · Cover** | Title, one-line mission, version, legend |
| **01 · Foundations** | Variable collections (below), type styles, elevation/effect styles, grid styles |
| **02 · Components** | The component library (§4), every variant + state |
| **03 · Wireframes** | Stage 4 — the ~40 screens in `Grayscale` mode (§5) |
| **04 · High Fidelity** | Stage 6 — the same screens in `Light`/`Dark` mode, polished |
| **05 · Prototype** | Flow wiring (§6) — clickable connections between screens |
| **06 · Archive** | Superseded frames, reduction-pass casualties (kept, not deleted) |

Frame naming: `Pillar / Screen — Tier — Mode`, e.g. `Today / Feed — Desktop — Grayscale`. Tiers:
**Mobile 390×844**, **Tablet 834×1194**, **Desktop 1440×1024**, **Wide 1600×1024** (three-column).

---

## 2. Variable collections (Foundations) — mapped 1:1 from [tokens.md](./tokens.md)

Built first, because every component binds to them.

**Collection `Color`** — modes `Grayscale · Light · Dark`. Variables (Light/Dark from tokens.md §6;
Grayscale = neutral greys of matching lightness):
`canvas, surface, surface-raised, surface-sunken, hairline, text-primary, text-secondary,
text-tertiary, accent, accent-hover, accent-subtle, on-accent, positive, warning, danger,
focus-ring, on-media`. *(In Grayscale mode, `accent`→mid-grey, `positive`→slightly lighter grey, so
even the Save signal reads as tone, not colour.)*

**Collection `Space`** (number): `space-0…9` = 0,4,8,12,16,24,32,48,64,96; `gutter`=32.
**Collection `Radius`** (number): `xs 6, sm 10, md 14, lg 20, xl 28, full 999`.
**Collection `Type`** (number): sizes `display 36 … micro 12`; `leading-tight/snug/normal/relaxed`;
`tracking-tight/normal/wide`. *(Font family + weight → Text Styles, not variables.)*
**Collection `Icon`** (number): `icon-sm 18, icon-md 22, icon-lg 28`.
**Collection `Layout`** (number): `rail-width 250, context-width 320, feed-measure 672, topbar 56,
tabbar 72, fab 56`; breakpoints `bp-sm 520 … bp-2xl 1600`.

**Text Styles** (from [typography.md](./typography.md)): one per scale step, binding size/leading/
tracking variables + Jost weight (Space Mono for `meta`). **Effect Styles**: `elevation-1/2/3`
(per-mode shadow from tokens.md §8). **Grid Styles**: the three-column canvas (rail/feed/context).

---

## 3. Build order (call-efficient — batch many nodes per `use_figma` call)

1. **Foundations** — create all variable collections + modes + styles. (~3–5 calls, batched.)
2. **Primitives** — Button, IconButton, Input, Avatar, Chip, Badge, Icon set (24 glyphs),
   Loading/Skeleton, EmptyState, Toast. Each as a Figma **component with variant properties**.
3. **Composite components** — Content Card (moment), Person Card, Media gallery (1/2/3/4+ variants),
   SegmentedControl, Tabs, Menu, Modal, Sheet, plus the shell parts: Nav Rail, Tab Bar, Top Bar,
   Context Column, Compose FAB.
4. **Wireframes (Grayscale)** — assemble the ~40 screens (§5) from instances, Auto Layout
   throughout. Batch by pillar (all Today frames in one call, etc.).
5. **Reduction pass** — apply Stage-5 decisions in-file (dedupe, merge); move casualties to Archive.
6. **Hi-Fi** — duplicate the Wireframes frames into `04 · High Fidelity`, flip mode to `Light`/`Dark`,
   layer real media, refine spacing/type. Same component instances — no new components.
7. **Prototype** — wire flows (§6).

**Call budget note:** target 2–6 screens per `use_figma` call by generating multiple frames in one
script. At ~200 calls/day a full pass is realistically **2–4 working sessions**; I'll pace and
check in at each page boundary, not one-shot it.

---

## 4. Component library (from [components.md](./components.md)) — variant matrix

| Component | Variant properties |
|---|---|
| Button | `variant{primary,secondary,ghost,danger}` × `size{sm,md,lg}` × `state{rest,hover,focus,active,disabled,loading}` × `icon{none,left,right,only}` |
| IconButton | `state` × `active{true,false}` |
| Input | `state{rest,focus,error,disabled}` + optional label/help |
| Avatar | `size{sm,md,lg,xl}` × `ring{true,false}` × `presence{none,dot}` |
| Chip / Badge | Chip `tone{neutral,accent,open}`; Badge `semantic{source,kind,count-private}` |
| SegmentedControl | `items{2..4}` × `selected-index` |
| Tabs | `count` × `active` (Posts · Media · About) |
| Content Card | `media{none,1,2,3,4+}` × `kind{thought,photo,article,video,event}` — actions row **Reply · Share · Save** (spark), **no counts** |
| Person Card | `context{list,grid,quick}` × `relationship{none,follows-you,mutual}` |
| Media | `count{1,2,3,4+}` × `ratio{photo,video,portrait,square}` + scrim/`+N`/play overlays |
| Nav Rail / Tab Bar | active pillar; presence dot on Conversations (`--color-accent`, never a count) |
| Modal / Sheet / Menu / Toast | elevation-3; sheet `--radius-xl`; toast auto-dismiss |
| EmptyState / Skeleton | per-surface content slots |

Every state binds tokens (e.g. primary Button: `accent` bg, `on-accent` text, `radius-md`, focus =
`focus-ring` 2px/2px offset, disabled = `alpha-disabled`). Icons SUPPORT labels, never replace them.

## 5. Screen inventory (the reduced ~40 from [Stage 5](./stage-5-design-decisions.md))

Built in `03 · Wireframes` (Grayscale), then evolved in `04 · High Fidelity`:

Onboarding (4) · Today (5) · People & profiles (7, incl. Pinned) · Discover & Search (5) ·
Conversations (5) · Me/Home (8, incl. Export) · Compose & publishing (8, incl. Scheduled) ·
System (5: media viewer +states, EmptyState, Skeletons, Error, 404, Toast). Tiers per
[responsive.md](./responsive.md): mobile always; desktop/wide where layout diverges; tablet when it
diverges.

## 6. Prototype flows (from [IA §8](./information-architecture.md))

Wire these clickable paths: First-run → populated Today · Compose → choose intent → distribute ·
Person → Remote Profile → Follow → appears in People · Presence dot → Conversations → reply · Save →
Collection · Workspace switch · Settings → Export. Transitions use motion tokens
([motion.md](./motion.md)): pillar changes `dur-3`/`ease-in-out`; sheets `dur-3`/`ease-out`.

---

## 7. Ready-to-go checklist (when the seat is live)

1. `whoami` re-check → confirm Full/Dev seat. 2. `create_new_file` → `Tacet — Visual System V2`
(in the project URL you provide, else drafts). 3. Build Foundations → Components → Wireframes →
Reduction → Hi-Fi → Prototype, in that order, per §3. 4. Check in at each page boundary.

**Standing by for your "ready" signal.**
