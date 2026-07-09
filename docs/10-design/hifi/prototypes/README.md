# Handoff: Tacet — Stage 6 High Fidelity (full app, 16 screens)

## Overview
High-fidelity Stage 6 designs for **Tacet — your home on the open social web** (a VNTA Group venture): the five pillars (Today, People, Discover, Conversations, Me) plus Remote Profile, Compose, and Saved/Collections — each in desktop and mobile. The repo remains the source of truth for doctrine and tokens:

> **Repo:** https://github.com/Vantaneant-International-Ltd/tacet
> Read `docs/10-design/tokens.md`, `docs/10-design/design-principles.md` (esp. L11),
> `docs/06-decisions/ADR-011` + `ADR-012`, and `docs/10-design/information-architecture.md`
> before implementing. Where this handoff and those docs disagree, the docs win —
> except for the deliberate Stage-6 additions listed in `stage-6-delta-log.md`
> (included here), which are proposed token/spec additions to land back in the repo.

## About the Design Files
The files in `screens standalone/` are **design references created in HTML** — self-contained prototypes showing intended look and behavior, not production code to copy. The task is to **recreate these designs in the tacet codebase's existing environment** — a React + Vite client (`client/src/`, styles in `client/src/styles.css`, theme vars in `client/src/design/theme.css`, icons in `client/src/design/icons.tsx`) — using its established patterns. Each HTML file opens directly in a browser and works offline; use them side-by-side with the running app.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and shadows are final and are expressed **exclusively through the semantic CSS custom properties** defined in each file's `<style>` block (`:root` = dark "lamplit near-black" default; `[data-theme="light"]` = warm ivory). Recreate pixel-perfectly, but bind to token *names*, never raw values (repo law: no raw values in components).

## Design Tokens
All canonical values are in `docs/10-design/tokens.md` and are reproduced verbatim at the top of every HTML file. Implement them once in `client/src/design/theme.css`.

**Stage-6 additions (new, style-layer — see delta log items 29–49):**
- `--glow-ambient` — accent-tinted radial washes at canvas top (dark 8%/5%, light 7%/4% of `--color-accent`)
- `--surface-gradient` — `linear-gradient(180deg, color-mix(in srgb, var(--color-surface-raised) 70%, var(--color-surface)), var(--color-surface))` (light: raised→surface)
- `--edge-highlight` — `inset 0 1px 0` white at 5% (dark) / 80% (light)
- `--glow-accent` — `0 8px 28px` accent at 32% (dark) / 18% (light)
- `--media-vignette` — inset bottom vignette + 1px inner ring on hero/poster media
- Whisper hairline on cards: `color-mix(in srgb, var(--color-hairline) 60%, transparent)` **plus** `--elevation-1` + `--edge-highlight`
- Missing size tokens used raw (propose adding): avatar 96/72/64/44/36/28/24, thumb 56, play-disc 56

**Fonts:** Jost (400/500; 300 reserved for display, 600 rare emphasis) + Space Mono (meta only: handles, timestamps, qualitative reception lines — never reading copy, never uppercase-letterspaced). Loaded from Google Fonts; the standalone files have them inlined.

## Screens / Views
Every desktop screen shares: **architectural left rail** (250px, sticky full-height, surface→canvas gradient, hairline right edge, accent lamp glow behind the `tacet` wordmark, ⌘K search trigger, five pillars — active = accent-subtle gradient pill with accent text, presence dot on Conversations, gradient "New" compose button with `--glow-accent`, identity foot with theme toggle) · **centred feed** at `minmax(0, 42rem)` · **context column** (320px, hairline-left, per-pillar content) · gutter 32px · ambient glow on the canvas.

