# Profile System — Design System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md).

**Purpose.** Define how a *person* appears in Tacet across four contexts — your private Home,
your public Profile, a Remote person who lives elsewhere on the open web, and your Workspaces —
so that all four feel like one calm, warm product and never like separate apps. A profile in
Tacet is a **living space**, not a data sheet. This doc adopts the craft of the V1 screens
([Profile.tsx](../../client/src/app/screens/Profile.tsx), [Me.tsx](../../client/src/app/screens/Me.tsx),
[PublicPreview.tsx](../../client/src/app/screens/PublicPreview.tsx),
[ProfileView.tsx](../../client/src/app/ProfileView.tsx)) and rejects their one clear mistake: the
vanity-number scoreboard.

---

## 1. Why: a person is a home, not a profile

Everything in Tacet is built around **Home** — the permanent place a person's digital life lives
([publishing-philosophy.md](../01-product/publishing-philosophy.md)). A profile is what a home
looks like from the doorway. So the design brief is emotional before it is structural: opening a
profile should feel like *arriving at where someone lives*, and opening your own should feel like
*walking into your own home, not opening settings*.

Two doctrines govern the whole system:

- **People over content chrome, no public vanity counts** (design-principles L2, L6; identity.md:
  "Not a follower-count trophy"). We reject the reference mockups' scoreboard row —
  *"432 Posts · 1.2K Followers · 980 Following"*. Numbers-as-status do not exist in Tacet.
- **Human words only** (design-principles L9). Users see **Thought / Photo / Article / Video /
  Event** — never "Entry", never "post" as a concept. Where a remote person lives is a **human
  place**, never a server, instance, protocol, or software name.

---

## 2. The identity-forward layout (shared craft)

One header component presents every person — yours or theirs — so *you* and *them* are visibly one
product (V1 already shares `ProfileHeader`; V2 keeps that and refines it). Top to bottom:

- **Banner** at `--ratio-banner` (3 / 1). Editorial crop, `--radius-lg` on the card it sits in,
  a `--scrim-caption` foot only if text overlaps it. Optional; a home without one is still a home.
- **Avatar** overlapping the banner, `--radius-full`, with the optional **ring** (V1's `ring`
  prop) drawn in `--color-hairline` for separation, or `--color-accent` only to mark *this is you*.
- **Name** at `--text-title`, weight 500, `--tracking-tight`.
- **Handle** at `--text-meta` in `--font-mono`, `--color-text-secondary` — the one place mono
  earns its keep (`@you@tacet.social`).
- **A human bio** at `--text-body`, `--leading-relaxed`. The voice of the person, not a tagline.
- **A link / fields** — website and up to a few labelled fields, quiet rows in
  `--color-text-secondary`, link text in `--color-accent`.

### 2.1 What replaces the scoreboard

Follower/following **counts are not shown as public numbers, ever.** What a person actually needs
to know at a glance is *relationship*, not magnitude. In their place:

- **"Follows you"** — a quiet chip (`--text-micro`, `--color-accent-subtle`) when the relationship
  is mutual-inbound. Connection, not tally.
- **"People you both know"** — a small cluster of overlapping avatars (`--overlap-avatar`) with a
  human line: *"Ana, Devi and 3 others you follow."* Mutuals as **shared world**, not a score.
- **"Joined [month year]"** and where they live (§5) — orientation, not metrics.

The private *you* may see quiet **private counts as context** (drafts, saved) — but only in your own
Home, never rendered as a public badge on anyone (see §4, §7). This is the same law as the context
column: a number here is private context for you, never a public reward
([responsive.md §3](./responsive.md)).

---

## 3. Tabs within a profile

A profile organises its content into calm tabs — refining V1's hand-rolled `t-tab-pill` row into
the V2 **Tabs** component. The tabs are **Posts · Media · About** (a person with published work),
collapsing to just **About** when there is nothing to read yet.

- **Label** `--text-label`, weight 500. Active tab: `--color-text-primary` with a
  `--border-strong` underline in `--color-accent`; inactive: `--color-text-secondary`, no border
  (hierarchy by weight + colour, not boxes — design-principles L1).
- Underline slides between tabs on `--dur-2` / `--ease-out`; honours `prefers-reduced-motion`.
- Real `role="tablist"` / `role="tab"` / `aria-selected`, full keyboard arrow navigation
  (accessibility is the floor, L10). Touch targets ≥ 44px via padding.
- **Posts** renders the reading feed at `--feed-measure`. **Media** is an editorial gallery
  (`--ratio-*`, `--scrim-media` for `+N`, L5), not a thumbnail wall. **About** is the bio + quiet
  fact rows.

