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
