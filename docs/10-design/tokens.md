# Tokens — Design System V2

> **Milestone:** Visual System V2 · **Stage:** 2 (Design System) · **Status:** Canonical.
> This is the single source of truth for Tacet's design tokens. Every other `10-design/` doc and
> every component references these names — it never hardcodes a value. The V1 implementation in
> [`client/src/design/theme.css`](../../client/src/design/theme.css) already defines most of this;
> V2 **keeps** the good foundation and **adds** the tokens the [audit](./design-audit.md) found
> missing (T1–T10) plus the layout tokens for the [full three-column desktop canvas](./responsive.md).

Legend: **[V1]** ships today, unchanged · **[V2+]** new in V2 · **[V2Δ]** value refined in V2.

---

## 1. Principles for tokens

1. **Semantic, not literal.** `--color-surface-raised`, never `--purple-400`. A token names a
   *role*; theming swaps the value, not the name.
2. **No raw values in components.** If a value appears in a component, it is a token. The audit's
   entire T-list exists to kill the last literals (line-heights, scrims, ratios).
3. **One accent.** Lavender is the only chromatic accent. Positive/warning/danger are *status*,
   used sparingly and never as decoration.
4. **Warmth is encoded.** Neutrals are warm (canvas is ivory, text is warm near-black, shadows are
   warm-tinted). This is doctrine, not taste.
5. **Both themes are first-class.** Every colour token has a light and a dark value that both pass
   WCAG AA for their role.

---

## 2. Typography tokens

### 2.1 Font families **[V1]**
```css
--font-sans: "Jost", system-ui, -apple-system, sans-serif;   /* humanist, warm, legible */
--font-mono: "Space Mono", ui-monospace, SFMono-Regular, monospace; /* meta only, never shouted */
```
Sans weights in use: **400** (body), **500** (headings/labels), **600** (rare emphasis).
**300** is reserved for `--text-display` only. Mono is used *only* for handles/timestamps/counts —
never for reading copy, never letter-spaced-uppercase (that chrome was retired).

### 2.2 Type scale **[V1]** — nine steps
| Token | Size | Default weight | Role |
|---|---|---|---|
| `--text-display` | 2.25rem / 36px | 300–400 | Hero / onboarding only |
| `--text-title` | 1.625rem / 26px | 500 | Screen titles (Today, People) |
| `--text-heading` | 1.25rem / 20px | 500 | Section & card headings |
| `--text-subheading` | 1.0625rem / 17px | 500 | Person name, card lead |
| `--text-body` | 1.0625rem / 17px | 400 | Post body — the voice (sacred) |
| `--text-body-sm` | 0.9375rem / 15px | 400 | Secondary body, replies |
| `--text-label` | 0.875rem / 14px | 500 | Buttons, controls, nav |
| `--text-meta` | 0.8125rem / 13px | 400 | Handle, timestamp, caption (mono) |
| `--text-micro` | 0.75rem / 12px | 500 | Smallest allowed; chips, overline |

> **V2 hierarchy note:** the audit found hierarchy leaning on borders because title→heading→body
> sizes sit close. V2 does **not** change the sizes (they are calm and correct) — instead it widens
> *perceived* hierarchy through weight, colour (`--color-text-secondary` for supporting text),
> tracking, and whitespace. See [typography.md](./typography.md).

### 2.3 Line-height tokens **[V2+ — resolves T1]**
Was hardcoded (`1.5/1.55/1.58/1.6`) across CSS. Now:
```css
--leading-tight:   1.15;   /* display, large titles */
--leading-snug:    1.30;   /* headings, subheadings */
--leading-normal:  1.45;   /* labels, meta, UI text */
--leading-relaxed: 1.60;   /* body — reading comfort (sacred) */
```
Pairing: display/title → `tight`; heading/subheading → `snug`; label/meta/micro → `normal`;
body/body-sm → `relaxed`.

### 2.4 Letter-spacing (tracking) tokens **[V2+ — resolves T2]**
```css
--tracking-tight:  -0.02em;  /* display & titles — pull large type together */
--tracking-normal: 0;        /* body, headings — default */
--tracking-wide:   0.02em;   /* micro / overline — small caps-ish legibility */
```

### 2.5 Reading measure **[V1]**
```css
--measure-reading: 42rem;  /* ~672px, body caps 66–72 chars */
--measure-wide:    56rem;  /* media, grids, wide screens */
```

---

## 3. Spacing tokens **[V1]** — 8px base + half-steps

