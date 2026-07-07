# Information Architecture

This is the canonical IA document. When any other doc, design, or line of code disagrees with the model defined here, this document is right and the other thing changes.

## The primary model

```
Tacet
  Today          — the calm entry point.
  People          — the relationship layer.
  Discover        — the gateway to the wider open social web.
  Conversations   — correspondence, not notifications.
  Me              — your identity and your own place.
```

Five surfaces. That is the whole spine. Everything else supports these.

## The rule about "Home Feed"

**Do not use "Home Feed" as the core concept.** This is not a stylistic preference; it is architectural.

A feed exists in Tacet. It is not banned. But it is a component that lives *inside* surfaces — the way a home has a window. Useful, present, never the reason you're there. The moment the feed becomes the organizing idea, the product becomes another engagement machine, and we have violated [People before posts](../00-manifesto/why-tacet-exists.md) and [Calm before addiction](../00-manifesto/why-tacet-exists.md).

So: **Today** is the entry point, not a home feed. **People** is the reason to stay. The infinite scroll is retired legacy. We do not design around it.

---

## Today — the calm entry point

**What it is.** The first thing you see. A bounded digest of what's worth your attention right now: the handful of things from your people and your world that actually matter today.

**Why it exists.** People need a place to land that answers "what should I look at?" without dragging them into an endless well. Today gives a clear, finite answer and then lets you leave.

**What it is NOT.** Not an infinite home feed. Not algorithmically optimized for time-on-app. Not a slot machine. Ordering is legible — chronological or clearly explained, never a black box. See [Today](today.md).

## People — the relationship layer

**What it is.** Your relationships as first-class objects. The people (and brands, and AI accounts) you follow, wherever on the open web they live. Your close ties, surfaced and kept close.

**Why it exists.** The people are the reason anyone is here at all. [Relationships before engagement](../00-manifesto/why-tacet-exists.md) means the relationship graph is a primary surface, not a byproduct of who you happen to interact with.

**What it is NOT.** Not a follower-count leaderboard. Not a vanity scoreboard. Not "audience" as a number to grow. See [People](people.md).

## Discover — the gateway to the open social web

**What it is.** Your window into the wider Fediverse — everyone on the open web who isn't already your person yet. A directory, human recommendation, and honest federated reach.

**Why it exists.** [Open before closed](../00-manifesto/why-tacet-exists.md). The whole point of the open web is that your world isn't confined to one server or one app. Discover makes that reachable without asking anyone to understand ActivityPub.

**What it is NOT.** Not an algorithmic trending machine chasing outrage. Not a promise to reach closed platforms. Honest about what's open and what isn't. See [Discover](discover.md).

## Conversations — correspondence, not notifications

**What it is.** Your correspondence and presence: direct messages, replies, mentions. The threads where you and your people actually talk.

**Why it exists.** To replace the anxiety-based notification model. Things that are genuinely *for you* arrive here as correspondence, calmly, without red-dot manipulation engineered to yank you back.

**What it is NOT.** Not a notification center designed to create urgency. Not a badge count meant to pull you in. See [Conversations](conversations.md).

## Me — your identity and your place

**What it is.** Your one owned, portable identity — `@you@tacet.social` — your profile, and your own corner of the open web.

**Why it exists.** [Identity before platforms](../00-manifesto/why-tacet-exists.md). You should own who you are online, and be able to leave and take your people with you. "Me" is where that ownership lives.

**What it is NOT.** Not a platform-locked account you rent. Not a profile that dies if the company does. See [Identity](identity.md).

---

## Supporting surfaces

First-class in capability, but deliberately not on the spine. They serve the five.

- **Compose** — creating a post (text, photo, video, long-form) that publishes to the open web. Reachable from anywhere; calm and non-persistent. See [Compose](compose.md).
- **Communities** — group spaces around people and purpose; the demoted successor to the old "rooms" idea. Supports People and Today; never replaces them. See [Communities](communities.md).
- **Settings** — account, privacy, portability/export, federation identity, appearance, and calm controls. See [Settings](settings.md).

## How navigation flows

You land on **Today**. From anything in Today you move sideways into **People** (whose is this?), into a thread in **Conversations** (reply), or outward into **Discover** (who else is out there?). **Compose** is always one gesture away but never in your face. **Me** and **Settings** sit at the edge — reached deliberately, not stumbled into.

The shape is a calm hub, not a scrolling column. You arrive, you attend to what matters, you connect with your people, and you leave lighter than you came.
