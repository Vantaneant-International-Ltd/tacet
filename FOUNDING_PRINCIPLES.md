# Founding Principles

These are the non-negotiables of Tacet. Everything in `docs/` elaborates them;
nothing in `docs/` overrides them. If a design, a feature, or a line of code
contradicts a principle here, the principle wins and the work changes.

Full narrative versions live in [docs/00-manifesto/](docs/00-manifesto/). This
page is the short, load-bearing list.

---

## What Tacet is

**Tacet is your home on the open social web.**

Not another social network. A home — one identity you own, one place your people
live, one calm window into the wider open web. You bring the internet you already
have into one place instead of maintaining seven copies of yourself.

## The five commitments

1. **People before posts.**
   The product is people and your relationships to them. Content serves the
   relationship; the relationship is not there to serve the content. We never make
   the stream the point.

2. **Relationships before engagement.**
   Success is people feeling closer, not time-on-app. No metric exists to keep you
   here longer. If a feature would grow engagement by weakening a relationship, we
   don't ship it.

3. **Identity before platforms.**
   You have one identity, and you own it. It is portable by design. Platforms are
   plumbing that can be replaced; your name, your people, and your history cannot
   be held hostage.

4. **Calm before addiction.**
   Nothing is engineered to be compulsive. No infinite feed tuned to your
   weaknesses, no artificial urgency, no notification anxiety, no dark patterns.
   The app never begs to be opened. Calm is a feature, and it is load-bearing.

5. **Open before closed.**
   We build on open protocols (ActivityPub / the Fediverse) so you are never
   locked in. You can leave and take your identity and relationships with you.
   Openness is the architecture, not a marketing bullet.

## The governing rule

**The code follows the philosophy. The philosophy is not invented by the code.**

Product decisions are made against these principles first and the current codebase
second. When the code embodies an assumption that conflicts with a principle, the
code is the thing that's wrong.

## What we will not do

- No engagement metrics that exist to drive compulsion (see `docs/00-manifesto/anti-patterns.md`).
- No algorithmic feed engineered for time-on-app. Order should be legible and
  chosen, not optimized against the user.
- No lock-in. Nothing that makes leaving Tacet cost you your identity or your
  people.
- No dark patterns, manufactured urgency, or notification anxiety.
- No dishonest claims about what Tacet connects to. We say what is true about the
  open social web and we don't imply integrations we can't deliver.

## What we promise honestly

- Tacet is the best **home for the open social web** — Mastodon, Pixelfed,
  PeerTube, WriteFreely, Friendica, and other ActivityPub-compatible places.
- Tacet is **not** a bridge that logs into every closed network for you. Walled
  gardens stay walled until they open a real door. We say so plainly.
- Federation should feel like **email**: one address, many homes, everyone still
  reachable, the protocol invisible.

---

*If you are about to build something and you're unsure whether it belongs in
Tacet, come back to this page. The answer is almost always here.*
