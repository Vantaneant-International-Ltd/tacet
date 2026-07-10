# Anti-patterns

The principles say what Tacet is for. This page says what Tacet refuses to be. It
is the discipline that keeps the principles from becoming decoration.

If you are building something and it resembles anything on this list, stop. The
resemblance is the warning.

---

## Product anti-patterns

**The infinite feed as the product.** A bottomless, algorithmically ordered stream
whose job is to keep you scrolling. Tacet has a feed the way a home has a window —
present, useful, bounded. It is never the front door and never endless-by-design.
(Violates *People before posts*, *Calm before addiction*.)

**Engagement metrics that drive compulsion.** Like counts, follower counts, view
counts, streaks, karma — any public number whose real function is to make you
perform for it or come back to protect it. Numbers that turn friends into an
audience and connection into a score. (Violates *Relationships before engagement*.)

**Notification anxiety.** Red badges, manufactured urgency, "someone you may know
just…", variable-reward pings tuned to pull you back. Tacet's correspondence lives
in **Conversations** — you learn that someone spoke to you without being
manipulated into opening the app. (Violates *Calm before addiction*.)

**Dark patterns.** Confirm-shaming, buried settings, roach-motel account deletion,
defaults that serve us at your expense. If a design only works because the user
didn't notice, it doesn't ship. (Violates all five, and basic respect.)

**Lock-in as retention.** Any mechanic whose value is that leaving is painful —
non-portable identity, hostage followers, export that's technically-present but
practically-useless. Retention should come from being worth returning to.
(Violates *Identity before platforms*, *Open before closed*.)

**The comparison machine.** Surfaces that rank people against each other, expose
who's "winning," or reward posting frequency. Tacet is not a leaderboard for your
life. (Violates *Relationships before engagement*.)

## Design anti-patterns

**Cloning the incumbents.** Tacet does not copy the X interface, the Instagram
layout, the Mastodon UI, LinkedIn's density, or Lifeinvader's literalism. We use
Apple's Human Interface Guidelines as a *quality* reference — the standard of care,
not a shape to trace. Tacet should feel original, calm, rich, and alive. (See
[docs/02-human-interface-guidelines/](../02-human-interface-guidelines/).)

**Density as sophistication.** Cramming more onto the screen because a competitor
does. Calm needs room. When in doubt, remove.

**Novelty over calm.** Animation, motion, and interaction that exist to impress
rather than to serve. Delight is welcome; theater is not.

## Positioning anti-patterns

**Dishonest integration claims.** Never imply Tacet logs into every closed network
for you. Do not say "Tacet connects to Instagram, TikTok, X, LinkedIn." Say the
true thing: *Tacet is the best home for the open social web; closed platforms stay
walled until they open a door.* Use closed-network names only to describe the
fragmentation problem, never as a promised feature. (See
[docs/05-federation/](../05-federation/) and
[docs/07-brand/launch-positioning.md](../07-brand/launch-positioning.md).)

**Pitching by negation.** "No ads. No algorithm. No tracking." is true, but it is
not the pitch — it's the fine print. The pitch is the positive thing: your people,
your identity, your calm home on the open web. Lead with what Tacet *is*. (This note
is about how we *talk*, not a softening of the promise: the commitment itself — that
we never sell ads, never sell data, and never build engagement mechanics — is stated
plainly in the [business model](../01-product/business-model.md).)

**Protocol as product.** Never make the user learn ActivityPub, "instances," or
"federation" to use Tacet. The protocol should disappear, like SMTP disappears
behind email. If a screen makes federation the user's problem, it has failed.

---

## The test

Before shipping anything, ask: *does this make people feel closer, calmer, and more
in control of their own identity — or does it make a number go up?*

If it's the number, it's an anti-pattern, however well it performs.
