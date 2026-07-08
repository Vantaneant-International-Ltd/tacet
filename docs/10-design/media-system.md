# Media System — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md §7](./tokens.md).

**Purpose:** how Tacet frames imagery and video pulled from the open social web — photos from
Pixelfed, video from PeerTube, images from Mastodon — so that borrowed media arrives as *content*,
composed like a magazine spread, never as a functional thumbnail. This doc operationalises Law
[**L5 — Media is editorial**](./design-principles.md) and spends the media tokens the
[audit §3.4](./design-audit.md) added. It cites tokens by name; it never redefines a value.

---

## 1. Philosophy — media is content, not a thumbnail

The reference networks treat an image as a payload: crop it to fit, stamp counters on it, autoplay
the video to farm a second of attention. Tacet does the opposite. A photograph someone shared is a
*thing worth looking at*. We frame it the way a good magazine frames a plate: an intentional crop, a
consistent corner radius, a single quiet scrim when text must sit on top, a calm blur-up as it
loads, and a caption set in real caption type.

The audit found V1 presenting media functionally — hardcoded `rgba(255,255,255,.92)` washes, a
`#000 55%` overlay, a one-off `text-shadow`, inline `3/2` and `1/1` ratios, and a media-only `520px`
breakpoint. V2 retires every one of those literals into tokens. The rule is simple: **if a media
surface carries a raw value, it is a bug.** Everything below composes from the §7 media tokens.

---

## 2. Aspect-ratio system

One image can arrive at any native proportion. We do **not** let that dictate layout; we choose an
editorial frame per role and let `object-fit: cover` fill it. The native pixels are preserved for
the full-screen viewer — the *frame* is a design decision.

| Role | Token | Why |
|---|---|---|
| Default single-image post | `--ratio-photo` (3/2) | The calm editorial default — reads as a photograph, not a square |
| Video / wide media | `--ratio-video` (16/9) | Matches how video is authored; poster and player share it |
| Tall photography (Pixelfed) | `--ratio-portrait` (4/5) | Honours portrait work without letting it dominate the column |
| Avatars, gallery tiles | `--ratio-square` (1/1) | Grid tiles and stacked avatars stay uniform |
| Profile banner | `--ratio-banner` (3/1) | A quiet header band, never a hero billboard |

**Focal handling.** `object-fit: cover` crops — so the crop must be *smart*, not centred-by-default.
Where the source federates a focal point (Mastodon/Pixelfed media `focus`), honour it via
`object-position`. Absent a focal point, bias toward the upper-centre for portrait sources (faces
sit high) and true centre otherwise. A crop that decapitates a subject is an editorial failure, not
an acceptable default.

---

## 3. Gallery layouts by count

A multi-image post is a composition. The layout is chosen by image count, not by dumping a scroll
strip. Grouped media shares one outer radius (`--radius-lg`, the Tacet card radius) and each inner
tile uses `--radius-md` so the group reads as a single considered object, not a pile of chips.

- **1 image** — full reading measure, at the image's natural proportion clamped to `--ratio-photo`
  (or `--ratio-portrait` for tall sources, `--ratio-video` for video). One image, given room.
- **2 images** — equal halves, side by side, both at `--ratio-square` so the pair balances. A hairline
  gutter (`--space-1`) separates them; the group keeps the single outer radius.
- **3 images** — one large lead (left, `--ratio-portrait`-ish tall) plus two stacked squares on the
  right. The lead earns emphasis; the stack supports it. Editorial asymmetry, not a rigid grid.
- **4 or more** — a 2×2 grid of `--ratio-square` tiles. When the post carries more than four, the
  fourth tile shows a **`+N` overlay** ("+3") drawn with `--scrim-media` behind `--on-media` text at
  `--text-heading`. The overlay invites the viewer into the full set; it is a doorway, not a badge.

**Collapse behaviour.** Gallery breakpoints are tokenised — a 2-up gallery may drop to stacked below
`--bp-sm`, and the tablet tier earns two-column galleries earlier (per
[responsive.md §5–6](./responsive.md)). There is **no** media-only `520px` literal anymore; galleries
respond at the shared `--bp-*` tokens like everything else.

---

## 4. Overlays & scrims

Every mark that sits *on* media — a play button, a `+N` count, a caption, a duration badge — reads
through one family of tokens, so it is theme-agnostic and legible on any photograph:

- **Text/icons on media:** `--on-media` (`#fff` in both themes), with `--media-shadow` for a whisper
  of separation from bright backgrounds.
- **Solid overlays** (play affordance, `+N` count): `--scrim-media` — black mixed to `--alpha-scrim`,
  legible over any image without inventing a new opacity.
- **Caption gradient:** `--scrim-caption`, the bottom-up gradient, so caption text lifts off the
  image without a hard bar.

There are **no hardcoded colours on media.** The retired `rgba(255,255,255,.92)`, the `#000 55%`
overlay, and the one-off `text-shadow` are all replaced by the tokens above. Because the scrim is
built from black and tuned by alpha, it behaves identically in light and dark — media legibility is
one system, not two.

---

## 5. Loading — calm, never a spinner

Media loads the way a page turns, not the way a slot machine spins.

1. **Reserve the frame.** The tile always occupies its aspect-ratio box (§2) before the pixels
   arrive, so there is **zero layout shift** — the column never jumps.
2. **Blur-up.** Show the low-quality placeholder (LQIP / BlurHash from the source) immediately, then
   fade the full image in over `--dur-3` with `--ease-out` (see [motion.md](./motion.md)). The image
   *resolves*; it does not pop.
3. **Skeleton, not spinner.** If no placeholder exists, hold a still skeleton in the reserved frame.
   No pulsing flash, no spinning ring, no progress theatre — a spinner that flickers on a fast
   connection is chrome that only wants to be noticed (Law L6).

Reduced-motion honours the contract: the fade collapses to an instant swap, never a jarring cut of a
moving thing.

---

## 6. Captions, alt text & attribution

- **Caption typography.** Captions render at `--text-meta` in `--color-text-secondary`, on the reading
  surface below the media — not stamped across the image unless the composition demands an overlay,
  in which case `--scrim-caption` + `--on-media` carry it. Captions are supporting voice, quiet.
- **Alt text is mandatory.** Every image and video poster carries alt text — federated when the source
  provides it, and surfaced (never silently dropped) so screen-reader users get the same content.
  This is Law [L10 — accessibility is the floor](./design-principles.md), not a nice-to-have. Missing
  alt is flagged in authoring, not shipped blank.
- **Source attribution — the human place.** Media credits *where it came from as a place a person
  posts from* — a warm, human name — never a protocol or server string. We say "shared from
  Pixelfed" or the community's human name; we never surface "instance", "server", "fediverse", or a
  bare domain (Law [L9 — human words only](./design-principles.md)).

---

## 7. Video — no autoplay, ever

Autoplay is a compulsion loop, and compulsion loops are banned doctrine. Video on Tacet is a still,
composed frame until a person chooses to play it.

- **Poster + play affordance.** The video shows its poster at `--ratio-video`, with a single play
  button drawn in `--on-media` over a `--scrim-media` disc. Calm, centred, unmistakable (Law L3 —
  legible over clever).
- **No autoplay, no auto-muted-loop.** Nothing moves until the play control is pressed. There is no
  hover-to-play, no scroll-into-view trigger.
- **Duration badge.** The runtime ("2:14") sits bottom-right in `--on-media` over `--scrim-media` at
  `--text-micro` — informative, so a person can choose with knowledge, never a countdown pressure.

---

## 8. Editorial details — making borrowed media feel premium

- **A Pixelfed multi-image post** should feel like a photo-essay page: the gallery composition (§3)
  gives the set rhythm, the shared outer radius binds it, generous whitespace above and below lets it
  breathe, and the `+N` doorway promises more without clutter. Portrait work is honoured at
  `--ratio-portrait`, not squashed into a square.
- **A PeerTube video** should feel like the still frame of a film, not a YouTube thumbnail: a clean
  `--ratio-video` poster, one calm play mark, the duration whispered in the corner, the creator's
  human name as attribution. The premium signal is *restraint* — no red progress worm, no
  recommendation rail, no view-count furniture crowding the frame.
- **A Mastodon image** slots into the same frames as a native photo — the network it came from is a
  detail in the attribution line, never a different visual language. One media system serves the
  whole open web.

---

## Content notes (reading)

A **content note** is Tacet's human name for what the open web calls a content warning. When a
moment arrives with one — whether authored here or federated in — we honour the poster's request to
let a reader *choose* before they see. That is care, not alarm. So a content note is a calm door, not
a hazard sign.

