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

## The five permanent pillars

Tacet is, and will remain, five places:

1. **Today** — the calm entry point.
2. **People** — your relationships.
3. **Discover** — the gateway to the open social web.
4. **Conversations** — correspondence, not notifications.
5. **Me** — your identity and your own place.

**This is the frozen product model.** It is the stable mental model the whole
product hangs on — the reason Tacet can feel coherent the way Apple, Linear, and
Notion feel coherent. It does not grow a sixth pillar on a whim, and it does not
rename these five to chase a trend.

**The pillar rule — the test every future feature must pass:**

> Every future feature must strengthen one of these five pillars. If it does not, it
> probably does not belong in Tacet.

A feature is not justified by being good in the abstract, or by what a competitor
ships. It is justified by making Today calmer, People closer, Discover more open,
Conversations more present, or Me more truly yours. Anything that maps to none of
the five is either the wrong feature or a sign the model is being stretched — and
the model does not stretch. When in doubt, the answer is fewer, better, inside the
five.

Everything the codebase still carries from earlier eras (rooms, feeds, lenses,
keeps, grids, archives) either **maps into one of these five** or is **legacy to be
retired** — see [PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md) and
[docs/01-product/information-architecture.md](docs/01-product/information-architecture.md).

## Tacet is a complete product; the protocol is a replaceable adapter

Tacet is **not** a Fediverse client, a Mastodon frontend, or a thin wrapper around
ActivityPub. Tacet is a complete social product in its own right — the way iMessage
and Mail are complete products, not "SMTP clients." The user experiences one
beautiful thing; the protocols underneath disappear.

The architecture reflects this ordering:

```
User → Tacet Product → Tacet Domain Model → ActivityPub Adapter → the open social web
```

**The adapter is replaceable. The product is not.** ActivityPub is how Tacet reaches
the open social web today; it is an implementation detail at the edge, never the
core. Federation *extends* the product; it does not *define* it. We build the best
social product first, and let it reach outward.

**The adapter test — apply it to every architectural and product decision:**

> If ActivityPub disappeared tomorrow and another open protocol replaced it, would
> Tacet still make sense as a complete product?

The answer must always be **yes**. If a feature only makes sense as "a Mastodon
thing," it is in the wrong layer.

**In the interface, the protocol is invisible.** Never expose protocol terminology
unless someone deliberately goes looking for it. It is never "a Mastodon post" — it
is *a post*. Never "a remote account" — *a person*. Never "the federated timeline" —
*Today*. One coherent experience, always.

**Open and cohesive are not a contradiction.** Email is decentralized, yet Gmail is a
product; both are true at once. Tacet is the same: open protocols underneath, one
beautiful product on top.

> Open protocols. Closed silos. Beautiful products.
> Users deserve all three. Tacet exists to prove they can coexist.

Tacet stays open-source, decentralization-compatible, federation-ready,
ActivityPub-compatible, with portable identities and exportable data, and
self-hostable if you choose. None of that is in tension with being one cohesive
product — it is what makes the product trustworthy. The moat was never the code
(which is open); it is the taste, the UX, and the community.

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
