# Accessibility

Accessibility is baseline respect, not a feature tier. Tacet is *your home*, and a
home everyone can use is the only kind worth building. This is not compliance work
bolted on at the end; it is the same [honesty and respect](design-principles.md)
that governs everything else, applied to bodies and abilities.

A useful frame: **calm is also accessible.** Most of what makes Tacet restful — low
noise, clear hierarchy, honest controls, no manufactured urgency — is exactly what
makes it usable for people with disabilities. The two goals point the same way.

## Contrast

- Meet WCAG AA contrast as the floor, for text and for meaningful non-text (icons,
  focus rings, state indicators) — in both [light and dark](dark-mode.md).
- **Never carry meaning by color alone.** State, hierarchy, and selection must also
  read through [text, weight, or shape](typography.md). This protects color-blind
  users and keeps hierarchy intact in either theme.
- Warm palettes still have to pass. Cosy is not an excuse for low contrast; test the
  real tokens against real backgrounds.

## Focus states

- **Every interactive element has a visible, obvious focus state.** Never remove
  focus outlines without replacing them with something equally clear.
- Focus order follows reading order and is logical, predictable, and never trapped.
- Focus is a first-class visual, designed to be calm and legible — not an
  afterthought that clashes with the rest of the interface.

## Reduced motion

Honor `prefers-reduced-motion` completely. When it is set, decorative
[motion](motion.md) stops and transitions collapse to simple fades or instant cuts.
The reduced-motion experience is fully functional and never a degraded one. This is
where calm and accessibility most visibly meet.

## Real, semantic controls

- **Use real controls.** A button is a `<button>`, a link is an `<a>`, a field is a
  labeled input. No `div`s pretending to be interactive.
- Every control has an accessible name and, where needed, an accessible description.
  Icon-adjacent labels ([iconography](iconography.md)) help here too.
- State (pressed, selected, expanded, disabled) is exposed programmatically, not
  only visually.

## Keyboard

- **Everything is operable by keyboard alone** — every [navigation](navigation.md)
  destination, every action, every setting. No mouse-only paths.
- Provide a skip link to main content and sensible keyboard shortcuts where they
  genuinely help, never as a hidden requirement.
- No keyboard traps; `Esc` reliably dismisses transient surfaces.

## Screen readers

- Structure pages with correct landmarks and a sane heading outline so a screen
  reader user can move by region and heading.
- Announce meaningful changes (new content in [Conversations](navigation.md), a save
  completing) with appropriately polite live regions — informative, never spammy.
  Calm applies to the audio experience too.
- Images and avatars carry meaningful alternative text; decorative imagery is hidden
  from assistive tech.

## The standard of care

We hold accessibility to the same [Apple-HIG-grade rigor](README.md) we cite
everywhere: not the look, the *discipline*. An interface that respects the user
respects *every* user. If a design works only for the sighted, mouse-using,
motion-tolerant person, it is not finished.
