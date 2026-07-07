# Product Direction

This document states where Tacet is going, and — just as important — where the
current repository still disagrees with that direction. It is the bridge between
the product Tacet is becoming and the code that exists today.

Read [FOUNDING_PRINCIPLES.md](FOUNDING_PRINCIPLES.md) first. This document assumes
it.

---

## The direction, in one paragraph

Tacet is your home on the open social web. One identity you own, one place your
people live, one calm window into the wider Fediverse. The entry point is **Today**
— not a "home feed." The relationship layer is **People**. The gateway to the open
web is **Discover**. Anxiety-free correspondence is **Conversations**. Your own
identity and place is **Me**. A feed exists inside this, but the feed is not the
product. People are the product.

## The product model (canonical)

```txt
Tacet
  Today          — the calm entry point. What's worth your attention now.
  People          — your relationships. The reason you're here.
  Discover        — the gateway to the wider open social web / Fediverse.
  Conversations   — correspondence, not notifications. Replaces anxiety with presence.
  Me              — your identity and your own place. Portable, owned.
```

Supporting surfaces (not top-level nav, but first-class): **Compose**,
**Communities**, **Settings**. Full definitions live in
[docs/01-product/information-architecture.md](docs/01-product/information-architecture.md).

Note deliberately: **"Home Feed" is not the core concept.** Tacet has a feed the
way a home has a window — useful, present, but not the reason the house exists.

## What Tacet is not

- Not a Twitter/X clone. Not an Instagram clone. Not a Mastodon clone. Not
  LinkedIn. Not Lifeinvader.
- Not a bridge that promises to connect every closed platform. We are honest: we
  are the best home for the **open** social web. Closed gardens stay closed until
  they open.
- Not an attention machine. No feature exists to maximize time-on-app.

## Legacy assumptions — superseded

The current codebase and its documents (`BUILD-LOCKFILE.md`, `DESIGN.md`,
`STATE.md`, `GOALS-SYNDICATION.md`, `src/`, `client/`, `migrations/`) were built
under earlier theses. Where those assumptions conflict with the direction above,
**this document supersedes them.** `docs/` is now the product's source of truth;
`BUILD-LOCKFILE.md` and `DESIGN.md` are stamped historical and no longer carry
authority (their banners point here).

These are **decisions taken**, not open questions — each item states the call and
why. Code is not deleted (the app still runs), but the *assumption* is overwritten:
nothing below stands as active product law anymore. Two genuinely strategic forks
(items 4 and 10) carry an opinionated recommendation and remain Ren's to veto; the
rest are settled by the five principles. Every item cites where the old assumption
lives so the code can be brought into line.

### 1. Rooms-first product model → now People-first

- **Where:** `BUILD-LOCKFILE.md` §1 ("rooms, not followings"), `src/routes/rooms.ts`,
  `client/src/views/RoomList.tsx`, `Room.tsx`.
- **Conflict:** The founding thesis was "rooms, not followings — a room is defined
  by its people, never a format." The new model is **People before posts** with
  following as first-class (already partly built — see follows migration). Rooms
  survive as **Communities**, a supporting surface, not the spine of the product.
- **Decision:** Superseded. People + Today are the spine; following is
  first-class. Rooms are demoted to **Communities**, a supporting surface. Retire
  "rooms, not followings" from all copy and product law.

### 2. Private "clubhouse" / invite-only language → now open by design

