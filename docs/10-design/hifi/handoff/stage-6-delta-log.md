# Stage 6 — Delta Log · Session 1 (Today, desktop)

Decisions this session made that `tokens.md` / `components.md` do not cover, plus every
place the reference sketch was overruled. These go back to the repo as token/spec
additions at Stage 7 — they are not local one-offs.

## Missing tokens (propose adding to tokens.md)

1. **Avatar sizes.** components.md names `lg 64 / md 44` but no tokens exist. Used raw:
   44px (card attribution), 36px (rail identity, context person rows), 56px (continue
   thumbnail). Propose `--avatar-lg: 64px; --avatar-md: 44px; --avatar-sm: 36px;
   --thumb-md: 56px`.
2. **Media play-control disc.** 56px used (equals `--fab-size`, likely coincidence).
   Propose `--control-media: 56px`.
3. **In-card ghost action icon.** Sketch and this build use 20px — between `--icon-sm`
   (18) and `--icon-md` (22). Either a ruling (use `--icon-md`) or a token.
4. **End-of-day rule width.** 20rem from the sketch, kept. Raw value — propose a token
   or drop the rule and let space carry the ending.

## Component specs components.md lacks

5. **Rail nav item.** rest = `--text-label`/500/`--color-text-secondary`, `--radius-md`,
   `--space-3` pad; hover = `--alpha-hover` wash of text-primary (via color-mix);
   active = `--color-accent-subtle` bg + `--color-accent` text. From the sketch; needs a
   canonical entry.
6. **Search trigger (rail).** Composed from field tokens: `--color-surface`, hairline,
   `--radius-md`, `--text-label` secondary, mono `--text-micro` ⌘K hint.
7. **Masthead.** Title (`--text-title`/500/`--tracking-tight`) + day-line
   (`--text-body-sm`, `--color-text-secondary`). The day-line is descriptive of reality,
   never a nag.
8. **Context-column rest state.** Composed quiet: two `--text-body-sm` lines
   (secondary/tertiary) + the open-web reassurance module. Toggle it via the
   `contextRest` tweak on the DC.

## Sketch overruled (tokens/ADRs win)

9. **Raw per-card reception tallies removed.** Sketch showed `104 reactions · 12
   replies · 5 shared` on feed cards. ADR-011 framing discipline + components.md §4:
   reception is world-directed and softened, and lives on editorial/context surfaces.
   Shipped: qualitative line only on the labelled curator moment
   ("active now · people you follow are here"). Standard cards carry Reply · Share ·
   Save only.
10. **Resting card = surface + `--elevation-1`, no hairline** (L1: hairline OR
    elevation). Sketch used hairline + flat. Dark depth comes from the canvas→surface
    step; light from warm shadow.
11. **Curator moment = Quiet/inset card variant** (`--color-surface-sunken` + hairline +
    `--elevation-0`). Sketch used a raw gradient background.
12. **Presence phrase colour.** Sketch set "around now" in `--color-positive`; positive
    is reserved (private Save signal / status, never decoration). Shipped:
    `--dot-presence` accent dot + tertiary mono phrase. Needs a ruling in the repo.
13. **Hover washes.** Sketch's raw `rgba(245,245,242,.06)` replaced with
    `color-mix(... 6%, transparent)`; the 6% should formally derive from
    `--alpha-hover`.
14. **Duration badge padding** now `--space-1`/`--space-2` (sketch: 2px/6px).

## Open items

15. **No logo asset exists in this workspace** (kickoff said brand assets were present;
    the folder was empty, and the repo carries none). Brand is set as a lowercase
    `tacet` wordmark in Jost 500 / `--tracking-tight` with **no drawn mark** — per the
    "do not redraw the logo" instruction. Drop the real logo in and it replaces the
    wordmark.
16. **Media are gradient stand-ins** (the sketch's placeholder language) pending real
    federated imagery. They are content placeholders, not tokens.
17. **Open-web reassurance dot** uses `--color-positive` as a status (paired with a
    label, per tokens §6 usage law) — confirm this reading.
18. **Body-behind-canvas sync.** The document body colour is set from the theme in JS so
    overscroll matches; raw canvas hexes appear there once, mirroring tokens §6.

## v2 — the calm-richness pass (Session 1, cont.)

Direction: push from "cards in a column" to a composed editorial page. The reference
mockup was reviewed directly; its life was adopted, its casino refused.

19. **Masthead greeting uses `--text-display`.** tokens.md reserves display for
    "hero/onboarding only"; the warm greeting ("Good evening, Renato.") earns it as
    Today's editorial masthead. Propose amending the display role to include the Today
    masthead — or a ruling to fall back to `--text-title`.
20. **Masthead presence row.** Avatar cluster (28px, `--overlap-avatar`, 2px canvas
    ring) + a mono provenance line naming the places tonight's digest comes from
    (tacet.social … peertube.social). World-directed, no counts. Propose `--avatar-xs:
    28px` and `--ring-avatar: 2px`.
21. **Inline composer entry** added at the top of the digest (hifi/today.md §5 verdict:
    Keep). Neutral, not accent — Compose in the rail remains the view's one accent
    action. Field is the sunken well from the input spec.
22. **Digest group labels** ("This evening" / "Earlier today") — plain chronological
    grouping, `--text-micro`/500/`--tracking-wide` tertiary. Sanctioned by
    hifi/today.md §2 ("any grouping is stated plainly").
23. **Media-first Content Card variant.** Photo essay + video cards run media
    full-bleed to the card edge (radius-lg crop), attribution below — components.md §4
    only specs nested `--radius-md` media. Propose the variant formally.
24. **3-image gallery** follows media-system §3 (lead + two stacked squares).
25. **Article content type composition:** title `--text-heading`/500 (link) +
    standfirst `--text-body-sm` secondary + mono "Article · 9 min read". Not yet in
    components.md.
26. **Community curator moment:** square community identity (`--radius-md` 44px tile),
    eyebrow "From a community you're in", qualitative reception ("busy this evening"),
    single "Step in" door instead of Reply/Share/Save.
27. **Context column additions:** faces/thumbnails on "Across your world" items;
    new "Communities active today" block (36px `--radius-sm` tiles). Column is no
    longer sticky (it is taller than a viewport; it reads as a page column now).
28. **Adopted from the reference:** faces row (as masthead cluster, not story rings —
    rings stay deferred per hifi §5), inline composer, richer media, connections →
    people, federation note → quiet reassurance. **Refused from the reference:** raw
    tallies on cards, "N people talking" trending leaderboard, federation map/live
    counters, red badges, notification bell, second accent (Post button).

## v3 — the illumination pass (Session 1, cont.)

Direction correction from review: "illuminated, not simply dark; premium flagship,
not a clean wireframe." Sanctioned by ADR-016 (the style layer — values — may be
re-tuned; the semantic system is untouched). New style-layer tokens, all defined once
per theme, proposed for tokens.md as a §"Atmosphere" block:

29. `--glow-ambient` — two large accent-tinted radial washes at the canvas top
    (8%/5% dark, 7%/4% light). The "lamplit" in lamplit near-black, made literal.
30. `--surface-gradient` — cards are lit from above (raised→surface vertical blend).
31. `--edge-highlight` — 1px inset top light on raised surfaces (5% white dark, 80%
    white light). The premium "machined edge".
32. `--glow-accent` — soft accent bloom under the one primary action (Compose).
33. **Whisper hairline** — cards now carry hairline at 60% mix *plus* elevation,
    matching components.md §3's "hairline dropped to a whisper" resting card.
34. **Hero moment.** The lead moment runs media-first at `--elevation-2` with the
    caption overlaid on `--scrim-caption` — editorial hierarchy: one moment per day
    may lead. Propose "Lead moment" as a Content Card variant.
35. **Source badges shipped** (components.md §7 Badge, source variant): Pixelfed /
    Mastodon / PeerTube / WriteFreely as human-place chips on remote attributions.
    Native tacet moments carry no badge — home is unmarked.
36. **Curator moments are accent-tinted** (accent-subtle→surface gradient, 16%
    accent-mixed hairline) — the editorial voice is now visibly lavender-lit.
37. **Architectural rail:** full-height panel, surface→canvas vertical gradient,
    hairline right edge; layout is now rail + centred (feed+context) grid rather than
    a three-column grid.
38. **Presence dots glow softly** (static 8px accent bloom — no pulsing, L6 held).
    Same for the positive connection dot. Needs a ruling with item 12.
39. **"The open web" panel** is the wonder module: accent-lit gradient panel, no
    counters, no map, no ticker (ADR-012 ban list held despite reference).
40. **Explicitly refused from the second reference set:** federation status dashboard
    (server/user counts, world map), per-card like/comment/repost tallies, red
    notification badge counts, "N people talking" trending list. Their *feeling* is
    carried by items 29–39 instead.

## v4 — full-app expansion (Session 1, cont.)

Sixteen screens produced from the refined Today baseline (see `screens/` +
`Tacet Screens/` standalone exports). Shared language additions:

41. `--media-vignette` — inset cinematic vignette + 1px inner ring on hero/poster
    media (theme-tuned). Style-layer token, propose for tokens.md.
42. **Group labels carry a trailing hairline flourish**; the digest groups now read
    as editorial sections.
43. **Quiet moment variant** — a text Thought rendered unboxed on canvas (L1),
    for feed rhythm.
44. **Rail ambience** — soft accent lamp behind the brand, hairline-topped identity
    foot. The context column is hairline-separated (architectural, not widget-stack).
45. **Per-pillar context columns** follow information-architecture.md §3 exactly:
    People = person-in-focus + you-both-know; Discover = about-this-corner + people
    there; Conversations = participants + the moment it hangs off; Me = private
    self-context (drafts, workspace switch — "only you see this"); Remote Profile =
    about + you-both-follow; Saved = Reading Later + recently viewed.
46. **Mobile tab bar** = 4 pillars + centre compose FAB; Me lives in the top-bar
    avatar (per hifi/today.md mobile frame). Presence dot, never a count.
47. **Compose** is intent-first (Thought/Photo/Article/Video/Event), author-aware
    (workspace), distribution as a calm select; honesty line "no predicted reach".
    Desktop = centred modal over dimmed Today; mobile = full sheet.
48. **Private counts shown only in Me/Saved** ("3 drafts", "12 kept · private") —
    ADR-011 private self-context, labelled as only-you.
49. **Wireframe reconciliation pending** — these hi-fi screens follow
    information-architecture.md and components.md; the Stage-4 wireframe docs were
    not re-read screen-by-screen this session and should be reconciled at Stage 7.
50. **Landing + onboarding (marketing surfaces).** New `--text-hero` marketing type
    step (clamp 3.25–5.25rem) and `--hero-constellation` background tokens — propose a
    small marketing-tier token block. Closed-platform names render as neutral
    letter-monogram tiles (never trademarked logos). The reference mockups' closed→tacet
    convergence and onboarding "we'll bring it all together" copy were **overruled** per
    voice-and-tone.md's honesty rule: convergence shows the open web only, and the
    onboarding step separates "connects here" from "they don't open their doors".
