# Design Audit — Visual System V2, Stage 1

> **Milestone:** Visual System V2 · **Stage:** 1 of 6 (Audit) · **Author:** Head of Design
> **Status:** Complete — feeds the Information Architecture review and Design System V2.
>
> This is a *refinement* milestone, not a redesign. Navigation, information architecture,
> features, and product concepts are **frozen** (see [`../08-roadmap/visual-system-v2.md`](../08-roadmap/visual-system-v2.md)).
> The job is to make every interaction feel intentional — WWDC-inevitable, calm, timeless —
> without adding a single feature.

---

## 0. Method

This audit is grounded in three sources, not impressions:

1. **The product doctrine** — the manifesto, product docs, Human Interface Guidelines, the
   existing Design System docs (`03-design-system/*`), the brand voice, and the
   [Publishing Philosophy](../01-product/publishing-philosophy.md).
2. **The V1 implementation as it actually ships** — the real tokens in
   [`client/src/design/theme.css`](../../client/src/design/theme.css), the primitives in
   `client/src/design/primitives.tsx`, the icon set in `client/src/design/icons.tsx`, and
   every screen in `client/src/app/screens/`.
3. **The inspiration references** supplied for this milestone — treated as *emotional*
   references only, and explicitly filtered against Tacet's founding laws (§6).

Everything below distinguishes **what is doctrine** (must hold) from **what is a design
decision** (open to refinement).

---

## 1. Verdict in one paragraph

Tacet V1 is already a coherent, disciplined system — not a pile of screens. The token layer
is close to production-grade: a nine-step type scale, an 8px spacing rhythm, a six-step radius
scale, three warm-tinted elevations, four motion durations with two shared easings, and a
**complete** light **and** dark palette that is warm rather than inverted. The five pillars are
clear and the navigation is calm. What V1 lacks is not structure but *finish*: line-heights and
a handful of overlay colours are hardcoded rather than tokenised; card padding drifts between
surfaces; motion is defined as tokens but barely used; media presentation is functional rather
than editorial; and light mode, though fully built, has never been given the same loving pass as
dark. V2 is therefore a **polish-and-tighten** pass over a good foundation, plus filling four
genuine gaps (motion library, form/overlay components, tablet layout, and a documented
component spec). It is not a rescue.

---

## 2. What works — keep and protect

These are strengths. V2 must not regress them.

- **The token architecture.** `theme.css` is a single source of truth with semantic names
  (`--color-surface-raised`, `--text-body`, `--space-5`, `--elevation-2`). Primitives consume
  tokens exclusively — no hardcoded colour or spacing inside `Button`, `Card`, `Avatar`, `Chip`.
  This is the backbone of V2; we extend it, we don't replace it.
- **The warm palette.** Light canvas is `#F7F4EF` (ivory, never `#FFF`); dark canvas is `#0D0D0D`
  lifted by `#161614` surfaces. Text is warm near-black `#23201C`, not `#000`. Accent is a single
  restrained lavender (`#7A5CD0` light / `#A88FE6` dark). This *is* the Tacet feeling — cosy, not
  clinical — and it already meets the "warmth over austerity" principle.
- **The five-pillar shell.** Today · People · Discover · Conversations · Me. Left rail on desktop
  (≥900px), bottom tab bar + top bar on mobile, one compose affordance. Calm, legible, frozen.
- **Icon language.** 22 custom icons on a 24px grid, 1.75 stroke, round caps, `currentColor`,
  one filled glyph (`spark`) reserved for the private positive signal. Coherent and original —
  not an off-the-shelf set.
- **Dark/light plumbing.** `data-theme` on `<html>`, three modes (system/light/dark), boot-time
  application to prevent flash, media-query fallback that respects manual override. Correct.
- **Discipline against engagement furniture.** No infinite scroll, no red badges, no public
  vanity counts in the shipped shell. This is the product's spine and its hardest-won asset.
- **Accessibility floor.** `:focus-visible` ring (2px accent, 2px offset), `prefers-reduced-motion`
  honoured, semantic controls, visually-hidden labels on icon buttons. A real floor to build on.

---

## 3. What feels unfinished — the V2 work list

Ordered roughly by visible impact.

### 3.1 Typography carries too little of the load
The scale exists and is good, but line-heights are written inline across CSS (`1.5`, `1.55`,
`1.58`, `1.6`) instead of living as tokens, so vertical rhythm drifts between screens. Headings
and body sit at similar weights (500 vs 400) with modest size contrast, so hierarchy currently
leans on *borders and cards* rather than *type* — the exact inversion the brief calls out
("Typography should carry the interface. Not borders."). **V2: promote line-height and
letter-spacing to tokens, widen the size/weight contrast between title→heading→body, and let
whitespace + type establish hierarchy so cards can lose chrome.**

