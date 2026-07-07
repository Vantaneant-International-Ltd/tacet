# Open Social Web adapter (read-only)

The **adapter layer** — the replaceable seam between Tacet's product/domain and the open
social web. Nothing above it knows which protocol or implementation is underneath.

```
Product UI → Tacet domain objects → this adapter → the open social web
```

> If ActivityPub were replaced by another open protocol tomorrow, only `activitypub/`
> would change. The domain, the normalizer's output, `sources/`, and the UI would not.

## Three layers, cleanly separated

| Layer | Folder | Speaks | Produces |
|---|---|---|---|
| **Parser** | `activitypub/` | ActivityPub / JSON-LD | **canonical AP objects** (`APActor`, `APObject`, `APActivity`) — still protocol vocabulary |
| **Normalizer** | `normalize/` | — | **Tacet domain** (`Person`, `Moment`, `Media`) — product vocabulary |
| **Discovery** | `sources/` | — | domain objects, discovered from somewhere |

The parser never mentions the product; the normalizer is the *only* place AP vocabulary
(Note, Article, Create, Announce, attributedTo…) turns into product vocabulary (Person,
Post). This boundary is what makes a second protocol — or future write support — a
localized change instead of a rewrite.

### `activitypub/` — the generic protocol core

- `apmodel.ts` — canonical AP object types.
- `jsonld.ts` — defensive accessors for the many shapes AP takes (arrays vs scalars,
  Link objects, language maps).
- `fetch.ts` — the one network primitive: unauthenticated `GET` with the AP content
  type, timeout, size guard. **Read-only by construction** (no way to POST/sign).
- `webfinger.ts` — resolve `@user@home` → actor document URL.
- `parse.ts` — raw JSON-LD → `APActor` / `APObject` / `APActivity`.
- `collection.ts` — page through an `OrderedCollection` (outbox) → raw items.
- `client.ts` — `ApClient`: `getActor()`, `getOutbox()`, `getObject()`.

Because it speaks only the protocol, it reads **Mastodon, Pixelfed, PeerTube, Lemmy,
Misskey, Friendica** and other ActivityPub software with the same code.

### `normalize/` — AP objects → domain

- `person.ts` — `APActor` → `Person`.
- `moment.ts` — `APObject` → `Moment`, and `APActivity` → `Moment` (unwraps `Create`,
  marks `Announce` as shared; handles `Note` / `Article` / `Image` / `Video` / `Page`,
  attachments, titles).

### `sources/` — discovery (ActivityPub has none of its own)

AP is object-addressed; there is no protocol-standard "trending" or "search." So
discovery is pluggable:

- `seed.ts` — **universal.** A small, tunable set of handles spanning *different*
  implementations, read entirely through the generic AP core. This proves the adapter
  is genuinely cross-implementation. Tune with `OPENWEB_SEED` (comma-separated handles).
- `mastodon.ts` — **optional vendor shim, quarantined.** Uses Mastodon's REST API
  (trending posts, profile directory) so discovery stays lively. Its Mastodon-specific
  field knowledge never leaves this file. Remove it and the seed source still works.

`registry.ts` wires the sources; `index.ts` merges their domain objects, dedupes, sorts,
and returns an `AdapterResult` that degrades **live → cached → mock**.

## Read-only & safety

100% read-only, unauthenticated: no posting, follows, likes, messaging, notifications,
or federation writes. Only the **open** social web — no Instagram / X / TikTok / LinkedIn
/ YouTube. Tacet begins with the open social web.

**Known limitation — authorized fetch.** Some homes (e.g. Mastodon in "secure mode")
require an HTTP-signed `GET` even for public objects and will refuse an unsigned read.
Because Tacet holds no user identity here, those objects are simply skipped and the
result degrades gracefully. A future server-actor signing key could widen coverage
without changing this architecture.

## Data modes (honest provenance)

Every result carries a `mode` the UI labels plainly: `live`, `cached`, or `mock`
(sample content shown only when the open web can't be reached).

## Testing

- **Pure parse + normalize + degradation** logic is covered by `test/openweb.test.ts`
  and runs with **no network** (`npm test`): actor/object/activity parsing across
  implementations, Create/Announce unwrapping, and the live→cached→mock facade.
- **Live data** needs outbound network. On a networked machine:
  ```sh
  npm run dev
  curl -s http://localhost:8787/api/openweb/today  | head
  curl -s http://localhost:8787/api/openweb/people | head
  ```
  Offline, both endpoints still return `200` with `"mode":"mock"` and an `error`.
