# Landing fidelity pass — per-section visual specs (from mocks 1–3)

Reproduction, not interpretation. Whitelist W1–W5 are the only permitted deviations.

## 1. Hero background (mock 3, mock 1 top)

**Geometry.** Full-viewport ink field (`#0A0613`). Constellation forms an **encircling
ellipse** hugging the left/right/top/bottom arcs, **open in the centre** where the
headline sits. Dense at the ring, empty in the middle.

**Colour by arc.** Left arc = warm: amber/orange + pink/magenta. Right arc = cool:
blue/violet + cyan. Lavender accents throughout. Colour interpolates by horizontal
position (left→warm, right→cool) and a little by vertical (top pink → bottom amber left;
top violet → bottom blue right).

**Density.** Hundreds of nodes (~320 desktop, ~120 mobile). Varied sizes 0.4–3px; ~8%
are brighter "hub" nodes with glow. **Connective edges** form visible triangulated
structure — each node linked to its 2–3 nearest neighbours (precomputed once for perf),
faint, tinted to the node colour.

**Motion (perpetual, calm).** Continuous: (a) very slow global rotation of the whole
ring around centre; (b) per-node twinkle (slow alpha oscillation); (c) slight radial
breathe. Never static (except W4 reduced-motion → one still frame), never fast.

**Glows.** Iris radial glow top-centre, blossom wash bottom-right (already on `.lp-hero`).

**Perf.** Canvas 2D, DPR-capped ≤2. Edges are a fixed list drawn each frame (≈nodes×2.5),
not an O(n²) neighbour scan per frame. Target 60fps mid hardware.

**Scroll cue.** Mouse glyph, bottom-centre, gentle wheel animation (mock 3).

## 2. Nav — mark+wordmark left; Sign in text + gradient "Join the beta →" pill right.
## 3. Fragmentation — white cards row, colored threads converging down + "And more".
## 4. Convergence — large soft-shadow white disc + Tacet mark, concentric dotted orbit
rings, avatars + open-web icons on orbit with drop shadows, radial dotted connectors,
lavender wash. (W2: open icons only.)
## 5. Divided — split warm→light band, converging line-field → small node → dots right,
right-aligned caption.
## 6. People/Manifesto — keep shipped content (W3), consistent spacing/type.
## 7. Final CTA + footer — dark gradient band, gradient pill, footer link row + copyright.
## 8. Welcome step 2 — stepper, icon-tile card grid + check circles, Other, lock privacy
line, dark Continue, two summary bands (W2 icons), "Your home on the open social web."

---

# Stage 7 — Template conformance (2026-07-10)

Per-surface fidelity specs (Desktop + Mobile) live in
[`docs/10-design/hifi/specs/`](specs/) — one concrete file per surface, each with the
layout, modules-in-order, exact copy, tokens, behaviors, and a GAP LIST vs the current
React implementation:

- [`specs/today.md`](specs/today.md) · [`specs/people.md`](specs/people.md) ·
  [`specs/conversations.md`](specs/conversations.md) · [`specs/me.md`](specs/me.md) ·
  [`specs/saved.md`](specs/saved.md) · [`specs/compose.md`](specs/compose.md) ·
  [`specs/remote-profile.md`](specs/remote-profile.md) · [`specs/discover.md`](specs/discover.md)

**Key finding:** every surface is **large** — they are built on a **three-column desktop
canvas** (rail 250px + centre ~42rem + context column 320px) plus per-surface context-column
modules the app did not yet have. That canvas is now shipped as an opt-in `Surface` layout
(`client/src/app/Surface.tsx`): centre + right context column on desktop, stacking calmly on
mobile; surfaces that pass no context render unchanged (zero regression).

**Conformed:** **Today is CONFORMED v2.2** (2026-07-10) — the data-honesty pass, against the
operator-approved end-state references (now vendored at `handoff/reference/`): People close
to you is persons-only (feed publications never render; ≥2 or hidden); Continue is
exclusively recently-viewed/reading-later rows with REAL titles (migration 0015), excluding
today's digest, max 2; nostr:/bech32 tokens stripped from rendered text and NIP-05
`_@domain` displays as `@domain` (adapter + render sanitation); the masthead cluster is home
domains only; Communities active today (spec title) lists domain homes only, ≥2 or hidden,
additive to the connectivity panel; bylines composed per reference (bold name + mono line +
"Medium · time" pill; publications show name + favicon + domain, no @-fabrication); hero
caption carries line + author·home; acts on a hairline; composer is an input with the media
glyph; toggle at reference geometry.

**Conformed v2:** (2026-07-10) — completion pass added the real
context column (People close to you with remote handles + honest presence; Continue with a
"Continue reading" affordance and *no* time-left; "Across your world" = real titled items;
"Busy today"; Connectivity), the "From your world" highlight moments, the inline composer
row, the pill/knob theme toggle, the locked scroll architecture (only the centre scrolls),
avatar monogram fallback, quiet links, and the triptych. All real-or-hidden.

**Conformed v1:** **Today** (2026-07-10) — the editorial masthead
(real date-line / time-of-day greeting / source cluster from live authors+homes), card
variants derived from real data (hero / article / video / quiet / default), section dividers
by recency, the bounded end, the desktop rail (Search entry + `@renato` handle), the mobile
top bar + 5-slot tab bar (FAB-in-bar, "Chats", solid — no glass) + inert lens row, plus the
full token set (theme.css + tokens.md §8.1). **Remaining inside Today:** the context-column
editorial modules beyond the connectivity panel (People close to you / Continue / Across your
world / Communities) — these are fabricated sample data in the template, so honest real-data
versions are the follow-up; the two curator moments and the inline composer row are likewise
deferred (fabricated momentum / compose-trigger plumbing). The other 7 in-scope surfaces
remain specced-not-implemented.

**Whitelist honored throughout:** W1 honest wording kept over template over-claims
(composer preview, "sample suggestions" on Discover, local-not-federated Me handle, no
audience meta the product can't back); W3 tokens only (specs list any token gaps — none
blocking); W4 reduced-motion + AA; W5 no protocol words. Landing + Onboarding **excluded by
operator** (not implemented or compared).