### 3.2 Card chrome is heavier than the philosophy wants
Three different card paddings are in use (`--space-5`; `--space-4/--space-5`; `--space-3/--space-4`
for posts, person rows, conversation rows respectively). Every card carries a visible border
*and* a radius *and* (on hover) an elevation shift. The doctrine is "remove before adding" and
"should they breathe more, need less chrome?" **V2: one card padding rhythm (comfortable vs
compact, nothing else), lean on hairline OR elevation but rarely both, and let content spacing —
not container outlines — separate items.**

### 3.3 Motion is defined but unused
`--dur-1..4` (120/200/320/480ms) and two easings exist as tokens, but the app ships essentially
static: a single page `t-fade`. The references communicate *depth and confidence* largely through
motion (things that arrive, settle, and acknowledge you). **V2: a real motion library — page
transitions, sheet spring-in, save/pin acknowledgement, skeleton loading, hover/focus feedback —
all built on the existing tokens, all `prefers-reduced-motion`-complete. Purposeful, never
decorative.**

### 3.4 Media is presented functionally, not editorially
Media overlays use hardcoded `rgba(255,255,255,.92)`, `#000 55%`, and one-off `text-shadow`;
aspect ratios (`3/2`, `1/1`) are inline literals; galleries collapse at a media-only 520px
breakpoint. The brief wants media to "feel editorial" — cropping, radius, spacing, captions,
loading all intentional. **V2: a media system — tokenised aspect ratios, a consistent overlay
scrim token, unified corner radius, graceful multi-image grids, blur-up loading, and caption
typography — so a photo from Pixelfed or a video from PeerTube reads like a magazine spread, not
a thumbnail.**

### 3.5 Light mode is built but not *loved*
The palette is complete and passes AA, but every design decision in the app has clearly been made
looking at dark mode. Light mode needs its own pass: elevation reads differently on ivory,
scrims must not go muddy, the accent needs contrast checking on `--color-surface`, and warmth must
survive ("warm, quiet, readable, never sterile"). **V2: a dedicated light-mode review with
side-by-side parity checks on every surface.**

### 3.6 Component coverage has gaps
Primitives cover Button/IconButton/Card/Avatar/Chip/SectionHeading/Loading/EmptyState. Missing
and currently improvised per-screen: **form inputs** (only base CSS), **modal/dialog** (only
sheets), **dropdown/menu**, **toast/inline confirmation**, **badge semantics** (Chip is
overloaded), **tabs** (hand-rolled in Me/Profile), **segmented control** (the Today filter row).
**V2: promote these to documented primitives with all states (rest/hover/focus/active/disabled/
loading) so screens stop re-inventing them.**

### 3.7 Tablet is scaled, not designed
Two real breakpoints exist (900px rail; small media/grid tweaks). Between phone and desktop, the
layout is stretched mobile. The brief explicitly wants tablet "intentionally designed, never
merely scaled." **V2: a genuine tablet tier (≈768px) — two-column Discover, wider reading measure,
rail-or-tab decision.**

