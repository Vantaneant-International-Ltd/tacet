# Tacet Design System

**Tacet is your home on the open social web.** A calm place where people reconnect with the internet. Not another social platform, not another clone — a quiet, premium, human product built on open protocols.

Values: people before platforms · relationships before engagement · identity before algorithms · calm before addiction · open before closed.

**Sources:** built from the founder's written brand brief plus a moodboard image (`uploads/pasted-1783382842219-0.png`). No pre-existing codebase, Figma, or logo existed; the identity here (mark, wordmark, palette, type) was created in this project and is the canonical source of truth.

---

## The identity in one paragraph

Tacet's mark is **the Hearth**: twelve strokes gathered around a quiet, open centre — a warm burst of presence, with **one stroke arrived as a dot**. The dot is the person; the burst is everyone already home. The centre is deliberately empty: *tacet* is the musical instruction for silence, and the calm at the middle of the mark is the brand. Iris violet on deep ink, generous space, soft type, slow motion.

---

## Index

- `styles.css` — global entry; imports everything in `tokens/`
- `tokens/` — `colors.css`, `typography.css`, `layout.css` (spacing/radius/elevation/motion), `fonts.css`, `base.css`
- `assets/logo/` — mark SVGs (currentColor + iris/lavender/ink/white), app icons, favicon, wordmark + lockup PNGs
- `assets/backgrounds/` — constellation backgrounds (dark/light)
- `assets/marketing/` — OG/social image
- `assets/icons/` — product icon set (Lucide, see Iconography)
- `assets/fonts/` — Hanken Grotesk + Spline Sans Mono variable woff2
- `components/core/` — Button, IconButton, Input, SearchField, Switch, Tabs, Chip, Badge
- `components/surfaces/` — Card, Dialog, Toast, Skeleton
- `components/social/` — Avatar, Icon, PostCard, PersonCard, CommunityCard, NotificationItem
- `guidelines/` — foundation specimen cards (Design System tab)
- `ui_kits/web_app/` — sample Tacet web app screen
- `ui_kits/landing/` — landing page hero

---

## CONTENT FUNDAMENTALS

**Voice:** quiet confidence. Warm, plainspoken, unhurried. Sentences are short. No exclamation marks. No hype words (revolutionary, supercharge, unleash). No engagement-bait ("You won't believe…").

**Person:** we speak to *you*, we call ourselves *we*. "Your home", "your people", never "users". People on Tacet are *people*, *neighbours*, or by name — never "followers" (use "people you follow" / "following you" when the mechanic must be named).

**Casing:** sentence case everywhere — headings, buttons, tabs, empty states. The wordmark is always lowercase: **tacet**. Never "Tacet" in the logo, though "Tacet" is correct mid-sentence.

**Emoji:** never in UI chrome or marketing. People's own posts may of course contain them.

**Numbers:** understated. "24 people" not "24 followers 🔥". No unread-count anxiety: counts cap at "9+".

**Empty states are hospitality, not apology:** "It's quiet here. That's okay." / "No new notifications. Enjoy the calm." / "Your bookmarks live here when you're ready."

**Examples of tone:**
- Hero: "Your home on the open social web."
- Onboarding: "Pick a place to live. You can always move — your people come with you."
- Notification settings: "We'll only knock when it matters."

---

## VISUAL FOUNDATIONS

**Colour.** Dark-first brand, light-default product. One primary — **iris violet** (`--iris-600 #7B61FF`) — earned, not decorative: it marks *presence and connection* (links, active states, the mark) and almost nothing else. Lavender `#B19CFF` is a glow/illustration tint; blossom pink `#FFB1E8` appears only inside illustrations and gradients, never as UI chrome. Neutrals are violet-cast "ink" tones — no pure grey, no pure black; dark mode sits on `#0A0613`, light on `#F8F7FC`. Semantic colours (moss/amber/rose) are desaturated to match the calm register. Always use semantic aliases (`--surface-1`, `--text-secondary`…), never raw ramp steps.

**Type.** One family: **Hanken Grotesk** (variable 300–800) — warm humanist grotesque standing in for Satoshi (see Caveats). Display/headings at weight 650 with tight tracking (−0.018 to −0.022em); body at 400/15px/23px. **Spline Sans Mono** for handles (`@maya@tacet.home`), server names, and tokens. Type is quiet: hierarchy comes from weight and colour, rarely from size jumps.