The word **Posts** is a tab label of convenience; individual items always name themselves in human
terms (Thought / Photo / Article / Video / Event).

---

## 4. The four contexts

### 4.1 My private Home (Me)

*"Walking into your own home, not opening settings."* This is where your home is most obviously
yours. It holds identity, your **owned** work, your **kept** content, collections, notes, and
history.

- **Shown:** your identity header (editable in place); your **Entries** (as Thoughts/Photos/…), and
  your **Saved Moments**, collections, reading-later, pinned, notes, recently viewed.
- **Actions:** edit identity, **View as public**, compose, organise (collect/note/pin), switch
  workspace, appearance. Leaving/export lives here too (§7).
- **How it differs:** private tools and **private counts are welcome here as *context*** —
  *"3 drafts", "42 saved"* — because they help you manage your own space. They are never public
  vanity. Saved/kept state uses `--color-positive`, the quiet private signal (tokens §6).
- **Context column (Me):** identity + **workspace switch**, and private context counts. Never a
  public tally, never a dashboard ([responsive.md §3](./responsive.md)).

#### Owned vs kept, clearly distinguished

Home is the union of two kinds of thing, and the line between them is **never blurred**
(publishing-philosophy: owned vs kept):

- **What you authored** — your Entries. Presented as first-class work you *own*; you can edit,
  publish, retract. A quiet **"Yours"** framing.
- **What you kept** — Saved Moments from the open web, wrapped in your collections and notes. The
  original stays attributed to its author (their name, their home); *your* note is visibly yours.
  A **"Kept"** framing, marked with `--color-positive`.

Visually they never masquerade as each other: a kept Moment always carries its author and source;
an owned Entry carries no source badge because *you* are the source.

### 4.2 My public Profile

What others see — *a person's living space, not a data sheet.* Rendered by the same header + tabs.