### 3.8 Empty, loading, and error states are under-specified
`EmptyState` and `Loading` primitives exist, but the pattern isn't applied consistently and there
is no error/skeleton library. The doctrine ("empty is invitation, loading is calm, errors say
what happened then what to do") needs a component-level home. **V2: a states system.**

---

## 4. What should remain (doctrine — do not touch)

These are frozen by the brief and the manifesto. The audit records them so V2 never "improves"
them by accident:

- The **five pillars** and their meanings; the navigation model.
- **No infinite scroll** — Today ends. "Done" is a real state.
- **No public vanity metrics** — likes, follower counts, view counts, streaks, karma as *public
  numbers* do not appear. Metrics are private context at most.
- **No red-badge navigation** — presence of new correspondence shown by a quiet dot or weight
  change, never a red number.
- **No protocol terminology in the UI** — never "ActivityPub", "instance", "federation",
  "server", "post"; the word **Entry** is an internal engineering abstraction and must never
  surface. Users see Thought · Photo · Article · Video · Event, and Follow · Reply · Share · Save.
- **People before posts** — faces present, names legible, relationship never buried.
- **Honesty over manipulation** — no dark patterns, easy to leave, empty states state facts.
- The **warm** foundation — light mode is a first-class citizen, never an afterthought.

---

## 5. What should change (design decisions open for V2)

These are *not* doctrine and V2 may revise them, with rationale documented:

1. **Hierarchy source:** shift from container-chrome-led to type-and-space-led (§3.1, §3.2).
2. **Line-height / letter-spacing / border-width / aspect-ratio / scrim-opacity:** promote to
   tokens (removes the hardcoded outliers found in the implementation).
3. **Card system:** collapse three paddings to one rhythm; reduce simultaneous chrome.
4. **Motion:** go from "tokens exist" to "a used, coherent motion language."
5. **Media:** functional → editorial.
6. **Component library:** fill the six gaps in §3.6 and document every state.
7. **Breakpoints:** add a real tablet tier; formalise desktop max widths and ultra-wide behaviour.
8. **Light mode:** dedicated parity pass.
9. **Landing page:** currently a separate, dark-only visual language (`.lp-*`, its own colours).
   Decide deliberately whether it stays a distinct "keynote surface" (recommended) or adopts V2
   tokens. Either way, document the boundary.

---

## 6. The inspiration references, filtered against doctrine

The supplied references are beautiful and communicate qualities Tacet wants. But several are drawn
from mainstream social apps and carry mechanics Tacet's founding principles **prohibit**. As Head
of Design I extract the feeling and reject the furniture, explicitly:

> **Doctrine-reconciliation note (2026-07-09).** This section is the original Stage-1 filter, and it
> was too blunt in one direction: it rejected *concepts* (trending, momentum, presence panels,
> federation reassurance) when only the incumbents' *manipulative implementations* were the problem.
> The governing line is now **informing vs. manipulating** ([design-principles L11](./design-principles.md),
> [ADR-011](../11-decisions/ADR-011-metrics-are-context-not-rewards.md),
> [ADR-012](../11-decisions/ADR-012-the-context-column-law.md)): representing the open web's real life
> (people, momentum, active communities) is *informing* and belongs; only *self-directed scores,
> people-rankings, and anxiety furniture* are cut. Read the "Reject" list below as **cut the
> manipulation, represent the reality** — see the per-item reconciliation and
> [stage-6-design-direction.md](./stage-6-design-direction.md). The "your world, never your score"
> context column ([ADR-012](../11-decisions/ADR-012-the-context-column-law.md)) supersedes the
> "calm context or scoreboard" binary this section drew.

**Adopt (emotional qualities to pursue):**
- **Depth and layering** — content floats on considered surfaces; elevation tells a spatial story.
- **Media-first confidence** — large, well-cropped imagery treated as content, not decoration.
- **Editorial calm** — generous whitespace, strong type, one clear subject per view.
- **Identity-forward profiles** — a person's space feels like *a living room*, not a data sheet.
  (The banner + avatar + "a person's space" framing is very Tacet.)
- **Premium restraint in dark surfaces** — rich near-blacks, a single lavender accent, glow used
  sparingly as *warmth*, not as a casino.
- **A real desktop three-column canvas** *(from the desktop reference)* — persistent left rail,
  a centred single-column reading feed at a comfortable measure, and a right-hand "context" column.
  V1's desktop is just rail + one column and wastes the width. This is the strongest structural
  idea in the references and belongs in the Responsive system (Stage 2 §responsive, Stage 3 IA).
  **But the right column must hold *calm context* (people close to you, a quiet "continue where you
  left off"), never a scoreboard** — see rejects below.

**Reject the manipulation / represent the reality (per-item, reconciled 2026-07-09):**
- **Per-card self-directed count rows** (`24 · 6 · 7`, `142 · 18 · 23`) as a standing scoreboard on
  every post. **Still cut** as a per-card scoreboard. *But* world-directed reception ("an active
  thread", "shared widely"), framed and softened, may be represented in editorial/context surfaces —
  it is informing, not a self-score ([ADR-011](../11-decisions/ADR-011-metrics-are-context-not-rewards.md)).
- **A live "Federation status" *dashboard*** (*"Connected servers 2,418 · Active users 47.3K"* with a
  pulsing map, as persistent furniture). **Cut** as a live ticker, and never expose server/instance
  terminology. *But* a one-time / on-demand **"you're connected to a live open web" reassurance**
  (educational, human-worded — "Learn how it works") is *informing wonder* and is allowed. The enemy
  is the persistent metrics panel, not the fact that the open web is large and alive.
- **"Trending" as a raw ascending leaderboard** ("12.4K people talking" as the headline, ranked hot
  topics). **Cut** the leaderboard form. *But* **represented momentum** — *what your world is reading /
  discussing*, relationship-scoped, led by the thing not the number — is Discover as editorial
  exploration of the open web and belongs (discover.md; [ADR-011](../11-decisions/ADR-011-metrics-are-context-not-rewards.md)).
- **Story rings as a streak / urgency halo** ("watch me before it disappears"). **Cut** the FOMO
  mechanic. *But* "people you care about, and their genuine recent moments" can exist without a
  disappearing-timer — revisit in a dedicated spec.
- **An "Activity"/Notifications tab with counts.** **Cut.** Tacet has **Conversations**
  (correspondence), not a dopamine inbox; presence is a quiet dot, never a red number. (This one is a
  self-directed anxiety machine — the reject stands in full.)
- **The glowing center-orb nav button.** **Cut** the spectacle; Compose stays a quiet, legible
  affordance. (Reject stands.)
- **"+N" follower/stat chrome and vanity number rows on profiles.** **Cut** the self-directed
  scoreboard about your own reach. Keep identity. (Reject stands.)

**Net read on the references (reconciled):** they are a masterclass in *surface craft* — depth, media,
type, the desktop three-column canvas — *and* in showing the open web's real life. V2 takes the craft
**and represents the reality**, while cutting the casino: self-directed scores, people-rankings, and
anxiety furniture. The line is **informing vs. manipulating**, not *rich vs. empty*. The desktop
reference proves the layout opportunity (three columns) and the world worth showing (people, momentum,
an alive open web) — with the manipulative framing removed, not the world itself.

This distinction is the single most important design judgement of the milestone: **Tacet can look
as premium as the references without becoming the product they came from.** If a screen only feels
good because it borrowed an engagement mechanic, it does not ship.

---

## 7. Token-level findings (the concrete punch list)

Carried forward verbatim into Stage 2 (Design System V2):

| # | Finding | Location (V1) | V2 action |
|---|---------|---------------|-----------|
| T1 | Line-heights hardcoded (`1.5/1.55/1.58/1.6`) | `app.css` throughout | Add `--leading-*` tokens |
| T2 | No letter-spacing tokens | — | Add `--tracking-*` (tight display, normal body, wide micro/overline) |
| T3 | No border-width token (`1px` literals) | throughout | Add `--border-hairline` (+ optional `--border-strong`) |
| T4 | Media overlay colours hardcoded | `app.css:318,319,389,399,652` | Add `--scrim-*` + `--on-media` tokens |
| T5 | Aspect ratios inline (`3/2`, `1/1`) | `app.css:241,384` | Add `--ratio-*` tokens |
| T6 | Avatar stacking offset `-8px` literal | `app.css:206` | Add `--overlap-avatar` |
| T7 | Card padding inconsistent (3 values) | `.t-post/.t-personrow/.t-convorow` | One padding rhythm |
| T8 | Motion tokens defined but unused | `theme.css:45-51` | Build motion library on them |
| T9 | Only 900px + media breakpoints | `app.css` | Add tablet (~768px) tier + max-width scale |
| T10 | No opacity/alpha scale | — | Add `--alpha-*` for disabled/scrim/hover states |

---

## 8. Stage gate

Stage 1 is complete. Proceeding to:

- **Stage 2 — Design System V2:** extend `theme.css` tokens (T1–T10), specify every component and
  state, define motion, media, profile/conversation/compose layout systems. Documented in
  `docs/10-design/` (tokens, typography, spacing, motion, components, navigation, responsive,
  accessibility, media-system, profile-system, conversation-system, publishing-ui).
- **Stage 3 — Information Architecture:** confirm the frozen nav, pressure-test where every
  surface lives, tighten flows. (Navigation stays; clarity improves.)
- **Stage 4 — Low-fidelity wireframes** (grey, ~30–50 screens).
- **Stage 5 — Self-critique and reduction.**
- **Stage 6 — High Fidelity + Prototype in Claude Design** (desktop/tablet/mobile, components,
  variables, prototype). *(Claude Design replaces Figma — see
  [stage-6-design-direction.md](./stage-6-design-direction.md).)*
- **Stage 7 — Claude Design → Repository handoff** (the repo remains the source of truth).

**Design North Star for the milestone:** *Would Apple ship this? Would Linear accept it? Will it
still feel modern in five years? Does it feel unmistakably like Tacet?* If any answer is no, keep
refining.