- **Faithful inbound mapping.** A content warning from the open web (Mastodon and kin) maps directly
  to a content note; the poster's words are preserved verbatim as the note's summary
  ([ADR-005](../30-architecture/) representation). We never drop it, and we never restyle its meaning.
- **Collapsed by default.** A moment carrying a note renders folded: a single quiet summary line —
  *"Content note: <summary>"* set in `--color-text-secondary` at `--text-meta` — above a soft
  **"Show"** control. The body text and any media stay hidden until the reader reveals them. There is
  **no red, no warning-triangle, no alarm styling**: the note reads in the same calm register as the
  rest of the surface (see [design-principles.md](./design-principles.md), L3).
- **Sensitive media, individually.** Media inside a noted moment (or flagged sensitive on its own) sits
  behind a blur overlay built from `--scrim-media`, carrying a quiet *"Sensitive — tap to view"* label
  in `--on-media` at `--text-meta`. Each image is revealed on its own — showing one does not force the
  set open.
- **Reveal is per-session, not permanent.** Once a reader shows a note or a sensitive image, it stays
  shown for that session; we do **not** persist a permanent dismissal that quietly erases the poster's
  request forever. A fresh session re-folds, honouring the note again.
- **Human term, always.** It is a **content note** everywhere in the interface and the copy — never
  "CW", "spoiler", "content warning", or any protocol word (L9).
- **Accessibility.** The "Show" control is a real `<button>` with a clear accessible name (e.g.
  *"Show content: <summary>"*), not a bare icon or a clickable `<div>`. Revealing expands the body in
  place and moves focus naturally forward — it never traps focus or steals it (see
  [accessibility.md](./accessibility.md)). Authoring of notes lives in
  [publishing-ui.md](./publishing-ui.md); the reveal control is specced in [components.md](./components.md).

---

## Alt text (reading)

An image description is content, not metadata — it is how a blind reader sees the photograph, and how
a sighted reader learns what the poster wanted noticed. Tacet treats alt text as a first-class part of
the image (Law L5 — media is editorial), surfaced quietly for everyone rather than buried.

- **A quiet "ALT" marker.** Every image with a description carries a small **"ALT"** affordance in a
  corner — a real text control, not a vanity badge — that reveals the full description on tap or focus.
  It is an offer to read more, never a decoration and never a boast about compliance.
- **Screen readers first (mandatory).** The description is set as the image's accessible name, so
  assistive technology speaks it as the image itself — this is not optional
  ([accessibility.md](./accessibility.md), and Law L10, the floor). Decorative images with no meaningful
  content are hidden from assistive tech entirely (empty alt / `aria-hidden`) so they don't clutter the
  reading.
- **Preserve the open web's descriptions.** Alt text federated from the source is kept intact and shown
  as-is ([ADR-005](../30-architecture/)); we never silently strip a description a poster took care to
  write.
- **Editorial, unobtrusive styling.** The marker uses `--text-micro` in `--on-media` over `--scrim-media`
  when it sits on an image — legible on any photograph, in either theme, without a second colour system.
  It is tucked into a corner and **never covers the image** or crowds the composition; restraint is the
  premium signal (L5).
- The marker component and the description panel are specced in [components.md](./components.md); writing
  and prompting for alt text at compose time lives in [publishing-ui.md](./publishing-ui.md).

---

## 9. Do's and don'ts

**Do**
- Frame every image with a role ratio from §2 and a smart focal crop.
- Compose multi-image posts by count (§3); bind them with the shared radius.
- Draw every on-media mark with `--scrim-*`, `--on-media`, `--media-shadow`.
- Reserve the aspect box and blur-up so nothing shifts or spins.
- Ship alt text and a human-place attribution on every piece of media.

**Don't**
- Hardcode a media colour, opacity, ratio, or breakpoint — the audit's literals are retired.
- Autoplay video, or loop it muted to catch the eye.
- Overlay engagement furniture on media. **No like counts, no comment tallies, no reaction rails,
  no view counts, no "trending" stamps** on top of an image or video — this is exactly the reference
  networks' chrome we reject (Law L6, and design-principles §2). Media carries the content and its
  human attribution; it never carries a scoreboard.
- Decapitate a subject with a centred default crop, or squash portrait work into a square.
- Flash a spinner. Calm loading only.