**Space.** 8pt system with a 4px half-step. Generous by default: cards pad 16–24px, sections breathe at 48–96px. Negative space is a brand asset — when in doubt, add more.

**Radius.** Soft everywhere, never sharp: 6 chips, 10 buttons/inputs, 14 cards, 20 dialogs, 28 sheets, full pills/avatars.

**Elevation.** Violet-tinted soft shadows in light mode (`--shadow-1…4`); in dark mode shadows are near-black plus a 1px inner light border. Accent glow (`--glow-accent`) is reserved for the mark and hero moments.

**Backgrounds.** Flat semantic surfaces. Ambient interest comes from two devices only: (1) constellation fields (`assets/backgrounds/`) at very low opacity, (2) large soft radial gradients of iris/lavender/blossom on deep ink for hero/marketing. Never busy patterns, never noise textures.

**Blur & transparency.** Glass (`backdrop-filter: blur(var(--blur-glass))` over `--surface-overlay`) only on floating chrome: top bars, bottom nav, toasts, dialog scrims. Content surfaces are always opaque.

**Borders.** Hairline `1px` using the translucent border tokens. Cards prefer `--border-subtle` + `--shadow-1` over heavier outlines.

**Motion.** Water, breathing, paper, glass. Everything eases with `--ease-glide`; entrances use `--ease-enter` with 8–12px translate + fade; exits are faster than entrances. Durations: 120ms hover, 200ms toggles, 320ms cards/dialogs, 560ms page transitions. Ambient loops (constellation drift, hero glow) breathe on a 4s `--ease-breathe` cycle. **No bounces, no springs with overshoot, no particles.** Respect `prefers-reduced-motion` by dropping ambient loops entirely.

**Interaction states.** Hover: `--hover-veil` wash or a one-step colour shift, 120ms. Press: `--press-veil` + `transform: scale(0.98)`. Focus: the two-ring `--focus-ring`, always visible, never removed. Disabled: `opacity: var(--opacity-disabled)`, no colour change.

**Cards.** `--surface-1`, radius 14, `--border-subtle`, `--shadow-1`; lift to `--shadow-2` on hover with no translate. Content-first: media edge-to-edge inside a 10px inner radius.

**Imagery.** Warm, natural light, human scale — homes, windows, hands, streets. Slight lavender cast is welcome; never neon, never HDR-crunchy. Avatars are always circles.

**Illustration.** Abstract, never literal people: constellation dots joined by thin lines (people finding each other), single glowing dots arriving home, window/threshold shapes, organic iris→blossom gradients on ink. Line weight matches icon stroke (2px at base size). No stock, no mascots, no 3D blobs.

---

## ICONOGRAPHY

- **The mark is not an icon.** Never use the Hearth as a UI glyph; it appears as brand only.
- Product icons are **Lucide** (ISC licence): outline, round caps/joins, 2px stroke on a 24px grid — matching the brief's "outline · rounded · 2px" spec exactly. Copies live in `assets/icons/` (one SVG per icon, `currentColor`), and the React `Icon` component (`components/social/Icon.jsx`) inlines the same set by name.
- Optical rules: 20px in dense rows, 24px default, stroke stays 2px (do not scale stroke). Icons take `currentColor` — `--text-secondary` at rest, `--text-primary` or `--accent-text` when active. Active nav states may switch to a filled treatment via the `Icon` component's `filled` prop where a fill variant exists.
- Naming map (product → file): today→`sun`, people→`users`, discover→`compass`, communities→`users-round`, conversation→`message-circle`, compose→`square-pen`, notifications→`bell`, profile→`circle-user`, media→`image`, article→`file-text`, privacy→`lock`, federation→`network`, import→`download`, export→`upload`. Full set in `assets/icons/`.
- No emoji as icons. No unicode glyph icons. No mixed icon sets.

## Intentional additions

- `Icon` wrapper component — single entry point to the glyph set (reason: keeps stroke/size/colour rules enforced in one place).

## Caveats / substitutions

- **Satoshi → Hanken Grotesk.** The moodboard names Satoshi (Fontshare), which cannot be redistributed here. Hanken Grotesk is the closest open match (humanist grotesque, warm terminals, variable). Drop Satoshi woff2s into `assets/fonts/` and update `tokens/fonts.css` to switch.
- Wordmark is set in Hanken Grotesk 650, tracking −0.03em, lowercase — rendered PNGs in `assets/logo/`. A drawn/custom-cut vector wordmark is a recommended follow-up with a type designer.