```css
--space-0: 0;     --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 24px;  --space-6: 32px;  --space-7: 48px;  --space-8: 64px;  --space-9: 96px;
```
`--space-4` (16px) is the base unit. Card inner padding: `--space-5` comfortable, `--space-4`
compact — **and nothing else** (V2 collapses the three drifting paddings the audit found, T7).
Never below `--space-4` inside a card. Between sections: `--space-7`. See [spacing.md](./spacing.md).

---

## 4. Radius tokens **[V1]**
```css
--radius-xs:   6px;    /* chips, tags, focus ring */
--radius-sm:   10px;   /* small inputs, media thumbnails, badges */
--radius-md:   14px;   /* buttons, inputs, nested media */
--radius-lg:   20px;   /* cards, panels (the Tacet card radius) */
--radius-xl:   28px;   /* sheets, modals, composer */
--radius-full: 999px;  /* pills, toggles, circular avatars */
```

---

## 5. Border & alpha tokens

### 5.1 Border width **[V2+ — resolves T3]**
```css
--border-hairline: 1px;   /* default divider / card edge */
--border-strong:   1.5px; /* focus-adjacent emphasis, selected states */
```
Colour comes from `--color-hairline` (see §6). **V2 rule:** a card leans on hairline **or**
elevation, rarely both (audit §3.2).

### 5.2 Alpha scale **[V2+ — resolves T10]**
For disabled/hover/scrim math via `color-mix`, so we stop inventing opacities inline:
```css
--alpha-disabled: 0.40;
--alpha-hover:    0.06;   /* subtle wash on hover (mix accent/text into surface) */
--alpha-pressed:  0.12;
--alpha-scrim:    0.62;   /* over media, see §7 — raised from 0.55 so on-media text clears AA */
```

