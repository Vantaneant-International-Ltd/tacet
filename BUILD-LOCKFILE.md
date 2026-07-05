# TACET · BUILD-LOCKFILE

**Status: LOCKED.** This file is the top authority for all build work on TACET.
Authority order: BUILD-LOCKFILE.md → STATE.md → TACET-Concept-Dossier (01) → TACET-Interface-Dossier (02).
Where a dossier and this file conflict, this file wins. Changes to this file are made only by Ren.

---

## 1. What TACET is

A quiet, decentralised-by-design social network built on rooms, not followings. One content
core, many lenses (views). No public metrics, no ads, no algorithmic feed, no notifications.
A VNTA Group venture. The long-term architecture is in Dossier 01; the visual system is in
Dossier 02. This file defines what gets built, in what order, and what is forbidden.

A room is defined by its people and purpose, never by a content format. Format is the lens:
the same room can be read as a Timeline (the reading feeling), seen as a Grid (the photo-wall
feeling), and — later — discussed as an Assembly (the threaded feeling). You choose a room by
who is in it, and a lens by how you want to look. A room may carry a default lens, always
user-overridable. This is the answer to "what is the alternative": one set of people, many
ways to look, and no room is ever a format lock.

## 2. Product law (applies to every phase, non-negotiable)

- NO like counts, follower counts, view counts, karma, or any public number attached to people or posts.
- NO advertising, tracking pixels, or analytics beyond privacy-respecting server logs.
- NO algorithmic ordering. Chronology only, newest first.
- NO push notifications of any kind in any phase. The app never asks to be opened.
- NO red anywhere in the interface. No badges, no dots, no counters.
- The verbs on a post are REPLY, KEEP, and ACKNOWLEDGE (added by Amendment 1, §10). Keeps are private to the keeper; authors see that a post was kept, never by whom, never how many times (no number is ever shown). An acknowledgment is a single word from a small fixed set, attributed to its author and visible to the room; it is never counted, never ranked, has no negative or downward form, and no anonymous mode. The interface shows who acknowledged and with which word — never a number.
- Confidentiality: no real personal data in seed files, fixtures, or committed content. Placeholder data must be obviously placeholder and stripped before any deploy (BUILDT lesson).
- Accuracy: no fabricated capability claims in any copy. The README describes only what runs.

## 3. Stack (locked)

- **Runtime:** Cloudflare Workers. Local dev via `wrangler dev` (localhost, no domain needed).
- **API:** Hono (TypeScript).
- **Database:** Cloudflare D1 (SQLite). Migrations in `/migrations`, applied via wrangler, committed always.
- **Images:** Cloudflare R2 (local: wrangler R2 simulation). Original + one resized variant.
- **Frontend:** Vite + React + TypeScript, single-page app served by the Worker. Plain CSS with custom properties (design tokens); no UI framework, no Tailwind.
- **Auth:** invite-code registration, session cookie (httpOnly, secure), no third-party auth, no email required in Phase 1 (handle + passphrase).
- **Repo:** private, under the VNTA GitHub org, name `tacet`. AGPL + public release is a Phase 5 decision, not now.

No other services, packages-of-the-week, or infrastructure without a lockfile change.

## 4. Visual system (from Dossier 02, binding)

Tokens (CSS custom properties, exact values):
- `--canvas: #0D0D0D` — the page. Near-black, never pure black.
- `--panel: #161614` — raised surfaces.
- `--hairline: #2A2A27` — all rules and dividers. The only borders. 1px.
- `--secondary: #8A8A86` — supporting text, system text.
- `--dim: #55554F` — labels, metadata, mono captions.
- `--voice: #F5F5F2` — reserved EXCLUSIVELY for content a person wrote. Nothing system-side is ever `--voice`.

Type: Jost (variable, weights 300/400/500) for human content and headings; Space Mono for
all system labels (small caps via letterspacing + uppercase). No other fonts. No font weight
above 500. No icons in Phase 1; words instead (REPLY, KEEP, ROOMS, LENS, YOU).

Motion: nothing animates except the lens change (a ~300ms cross-fade) and standard focus states.
No skeleton shimmer, no spinners where a static "loading" word suffices.

## 5. The Timeline ruling (locked, supersedes Dossier 02 mockups)

Timeline is EDITORIAL, not chat:
- No avatars. A post shows a small mono byline: `HANDLE · HH:MM · DD MMM`.
- Post body in `--voice`, comfortable reading size (17-18px), generous line height.
- REPLY and KEEP as small mono labels beneath. Hairline. Large vertical gap between posts.
- No persistent composer. A single quiet WRITE affordance in the room header opens the
  composer as a full overlay; it is not visible while reading.
- Density target: roughly 3 posts per phone viewport, never more than 4.

