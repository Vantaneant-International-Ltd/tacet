# Design principles

The [five founding principles](../00-manifesto/founding-principles.md) govern the
product. These five interface principles are how they show up on screen. Each one
is a decision already made, not a preference to be re-litigated per feature.

---

## 1. Calm is clarity, not emptiness

Calm means the person is unhurried and in control — one clear subject, legible
hierarchy, nothing fighting for attention. It does **not** mean sparse. Apple,
Linear, Arc, and Notion are calm *and* intentionally rich; that is the bar. What we
refuse is not richness but *noise*: a screen crammed to serve the metric rather than
the person, competing calls to action, throughput-for-its-own-sake. Density is only
a failure when it stops being clear.

Calm is engineered, not hoped for: generous [whitespace](spacing.md) as a material
(not a goal), one clear job per screen, and content that *informs* — including the
real life of the open social web — presented so the person understands it without
strain. If a layout only works by packing in noise, the layout is wrong; if it feels
empty, it is not yet doing its job. This flows from *Calm before addiction* and
*People before posts*.

**In practice:** clarify before you add, and before you remove. Remove what confuses
or scores; keep what informs. Let a single person, conversation, or moment own the
frame — inside a home that still feels alive. *(See the revised doctrine:
[10-design/design-principles.md](../10-design/design-principles.md) L11 and
[stage-6-design-direction.md](../10-design/stage-6-design-direction.md).)*

## 2. People over content chrome

The atom of Tacet is a person and your relationship to them. The interface must
make that literal: people are easier to find than posts, faces are present, names
are legible, and your standing with someone is never buried beneath engagement
furniture.

"Content chrome" is everything the attention economy bolts around a post to make a
number about *you* go up — like buttons that beg, a scoreboard of *your* reach,
reaction rails, a ranking of people. We strip that. But we distinguish it from
*world-directed context* — representing what your world is reading, which
conversations are alive, which communities moved — which **informs** and is welcome
(the line is [informing vs. manipulating](../10-design/design-principles.md), L11;
[ADR-011](../06-decisions/ADR-011-metrics-are-context-not-rewards.md)). Content
carries the relationship; the design serves the relationship first. This flows from
*People before posts* and *Relationships before engagement*.

**In practice:** ask "whose relationship does this serve?" before "how much can we
show?" No **self-directed** vanity numbers (a scoreboard about you, a people-ranking);
world-directed context, honestly framed, is representation, not chrome. (See the
[anti-patterns](../00-manifesto/anti-patterns.md) on the comparison machine — still the
enemy in its self-directed form.)

## 3. Legible over clever

Clarity beats cleverness every time. A person should always know where they are,
what something is, and what will happen if they touch it — without decoding a
gesture, guessing at an icon, or discovering a hidden affordance.

Cleverness that costs comprehension is a bug. This is the one place we hold
ourselves to Apple-HIG-grade rigor: deference to content, honest affordances,
predictable behavior. We take the *standard of care*, not the look. Words carry
meaning; [icons](iconography.md) support words but never replace them.

**In practice:** name things plainly. Prefer a labeled control to a mystery glyph.
If a designer has to explain the interaction, redesign the interaction.

## 4. Warmth over austerity

Tacet is warm and familiar, not cold and austere. This supersedes the repo's early
words-only, dark-only `DESIGN.md`, which is now historical. Restraint is the
discipline; warmth is the feeling.

Warmth means: a [light mode](dark-mode.md) is expected, not an afterthought;
[icons](iconography.md) are permitted; [type](typography.md) is human and readable,
not brutalist; the product feels like a home, not a terminal. Calm and warm are not
opposites — the calmest rooms are also the most inviting.

**In practice:** design for the person who wants to feel close to their people, in
a space that feels good to be in. Cozy, not clinical. Rich, not loud.

## 5. Honesty over manipulation

No dark patterns. Ever. Every surface tells the truth: real state, real
consequences, real controls. Nothing is designed to work only because the user
didn't notice.

That means no confirm-shaming, no roach-motel deletion, no defaults that serve us
at the user's expense, no [notification](navigation.md) anxiety, no manufactured
urgency, no compulsion loops. [Empty states](empty-states.md) state facts calmly.
Leaving is easy, because *Identity before platforms* and *Open before closed*
demand it. This is the interface expression of basic respect.

**In practice:** if a design only performs because it's slightly deceptive, it does
not ship — no matter how well it "performs."

---

## The anti-clone stance, in depth

Tacet's originality is not a style preference; it is a structural requirement. The
products we refuse to imitate are optimized for goals we reject, and their
interfaces *encode those goals*. Copy the surface and you smuggle in the incentive.

- **X's** column and verbs encode broadcast-and-outrage. We are not a megaphone.
- **Instagram's** grid and story rail encode performance and FOMO. We are not a
  stage.
- **Mastodon's** UI encodes the protocol — timelines, instances, federation knobs.
  We keep the protocol and hide it; federation should feel like email, invisible.
- **LinkedIn's** density and dashboards encode self-as-résumé. We are not a career
  scoreboard.
- **Lifeinvader** is the cautionary cartoon of all of the above.

**Apple's HIG is the exception that proves the rule:** we cite it constantly, and
we never clone it. It is a manual on *how to care* — clarity, deference, restraint,
respect — not a template to trace. The right instinct is: study the rigor of the
best, then build a surface that is unmistakably, originally Tacet.
