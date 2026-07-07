# Remote Content

Most of what you see in Tacet from the wider open web is **remote content** — posts, photos, videos and writing that originated on another server. Our promise here is simple: show it faithfully, show where it's from, and never pretend it's something it isn't.

## Rendered faithfully

A post from Mastodon, a gallery from Pixelfed, a video from PeerTube, an essay from WriteFreely — each arrives in Tacet's calm surfaces and is shown as itself. We render it well, in Tacet's own [design system](../03-design-system/README.md), so the experience is coherent and unhurried. But we don't distort the content to flatter our own format. What Anna wrote is what you read.

## The source is always shown

Every remote post carries a quiet, honest marker of where it came from — the author's full handle (`@ben@pixelfed.social`) and, where it matters, the kind of home it lives on. This is the one place the "protocol" gently surfaces, because it's genuinely useful to the person:

- It tells you *who* and *where*, like a return address.
- It sets fair expectations for what the post can do.
- It lets you jump to the source if you want the full context.

This is honesty as a feature, not friction. It never becomes a networking lecture — see [ActivityPub as infrastructure](activitypub-as-infrastructure.md) for why the protocol otherwise stays invisible.

## No pretending it's native

We will not dress remote content up as though it were born on Tacet. If a photo set comes from Pixelfed, it looks like what it is, with its source intact. This matters because:

- It keeps trust. You always know what you're looking at.
- It respects the author's home and format.
- It avoids the quiet dishonesty of laundering other servers' content through our brand.

## Limits, stated plainly

Different homes support different things, and some content can't cross fully. We say so rather than hide it:

- **Some formatting or features may not translate.** A poll, a content warning, a custom emoji, or a niche post type may render partially or as plain text. When that happens, we show the honest fallback, not a broken shell.
- **Some interactions are one-way or unavailable.** If the source server doesn't accept a reply or reaction the way Tacet expects, we tell you rather than silently dropping it.
- **Closed platforms don't appear here at all.** Content locked inside Instagram, X, TikTok, LinkedIn or YouTube is not remote content — it's behind a wall we can't and won't fake through. See [federation principles](federation-principles.md).

The mechanics of fetching, mapping and rendering Activity objects live in the [engineering adapter](../06-engineering/activitypub-adapter.md). Here, the point is human: what you see is real, sourced, and honest.
