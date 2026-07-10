# Remote Profile — fidelity spec

Surface: a remote person's profile, read inside Tacet (route `/p/:actor`, `Profile.tsx`).
Templates: `docs/10-design/hifi/handoff/Remote Profile Desktop.html`, `Remote Profile Mobile.html`.
Impl to conform: `client/src/app/screens/Profile.tsx`, `client/src/app/ProfileView.tsx` (shared header/About).

Scope note (FENCED): this surface is **visual only**. Live hydration/sync of a remote
profile is fenced to session 3. Render whatever cached data we have plus a calm
"the full profile loads as Tacet syncs" state. **Never** show an error box on this
surface — the "couldn't open this profile" empty state is removed (see Gap 12).

Type system is LOCKED to Hanken Grotesk + Spline Sans Mono. The template's `Jost` /
`Space Mono` `--font-sans` / `--font-mono` are ignored on purpose. All other template
`--color-*`, `--space-*`, `--radius-*`, `--text-*`, `--dur-*`, `--ease-*` token names
are the same names already in `theme.css` — map to them 1:1.

---

## 1. Desktop layout — the 3-column canvas

The template is a **three-column** page. The current app shell (`AppShell.tsx` /
`app.css` `.t-app`) is only **two** columns (`grid-template-columns: 250px 1fr`) and has
no right context column. This surface introduces the third column.

```
┌─────────────┬──────────────────────────────┬────────────────────┐
│ LEFT RAIL   │ CENTRE FEED                  │ CONTEXT COLUMN     │
│ 250px       │ ~42rem (--measure-reading)   │ 320px              │
│ (AppShell)  │ profile header + moments     │ About this person  │
└─────────────┴──────────────────────────────┴────────────────────┘
```

- Column widths (from template `:root`): `--rail-width: 250px`,
  `--feed-measure: var(--measure-reading)` (= 42rem), `--context-width: 320px`.
- **Left rail** = the existing `AppShell` `.t-rail`. Unchanged by this surface EXCEPT
  the rail already carries brand, Search affordance, the five nav pillars (Today,
  People, Discover, Conversations, Me), the accent **New** button, the me-footer
  (avatar + name) and theme toggle. The Search control in the rail is the template's
  `⌘K` "Search people, communities, conversations" box — out of scope here, do not add
  it as part of this surface (it belongs to a shell pass).
- **Centre feed** (`--measure-reading`, 42rem): the profile header, then a
  "Recent moments" section of post cards, then the "Visit their home" footer.
- **Context column** (320px, right): a single `About this person` `<aside>` holding
  three quiet modules (About / You both follow / Their communities) plus the
  cross-web note. Sticky-ish, top-aligned, hairline-separated cards.

The context column only appears at desktop width. Below the desktop breakpoint the
context column content is **dropped** entirely on mobile (the mobile template shows
none of it) — do not stack it under the feed.

---

## 2. Mobile layout — top bar + tab bar

- **Top bar** (`.t-topbar`, solid `--color-surface` + `--color-hairline` bottom
  hairline, **no glass/blur**): a **Back** button (`aria-label="Back"`, chevron-left
  icon) on the left, then the person's name **"Jonas Vold"** as the centred title.
  This is profile-specific: the shell's default top bar is brand-only. On a remote
  profile the top bar shows Back + the person's name.
- **Tab bar** (`.t-tabbar`, bottom): five pillars, but the mobile template labels the
  fourth **"Chats"** (not "Conversations") and the order is Today · People · [New FAB] ·
  Discover · Chats — the compose FAB (`aria-label="New"`, accent gradient) sits in the
  **centre** of the tab bar between People and Discover, not floating bottom-right.
  NOTE: the current shell uses a separate floating `.t-fab` and a 5-item tab bar
  labelled "Conversations". Reconciling the tab bar is a shell-wide change; for THIS
  surface, do not regress the shell — see Gap 13 (flag, do not silently diverge).
- Feed content is the same header → moments → home-footer stack, full-bleed to the
  reading measure, no context column.

---

## 3. Sections / modules, in order

### Centre feed (desktop + mobile)

