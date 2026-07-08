# ADR-014: Design system before screens

## Status
Accepted (2026-07).

## Context
Tacet's product architecture, information architecture, navigation, and feature
set were already frozen and coherent. What remained was to make every interaction
*feel* intentional — WWDC-inevitable, calm, warm, timeless. The natural failure
mode at this stage is to jump straight to polishing individual screens in high
fidelity: a beautiful profile here, a striking composer there, each lovely on its
own and none of them speaking one language. That produces drift — three card
paddings, idle tokens, motion that decorates instead of communicating — which is
exactly what the Visual System V2 audit surfaced. We needed a governance rule for
the *order* in which design work is allowed to happen, so that beauty accrues to
a system rather than to isolated pixels.

## Decision
**The design system is defined and reviewed before any screen is polished.**

Order is doctrine: **system first, product second, polish last.** The tokens,
components, principles, and information architecture are settled in documents
first (the Visual System V2 corpus), then wireframed low-fidelity in grey, then
critiqued and reduced, and only then taken to high fidelity in Figma. Wireframes
precede visuals; the system precedes the wireframes.

The governing acceptance criterion is blunt: **a beautiful interface without a
coherent system will not be accepted.** A gorgeous screen that borrows an
engagement mechanic, drifts from the token set, or speaks a different visual
dialect than its neighbours is a defect, however pretty. This is a process and
governance decision, not a stylistic one — its purpose is to guarantee that when
Tacet reaches high fidelity, every screen is inevitably part of one design
language that can hold for a decade. This decision is what produced the Visual
System V2 corpus as a deliverable.

## Consequences
- **Benefit — coherence by construction.** Screens inherit the system instead of
  each inventing their own, so the product becomes recognisable from typography,
  spacing, motion, and hierarchy rather than from logos.
- **Benefit — a shared bar for "done."** Every screen is measured against the
  same final-review questions (Would Apple ship this? Will it feel modern in five
  years? Is it unmistakably Tacet? Did I remove everything not earning its place?
  Does any part only work by an engagement mechanic?).
- **Cost — delayed gratification.** No polished hero screen exists until the
  system is settled and wireframes are reviewed, which can feel slow to
  stakeholders who want to *see* something early.
- **Cost — enforced restraint.** "Remove before adding" and "one accent, one
  action" mean designers must justify every element against calm; the system can
  reject work that is objectively attractive.
- **Future implication.** Any new visual work re-enters at the system layer:
  tokens and components are extended deliberately, not overridden per screen. The
  frozen IA/navigation constraint means this milestone refines, never redesigns.

## References
- [Visual System V2 — overview & index](../10-design/visual-system-v2.md)
  — the corpus this decision produced; the stage map and decisions log.
- [Visual System V2 (roadmap brief)](../08-roadmap/visual-system-v2.md)
  — "System first, product second, polish last"; refinement, not redesign.
- ADR-012, ADR-013 (the visual-system decisions this process governs and orders).
