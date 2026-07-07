# Remote Accounts

A remote account is simply a person whose **home** is a different server. Your handle is `@you@tacet.social`. Anna's is `@anna@mastodon.social`. Ben posts photos from `@ben@pixelfed.social`. Different homes, one open web — and, to you, one address book.

## It should feel like one address book

Open **[People](../01-product/people.md)** and you see the people you follow. Some live on Tacet. Many don't. You should not be able to tell, or need to, from the shape of the relationship. You followed a person; the person is here.

This mirrors email exactly. Your contacts list doesn't sort itself into "Gmail people" and "Fastmail people." A contact is a contact. On Tacet, a follow is a follow — the server behind the handle is a footnote, not a category.

## Following someone whose home is elsewhere

You find Anna (through search, a link, a mention, or [Discover](../01-product/discover.md)), and you follow her. From that moment:

- Her posts arrive in your surfaces alongside everyone else's.
- You can reply, and your reply reaches her on her server.
- She can follow you back, and your posts reach her the same way.

No "connecting an account," no bridge to configure, no second login. One identity — yours — reaching across homes. The plumbing that carries this lives in the [engineering adapter](../06-engineering/activitypub-adapter.md); you never touch it.

## Identity across homes

The handle is the whole trick. `@anna@mastodon.social` is globally unique and globally reachable — like an email address, it tells you both *who* and *where*, and any server that speaks the protocol can deliver to it. That's what lets identity travel:

- **You own your side.** `@you@tacet.social` is your identity on the open web, not just inside one app.
- **Anna owns hers.** If she moves servers, her identity can move with her (see [portability](portability.md)), and ideally your follow follows along.
- **The relationship is between people, not platforms.** You didn't follow "a Mastodon account." You followed Anna.

## Honest limits

We keep this section truthful, so:

- **Some things vary by home.** A remote server may support features Tacet doesn't, or lack ones we have. When an interaction can't cross cleanly, we say so plainly rather than failing silently.
- **Closed platforms are not remote accounts.** You cannot follow an Instagram or X account through Tacet, because those platforms don't open the door. They are walled gardens, and we say so — see [federation principles](federation-principles.md). Remote accounts mean the *open* social web: Mastodon, Pixelfed, PeerTube, WriteFreely, Friendica, and their kin.

One address book. Real people. Many homes. The protocol stays out of the way.
