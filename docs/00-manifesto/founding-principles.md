# Founding principles

Five commitments. They are the constitution of the product. The one-page version
lives at [`/FOUNDING_PRINCIPLES.md`](../../FOUNDING_PRINCIPLES.md); this is the full
reasoning behind each.

Read them as decisions already made, not aspirations. Their job is to make hard
choices easy: when a feature would serve one principle by violating another, the
higher principle wins, and usually the answer was obvious once named.

---

## 1. People before posts

The atom of Tacet is a person and your relationship to them — not a post, not a
feed, not a piece of content.

This inverts how modern social products are built. They start with the stream of
content and treat people as sources that feed it. The consequence is a product
that is *about* content and merely *populated* by people. You come back for the
scroll; the people are incidental.

Tacet starts with the person. The first-class objects are your people and your
standing with them. Content exists to carry the relationship — a photo is a way of
being close, not a unit of supply. When we design a surface, the first question is
"whose relationship does this serve?" not "how much content can we show?"

**What this rules out:** any surface whose primary job is to maximize content
throughput. Any design that makes people harder to find than posts.

## 2. Relationships before engagement

We measure whether people feel closer. We do not measure, optimize for, or reward
time-on-app.

"Engagement" is the industry's word for compulsion dressed as value. It is easy to
grow and it corrodes the thing it claims to serve: a product optimized for
engagement will always, eventually, choose the design that keeps you scrolling over
the design that makes you feel good about your friendships, because those two
diverge and only one of them shows up in the dashboard.

Tacet refuses the trade at the root by refusing the metric. No number on this
product exists to keep you here longer. If a feature would increase usage by
weakening a relationship — outrage bait, manufactured FOMO, a scoreboard that turns
friends into rivals — it does not ship, no matter how well it "performs."

**What this rules out:** growth features that work by degrading the relationship.
Vanity metrics that reframe connection as competition.

## 3. Identity before platforms

You have one identity. You own it. It is portable by design.

On the closed web, your identity is issued to you by a platform and revocable by
it. Your followers, your name, your history — all held on the platform's servers,
under the platform's terms, forfeit the moment you leave. That is not identity;
that is a tenancy that can be terminated.

Tacet treats identity as yours. Built on open standards, your Tacet identity can
speak to people on other services and, crucially, can *leave* — you can move your
account and take your connections with you. Platforms are plumbing. Plumbing gets
replaced. Your name and your people do not belong to the pipes.

**What this rules out:** any design that makes leaving cost you your identity or
your relationships. Any lock-in dressed as a feature.

## 4. Calm before addiction

Nothing in Tacet is engineered to be compulsive. Calm is not the absence of
features; it is a designed, defended property of the product.

The dominant social products are, by construction, slot machines. Infinite feeds,
variable-reward notifications, autoplay, manufactured urgency, red badges tuned to
pull you back — these are not accidents; they are the mechanism. They work because
human attention is exploitable, and exploiting it is profitable.

Tacet declines to build the slot machine. The app never begs to be opened. There
is no infinite feed tuned against your weaknesses, no artificial scarcity, no
notification anxiety, no dark pattern nudging you toward "one more." When you're
done, the product is happy to let you go — and glad to see you when you return.

Calm is load-bearing. It is the difference between a home and a casino.

**What this rules out:** infinite scroll for its own sake, compulsion-loop
notifications, autoplay, dark patterns, any mechanic whose value depends on
overriding the user's intent.

## 5. Open before closed

We build on open protocols so you are never locked in. Openness is the
architecture, not a marketing bullet.

Every closed network eventually turns against its users, because a wall that keeps
users in is worth more than a wall that lets them choose to stay. The only durable
protection is to build somewhere the walls can't be raised: on open protocols
(ActivityPub / the Fediverse) where interoperation is the default and leaving is
always possible.

This is why Tacet can honestly promise the other four principles. A closed product
can *say* it puts people first, but its incentives will win in the end. An open one
is structurally accountable — if Tacet stops serving you, you can leave and take
your world with you, and that possibility keeps us honest.

**What this rules out:** proprietary lock-in, embrace-extend-extinguish of open
standards, any short-term feature that trades away portability.

---

## The governing rule

**The code follows the philosophy. The philosophy is not invented by the code.**

Decisions are judged against these five principles first and the existing codebase
second. When the code embodies an assumption that conflicts with a principle, the
code is what's wrong, and it changes. This document does not bend to fit what has
already been built.
