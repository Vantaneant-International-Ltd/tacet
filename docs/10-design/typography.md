# Typography — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md).

How Tacet spends its type scale: the roles in use, and how V2 makes hierarchy louder without making anything bigger — so cards can shed their borders.

Type is Tacet's primary material. Because the product is [people over content chrome](./design-principles.md), most screens are words — names, notes, conversations, plain controls. Get the reading right and most of the product is right. This doc is the *how*; the values live in [tokens.md §2](./tokens.md) and are never restated here.

## The scale in use

Nine steps, each an unmistakable role — a ladder, not a spectrum. Every row pairs a size token with the weight, line-height (`--leading-*`), and tracking (`--tracking-*`) it ships with. Sizes come from [tokens.md §2.2](./tokens.md); do not invent half-steps.

| Role | Size token | Font | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Display | `--text-display` | Hanken Grotesk | 300–400 | `--leading-tight` | `--tracking-tight` |
| Title | `--text-title` | Hanken Grotesk | 500 | `--leading-tight` | `--tracking-tight` |
| Heading | `--text-heading` | Hanken Grotesk | 500 | `--leading-snug` | `--tracking-normal` |
| Subheading | `--text-subheading` | Hanken Grotesk | 500 | `--leading-snug` | `--tracking-normal` |
| Body | `--text-body` | Hanken Grotesk | 400 | `--leading-relaxed` | `--tracking-normal` |
| Body-sm | `--text-body-sm` | Hanken Grotesk | 400 | `--leading-relaxed` | `--tracking-normal` |
| Label | `--text-label` | Hanken Grotesk | 500 | `--leading-normal` | `--tracking-normal` |
| Meta | `--text-meta` | Spline Sans Mono | 400 | `--leading-normal` | `--tracking-normal` |
| Micro | `--text-micro` | Hanken Grotesk | 500 | `--leading-normal` | `--tracking-wide` |

**Body is sacred.** `--text-body` at 17px on `--leading-relaxed` (1.60) is the voice of the product — a note from someone you care about. It is not tuned for density, ever. If body feels cramped, the layout is wrong, not the type.

## Widening hierarchy without changing sizes

The [audit](./design-audit.md) found title → heading → body sitting close in size, so the interface leaned on borders to separate groups. Those sizes are calm and correct — V2 keeps them. Instead it widens *perceived* hierarchy through four levers, which is what lets a card [carry its own structure without a border](./design-principles.md) (Law **L1**).

| Lever | Token(s) | What it does |
|---|---|---|
| Weight | 400 / 500 / 600 | 400 recedes (body), 500 leads (headings/labels), 600 is rare emphasis only |
| Colour | `--color-text-primary` vs `--color-text-secondary` | Supporting text steps back in tone, not size |
| Tracking | `--tracking-tight` on display/titles | Large type pulls together and reads as one confident unit |
| Whitespace | the [spacing scale](./spacing.md) | Grouping by air, not by lines or boxes |

Weight and whitespace do the heavy lifting; colour is the quiet lever, never the only one — hierarchy built on colour alone fails for many readers and in [dark mode](./tokens.md) (Law **L10**).

### Concrete pairings

A **card heading and its supporting line** — the pattern that replaces the border:

| Element | Size | Weight | Line-height | Colour |
|---|---|---|---|---|
| Card heading | `--text-heading` | 500 | `--leading-snug` | `--color-text-primary` |
| Supporting line | `--text-body-sm` | 400 | `--leading-relaxed` | `--color-text-secondary` |

The 20px/500/primary heading against the 15px/400/secondary line reads as two clearly ranked tiers with no rule between them. The gap between them is [spacing](./spacing.md), not a divider.

A **person row**: name is `--text-subheading` / 500 / primary; handle is `--text-meta` / Spline Sans Mono / `--color-text-tertiary`; your standing with them (a supporting phrase) is `--text-body-sm` / 400 / secondary. Three tiers, one border avoided.

A **screen title over its count-free subtitle**: title is `--text-title` / 500 / `--tracking-tight` / primary; the subtitle beneath is `--text-body-sm` / 400 / secondary. The tightened tracking on the title is what makes it feel like a masthead rather than just larger body.

## Fonts

Two families, held to strict jobs — a restrained palette reads as calm and intentional (see [tokens.md §2.1](./tokens.md)).

- **Hanken Grotesk** (`--font-sans`) — humanist, warm, legible. It carries everything a person reads: display through micro, all body and reading copy, all controls. Warm, not brutalist; a well-set letter, not a terminal readout.
- **Spline Sans Mono** (`--font-mono`) — meta **only**: handles, timestamps, counts. It is a quiet fingerprint of texture, never reading copy. **Never** set uppercase-and-letterspaced — that shouted chrome was retired in V2. Mono says "this is data about the moment," not "look at me."

**Weight 300 is reserved for `--text-display` only** — the hero and onboarding, where large type can afford to be light and airy. Nowhere else. Body is 400; leading is 500; 600 is rare emphasis.

## Reading measure and long-form

Long notes and articles cap at `--measure-reading` (42rem ≈ 66–72 characters — see [tokens.md §2.5](./tokens.md)). This is the humane measure: past ~72 characters the eye loses the line return; full-width reading text is a density tell.

For articles and long-form:

- Body stays `--text-body` / `--leading-relaxed`. Reading, not scanning.
- Respect the writer's paragraph breaks; give correspondence room to breathe rather than compressing it into a stream.
- Media inside an article may break to `--measure-wide` (56rem); the *text column* stays at reading measure so the words never sprawl.
- Article title uses `--text-title` or `--text-display` with `--tracking-tight`; a standfirst/lead line sits in `--text-body-sm` / secondary.

## Do / Don't

| Do | Don't |
|---|---|
| Build rank with weight + whitespace first, colour last | Lean on `--color-accent` to create hierarchy — it is [one action per view](./design-principles.md) (L3) |
| Use `--color-text-secondary` for supporting lines | Shrink type below `--text-micro` to fit more |
| Keep body at 17px / 1.60 always | Tune body tighter for density |
| Reserve 300 for display; Spline Sans Mono for meta | Set Spline Sans Mono as reading copy or uppercase-letterspaced |
| Cap reading text at `--measure-reading` | Let notes run full-width |
| Apply `--tracking-tight` to display and titles | Track out body or headings |

## Terminology

The UI speaks human words only (Law **L9**): **Thought, Photo, Article, Video, Event**; **Follow, Reply, Share, Save**. Never surface the internal engineering word *Entry*, nor *post*, *instance*, *server*, or *federation*. Typography is where these words live and are read — set them like they matter, because to the person on the other end, they do.
