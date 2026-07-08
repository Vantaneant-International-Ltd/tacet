# Design Principles — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2. These extend (do not replace) the Human Interface
> Guidelines in [`../02-human-interface-guidelines/design-principles.md`](../02-human-interface-guidelines/design-principles.md).
> Those five principles are doctrine. This doc restates them as *visual* commitments and adds the
> V2-specific laws the [audit](./design-audit.md) surfaced.

---

## The five founding principles (doctrine — restated visually)

1. **Calm over dense.** Whitespace is the primary material. One clear subject per view. When in
   doubt, remove. Density is a failure mode, not a feature.
2. **People over content chrome.** Faces present, names legible, relationship first. No public
   vanity counts. Engagement furniture (like tallies, reaction rails, "trending") does not exist.
3. **Legible over clever.** A person always knows where they are, what a thing is, and what a touch
   will do — without decoding an icon or a gesture. Words carry meaning; icons support words.
4. **Warmth over austerity.** Cosy, not clinical. Light mode is a first-class citizen. Type is
   human. The product feels like a home, not a terminal.
5. **Honesty over manipulation.** No dark patterns. Real state, real consequences, easy to leave.
   If a design only works because the user didn't notice, it does not ship.

---

## V2 visual laws (new, milestone-specific)

These are the enforceable commitments of Visual System V2. Each traces to an audit finding.

### L1 — Type carries hierarchy; borders do not
Hierarchy comes from **size, weight, colour, tracking, and whitespace** — not from wrapping every
group in a bordered card. A card earns its border only when it is a genuinely separable object.
*(Audit §3.1–3.2. "Typography should carry the interface. Not borders.")*

### L2 — Remove before adding
When tempted to add decoration, remove something instead. Every element must justify its presence
against calm. Chrome is debt. *(Brief: "Remove before adding.")*

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

### L7 — The context column helps; it never dashboards
The wide-canvas right column is contextual to the current task — it helps you understand or continue
what you're doing, or it is empty. Never widgets, never metrics-as-rewards, never a status board.
*([responsive.md §3](./responsive.md).)*

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

---

## The final-review questions (apply to every screen)

Before any screen is "done":

1. Would Apple ship this? Would Linear accept it? Would Arc?
2. Will it still feel modern in five years?
3. Does it feel unmistakably like **Tacet** — calm, warm, honest, media-first, people-first?
4. Did I remove everything that wasn't earning its place?
5. Does any part of it only work by borrowing an engagement mechanic? *(If yes — cut it.)*

If any answer is unsatisfying, keep refining. Calm confidence is the bar.