1. **Profile header** (`<section aria-label="Jonas Vold">`)
   - **Banner** — full-width image, `--ratio-banner` (3 / 1), `role="img"`
     `aria-label="Banner — the quay at dawn"`. Rounded top corners (`--radius-lg`),
     media vignette. When no banner exists, collapse (header still valid).
   - **Action row** (top-right, overlapping banner bottom): two buttons —
     - **Message** — ghost/quiet button: `background:none; color:var(--color-text-secondary);
       border:none; border-radius:var(--radius-full); font-size:var(--text-label);
       font-weight:500; padding:var(--space-2) var(--space-4)`. **Dead in template →
       must be honestly disabled** (`disabled`, `title="Coming soon"`,
       `aria-label="Message — coming soon"`).
     - **Follow** — accent button: `background:linear-gradient(180deg,
       var(--color-accent-hover) 0%, var(--color-accent) 100%);
       color:var(--color-on-accent); border-radius:var(--radius-full);
       box-shadow:var(--glow-accent); padding:var(--space-2) var(--space-5)`. Following
       is **not wired** (read-only milestone, same as `LivePerson`'s Follow) → **honestly
       disabled** (`disabled`, `title="Coming soon"`).
   - **Avatar** — 88px, ring, overlapping the banner bottom edge (existing
     `.t-phead__top--banner` margin + canvas ring already do this).
   - **Name** — `<h1>` **"Jonas Vold"**, `--text-title`, weight 500.
   - **Source badge** — inline `[Pixelfed]` glyph + product name. Reuse `SourceBadge`
     from `live.tsx`. Product name only ("Pixelfed"), never a protocol word (W5).
   - **Handle + home line** — `--text-meta`/`--font-mono` handle followed by a plain
     home phrase: desktop **"@jonas@pixel.town · lives at pixel.town, a home for
     photographers"**; mobile shortens to **"@jonas@pixel.town · lives at pixel.town"**.
     The handle is monospace; the "lives at …" clause is sans, secondary colour.
   - **Bio** — desktop **"Street and harbour photography, one roll a month. Prints
     sometimes. The quay, mostly."**; mobile drops the "Prints sometimes." sentence.
     `.t-phead__bio`, `--text-body`, secondary.
   - NOTE the template header shows **no follower/following/post counts and no
     joined/website/location fact row** in the centre column. Those live in the
     context-column "About" module on desktop. Keep the header calm (ADR-012, "your
     world, never your score").

2. **Recent moments** (`<h2>` **"Recent moments"**, then `<article>` cards)
   - Section heading **"Recent moments"** (not "Posts", not a tab). `--text-heading`.
   - **Moment card 1** — a 3-up photo row (`role="img"` each:
     "The quay at first light" / "A dark street, one window lit" / "Moss on the
     harbour wall"), caption **"Morning walk, before the street woke up. Three frames
     from the quay."** (mobile: **"Morning walk, before the street woke up."**), then a
     quiet meta line **"Photos · 4:40 pm"**.
   - **Moment card 2** — single photo ("Harbour in fog"), caption **"Fog holds the
     harbour until nine."** (mobile drops caption), meta **"Photo · Monday"**.
   - Cards are the calm editorial post card — reuse `LiveMoment` from `live.tsx` so a
     remote person's posts look identical to Today's feed. Media grid = existing
     `.t-media-grid` (1/2/3/4 variants); meta line = "Photo(s) · <time>".
   - The template moment cards show **no Spark/Save action row and no source badge**
     per card (author is implicit — it's their profile). Prefer a profile-context
     variant of the card that hides the per-card author link + action row. If reusing
     `LiveMoment` wholesale, its Spark (disabled) + Save actions are acceptable as an
     honest superset, but the author `Link`/`SourceBadge` in each card head is
     redundant on a profile and should be suppressed (see Gap 6).

3. **Home footer** (end of feed)
   - Quiet line: desktop **"Older moments live at their home on pixel.town."**;
     mobile same.
   - Link **"Visit their home"** → the person's canonical home URL
     (`person.url`), opens in a new tab (`target="_blank" rel="noreferrer noopener"`).
     Style: `color:var(--color-accent-hover); font-size:var(--text-label);
     font-weight:500; gap:var(--space-2)` with a trailing external-link glyph.
   - This is the honest boundary: Tacet shows recent cached moments, the full archive
     lives at the source. It doubles as the FENCED "full profile loads as Tacet syncs"
     framing — see §5.

### Context column (desktop only) — `<aside aria-label="About this person">`

Three quiet modules, each a hairline-separated card, in order:

4. **About <FirstName>** — `<h2>` **"About Jonas"**, then prose:
   **"Lives at pixel.town — a small, careful photography community on the open web.
   Posting since 2023."** ("pixel.town" is emphasised/accent). This is where the home,
   community description and "since" live — the calm equivalent of the header fact row.

5. **You both follow** — `<h2>` **"You both follow"**, value **"Mara, Alex and Tobi"**.
   This is relational context (shared follows), never a follower count. **Data is not
   wired** (no mutuals source in `openweb.ts`) → this module must be **omitted when we
   have no mutuals data**, or rendered as a static, clearly-sample line. Do NOT
   fabricate mutuals against a real person. Prefer: render only when the profile
   payload actually carries mutuals; otherwise drop the module (calm absence, not an
   empty box).

6. **Their communities** — `<h2>` **"Their communities"**, item **"Slow Photography"**
   with sub-line **"a community on pixel.town"**. Same rule: render only from real
   payload data; otherwise omit.

7. **Cross-web note** (bottom of aside):
   line **"You're connected across the open social web."** + link **"Learn how it
   works"** (→ the same explainer the app uses elsewhere; if none exists, honestly
   disable or point at the existing help/about surface). `--text-meta`, tertiary.

---

## 4. Semantic tokens used (map template → `theme.css`, same names)

- Canvas / surface: `--color-canvas`, `--color-surface`, `--color-surface-raised`,
  `--color-surface-sunken`, `--color-hairline`.
- Text: `--color-text-primary` (name), `--color-text-secondary` (bio, Message btn,
  home line), `--color-text-tertiary` (handle, meta, cross-web note).
- Accent: `--color-accent` / `--color-accent-hover` (Follow gradient, "Visit their
  home", "pixel.town" emphasis), `--color-on-accent` (Follow label),
  `--color-accent-subtle`.
- Type: `--text-title` (name h1), `--text-heading` (Recent moments / aside h2s),
  `--text-body` (bio, About prose), `--text-body-sm`, `--text-label` (buttons, links),
  `--text-meta` (handle, "Photos · 4:40 pm"), mono via `--font-mono` for handle only.
- Radius: `--radius-lg` (banner top), `--radius-md` (media, cards), `--radius-full`
  (Message/Follow pills).
- Spacing: `--space-2`…`--space-6` per template inline styles above.
- Ratio: `--ratio-banner` (3/1) for the banner, existing gallery/media ratios for
  moment photos.
- Effects: `--glow-accent` (Follow shadow), `--media-vignette` / `--scrim-media` on
  banner + photos, `--elevation-1` on cards.
- Motion: `--dur-1` + `--ease-out` on button hover; all reveals must honour
  `prefers-reduced-motion` (W4 — already handled globally in `theme.css`).

No new tokens are required. The template introduces layout vars `--rail-width`,
`--feed-measure`, `--context-width` — express these with the existing
`--measure-reading` and literals `250px` / `320px` in the grid rule; they need not
become theme tokens.

---

## 5. FENCED / honest states (this surface renders, never errors)

- **Cached / partial** (default, session-2): render header + whatever cached moments
  exist. Below the moments, in place of a hard "loaded" claim, keep the honest home
  footer ("Older moments live at their home on …" + "Visit their home"). If the
  profile is only partially present, show a single calm line:
  **"The full profile loads as Tacet syncs."** (secondary text, no icon, no red,
  no spinner). This replaces both the current `Loading` spinner text and the error
  empty state on this surface.
- **No moments yet cached** — a calm empty note, not an error:
  **"No recent moments cached yet — the full profile loads as Tacet syncs."** Reuse
  `.t-caughtup`-style calm block, positive/neutral tone, never `EmptyState icon="people"
  title="Couldn't open this profile"`.
- **Never** an error box on this surface (fetch failure → fall back to the calm sync
  line, not "This person's home couldn't be reached").

---

## 6. Interaction behaviors + honestly-disabled controls

- **Message** — disabled, "Coming soon" (dead in template).
- **Follow** — disabled, "Coming soon" (read-only milestone; consistent with
  `LivePerson`'s disabled Follow).
- **Visit their home** — live external link to `person.url`, new tab.
- **Back** (mobile top bar) — `history.back()` when possible, else `navigate("/people")`
  (matches existing `.t-profileback` behaviour).
- **Per-moment Save** — if `LiveMoment` is reused, Save stays live (it works today);
  Spark stays disabled "Coming soon". These are an honest superset over the template's
  bare cards and are acceptable.
- **"Learn how it works"** — link to the existing explainer if one exists; otherwise
  disable honestly. Do not invent a page.
- **"You both follow" / "Their communities"** — data-gated: render only from real
  payload, otherwise omit the whole module (no fabricated relationships).
- All controls: AA contrast, visible `:focus-visible` ring (global), reduced-motion
  static.

---

## 7. Whitelist compliance

- **W1 (honesty):** error state removed in favour of calm sync line; Message/Follow
  honestly disabled; mutuals/communities modules data-gated not faked; home footer keeps
  the true "full archive lives at their home" boundary.
- **W3:** semantic tokens only (§4); no raw hex.
- **W4:** reduced-motion static, AA contrast.
- **W5:** product name "Pixelfed"/"pixel.town" fine; no protocol words in UI copy.

---

## 8. GAP LIST — concrete edits to conform current impl

1. **Add the third (context) column.** Current shell is 2-col (`app.css` `.t-app`
   `grid-template-columns: 250px 1fr`). This surface needs a right context column at
   desktop width (320px). Introduce a per-surface layout that renders an
   `<aside aria-label="About this person">` in a 3-col grid
   (`250px minmax(0, 42rem) 320px` centred), collapsing to the 2-col shell + no aside
   below desktop. (Layout is currently entirely missing.)

2. **Remove the tab strip.** `Profile.tsx` renders `.t-tabs` with Posts/Media/About
   pills and `useState<Section>`. The template has **no tabs** — it shows a single
   "Recent moments" list inline and moves About into the context column. Delete the tab
   state, `.t-tabs`, the `Media` gallery view, and the in-feed `About` render.

3. **Rename the moments section to "Recent moments"** with an `<h2>` heading
   (`--text-heading`), replacing the tab-driven "Posts" list. Cap to the recent set
   (template shows 2 cards) and follow with the home footer, not an infinite feed.

4. **Add the header action row (Message + Follow), both honestly disabled.** Current
   `ProfileHeader` (`ProfileView.tsx`) has only a "View original" text link. Add the two
   pill buttons per §3.1 (Message = ghost disabled, Follow = accent gradient disabled),
   positioned top-right overlapping the banner. Keep "View original" behaviour by folding
   it into the "Visit their home" footer instead (see Gap 8) to avoid duplicate exits.

5. **Move header meta into the context column.** Current `ProfileHeader` renders
   follower/following/post **counts** and a website/location/joined **fact row**
   (`.t-phead__meta`). The template header shows none of these; they belong in the
   context-column "About Jonas" module. Suppress `.t-phead__counts` and
   `.t-phead__facts` on this surface (keep the module for the shared component's other
   uses, but hide on remote profile) and render the home/"since" prose in the aside.

6. **Profile-context moment cards.** Reusing `LiveMoment` renders a per-card author
   `Link` + `SourceBadge` in the head — redundant on a profile (every card is this
   person). Add a `context="profile"` prop (or a `hideAuthor`/`hideActions` variant) that
   suppresses the author link and, per template, the Spark/Save action row on this
   surface. Keep the media grid, caption and the "Photos · <time>" meta line.

7. **Add the "Recent moments" meta line format.** Template meta reads
   **"Photos · 4:40 pm"** / **"Photo · Monday"** (media-kind + friendly time), not the
   handle+relative-time `Identity` line. Add a compact meta line under each profile
   moment: `<media kind label> · <time>`.

8. **Add the home footer.** New element after the moments: line "Older moments live at
   their home on <home>." + accent link "Visit their home" → `person.url` (new tab).
   This replaces the header's "View original" as the single, honest exit.

9. **Add the context-column modules** ("About Jonas", "You both follow",
   "Their communities", cross-web note) per §3.4–7, each hairline-separated, data-gated
   (render mutuals/communities only from real payload; otherwise omit).

10. **Mobile top bar shows Back + person name.** Current mobile top bar
    (`AppShell.t-topbar`) is brand-only. On a remote profile the top bar must show the
    Back control + the person's name as title. Since the shell top bar is global, either
    (a) let the profile screen render its own in-content sticky top bar for mobile, or
    (b) add a shell slot for a per-route title. Prefer (a) to avoid shell churn; keep the
    existing `.t-profileback` for the back affordance and add the name as a centred
    title on mobile.

11. **Banner treatment.** Ensure the banner uses `--ratio-banner` (3/1) with
    `--radius-lg` top and `--media-vignette`; current `.t-phead__banner` should be
    verified against these values (fixed height today, not ratio-based).

12. **Remove the error/empty "Couldn't open this profile".** Replace with the calm
    FENCED sync states in §5 ("The full profile loads as Tacet syncs." /
    "No recent moments cached yet — …"). Never render `EmptyState title="Couldn't open
    this profile"` on this surface.

13. **Tab-bar label + compose FAB (mobile) — FLAG, do not silently diverge.** Template
    labels the 4th pillar "Chats" and centres the New FAB inside the tab bar; the current
    shell says "Conversations" and floats a separate `.t-fab`. This is a shell-wide
    decision, not a remote-profile-local one. Record the delta; do not change the global
    shell as part of this surface unless the shell pass adopts it.

14. **Fonts:** confirm the surface inherits `--font-sans: Hanken Grotesk` /
    `--font-mono: Spline Sans Mono` (LOCKED). Ignore the template's Jost / Space Mono.
