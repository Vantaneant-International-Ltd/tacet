# TACET · DESIGN.md

> **⚠️ HISTORICAL — SUPERSEDED (2026-07-07).** The authoritative design system is
> now **[`/docs/03-design-system/`](docs/03-design-system/)** and the interface
> guidelines **[`/docs/02-human-interface-guidelines/`](docs/02-human-interface-guidelines/)**.
> Tacet's design language is now **warm, rich, calm, and alive**, with icons
> permitted and a light mode expected — not the austere, words-only, near-black
> system described below. The dark tokens here survive only as a starting point for
> a dark theme. Kept for history; do not use as current guidance.

---

The visual and interaction reference for TACET (historical). This file contains design
guidance only, no strategy. Superseded by `/docs/`; retained for provenance.

---

## 1. Posture

The interface is the same argument as the network: remove the machinery of attention and
what remains is reading, watching, and speaking. Every screen answers to six principles:

1. **One column of quiet.** Content holds the centre; navigation and tools retreat to edges.
2. **The lens switcher is the only chrome that matters.** Everything else recedes.
3. **No red, no badges, no dots.** Nothing pulses, counts up, or begs to be opened.
4. **Chronology is visible.** Timestamps are typography, not metadata.
5. **Type over iconography.** Words in letterspaced mono where other apps use icon soup.
6. **Darkness as canvas.** Near-black surfaces, tints for structure, white reserved for voice.

## 2. Canvas

CSS custom properties, exact values, both required and sufficient:

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#0D0D0D` | The page. Near-black, never pure black. |
| `--panel` | `#161614` | Raised surfaces: overlays, composer, admin cards. |
| `--hairline` | `#2A2A27` | All rules and dividers. The only borders. 1px. |
| `--secondary` | `#8A8A86` | Supporting and system text. |
| `--dim` | `#55554F` | Labels, metadata, mono captions. |
| `--voice` | `#F5F5F2` | RESERVED for content a person wrote. Nothing system-side, ever. |

The voice rule is the load-bearing one: hierarchy of who-is-speaking is carried by colour.
If system text is ever `--voice`, the interface has lied about who said something.

No other colours exist. No red under any circumstance. No gradients, no shadows, no glow.

## 3. Type

- **Jost** (variable; weights 300, 400, 500 only) for everything a person wrote and for headings.
- **Space Mono** for everything the system says: labels, bylines, timestamps, nav. Uppercase,
  letterspaced (0.08em-0.2em by size), small (10-12px).
- Post body text: 17-18px, line-height ≥ 1.6, `--voice`.
- No weight above 500. No italics in system text. No other fonts.

## 4. Layout and spacing

- Mobile-first; every screen must hold at 380px wide.
- One reading column, max-width ~640px on larger screens, centred, generous side margins.
- Vertical rhythm is generous by default; when in doubt, add space. Density is a failure mode.
- Hairlines separate; panels are used sparingly (overlays and admin, not feed content).

## 5. Components

**Post (Timeline lens).** Editorial, not chat:
- Byline: mono, `--dim`: `HANDLE · HH:MM · DD MMM`
- Body: `--voice`, reading size, full column width. Images sit below body, full column width.
- Actions: `REPLY` and `KEEP` as small mono labels, `--dim`, hover/active to `--secondary`.
- Hairline below, then a large gap. Density target ~3 posts per phone viewport, never more than 4.
- No avatars. No numbers of any kind attached to the post.

**Tile (Grid lens).**
- Square, chronological, silent: no counts, no overlays, no hover metrics.
- Text posts render as typographic tiles: first words in Jost on `--panel`.
- Tapping a tile opens the post with its replies in the reading column.

**Lens switcher.**
- Room header on web; a LENS tab / quiet bottom sheet on phone. Current lens marked
  with a subtle `--panel` pill, others `--dim`. One line per lens: name + three-word description.
- Switching cross-fades ~300ms. This is the only animated moment in the product.

**Composer.**
- Not persistent. A single mono `WRITE` affordance in the room header opens a full overlay
  on `--panel`: room name, a large plain text area, image attach, one `POST` action.
- Placeholder text is quiet and literal (e.g. the room name), never an exhortation.

**Navigation (phone).** Three mono words: `ROOMS · LENS · YOU`. No bell, no icons, no badges.

**Replies.** Flat list under the post, same editorial anatomy at slightly smaller scale.

**Keep.** Private. The author of a kept post sees the single word `KEPT` in `--dim` on their
own post. Never a number, never who. A private **Your keeps** view (reached from YOU) lists
what you've kept, across rooms; it is yours alone and carries no metrics.

**Acknowledge** (lockfile §10, Amendment 1). Beneath a post's actions: the three words
`SEEN` · `WITH YOU` · `MORE` as small mono labels (`--dim`, active in `--secondary`).
Placing one is a gesture, not a composition; tapping your active word withdraws it. Below,
who acknowledged is shown grouped by word — the word in `--secondary` mono, the names after
it in `--dim`. Attributed and room-visible, **never a number, never an opposite word.**
Acknowledgments appear only in Timeline and post detail; the Grid stays silent.

**Onboarding.** Shown once per device on first arrival: a quiet full overlay on `--panel`
that teaches the one thing newcomers need — rooms not a feed, the lens is the format, the
verbs, and what isn't here. One `ENTER` action. No carousel, no dots, no skipping theatre.

**Default lens.** A room may open in a suggested lens (set by its admin at creation). It is
only a default — the person's own lens choice always wins and persists (per §5).

## 6. Motion

Nothing moves unless the person moved it. Permitted: the lens cross-fade (~300ms) and
standard focus/active states. Forbidden: skeleton shimmer, spinners (use a static mono
`LOADING` word), pull-to-refresh flourishes, counters, auto-playing anything.

## 7. Language in the interface

- System copy is short, literal, and unexcited. No exclamation marks. No "please".
- Words over icons: `REPLY`, `KEEP`, `WRITE`, `KEPT`, `ROOMS`, `LENS`, `YOU`.
- Empty states state facts quietly ("No posts yet.") and stop. No coaching, no mascots.
- Errors say what happened and what to do, one sentence, no apology theatre.

## 8. Accessibility

- Contrast: `--voice` and `--secondary` on `--canvas` meet WCAG AA at their sizes; do not
  introduce text below 10px or reduce these pairings.
- Focus states are visible (1px `--secondary` outline) and never removed.
- All actionable mono labels are real buttons/links with accessible names.
- The lens cross-fade respects `prefers-reduced-motion` (switch becomes instant).

## 9. What this file is not

Not a product spec (see BUILD-LOCKFILE.md), not a roadmap, not a brand strategy document.
If a question is about scope, data, or law rather than appearance and behaviour, the
lockfile answers it.