Dossier 02's room-view mockups (avatars + bottom composer) are superseded by this section.

## 6. Phase plan

Rule of phases: **never begin phase N+1 while phase N has open bugs.** Each phase ends
usable and stable.

### Phase 1 — The clubhouse (current)
Scope: single house, invite-only. Rooms. Text posts and image posts. Replies (flat, one level).
Keep. Two lenses: TIMELINE (editorial, per §5) and GRID (square tiles, chronological, silent).
Lens choice persists per person per room. Admin (Ren) can create rooms and mint invite codes.
Runs entirely on localhost via wrangler dev.
Done means: Ren + at least one other person use it for a week and prefer it to a group chat.

Non-goals for Phase 1 (do not build, do not scaffold, do not "prepare for"):
federation/ActivityPub, instruments, Assembly/Journal/Theatre lenses, video, Portraits,
notifications (never), search, editing posts, DMs, mobile apps, deployment config beyond
what wrangler needs.

### Phase 2 — The address
Deploy to Cloudflare on a purchased domain. Real invites. Turnstile on registration.
No new features.

### Phase 3 — The quiet machinery
Assembly lens (nested threads, ordered by activity, no votes). Journal lens (long-form).
First instrument: Digest (daily note at a user-chosen hour, generated via the Anthropic API).

### Phase 4 — The doors open
ActivityPub federation (follow outside accounts into rooms; Portraits). The hard phase.
Gets its own lockfile amendment before it begins.

### Phase 5 — The gallery
Lens/instrument API, approval gate, AGPL public release, trademark filed before release.

### Phase 6 — Other surfaces
Native iOS, spatial. Apple developer account purchased here and not before.

## 7. Data model (Phase 1)

- `users` — id, handle (unique), passphrase_hash, created_at, is_admin
- `invites` — code, created_by, used_by (nullable), created_at, used_at
- `rooms` — id, slug, name, description, default_lens (timeline|grid), created_by, created_at
- `memberships` — user_id, room_id, joined_at (all rooms invite-wide in Phase 1; membership rows still recorded for later privacy rules)
- `posts` — id, room_id, author_id, kind (text|image), body, image_key (nullable, R2), created_at
- `replies` — id, post_id, author_id, body, created_at
- `keeps` — user_id, post_id, created_at (unique pair) — private to the keeper
- `acknowledgments` — user_id, post_id, word, created_at (unique pair; word from the fixed set; attributed and room-visible; never counted)
- `lens_prefs` — user_id, room_id, lens (timeline|grid)

Timestamps UTC. IDs are ULIDs. Soft deletes are not needed in Phase 1; hard delete own posts only.

## 8. Continuity protocol (how work stays resumable)

- `STATE.md` at repo root. Updated at the END of every working session with: current phase,
  done since last entry, open bugs, next three tasks, any decisions awaiting Ren.
- Every Claude Code session BEGINS by reading BUILD-LOCKFILE.md then STATE.md, then continues
  from "next three tasks". No session invents new scope.
- Conventional commits. Main is always runnable: `wrangler dev` from a fresh clone +
  `npm install` + documented migration command must work at every commit on main.
- Migrations are append-only and committed with the code that needs them.
- A minimal test suite (API routes + auth) runs via `npm test`; a session does not end with
  failing tests.
- Decisions Claude cannot make (scope changes, visual rulings, anything touching product law)
  are written into STATE.md under "awaiting Ren" and left undone.

## 9. Open items awaiting Ren

- Domain purchase (Phase 2 gate).
- Confirmation or overrule of the editorial Timeline ruling in §5 (assumed confirmed).
- Trademark search for TACET (before Phase 5, ideally earlier).

## 10. Amendment log

### Amendment 1 — acknowledgment, rooms-as-people, the why-surface (authorised by Ren, 2026-07-05)

- **ACKNOWLEDGE** becomes a third post verb (§2). A reader may place a single word from a
  small fixed set on a post. It is **attributed** (shows who) and **visible to the room**,
  **never counted**, **never ranked**, has **no negative/downward form**, and **no anonymous
  mode**. It never reorders anything (chronology stands). Keep remains private; the two lanes
  are deliberate — Keep is for yourself, Acknowledge is for the room.
- The fixed vocabulary for Phase 1: `SEEN`, `WITH YOU`, `MORE`. No opposite word exists.
- **Rooms are defined by people/purpose, not format** (§1). Format is the lens. A room may
  carry a **default lens**, always user-overridable.
- **Keep** gains a private **"your keeps"** view (personal, no metrics, cross-room).
- The house **explains its difference to members** in two places: a first-run **onboarding**
  and a permanent statement in the **YOU / settings** surface.
- Everything else stands. Still no counts, no algorithm, no ads, no notifications, no red.
  Acknowledgments show names and words, never a number — the "no public number" law holds.
