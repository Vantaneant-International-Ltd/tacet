# ADR-008: Human language over protocol language

## Status
Accepted (2026-07).

## Context
ADR-007 keeps the protocol at the edge of the architecture. But an architecture
can be clean and the *interface* can still betray it — the moment a screen says
"instance," "boost," "toot," or "your ActivityPub inbox," the plumbing has
leaked into the room and the person is being asked to reason about wiring instead
of about people. This is the failure Mastodon's UI encodes: the protocol made
visible as vocabulary. Email won by doing the opposite — nobody markets "the SMTP
experience." Tacet takes the same bet on social, so we needed a firm, testable
rule for the words the product is allowed to say.

## Decision
**The UI speaks only human words, and never surfaces protocol or implementation
terms.**

The interface says the human *things* a person makes — **Thought, Photo, Article,
Video, Event** — and the human *acts* they take — **Follow, Reply, Share, Save**.
Where something lives, it is shown as a human **place**, never as a server or a
piece of software.

It never says: *server, instance, federation, fediverse, ActivityPub, toot,
boost*. It never says the internal engineering word **Entry** — that word exists
so the domain can unify the five kinds, and for exactly that reason the interface
never utters it. It avoids the word **post**, with one narrow, blessed exception:
"Posts" as a profile tab label, where no better human word exists.

When a remote person's home must be shown, it is shown as a human place, not as a
server name or a software brand. The protocol surfaces *only* where it genuinely
helps the person (knowing where a shared thing came from), never where it merely
explains the plumbing. The reason is respect: making a newcomer learn "instance"
is a failure of design dressed up as transparency, and Tacet's job is to leave
the machine in engineering and put only the human act on screen.

## Consequences
- **Benefit — the front door stays warm.** A normal person can live in Tacet
  without ever learning the vocabulary of federation, which is the entire premise
  of "one home on the open social web."
- **Benefit — a copy-review test anyone can run.** If a label needs a glossary,
  rewrite the label. Reviewers can check any screen against a short banned-words
  list without judgment calls.
- **Cost — translation work at the seam.** Failures and remote sources must be
  described in plain human terms ("this is from a home that isn't responding
  right now"), which is more effort than surfacing the raw protocol error.
- **Cost — occasional lossy honesty.** Naming a remote place in human terms
  rather than by its exact server can hide detail a power user might want; we
  accept that trade in favour of calm, and keep honesty as plain language, never
  as a networking lecture.
- **Future implication.** New content kinds must arrive with a human name before
  they can appear; no protocol object is ever allowed to name itself in the UI.
  This binds every future publishing and federation feature.

## References
- [Design principles (Human Interface Guidelines)](../02-human-interface-guidelines/design-principles.md)
  — Legible over clever; the anti-clone stance on Mastodon's protocol UI.
- [Publishing philosophy](../01-product/publishing-philosophy.md) — "Entry" is an
  internal domain word, never a user-facing one.
- [Design principles — Visual System V2, Law L9](../10-design/design-principles.md)
  — "Human words only," the enforceable visual commitment.
- ADR-003 (identity before platforms), ADR-007 (protocols are replaceable
  infrastructure — this ADR is its UI-facing consequence).
