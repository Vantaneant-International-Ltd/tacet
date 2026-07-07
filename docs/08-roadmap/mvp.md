# MVP

The smallest version of Tacet that is honestly **your home on the open social
web** — not a demo of one. It must prove the whole promise in miniature: one
identity you own, your people, a calm Today, and the *first real window* into the
Fediverse.

## What the MVP is

Four things, done well:

1. **One owned identity — `@you@tacet.social`.** An account that reads as an address, not a username in a silo. This is the foundation for everything federated that follows. See [identity](../01-product/identity.md).
2. **Your people.** Follow the people who matter and see them in one place — including people on other servers. See [people](../01-product/people.md).
3. **Today.** A calm view of what's new from your people, in the order things happened — not a ranked, engagement-optimized feed. "Home Feed" is not the concept; [Today](../01-product/today.md) is.
4. **The first honest window into the Fediverse.** From your Tacet home you can **read, follow, and reply** across the open web — Mastodon, Pixelfed, and the rest. This is the load-bearing new capability. See [federation](../05-federation/README.md).

## The honest scope line

Read, follow, and reply — across the open web. That's the federation surface of
the MVP. Rich cross-network composing, discovery, and communities come later
(see [v1](v1.md)). We would rather ship a small federation that truly works than
a broad one that half-works.

We claim only what is built. No closed-platform integration — not now, not in any
version. See [launch positioning](../07-brand/launch-positioning.md).

## What exists today vs what must be built

**Exists today** (from the pre-re-founding app on Cloudflare Workers + D1 + R2):

- Accounts and profiles
- Following
- Posts and replies
- Reactions
- Communities (built under the old "rooms/clubhouse" thesis)
- Invite gating

**Must be reshaped** (exists, but wrong shape for this direction):

- Profiles → an owned `@you@tacet.social` identity, presented as an address.
- The feed → [Today](../01-product/today.md): calm, chronological, people-first — not a clubhouse room list.
- The whole IA → the new top nav (Today, People, Discover, Conversations, Me). See [information architecture](../01-product/information-architecture.md).
- Copy and framing → the new [brand voice](../07-brand/voice-and-tone.md), away from "invite-only clubhouse."

**Must be built (net new)** — the hard part:

- **Federation itself.** None exists today. The MVP needs ActivityPub enough to resolve remote addresses, fetch remote posts, follow remote accounts, and deliver replies outward. See [remote accounts](../05-federation/remote-accounts.md) and [remote content](../05-federation/remote-content.md).
- Remote identity resolution — turning `@name@server` into someone you can follow.

## Done means

A newcomer signs up, gets an address they own, follows a friend on Mastodon,
sees that friend in Today, replies, and the reply lands — all inside one calm
home. That is the MVP: the [seven-apps problem](../07-brand/launch-positioning.md)
answered, small but true.
