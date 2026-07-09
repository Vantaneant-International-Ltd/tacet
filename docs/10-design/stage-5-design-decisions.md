# Stage 5 — Reduction Pass & Design Decisions

> **Milestone:** Visual System V2 · **Stage:** 5 (Self-critique & reduction) · **Status:** Complete.
> A skeptical review of the whole corpus (16 docs + ~54 wireframe screens) surfaced a small number
> of real conflicts, two undefined token families, one doctrine slip, and several reduce/merge wins.
> This doc records **every decision** — what was fixed, what was cut, what the High-Fidelity build
> must add. Per the revised workflow, **Claude Design is the High-Fidelity build environment**
> (replacing Figma); the **repository remains the source of truth**. The markdown wireframes are
> supporting rationale, and these decisions are the spec the High-Fidelity screens are built from.
> *(References to "the Figma build" below mean the Claude Design build — see
> [stage-6-design-direction.md](./stage-6-design-direction.md).)*

---

## A. Must-fix inconsistencies — resolved

- **A1 · The tab bar holds five pillars, not four-plus-compose.** The frozen frame had drawn Compose
  as the *centre tab slot* (`◈ ◯ ⊕ ◇ ◯`) — impossible (there are five pillars + compose) and an
  accidental revival of the rejected glowing-orb. **Decision:** the tab bar is **Today · People ·
  Discover · Conversations · Me**, in that order, on every tier. **Compose floats** — a FAB above
  the bar (phone/tablet), a labelled "New" button in the rail (desktop). *Applied* to the canonical
  frame in [wireframes/00-overview.md](./wireframes/00-overview.md); it supersedes any individual
  frame that differs. **This is the single most important thing the Figma build must get right.**
- **A3 · "Messages", not "Msgs".** The Conversations filter is **All · Mentions · Replies ·
  Messages** everywhere (no abbreviation). Figma SegmentedControl uses the full word.
- **A4 / C1 · The heart glyph on Save is removed.** Onboarding rendered `♡ save` (a heart — the exact
  like-count furniture V2 forbids), wrong order, missing Share. **Fixed** to the canonical Content
  Card row **Reply · Share · Save**, Save shown with the `spark` glyph. *Applied.*
- **A5 / F2 · Presence dot colour is locked.** The unread/presence dot is always `--color-accent`.
  `--color-positive` is reserved **strictly** for Save/kept acknowledgement — it never colours the
  presence dot. Keeps the "positive = kept" rule clean.

## B. Undefined tokens — resolved

- **B1 · No `--ratio-4-3` / `--ratio-16-9`.** These were invented in `06-me-home`. The canonical set
  ([tokens.md §7](./tokens.md)) has `--ratio-square / photo (3:2) / video (16:9) / portrait (4:5) /
  banner (3:1)` and is declared complete. **Decision:** use `--ratio-photo` where 4:3 was meant and
  `--ratio-video` for 16:9. No new ratio token. The Figma variables use only the canonical five.
- **B2 · Icon sizes are now real tokens.** `--icon-sm/md/lg` were cited but undefined. **Fixed** —
  added `--icon-inline / --icon-sm 18 / --icon-md 22 / --icon-lg 28` to [tokens.md §5.3](./tokens.md).
  *Applied.* Figma exposes these as number variables.

## C. Doctrine — resolved

- **C2 · "Posts" ruling.** Two treatments of the forbidden word "post":
  1. **On-screen body copy** "Your posts will appear here" → **change** to "What you publish will
     appear here" (or the kind list). Body copy must never say "post".
  2. **The profile "Posts" tab label** → **blessed as an allowed exception**, narrowly. A one-word
     tab needs the most legible common word; "Moments" reads as jargon. **Decision:** "Posts" is an
     approved *tab label of convenience* and is the **only** sanctioned use of the word in the UI;
     [design-principles.md L9](./design-principles.md) is annotated to reflect this. Everywhere else,
     the word is banned.
- **C3 · Design-doc prose** may say "post" internally for brevity, but wireframe/UI copy says
  "moment". Non-blocking stylistic note.
- No other doctrine slips found: **no** public counts, vanity numbers, red badges, Notifications
  screen, autoplay, or "Entry"/"draft"/"server"/"federation" as user-facing anywhere. The
  "reject-the-casino" discipline held across all ~54 screens.

## D. Reductions (the actual reduction pass) — the Figma set is smaller than the markdown set

The Figma **Wireframes** page builds the *reduced* set below, not a 1:1 copy of the markdown frames.

- **D1 · One "search — empty" frame, not two.** The initial/empty search state was drawn twice
  (`04` and `08`). **Cut** to one, owned by `04-discover-search`. Search = phone + desktop(⌘K) + one
  empty. **−1 screen.**