1. **Today Desktop** — display-size greeting masthead + honest day-line + avatar cluster + mono provenance line naming the places tonight's digest comes from; inline composer (neutral — the rail "New" is the view's one accent); editorial groups "This evening" / "Earlier today" (micro label + hairline flourish); HERO lead moment (full-bleed 3/2 photo, caption on `--scrim-caption`, `--elevation-2`); accent-tinted curator moment ("A conversation worth joining") with participant face cluster + qualitative line ("active now · people you follow are here" — **never numeric tallies**); media-first 3-image photo essay (lead + two stacked squares, 4px gutters); unboxed quiet Thought; poster-first film card (play disc over `--scrim-media`, mono duration chip, **no autoplay**); community curator moment with "Step in" door; **the bounded end** ("That's today. You're all caught up."). Context column: People close to you (presence dots, glowing, static), Continue (Resume reading), Across your world (faces/thumb per item, qualitative phrasing), Communities active today, accent-lit "open web" reassurance panel (**no counters, no map**).
2. **Today Mobile** (430px) — solid top bar (wordmark, search, avatar → Me), compact masthead, **lens row** segmented control (For You · Following · Local · Trending — neutral, thumb raised, never accent), hero card, curator moment, triptych, quiet thought, film, bounded end; **tab bar**: Today · People · [compose FAB, centre, raised, accent gradient + glow] · Discover · Chats (presence dot, never a count).
3. **People Desktop** — "Your people." masthead; groups Around now / Your people / New for you; person rows (avatar 44, name subheading, mono handle, standing phrase in body-sm secondary, Following/Follow secondary pills — **no follower counts, no rankings**). Context: person-in-focus card, "You both know" cluster, recently around.
4. **People Mobile** — same list condensed; People tab active.
5. **Discover Desktop** — "Find your place." masthead; Worth meeting (person cards, ONE primary Follow on the featured person, photo strip on the second); Communities that moved ("Step in" ghost doors); accent-tinted conversation door; bounded ending line. Context: About this corner (pixel.town card), people there, communities active today.
6. **Discover Mobile** — condensed; Discover tab active.
7. **Conversations Desktop** — open-thread state: "All conversations" back link, thread header card (participant cluster + Mastodon place badge), calm message rows (yours = accent-tinted bubble, indented), reply field + Send primary. Context: participants (presence), "It hangs off" origin moment, Waiting quietly rows. **No notification center exists — this surface absorbs it (IA §5).**
8. **Conversations Mobile** — thread LIST state: rows with presence dot for unread (never a count), preview line, time; ending line "Nothing is waiting to be cleared." Chats tab active.
9. **Me Desktop** — identity header (avatar 96, display name, mono address, bio, Edit profile / View as public), Tabs (Moments · Saved · Collections · Reading Later, accent underline), Pinned + This week moments (**no counts on your own posts, ever**), draft card. Context: "For you only" private self-context (3 drafts — private, labelled), Workspace switcher (Personal ✓ / VNTA Workspace), portability note ("your identity can leave with you").
10. **Me Mobile** — condensed; Me is the top-bar avatar (no Me tab in the tab bar).
11. **Remote Profile Desktop** — 3/1 banner (vignette), 96px avatar overlapping (4px canvas ring), name + Pixelfed place badge, mono address + human home line, Message ghost + **Follow primary** (the view's accent), bio; Recent moments (triptych + captioned photo); "Older moments live at their home on pixel.town → Visit their home". Context: About, You both follow cluster, Their communities. **No follower/post counts.**
12. **Remote Profile Mobile** — back-arrow top bar, same condensed.
13. **Compose Desktop** — centred modal (`--radius-xl`, `--elevation-3`, 640px) over dimmed Today; intent-first kind selector (Thought active · Photo · Article · Video · Event); author row with workspace ("Change author"); borderless body ("What's on your mind?"); footer: photo attach, "Shared with everyone ▾" select, Save draft ghost, **Share primary**; honesty line: "No character anxiety. No predicted reach."
14. **Compose Mobile** — full sheet: Cancel / New / Share header, kind chips (h-scroll), author row, body, footer; no tab bar.
15. **Saved Desktop** — "Your keeps." masthead with positive-color saved glyph ("kept for yourself"); Tabs (Saved active); 2-col keep grid (photo tiles + article keep); Collections grid ("12 kept · private" — private self-context, allowed); footer line "Keeping is private." Context: Reading Later (Resume), Recently viewed, "Only you can see your keeps."
16. **Saved Mobile** — back-arrow top bar; condensed grid.
17. **Landing Desktop** (`Landing Desktop.html`) — marketing page for tacet.social. Lamplit constellation hero (warm nebula left / cool right, dot field, `--text-hero` clamp 3.25–5.25rem): "The social web. **Finally.**" + "One identity. Your people. No walls." + gradient Join-the-beta CTA. Light ivory band "Today's internet is fragmented." — closed platforms (Instagram, TikTok, Reddit, X, LinkedIn) shown as **neutral name tiles with letter monograms, never their trademarked logos**, naming the problem only (voice-and-tone honesty rule). Lavender-tinted band "Tacet brings the open web together." — orbit visual (tacet disc, dashed ring, faces + open-place chips: Mastodon, Pixelfed, PeerTube, WriteFreely, Lemmy) with the plain honesty line ("closed networks stay closed"). Quote band, dark CTA band ("Be part of something better."), footer (Manifesto · Privacy · Terms · Status · GitHub · Contact · © 2026 Tacet, a VNTA Group venture).
18. **Landing Mobile** — same bands, single column, 430px.
19. **Onboarding — Your World** (`Onboarding Your World.html`) — light theme, step 2 of 3 (Welcome ✓ · Your world · Your home). "Where do you live online?" — **two honest groups**: "The open social web — Tacet connects here" (selectable tiles, Mastodon + Pixelfed pre-selected with accent ring + check; "Somewhere else — paste an address") and "Closed networks — they don't open their doors" (inert chips + the plain line "Walled gardens stay walled until they open a real door"). Privacy note, Continue primary, Back ghost. **This deliberately corrects the reference mockup, which implied closed-network integration (forbidden by voice-and-tone.md).**

## Interactions & Behavior
- Hover: ghost actions text→primary; cards never lift unless whole-card interactive; nav items get a 6% text-primary wash; buttons `--dur-1` `--ease-out`.
- Focus: ALWAYS `2px solid var(--color-focus-ring)`, 2px offset, both themes.
- Active/pressed: translateY(0.5px) scale(0.99) on primary buttons.
- Theme: `data-theme` attribute on the app root swaps all tokens; body/overscroll background must follow. Toggle in rail foot (sun in dark / moon in light).
- Motion: `prefers-reduced-motion` collapses all transitions. Nothing pulses, ever.
- Media: reserve aspect boxes (zero layout shift), blur-up load, no autoplay, alt text mandatory (federate the source's), focal-point-aware crops.
- **Today ends** — no infinite scroll on any surface; every lens/list is bounded.

## State Management (implementation notes)
- Theme (dark default), current pillar, presence (boolean per person — no counts), thread unread (boolean), compose kind/author/distribution, saved state (Save→Saved uses `--color-positive`, private, toast "Saved" via the calm Toast spec in `docs/10-design/components.md` §11).

## Hard constraints (do not "improve" these away)
No infinite scroll · no autoplay · no red badges or numeric unread counts · no like/follower/view tallies on cards or profiles · no trending leaderboards or people rankings · no federation status dashboards/maps/tickers · no streaks · protocol words never in UI copy ("Mastodon/Pixelfed/PeerTube" appear only as human *place* badges) · one accent action per view (two max) · reading measure fixed at 42rem.

## Assets
- **Every media surface is a gradient placeholder** standing in for real federated imagery (photos, posters, avatars, banners). Do NOT ship the gradients as final art; wire them to real content. The gradient stops are listed inline in each file.
- **Brand:** the `tacet` wordmark is set live in Jost 500 with `--tracking-tight` — there is currently **no logo asset in the repo or this workspace**; do not draw one. `assets/hero.png` exists in the repo for marketing surfaces only.
- **Icons:** inline SVG, 24px grid, 1.75 stroke, round caps, `currentColor` — matches `client/src/design/icons.tsx`; extend that file rather than importing an icon library.
- **Fonts:** Jost + Space Mono (Google Fonts); already referenced in the repo sketch.

## Files
- `screens standalone/*.html` — the 19 self-contained design references (16 app screens + Landing Desktop/Mobile + Onboarding; open directly in a browser; dark/light toggle in the rail on desktop app screens).
- `stage-6-delta-log.md` — every decision tokens.md doesn't cover (items 1–49); these are proposed repo additions, not local one-offs. Reconcile with `docs/10-design/wireframes/` at Stage 7 (item 49).
