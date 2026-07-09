# Design Principles — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2. These extend (do not replace) the Human Interface
> Guidelines in [`../02-human-interface-guidelines/design-principles.md`](../02-human-interface-guidelines/design-principles.md).
> Those five principles are doctrine. This doc restates them as *visual* commitments and adds the
> V2-specific laws the [audit](./design-audit.md) surfaced.

---

## The five founding principles (doctrine — restated visually)

1. **Calm is clarity, not subtraction.** Calm means the person is unhurried and in control — one
   clear subject, legible hierarchy, nothing fighting for attention. It does **not** mean empty.
   Apple, Linear, Arc, and Notion are calm *and* intentionally rich; that is the bar. Whitespace is
   a material, not a goal. When in doubt, clarify — remove what confuses, keep what informs. Density
   is only a failure when it stops being clear.
2. **People over content chrome.** Faces present, names legible, relationship first. No **self-directed**
   vanity counts — no scoreboard of *your* likes, followers, or reach, no reaction rail that turns
   friends into an audience. **World-directed context is different and welcome:** representing what
   your world is reading, which conversations are alive, which communities moved — honestly framed —
   *informs* a person about the open social web (see L11, ADR-011). We refuse the scoreboard, not the world.
3. **Legible over clever.** A person always knows where they are, what a thing is, and what a touch
   will do — without decoding an icon or a gesture. Words carry meaning; icons support words.
4. **Warmth over austerity.** Cosy, not clinical. Light mode is a first-class citizen. Type is
   human. Tacet feels warm, confident, and purposeful — *the place where a person's open-social-web
   life comes together and the one they return to.* "Home" is a **product principle, not a visual
   metaphor**: we do not make the UI resemble a house, a room, or a city — we make it feel like *where
   everything comes together.* Not a terminal, not a sterile magazine, not theatrical.
5. **Honesty over manipulation.** No dark patterns. Real state, real consequences, easy to leave.
   If a design only works because the user didn't notice, it does not ship.

---

## V2 visual laws (new, milestone-specific)

These are the enforceable commitments of Visual System V2. Each traces to an audit finding.

### L1 — Type carries hierarchy; borders do not
Hierarchy comes from **size, weight, colour, tracking, and whitespace** — not from wrapping every
group in a bordered card. A card earns its border only when it is a genuinely separable object.
*(Audit §3.1–3.2. "Typography should carry the interface. Not borders.")*

### L2 — Clarify before adding, and before removing
Every element must justify its presence — but the test is **clarity, not scarcity**. When something
feels wrong, first ask *does this help the person understand their world?* If yes, keep it and make
it clearer; if it only adds chrome or a score, remove it. Do not remove informing content in the
name of calm. Chrome is debt; *context is not chrome*. *(Supersedes the earlier "remove before
adding" reflex — see [stage-6-design-direction.md](./stage-6-design-direction.md).)*

### L3 — One accent, one action
Lavender marks the single primary action per view (two is the absolute ceiling). Everything else is
neutral. Colour is not decoration; it is signal. *(tokens.md §6.)*

### L4 — Motion means something
Every animation communicates: where you went, that something loaded, that your action was received.
Motion that only wants to be noticed has the wrong job. All motion is `prefers-reduced-motion`-
complete and never blocks. *(Audit §3.3; [motion.md](./motion.md).)*

### L5 — Media is editorial
Imagery is content, framed like a magazine, not a thumbnail: intentional crop, consistent radius,
a single scrim token, blur-up loading, caption typography. *(Audit §3.4; [media-system.md](./media-system.md).)*

### L6 — The interface disappears behind the content
No spectacle competing for attention — no glowing orbs, no urgency halos, no pulsing badges. The
best compliment is that the person remembers the conversation, not the chrome. *(Audit §6.)*

### L7 — The context column shows your world, never your score
The wide-canvas right column is a **living contextual space**: people close to you, what your world
is reading, active conversations, communities that moved, a calm onward door. It may be genuinely
rich. It never becomes a dashboard, a leaderboard, a personal-analytics panel, or anxiety furniture.
The gate is the informing/manipulating test (L11), not emptiness. *([ADR-012](../06-decisions/ADR-012-the-context-column-law.md),
[responsive.md §3](./responsive.md).)*

### L8 — Both themes are designed, not inverted
Dark and light each get a deliberate pass. Depth in light comes from surface steps and warm shadow;
depth in dark comes from contrast, not from going blacker. *(Audit §3.5; brief: dark/light.)*

### L9 — Human words only
The UI speaks Thought / Photo / Article / Video / Event and Follow / Reply / Share / Save. It never
says post, feed-as-concept, instance, server, federation, or **Entry** (an internal engineering
word). *(Publishing Philosophy; product doctrine.)*

### L10 — Accessibility is the floor, not a tier
WCAG AA minimum in both themes, visible focus everywhere, real semantic controls, full keyboard
paths, meaning never by colour alone, motion respectful. Non-negotiable. *([accessibility.md](./accessibility.md).)*

### L11 — Informing, not manipulating (the core law)
This is the line that governs every judgement about richness. **Representing the open social web's
reality is informing; optimizing it to maximize attention is manipulating.** The open web genuinely
has people, communities, conversations, photos, videos, articles, events, momentum, popular
discussions, and active relationships. Showing those honestly is *faithful representation of reality*
— it is not engagement optimization, and it does not violate calm. Manipulation begins the moment
those things are ordered, counted, or timed to maximize attention rather than understanding: a
scoreboard about you, a ranking of people, a red badge, a streak, a manufactured "you missed this."

The test, applied to every element that shows the world or a number:

> **Is this informing the person (helping them understand their world), or manipulating them
> (making a number about them go up)?** Informing ships. Manipulating does not.

Corollary — **represent, don't remove.** When the open web has real life to show, the calm answer is
to represent it faithfully and quietly, not to hide it. Hiding reality is not calm; it is
incomplete. *(ADR-011, ADR-012; [stage-6-design-direction.md](./stage-6-design-direction.md).)*

---

## The final-review questions (apply to every screen)

Before any screen is "done":

1. Would Apple ship this? Would Linear accept it? Would Arc? (Calm **and** intentionally rich?)
2. Will it still feel modern in five years?
3. Does it feel unmistakably like **Tacet** — calm, warm, confident, honest, media-first,
   people-first, and *alive* — the definitive product for the open social web (where everything comes
   together), never theatrical?
4. Is everything here earning its place by **informing** the person about their world?
5. Does any part of it manipulate — a self-directed score, a ranking, an engagement mechanic,
   anxiety furniture? *(If yes — cut it.)*
6. Did I hide anything real about the open web that I should have **represented** instead?

If any answer is unsatisfying, keep refining. Calm, rich confidence is the bar.