- **Shown:** identity, and **only public-facing content** — published Entries and public fields. No
  saved posts, no notes, no history, no private counts (V1's `PublicPreview` already enforces this).
- **Actions (as owner previewing):** **View as public** shows exactly what a visitor sees; an edit
  affordance returns you to Me. Until publishing ships, this space honestly says *"Your posts will
  appear here."*
- **Context column (Profile):** about you + "people you both know" — from the visitor's side.

### 4.3 Remote Profiles

Someone who lives **elsewhere on the open web**. You meet them as an equal — you can Follow, Reply,
Share the same as anyone (identity.md; federation stays invisible).

- **Shown:** the same identity-forward header and tabs; their public work; relationship context
  ("Follows you", people you both follow).
- **Actions:** **Follow / Reply / Share** — human verbs (L9), one accent action per view (L3).
  **"View original"** opens their home in the browser, phrased as visiting *their place*.
- **How it differs:** it is not editable, and it carries a **source attribution** — but expressed
  humanely (§6).
- **Context column (Profile · remote):** *about this person; where they post from as a human place;
  people you both follow* — so you understand someone **before** you follow
  ([responsive.md §3](./responsive.md)).

### 4.4 Workspaces (personal vs business)

A workspace is the **author** of published content (publishing-philosophy: "every Entry belongs to
exactly one workspace, which is the author"). *Renato* and *VNTA* are different identities entirely
— different name, handle, audience, public face.

- **Shown:** each workspace has its own identity header and public profile. Business vs personal is
  merely a workspace `kind`, not a separate product.
- **Actions:** **switch** workspace; compose/publish *as* the current workspace.
- **How it differs:** switching changes *who you are authoring as*. No ambient "current user" leaks
  across identities — no silent cross-identity posting.
- **Switching feels like changing Notion workspaces, not logging out** (§6).

---

## 5. Source attribution, done humanely

A remote person **lives somewhere**, and we show it — but as a **home**, a place a person belongs
to, never a server / instance / protocol / software term (doctrine L9). This is a required V2 fix:
V1's `SourceBadge` and `About` still append `source.software` (e.g. *"· Mastodon"*) — **retire that
trailing software term** in the profile surfaces.

- **Say:** *"Lives at social.coop"*, *"from their home at indieweb.social"* — a place name.
- **Never say:** "instance", "server", "ActivityPub", "Mastodon/Pixelfed as software", "federated".
- Rendered as a quiet line under the handle (`--text-meta`, `--color-text-secondary`), or as the
  **Home** fact row in About — value = the place, with no protocol suffix.

The plumbing stays out of sight, exactly like email (identity.md).

---

## 6. Workspace switching UI

A **calm switcher**, not an account menu. It lives at the **bottom of the rail** (≥ 900px) and in
**Me** on phone/tablet — the same place across tiers ([responsive.md §4](./responsive.md)).

- Current workspace shown as avatar + name + handle. Tap opens a small sheet
  (`--radius-xl`, `--elevation-3`, `--z-sheet`) listing your workspaces; the active one carries a
  quiet `--color-accent` check.
- Switching is a `--dur-3` cross-fade of identity chrome — **no re-auth, no logout screen.** It
  feels like sliding between rooms of the same home.
- **Identity is portable:** `@you@tacet.social` is shown plainly; the **protocol is invisible**.
  You never pick a server to be yourself.
- One accent action (L3); no badges, no counts on the switcher.

---

## 7. Public vs private, and the door out

| | A visitor sees | Only you see |
|---|---|---|
| Identity | name, handle, bio, links, home place | edit controls |
| Content | published Entries, public fields | Saved, collections, notes, reading-later, history |
| Counts | relationship context ("Follows you", mutuals) | private counts (drafts, saved) as context |
| Actions | Follow / Reply / Share / View original | edit, compose, switch workspace, export |

**Leaving is easy** (honesty over manipulation, L5; identity.md portability). Export/migration is a
first-class path in your Home, not a dark pattern: you can take your identity, your people, and your
work and go — `@you@tacet.social`, your Entries, and your history intact. A real door out is what
keeps Tacet honest.

---

## 8. Do / Don't

**Do**
- Lead with the person: face, name, bio, relationship. A living space.
- Replace counts with **connection** ("Follows you", "people you both know").
- Speak human: Thought / Photo / Article / Video / Event; Follow / Reply / Share.
- Show where a remote person lives as a **home / place**.
- Distinguish **owned** (yours) from **kept** (theirs, kept by you) in Home, always.
- Keep private counts private — context for you, never a public badge.
- Share one header across you / them / preview; carry all tokens by name.

**Don't**
- Show follower/following/post **counts as public numbers**. Ever.
- Say "instance", "server", "federation", "ActivityPub", "post", or **Entry** in the UI.
- Make your own Home feel like settings, or a remote profile feel like a data sheet.
- Let a kept Moment masquerade as your own authored work.
- Turn the context column into a dashboard or a scoreboard (L7).
- Require a logout to change workspace, or make leaving hard.
- Lean on borders for hierarchy where weight, colour, and whitespace will do (L1).

---

## 9. Trust: verified links & workspace kind

The pre-Figma review found one honest gap: a person arriving from LinkedIn can't yet tell that an
official company account is *really* that company, and a business has no calm way to say *this is
us*. The answer is a **trust surface that is factual, not a vanity tier** — it fits the honesty
doctrine (L5) exactly because it proves a fact rather than awards a status.

### 9.1 Verified links (`rel="me"`)

A person or a workspace can **prove they own** a domain or link. When a link is confirmed, it renders
with a **quiet "confirmed" affordance** — a small `check` glyph sitting on the link in
`--color-positive` (the same private/positive signal, not a hue-only cue), with a human tooltip:
*"confirmed theirs"*. Nothing louder.

- **Never** a blue-check status badge, a "verified" tier, or a rank. A confirmed link states one
  fact — *they proved they own this* — and nothing about worth or importance.
- On a **business workspace**, the confirmed domain reads as a plain fact in the link / About fact
  row: *"confirmed vnta.xyz"* (`--text-meta`, link text in `--color-accent`, the `check` in
  `--color-positive`). An *unconfirmed* link is simply a link — no scolding, no red mark.
- The affordance is legible without colour: the `check` glyph and the tooltip word carry the meaning
  (accessibility is the floor, L10).

### 9.2 Workspace kind cue

A quiet, non-vanity indicator distinguishes a **workspace / business** account from a person — this
is **orientation, not status**. It is a subtle *"Workspace"* label near the name (`--text-micro`,
`--color-text-secondary`) and/or a **squared-avatar treatment** (a business face steps from
`--radius-full` toward `--radius-md`, so a company reads as a company at a glance). It never implies
a business is more important than a person; it only helps you place who you're looking at.

Pair the kind cue with §9.1 verification so an **official company account is legible both in the
feed and on its own profile**: *VNTA* shows the "Workspace" cue **and** its *"confirmed vnta.xyz"*
link, and the two together are how you *know*.

### 9.3 Anti-impersonation

Handles are **unique per home** (`@vnta@tacet.social` is one place, one owner), and the **confirmed
link is how you know it's really them** — not a badge you're asked to trust on faith. No protocol
terms are ever surfaced (L9): you see a place name and a confirmed fact, never "rel=me",
"WebFinger", or "verification API". The plumbing stays out of sight, exactly like the home place
(§5).