- **Where:** old `README` ("quiet, invite-only social network... Phase 1 — the
  clubhouse"), `BUILD-LOCKFILE.md` §6 Phase 1 "The clubhouse", invite gating in
  `src/routes/invites.ts`, `client/src/views/InvitePanel.tsx`.
- **Conflict:** "Invite-only clubhouse" reads as a closed private club. The
  direction is **Open before closed** — a home *on the open web*. Invites may
  remain a launch/anti-spam mechanic, but the framing "private clubhouse" is
  retired.
- **Decision:** Superseded. The "private clubhouse" framing is retired from all
  copy and positioning. Invites are kept only as a pragmatic launch / anti-spam
  gate, never as the identity of the product.

### 3. `tacet.house` addressing → now `tacet.social`

- **Where:** `client/src/views/You.tsx` (`@{handle}@tacet.house`),
  `PublicArchive.tsx`, `src/routes/rooms.ts` comment, `design/*.html` mockups.
- **Conflict:** The direction uses **tacet.social** as the address people type and
  the federation handle domain (`@you@tacet.social`). `tacet.house` is hardcoded in
  several places.
- **Decision:** Superseded. Canonical domain is **tacet.social**. Replace every
  `tacet.house` literal, and make the handle domain a single config value rather
  than a string scattered across views. (Ren confirms the registered domain; the
  product assumes `tacet.social`.)

### 4. "No likes / no notifications" ideology → internally contradicted already

- **Where:** `BUILD-LOCKFILE.md` §2 product law ("NO like counts... NO push
  notifications... NO red anywhere"), `DESIGN.md` §1. **But** Amendment 4 (same
  file, §10) *reverses* this and adds public **like + dislike counts** with icons;
  `migrations/0006_reactions.sql` and `client/src/views/Reactions.tsx` implement
  it.
- **Conflict:** The repo currently holds *both* the austere no-metrics ideology
  *and* a public like/dislike scoreboard. That is a live contradiction, not a
  settled position. The new principle is **Calm before addiction** and
  **Relationships before engagement** — which points away from public vanity
  counts, but not necessarily away from a private "this landed" signal.
- **Decision (recommended, Ren's veto):** Superseded toward **calm**. The austere
  "no reactions at all" ideology is retired *and* Amendment 4's public like/dislike
  scoreboard is rolled back. The direction: a **private positive signal** the
  author feels ("this landed"), never a public vanity count, and **no dislike**
  (see item 10). Reactions that arrive from federated posts are *shown as received*
  (we don't hide what the network sends) but Tacet does not originate a public
  count of its own. This is the reading of **Calm before addiction** +
  **Relationships before engagement**. It reverses Amendment 4; flagged for Ren
  because he authored that amendment twice. This is the single most consequential
  open call — everything else here follows the principles cleanly.

### 5. Notifications framing → now Conversations

- **Where:** product law "NO push notifications... never"; there is no
  notifications surface built.
- **Conflict:** The direction replaces anxiety-based notifications with
  **Conversations** — a surface for correspondence and presence, not red-dot
  urgency. This is a reframing, not a reversal: still no compulsive notification
  loop, but people do need to know when someone spoke to them.
- **Decision:** Superseded / adopted. Build **Conversations**. Keep the "never
  engineer for compulsion" law: people learn someone spoke to them without red-dot
  manipulation.

### 6. Feed-first / lens (Timeline + Grid) UX → Today is the entry point

- **Where:** `DESIGN.md` §5 "The Timeline ruling", lens switcher,
  `client/src/views/Timeline.tsx`, `Grid.tsx`, `Feed.tsx`.
- **Conflict:** The product is organized around lenses on a feed. The new entry
  point is **Today**, a calm digest of what's worth your attention — the feed is a
  component, not the home. Timeline/Grid become viewing options within surfaces,
  not the product's primary metaphor.
- **Decision:** Superseded. **Today** is the entry point. Reuse Timeline/Grid as
  viewing options inside surfaces; retire "feed / lenses" as the product's
  top-level mental model.

### 7. Austere, words-only, dark-only design → warm, rich, alive

- **Where:** `DESIGN.md` (no icons, no color but near-black, "words instead of
  icons", "darkness as canvas"), `BUILD-LOCKFILE.md` §4. **But** Amendment 4 says
  "icons are now allowed (warm/familiar direction)."
- **Conflict:** The original design language is deliberately cold and severe. The
  direction is **calm, rich, and alive** — Apple-quality warmth, not austerity;
  a light mode is expected, not just near-black. Icons are permitted.
- **Decision:** Superseded. The design language is **warm, rich, calm, and alive**,
  with icons permitted and a light mode expected. `docs/03-design-system/` is now
  authoritative; `DESIGN.md` is stamped historical. The dark tokens survive only as
  a *starting point* for a dark theme, not as the whole system.

### 8. The "Acknowledge" verb → superseded twice

- **Where:** `BUILD-LOCKFILE.md` §10 Amendment 1, `migrations/0002_acknowledgments.sql`,
  `src/lib/acks.ts`, `client/src/views/Acks.tsx`.
- **Conflict:** Amendment 1 added a room-visible "SEEN / WITH YOU / MORE" verb;
  Amendment 3 then said "appreciation stays the private keep"; Amendment 4 then
  added public reactions. The acknowledge verb is orphaned by later decisions.
- **Decision:** Superseded / retired. The room-visible "acknowledge" verb is gone;
  appreciation is the private positive signal (item 4). The `acks` code and
  migration stay until the app is reshaped, but carry no product authority.

### 9. Canonical-record / syndication goal → orthogonal, revisit scope

- **Where:** `GOALS-SYNDICATION.md`, and this VNTA-wide "TACET = canonical record,
  Instagram = syndication window" framing.
- **Conflict:** That goal frames Tacet as a brand-archive/publishing backend for
  VNTA houses. The consumer product ("your home on the open social web") is a
  different thing that happens to share a name. Both can be true, but they should
  not be conflated in one roadmap.
- **Decision:** Superseded / scoped out. The canonical-record/syndication goal is a
  **separate VNTA workstream** and does not shape the consumer product's IA. It may
  reuse Tacet infrastructure later; it is not part of "your home on the open social
  web." Do not let it bleed into the product roadmap.

### 10. Dislikes / "social media needs weapons" → tension with Calm

- **Where:** `BUILD-LOCKFILE.md` §10 Amendments 3 & 4 (dislikes/downvotes IN).
- **Conflict:** A public downvote/dislike is hard to reconcile with **Calm before
  addiction** and **Relationships before engagement** — it is, structurally, a
  pile-on mechanic. Amendment 3 itself asked for the "least-corrosive"
  implementation.
- **Decision (recommended, Ren's veto):** Superseded toward **calm**. Public
  dislike/downvote is retired — it is structurally a pile-on and cannot be
  reconciled with the five principles. Disagreement lives in **replies**
  (conversation), not in a downward tally. Flagged for Ren because he twice ruled
  dislikes IN; this is the deliberate reversal, tied to item 4.

### 11. Monolithic Worker + SPA → proposed monorepo shape

- **Where:** `src/` (single Hono Worker), `client/` (single SPA), no `apps/` or
  `packages/`.
- **Conflict:** The engineering direction proposes an `apps/` + `packages/` layout
  with a dedicated `federation/` package and an ActivityPub *adapter* layer. No
  federation code exists yet despite it being on the roadmap.
- **Decision:** Target set, execution deferred. The `apps/` + `packages/` layout
  with a `federation/` package and an ActivityPub *adapter* is the agreed shape —
  see
  [docs/06-engineering/folder-structure.md](docs/06-engineering/folder-structure.md).
  **Do not move files yet.** The restructure is a deliberate, separate step; only
  the direction is decided now.

## How decisions get made from here

- The five founding principles are fixed. Everything else is judged against them.
- Items 1–3, 5–9, and 11 are **settled** by the principles and take effect now as
  product direction. The code is brought into line during the app reshape; the
  *assumptions* are already overwritten.
- Items **4** (reactions) and **10** (dislike) carry an opinionated recommendation
  toward calm and are the only two open forks — Ren's to veto, because he authored
  the amendments they reverse. Everything else is decided.
- The `docs/` tree is the product's source of truth. `BUILD-LOCKFILE.md` and
  `DESIGN.md` are stamped **historical** and no longer carry authority; they are
  kept for history, not consulted for decisions. `STATE.md` continues to track
  build state only.

---

*The purpose of this page is honesty. Tacet is mid-pivot, and pretending otherwise
would be its own kind of dishonesty. This is the map of the gap between where the
product is going and where the code currently stands.*