- **D2 · Empty states live on their surface, not in a second gallery.** Each surface's empty state is
  specified once, on that surface. The `08` "empty-state gallery" becomes a **single pattern
  exemplar** (the EmptyState component itself), not a re-spec of five real screens (which had already
  drifted in copy). **−4 duplicate frames.**
- **D3 · Reading Later is a tab inside Saved, not a standalone screen.** It was reachable two ways and
  drawn twice; the standalone frame was ~identical to Saved with a "mark read" swap. **Cut** the
  standalone; Reading Later = a segment within Saved. **−1 screen.**
- **D4 · The Today responsive matrix is a table, not five re-drawn frames.** `08 §7` re-drew Today at
  all five tiers already wireframed in `02`. **Reduced** to the tier table in
  [responsive.md §1](./responsive.md). **−1 frame.**

Net: the polished Figma set targets **~40 screens** (down from ~54 markdown frames) — the reduction
the stage exists to produce. Removing duplication *before* Figma is what stops copy drift.

## E. Gaps the Figma build must add (missing screens/states)

The critique found real coverage holes. The Figma Wireframes page must include these (they were
under-specified in markdown):

- **E1 · Export / "leave" flow.** Doctrine makes leaving first-class, but only a Settings *row*
  exists. Add: an Export flow frame + its calm success state ("Your world is yours — packaged and
  ready"). Honest, no friction.
- **E2 · Scheduled distribution.** The `scheduled` state is named in every composer but never drawn.
  Add: the when-picker, and how a scheduled item appears in Home (a calm "Scheduled for …" state,
  never a countdown-urgency widget).
- **E3 · Per-surface error + loading.** One systematic Error/404 pattern exists, but Conversations,
  People, Discover, Me, and the composer lack loading/error frames. Add the **pattern applied** to
  each (skeleton per layout; inline error with retry). No surface ships without empty/loading/error.
- **E4 · Pinned.** Listed in the IA as a surface but wireframed nowhere. Add: a pinned moment at the
  top of a profile (the "📌 Pinned" treatment), phone + desktop.
- **E5 · Media viewer states.** The viewer at rest exists; add its blur-up loading and a
  "couldn't load this media" state (per [media-system.md §5](./media-system.md)).

## F. Nits — resolved/logged

- **F1 · Rail compose label is "New"** everywhere (was "Compose" once). Standardised.
- **F3 · People filter set** defined: **All · Close · Brands · Creators** (drop the unexplained
  "AI"; "Creators" is clearer and covers AI/brand/creator accounts without a cold label). Recorded
  in the IA/profile system for the Figma segmented control.
- **F4 · No "reward" language.** Onboarding's "gently rewards bringing a person" reworded to "the
  moment your world shows up" — no reward framing anywhere.
- **F5 / F6 · Stale status metadata** in `visual-system-v2.md` (still "Stage 2 in progress", ⏳
  markers) to be refreshed when the index is next touched. Non-blocking.

---

## The reduced screen inventory (what Figma's Wireframes page builds)

Grouped, ~40 screens, desktop · tablet · mobile as noted. This is the build list for Stage 4-in-Figma.

1. **Onboarding (4):** Landing (ref/keynote), Welcome home, Create identity, Bring your world.
2. **Today (5):** phone, desktop, wide (3-col + "continue"), "You're done" end-state, empty + loading.
3. **People & profiles (7):** People (phone/wide), Remote Profile (phone/wide), Public Profile,
   Follow flow, **Pinned (E4)**, People empty.
4. **Discover & Search (5):** Discover (phone/wide), Community, Search (phone / ⌘K / one empty).
5. **Conversations (5):** list (phone/wide), reader (phone/wide), presence signal, reply, empty.
6. **Me / Home (8):** Home (phone/wide), Saved (with Reading-Later segment), Collections, Collection
   detail, Recently Viewed, Workspace switcher, Settings, Identity editing, **Export/leave (E1)**.
7. **Compose & publishing (8):** chooser, Thought, Photo, Article, Video, Event, Distribution
   (incl. **Scheduled when-picker, E2**), Retract vs Delete.
8. **System (5):** Media viewer (+ **loading/error, E5**), EmptyState exemplar, Loading skeletons,
   Error, 404, Toast; **per-surface error/loading applied (E3)**.

---

## Stage gate

Stage 5 is complete as a **decision record**. The reduction and fixes above are the spec.
**Executing them lives in Figma (Stages 4–6), which is currently blocked** — see the status report
to the user (Figma seat/plan). Once unblocked, the Figma build follows this inventory exactly:
grayscale wireframes first (V1 of the product), then hi-fi evolved from the *same* components per
[the design system corpus](./visual-system-v2.md) — never rebuilt.
