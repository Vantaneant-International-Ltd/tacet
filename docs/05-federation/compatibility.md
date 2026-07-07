# Compatibility matrix — the open social web

Tacet reads the open social web through **one generic ActivityPub parser** and a
**normalization layer** (see [`src/openweb/`](../../src/openweb/README.md)). It does not
build per-platform integrations; every implementation below is read through the same
code. This page is the reference for what is supported and what the protocol makes hard.

**Read-only.** Everything here is reading public content: profiles, posts, and media.
No accounts, follows, likes, boosts, replies, publishing, or notifications.

## Legend

- **✅ Full** — read and normalized well through the generic parser.
- **◑ Partial** — reads, with caveats noted.
- **○ N/A** — the platform doesn't model this concept.
- **Tested:** *Live* = verified against a live server this milestone · *Expected* =
  supported by the generic parser but not yet live-verified · *Best-effort* = works where
  the server exposes the needed public endpoints.

## Matrix

| Software | Profiles | Posts | Media | Titles | Attachments | Tested | Notes |
|---|---|---|---|---|---|---|---|
| **Mastodon** | ✅ | ✅ (Note) | ✅ img/video | ○ | ✅ | **Live** | Public timeline needs auth on some homes → we use trending + generic actor reads. Secure mode → authorized fetch. |
| **Pixelfed** | ✅ | ✅ (Note) | ✅ images | ○ | ✅ | **Live** | Photo-first; image attachments normalize cleanly. |
| **Misskey** | ✅ | ✅ (Note) | ✅ | ○ | ✅ | **Live** | Also covers Firefish/Sharkey/Iceshrimp forks (same objects). |
| **PeerTube** | ✅ | ✅ (Video) | ✅ video | ✅ title | ✅ (url links) | **Live** | Profiles verified live (tilvids.com); playable media taken from the Video's `url` links, description as body. |
| **Lemmy** | ✅ (Group/Person) | ✅ (Page) | ◑ thumbnail | ✅ title | ◑ | Expected | Posts are `Page` with title + link/thumbnail; comment trees not surfaced (read-only). |
| **Friendica** | ✅ | ✅ (Note/Article) | ✅ | ◑ | ✅ | Expected | ActivityStreams-compliant; parses generically. |
| **GoToSocial** | ✅ | ✅ (Note) | ✅ | ○ | ✅ | Expected | Mastodon-compatible objects; **often requires authorized fetch**. |
| **Akkoma / Pleroma** | ✅ | ✅ (Note) | ✅ | ○ | ✅ | Expected | Generic Note parsing. |
| **BookWyrm** | ✅ | ✅ (Review/Comment/Quotation) | ◑ | ✅ (Review) | ◑ | Expected | Book reviews normalize as titled posts; rating metadata not surfaced. |
| **WriteFreely** | ✅ | ✅ (Article) | ○ | ✅ title | ○ | Expected | Long-form; title + body. |
| **Mobilizon** | ✅ | ✅ (Event) | ◑ | ✅ title | ◑ | Expected | Events render as titled posts; structured date/place not yet surfaced. |
| **WordPress (ActivityPub plugin)** | ✅ | ✅ (Article/Note) | ✅ | ✅ (Article) | ✅ | Expected | Featured image read from `image`. |
| **Ghost (ActivityPub)** | ✅ | ✅ (Article) | ✅ | ✅ title | ✅ | Expected | Newsletter/article objects. |
| **Owncast** | ◑ actor | ◑ (Note) | ○ | ○ | ○ | Best-effort | Live-stream service; its actor posts "went live" Notes. Stream itself isn't AP content. |

## Conversations (read-only)

Opening a post reads its **conversation** through the same generic core: `inReplyTo`
builds the ancestor chain, `replies` collections build the nested reply tree, and each
reply's author is resolved to a person. This works across implementations that expose
standard `inReplyTo`/`replies` (Mastodon, Pixelfed, Misskey, Friendica, GoToSocial,
Akkoma, Lemmy, …). Live-verified reading a Mastodon thread (6 replies, 6 participants).
Limits: reply trees are bounded (depth/size) and reveal progressively; boost/quote and
reference-only replies (bare-URL objects that don't resolve) are skipped read-only; homes
in secure mode need authorized fetch to expose replies.

## What the generic parser handles

- **Actors:** `Person`, `Service`, `Application`, `Group`, `Organization` → one `Person`.
- **Objects:** `Note`, `Article`, `Page`, `Video`, `Audio`, `Image`, `Event`, `Question`,
  `Review`, `Comment`, `Quotation` → `Moment` (a post), with a `title` where the object
  carries one.
- **Activities:** `Create`/`Update` (owner authored) and `Announce` (a share, marked
  `sharedBy`) are unwrapped; other activities are ignored.
- **Media:** `attachment` documents, PeerTube-style playable `url` links, and featured
  `image` (Lemmy/WordPress) → `Media` (image/video/other) with alt text.
- **JSON-LD variance:** values as scalar / object / array, `Link` objects, language maps.

## Unavoidable ActivityPub limitations

- **No discovery in the protocol.** ActivityPub is object-addressed; there is no standard
  "search" or "trending." Tacet discovers via a tunable cross-implementation **seed** read
  through the generic core, plus an optional Mastodon REST shim for liveliness. Discovery
  breadth is a product/curation problem, not a protocol feature.
- **Authorized fetch.** Homes in "secure mode" (common on Mastodon/GoToSocial) require an
  **HTTP-signed GET** even for public objects. Tacet supports this via an optional server
  signing key (read-only; see the adapter README). Without it, those homes are skipped and
  the result degrades gracefully.
- **Reference-only objects.** An `Announce` (or `Create`) whose object is a bare URL rather
  than embedded would need a second fetch; read-only, we skip these rather than fan out.
- **Comment/reply trees** exist in AP (`replies` collections) but are intentionally not
  surfaced this milestone (read-only; no Conversations UI yet).
- **Rich structure** (poll options, event date/place, book ratings) is normalized to text
  today; the domain has room to carry it later without UI or protocol changes.

## How this list grows

Adding another ActivityPub implementation usually means **nothing** — if it serves standard
actors and objects, it already reads. When an implementation uses an unusual object type or
field, the change is localized: a set entry in `normalize/moment.ts` or a few defensive
lines in `activitypub/parse.ts`. No product, UI, or domain change. See
[architecture-validation.md](architecture-validation.md).
