# Motion

Motion in Tacet serves comprehension and calm. It never performs, never grabs, and
never exists to be admired. If an animation's job is to be noticed, it has the wrong
job.

This is [calm before addiction](../00-manifesto/founding-principles.md) expressed in
time. The attention economy uses motion as a hook — pulses, bounces, autoplay,
things that move to pull the eye back. Tacet uses motion the opposite way: to make
change *understandable* so the mind stays at rest.

## What motion is for

- **Continuity.** When something moves or transforms, animation shows *where it came
  from and where it went*, so the user never has to re-find their place.
- **Orientation.** Transitions between [places](navigation.md) should feel like
  moving through a coherent space, not cutting between unrelated screens.
- **Feedback.** A tap, a send, a save may acknowledge itself with a small, honest
  motion — confirmation, not celebration.

## What motion is never for

- **No autoplay.** Video and animated media never play on their own. The user
  starts motion; motion never starts on the user. (A named
  [anti-pattern](../00-manifesto/anti-patterns.md).)
- **No attention-grabbing animation.** No pulsing badges, no bouncing icons, no
  shimmer designed to pull the eye, no looping motion competing for focus. Nothing
  moves in order to bring you back.
- **No spectacle.** No gratuitous parallax, confetti, or hero animations that exist
  to impress. Delight comes from calm and clarity, not from a show.
- **No motion as urgency.** Movement must never manufacture "act now." Urgency is a
  dark pattern; see [honesty over manipulation](design-principles.md).

## Permitted transitions

Kept small, quick, and purposeful:

- Gentle fades and slides between navigation destinations, matching the spatial
  model (a place you move *to*, not a screen that replaces).
- Soft reveals as content or people load — easing in rather than snapping, without
  drawing attention to themselves.
- Quiet acknowledgment of an action (a compose sending, a setting saved).
- Calm, non-looping loading states. No spinner theater.

The bar: motion should be *felt as ease and understood as change*, and never
*remembered as an effect*. Short durations, natural easing, no bounce for its own
sake.

## Respect prefers-reduced-motion

This is non-negotiable. When a person has asked their system for reduced motion,
Tacet honors it completely — transitions become simple cross-fades or instant cuts,
and nothing animates decoratively. Reduced motion must remain fully functional and
never feel like a broken or lesser version of the product. See
[accessibility](accessibility.md); calm is also accessible, and motion restraint is
where the two most obviously meet.
