# Iconography

Icons are permitted in Tacet. This is a deliberate move toward warmth and
familiarity, and it supersedes the repo's early words-only, dark-only `DESIGN.md`,
which is now historical. A home has recognizable objects; a warm interface has
recognizable icons.

But permitted is not the same as free. Icons carry two risks — they can *replace*
meaning that belongs to words, and they can *smuggle in* the visual language of the
products we reject. Both are guarded against here.

## Icons support words; they never replace meaning

This is the first rule and it is firm. Icons are companions to labels, not
substitutes for them.

- **Label by default.** Primary navigation and primary actions carry words. An
  [icon](navigation.md) sits *with* the word to aid recognition and scanning — it
  does not stand alone hoping the user guesses right.
- **No mystery glyphs.** If a control's meaning lives only in an icon, the design has
  failed [legible over clever](design-principles.md). A person should never have to
  decode Tacet.
- **Icons speed recognition; words carry meaning.** Once a person knows a place, its
  icon helps them find it fast. But the meaning was established in words first, and
  the words stay.

## An original icon style, not a borrowed set

Tacet's icons must look like Tacet — nowhere else. This is the [anti-clone
stance](README.md) applied to the smallest surface.

- **Draw an original family.** One coherent set with its own weight, corner
  character, and warmth. Don't ship a stock icon library and don't mix sets.
- **Warm and familiar, not sharp and generic.** The style should feel calm and
  human, of a piece with the [type](typography.md) and [spacing](spacing.md) — a
  little softness over clinical precision.
- **Consistency over cleverness.** Same stroke, same grid, same optical sizing
  across the whole set. A person should feel one hand drew them all.

## Never copy X or Instagram icon language

Explicitly forbidden: reproducing the icon vocabulary of the attention platforms.

- No X-style glyphs, verbs, or the bird-lineage shorthand.
- No Instagram-style camera, story-ring, heart-burst, or double-tap iconography.
- No Mastodon/Fediverse control glyphs surfaced to users — federation is invisible
  plumbing, so there are no boost/federate/instance icons in the person's view.
- No engagement iconography at all: no like-hearts as counters, no view-eyes, no
  share-spurs. That furniture is [content chrome](design-principles.md), and Tacet
  removes it. (See the [anti-patterns](../00-manifesto/anti-patterns.md).)

If an icon looks like it came from another app, redraw it until it looks like it
came from Tacet.

## Where the specifics live

This page sets intent. The icon set itself, its grid, stroke, and sizing tokens
belong in the [design system](../03-design-system/README.md). Keep the drawn assets
and their specs there so this document can stay about *what icons are for*.
