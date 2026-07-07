# ActivityPub as Infrastructure

This is the essay at the heart of the federation section. One sentence carries it:

> **ActivityPub is infrastructure, not the product.**

ActivityPub is a protocol — a shared language that lets independent servers pass messages about people, posts, follows and replies. It is plumbing. Essential, invisible plumbing. And like all good plumbing, its success is measured by how completely you forget it exists.

## The email analogy, in full

Think about how email actually works.

You have an address: `you@fastmail.com`. Your friend has a different one: `anna@gmail.com`. You are on different companies, different servers, different software written by different people. You have never heard of SMTP, IMAP, MX records, or DKIM. You do not know or care which data centre Anna's inbox lives in.

You just write to `anna@gmail.com`, and it arrives. She replies, and it comes back. Neither of you ever "joined the email network" or "picked an email instance." You each picked a *home you liked* — a provider you trust — and the protocol carried the rest, silently, in the background.

That is exactly the shape of Tacet's federation:

| Email | Tacet |
| --- | --- |
| `you@fastmail.com` | `@you@tacet.social` |
| `anna@gmail.com` | `@anna@pixelfed.social` |
| SMTP / IMAP (invisible) | ActivityPub (invisible) |
| "Pick an email provider" | "Pick your home" |
| Mail crosses providers seamlessly | Follows, posts and replies cross servers seamlessly |

Nobody markets email as "the SMTP experience." Nobody asks a newcomer to "understand federation" before sending a message. Email won precisely because the protocol disappeared and left only the human act: writing to a person. Tacet takes the same bet on social.

## Why the user never sees the protocol

Words like *instance*, *fediverse*, *toot*, *boost*, *ActivityPub* are engineering words. They describe how the machine works, not what the person is doing. Making users learn them is like making an email newcomer learn "MX record" — a failure of design dressed up as transparency.

So in Tacet, the protocol surfaces only where it *helps the person*, and never where it merely explains the plumbing. A post from another server shows its source — because knowing where something came from is genuinely useful (see [remote content](remote-content.md)). But the person is never asked to reason about *how* it got here.

## What "infrastructure not product" means for design

This isn't a slogan; it's a test we apply to every decision:

- **The product is people, not the network.** We design address books, conversations and calm — not a map of servers. If a screen would show the topology of the fediverse, it's probably the wrong screen.
- **No protocol vocabulary in the interface.** If a label needs a glossary, rewrite the label.
- **Failures are translated, not exposed.** When a remote server is slow or a bridge is missing, we say what it means for the person ("this post is from a server that's not responding right now"), not what broke in the protocol.
- **Honesty lives at the edges, calm lives at the centre.** We're candid about which platforms are reachable (see [federation principles](federation-principles.md)), but that honesty appears as plain language, not as a networking lecture.
- **The wiring stays in engineering.** Inbox/outbox, Activity objects, signatures, delivery — all real, all necessary, all hidden from the person. It lives in the [engineering adapter](../06-engineering/activitypub-adapter.md).

Done right, ActivityPub becomes as unremarkable as the electrical grid. You don't admire the grid. You turn on the light. Tacet is the light.
