# Tacet — Product

Your home on the open social web.

Tacet is not another social network. It is the calm, single place a person plugs the open web into: one identity you own, one place your people live, one window into the wider Fediverse. This section defines what we are building and why.

## The canonical product model

The whole product hangs off five surfaces:

```
Tacet
  Today          — a calm entry point; what's worth your attention now.
  People          — your relationships; the reason you're here.
  Discover        — the gateway to the wider open social web.
  Conversations   — correspondence, not anxiety-based notifications.
  Me              — your identity and your own place; portable, owned.
```

Supporting surfaces — first-class, but not the spine: **Compose**, **Communities**, **Settings**.

## "Home Feed" is not the core concept

Almost every social product organizes itself around an infinite home feed. We do not.

A feed exists inside Tacet the way a home has a window: present, useful, but not the point. You do not live at a window. You live in the rooms. **Today** is the entry point; the reason you stay is **People**. If we ever catch ourselves designing the feed as the product, we have drifted, and we correct.

## The five principles

These are the constitution. They are never violated.

1. People before posts.
2. Relationships before engagement.
3. Identity before platforms.
4. Calm before addiction.
5. Open before closed.

The governing rule: **the code follows the philosophy; the philosophy is not invented by the code.** When an implementation detail and a principle disagree, the principle wins and the implementation changes.

## Federation, in one line

ActivityPub is infrastructure, not the product. It should feel like email: one address, many homes, the protocol invisible. A Tacet handle looks like `@you@tacet.social`. See [Discover](discover.md) and [Identity](identity.md) for what that buys you.

We are honest about reach. Tacet is the best home for the **open** social web — Mastodon, Pixelfed, PeerTube, WriteFreely, Friendica, and other ActivityPub platforms. It does not promise to connect to closed platforms. Those stay walled until they open a real door.

## The documents

- [Product Vision](product-vision.md) — what Tacet is, the problem, the one-home thesis, what winning looks like.
- [Information Architecture](information-architecture.md) — the canonical IA; every surface defined precisely.
- [Today](today.md) — the calm entry point.
- [People](people.md) — the relationship layer.
- [Discover](discover.md) — the gateway to the open social web.
- [Conversations](conversations.md) — correspondence over notifications.
- [Communities](communities.md) — group spaces around people and purpose.
- [Identity](identity.md) — the owned, portable "Me."
- [Compose](compose.md) — creating things that publish to the open web.
- [Settings](settings.md) — account, privacy, portability, calm.
- [Business model](business-model.md) — how Tacet is free, how the hosted service is paid for, and what we will never sell.
- [Running costs](running-costs.md) — what the hosted service actually costs to run, published in the open.

For the deeper "why," start with the [manifesto](../00-manifesto/why-tacet-exists.md).