### 5.3 Icon sizes **[V2+ — resolves Stage-5 B2]**
Icons are drawn on a 24px grid, 1.75 stroke, `currentColor` (see [components.md](./components.md#icons)).
Their *rendered* size is tokenised so components never hardcode a pixel:
```css
--icon-inline: 1em;   /* sits in a line of text; scales with the type around it */
--icon-sm:     18px;  /* dense controls, meta rows, chips */
--icon-md:     22px;  /* default UI icon — buttons, nav, actions */
--icon-lg:     28px;  /* prominent affordances, empty-state glyphs */
```

---

## 6. Colour tokens **[V1]** — warm, both themes

### 6.1 Light — *warm ivory*  **[V2Δ — contrast-corrected to WCAG AA, pre-Figma review §8]**
```css
--color-canvas:         #F7F4EF;   --color-surface:        #FFFDFA;
--color-surface-raised: #FFFFFF;   --color-surface-sunken: #F1EDE6;
--color-hairline:       #E7E1D8;
--color-text-primary:   #23201C;   --color-text-secondary: #6B655C;   --color-text-tertiary: #726B63;
--color-accent:         #7A5CD0;   --color-accent-hover:   #6B4BC4;   --color-accent-subtle: #EFE9FB;
--color-on-accent:      #FFFFFF;
--color-positive:       #3F8A6B;   --color-warning:        #946A1F;   --color-danger:        #C0453E;
--color-focus-ring:     #7A5CD0;
```
> **Contrast corrections (were failing AA on the real hex — pre-figma-review §8):**
> `text-tertiary` `#948D83`→`#726B63` (2.99→~4.8 on canvas); `positive` `#4E9E7E`→`#3F8A6B`
> (2.94→~3.8, and it is always paired with a label/shape, never colour-alone); `warning`
> `#B9862E`→`#946A1F` (2.94→~4.5). **`accent` is for fills/rings only** — inline text **links use
> `--color-accent-hover` (`#6B4BC4`, ~5.6) + underline**, never `--color-accent` at body size.

### 6.2 Dark — *lamplit near-black*
```css
--color-canvas:         #0D0D0D;   --color-surface:        #161614;
--color-surface-raised: #1E1E1B;   --color-surface-sunken: #100F0E;
--color-hairline:       #2A2A27;
--color-text-primary:   #F5F5F2;   --color-text-secondary: #8A8A86;   --color-text-tertiary: #83837C;
--color-accent:         #A88FE6;   --color-accent-hover:   #BBA6EE;   --color-accent-subtle: #221D33;
--color-on-accent:      #16121F;
--color-positive:       #6FBE9C;   --color-warning:        #D6A24E;   --color-danger:        #E06B63;
--color-focus-ring:     #A88FE6;
```
> **Dark correction:** `text-tertiary` `#55554F`→`#83837C` (was 2.4–2.6, now ≥4.5 on both canvas and
> surface). Dark accent/positive/warning/danger already pass AA and are unchanged.

**Usage laws:** one accent action per view (two is the ceiling). `--color-positive` is the *quiet
private signal* — it marks Saved/kept content and successful save acknowledgement, **never** used
as decoration or a second accent. Status colours never carry meaning by hue alone — always paired
with icon/label (accessibility doctrine).

---

## 7. Media & scrim tokens **[V2+ — resolves T4, T5, T6]**

Kills the hardcoded media overlays the audit found (`rgba(255,255,255,.92)`, `#000 55%`, one-off
`text-shadow`). See [media-system.md](./media-system.md).

```css
/* Scrim over imagery, so overlaid text is legible in both themes.
   Built from black so it reads on any photo, tuned by --alpha-scrim. */
--scrim-media:        color-mix(in srgb, #000 62%, transparent);  /* play/count overlays */
--scrim-media-strong: color-mix(in srgb, #000 72%, transparent);  /* backing for SMALL on-media text (counts, +N) so #fff clears AA on a bright photo */
--scrim-caption: linear-gradient(to top, color-mix(in srgb,#000 72%,transparent), transparent 60%);
--on-media:      #FFFFFF;   /* text/icons on top of media, both themes */
--media-shadow:  0 1px 3px color-mix(in srgb, #000 45%, transparent); /* on-media text legibility */
--dot-presence:  8px;       /* the quiet presence/unread dot — --color-accent, never a count */

/* Aspect ratios — was inline 3/2, 1/1 */
--ratio-square:   1 / 1;    /* avatars, single photo tiles in a grid */
--ratio-photo:    3 / 2;    /* default single-image post */
--ratio-video:    16 / 9;   /* video, wide media */
--ratio-portrait: 4 / 5;    /* tall photography (Pixelfed-friendly) */
--ratio-banner:   3 / 1;    /* profile banner */

/* Avatar stacking (participant clusters) — was -8px literal */
--overlap-avatar: -8px;
```

---

## 8. Elevation tokens **[V1]** — warm-tinted, theme-aware

```css
--elevation-0: none;                                          /* on-canvas, flat */
/* light */
--elevation-1: 0 1px 2px rgba(35,32,28,.05), 0 2px 8px rgba(35,32,28,.04);   /* card at rest */
--elevation-2: 0 4px 12px rgba(35,32,28,.07), 0 2px 4px rgba(35,32,28,.05);  /* hover, popover */
--elevation-3: 0 12px 32px rgba(35,32,28,.12), 0 4px 8px rgba(35,32,28,.06); /* modal, sheet */
/* dark (remapped) */
--elevation-1: 0 1px 2px rgba(0,0,0,.30);
--elevation-2: 0 6px 16px rgba(0,0,0,.40);
--elevation-3: 0 16px 40px rgba(0,0,0,.55);
```
Shadows are warm-tinted toward text hue in light, deep in dark. In light mode, **depth also comes
from surface steps** (canvas → surface → surface-raised), not shadow alone (audit §3.5).

---

## 9. Motion tokens **[V1]** — now actually used in V2

```css
--dur-1: 120ms;   /* micro: hover, focus, toggle */
--dur-2: 200ms;   /* controls, chips, small reveals */
--dur-3: 320ms;   /* surfaces: sheets, sidebars, page content */
--dur-4: 480ms;   /* large page reveals, hero */
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* enters, settles (default) */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* moves that leave and return */
```
V2 adds a **spring feel via `--ease-out`** for sheets, and a strict `prefers-reduced-motion`
contract. See [motion.md](./motion.md). Motion tokens were defined in V1 but essentially unused —
Stage 2's motion library is what finally spends them.

---

## 10. Layout & responsive tokens **[V2+ — the three-column canvas]**

Formalises the decision to make desktop a designed tier, not scaled mobile. See
[responsive.md](./responsive.md).

```css
/* Breakpoints */
--bp-sm:  520px;   /* large phone / small tablet grid shifts */
--bp-md:  768px;   /* tablet tier (NEW) */
--bp-lg:  900px;   /* rail appears (V1 breakpoint, kept) */
--bp-xl:  1200px;  /* three-column canvas: context column appears */
--bp-2xl: 1600px;  /* ultra-wide: cap, don't stretch */

/* Canvas structure */
--rail-width:        250px;   /* left navigation rail */
--feed-measure:      --measure-reading;  /* centred reading column = 42rem */
--context-width:     320px;   /* right context column (people close, continue) */
--canvas-max:        1440px;  /* total content cap; margins absorb beyond --bp-2xl */
--gutter:            var(--space-6); /* column gutter on desktop (32px) */

/* Fixed chrome (mobile) */
--topbar-height:     56px;
--tabbar-height:     72px;
--fab-size:          56px;
```

**The canvas at each tier** (full spec in [responsive.md](./responsive.md)):
- **< 768px (phone):** single column, top bar + bottom tab bar + compose FAB.
- **768–899px (tablet):** single wide column, tab bar; reading measure widens.
- **900–1199px (desktop):** rail + centred feed. No context column yet.
- **≥ 1200px (wide):** rail · feed · **context column**. **The context column is *contextual*, never
  a dashboard.** It always helps the person *understand or continue what they are doing right now* —
  and it adapts per screen: on Today, *continue where you left off*; on a Profile, *about this person
  + people you both know*; in a Conversation, *the participants and thread*; on Discover, *about the
  place you're exploring*. It holds no standalone widgets, **never** counts, trending, or a
  federation dashboard (audit §6), and when there's nothing genuinely helpful it stays **empty**
  rather than inventing filler. This is a design law, not a slot to fill — see
  [responsive.md](./responsive.md) and the IA review.
- **≥ 1600px (ultra-wide):** content capped at `--canvas-max`; extra space becomes quiet margin.

---

## 11. Z-index tokens **[V2+]** (formalise the layering seen in V1 CSS)
```css
--z-base:    0;
--z-content: 20;   /* sticky top bar, scrolled content */
--z-nav:     30;   /* tab bar, rail */
--z-fab:     31;   /* compose FAB (above tab bar) */
--z-sheet:   40;   /* sheets, sidebars */
--z-modal:   50;   /* modal dialogs */
--z-toast:   60;   /* transient confirmations */
```

---

## 12. What V2 explicitly did **not** change

- The type scale sizes, the spacing scale, the radius scale, the colour *values*, the elevation
  math, the motion durations/easings. These were audited as correct and calm. V2's contribution is
  to **complete** the token set (line-height, tracking, border, scrim, ratio, alpha, layout, z) so
  that **zero** raw values remain in components — and then to *use* the motion tokens that were
  sitting idle.
- No new accent colour. No second brand hue. Restraint is the brand.

---

## 13. Implementation note

These tokens land in [`client/src/design/theme.css`](../../client/src/design/theme.css) as CSS
custom properties during the (later) implementation milestone — **not** in this design milestone.
Stage 2 defines them; implementation spends them. Naming here is final so code and Claude Design
variables (Stage 6) share one vocabulary.

---

## 14. The timeless system vs the swappable style layer

From the [timelessness audit](./timelessness-audit.md) and [ADR-016](../06-decisions/ADR-016-timeless-system-swappable-style.md):
a few token *values* are more tied to the taste of this decade than to Tacet itself. They are **not
removed** — they are Tacet's current identity — but they are explicitly marked as the **style layer**:
a value can change without the system changing, precisely because the token *names* (the roles) are
what components depend on.

| Token(s) | Role (timeless — never changes) | Value (style layer — may be re-tuned) |
|---|---|---|
| `--color-accent*` | one restrained accent; signal, not decoration | the specific **lavender** hue (a 2020s-coded choice) |
| `--font-sans` | a humanist sans for reading | the specific face **Jost** |
| `--font-mono` | a restrained mono for meta only | the specific face **Space Mono** *(the most fashion-bound token — most likely to be swapped first)* |
| `--radius-lg` / `--radius-xl` | cards/sheets are gently rounded, not sharp | the *amount* (20/28px lean to this decade's soft-UI; moderate is timeless, extreme ages) |

**Rule:** components bind to the **name**, never the value. Re-tuning the accent hue, swapping a
typeface, or moderating the largest radii is a *style* change — one place, no structural churn. The
*system* (semantic tokens, one accent, humanist-sans-for-reading, mono-for-meta-only, the spacing
rhythm, the reading measure, AA contrast) is the part built to last a decade. This is why Tacet can
stay recognisably itself while its surface is refreshed — and it is the discipline that keeps the
product from ageing with any single year's taste.
