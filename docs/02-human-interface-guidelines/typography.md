# Typography

Type is Tacet's primary material. Before color, before icons, before imagery, the
words on screen carry the product. A person reading a note from someone they love
is having a *typographic* experience first. Treat type with the care that deserves.

This is also where the [legible over clever](design-principles.md) principle earns
its keep: the highest craft here is invisible. Good typography is felt as ease, not
noticed as style.

## Type as the material, not the decoration

Because Tacet is [people over content chrome](design-principles.md), the interface
is mostly words: names, notes, conversations, plain controls. That means typography
*is* the UI for most of the app. Get the reading experience right and most of the
product is right.

## Hierarchy

A person should understand the shape of a screen before reading a single word,
purely from typographic weight and scale.

- **A clear ladder, not a spectrum.** A small number of distinct roles — display,
  title, body, supporting, meta — each unmistakably different from its neighbors.
  Ambiguous half-steps make screens feel busy.
- **Size and weight do the work; color is a last resort.** Hierarchy that depends
  on color fails in [dark mode](dark-mode.md) and for many readers. Build the ladder
  in scale and weight first.
- **One focal point per screen.** [Calm over dense](design-principles.md) applies
  to type: if everything shouts, nothing is heard. Let one thing be the largest.

## Reading comfort

Tacet is read for minutes at a time, often warmly, sometimes tenderly. Optimize for
comfort, not information density.

- **Generous line height** for body and message text — reading, not scanning.
- **Humane measure.** Cap line length (roughly 60–75 characters) so long notes stay
  easy on the eye. Full-width text is a density tell.
- **Real paragraphs.** Respect the writer's line breaks; give correspondence room to
  breathe rather than compressing it into a stream.
- **No walls of small type.** If text is small enough to feel dense, the layout,
  not the type size, needs to change.

## Restraint, warmth, humanity

- **Few families, few weights.** A restrained palette of type reads as calm and
  intentional. Novelty fonts and a zoo of weights read as noise.
- **Warm and human, not brutalist.** This supersedes the historical words-only,
  monospace-leaning `DESIGN.md`. Type should feel like a well-set letter, not a
  terminal readout. Warmth over austerity is the [governing feeling](design-principles.md).
- **The historical Jost / Space Mono pairing can evolve.** It was an early choice,
  not a commitment. The requirement is *warm, legible, original, and calm* — the
  specific families should be chosen against that bar and may change. Do not treat
  the old pairing as fixed canon.

## Where the specifics live

This document sets intent, not values. Concrete type tokens — the exact scale,
weights, line heights, and families — belong in the
[design system](../03-design-system/README.md). Don't hardcode sizes here; set the
philosophy here and let the tokens implement it, so the two never drift.
