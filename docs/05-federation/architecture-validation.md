# Architecture validation

This milestone included a checkpoint: prove the adapter architecture holds under real
breadth, and that Tacet stays a product on top of a replaceable protocol — not a
Fediverse client. Here is the validation, with how each claim is checked.

```
User → Tacet Product (UI) → Domain Model → Normalizer → ActivityPub Parser → Open Social Web
                                            └─ Discovery Sources ─┘
```

## Claims and evidence

### 1. The UI has zero ActivityPub knowledge ✅
The client (`client/src/`) never names a protocol concept and never imports the adapter.
- **Check:** grep `client/src` for `activitypub|webfinger|outbox|inbox|actor|attributedTo|Note|Announce|nodeinfo|preferredUsername` → only the English word "note", the marketing line "One inbox", and the word "actor" in a comment. No protocol usage.
- **Check:** grep `client/src` for imports of `src/openweb/*` → none. The UI talks to
  `/api/openweb/*` and renders domain objects (`Person`, `Moment`, `Source`).

### 2. The parser produces canonical ActivityPub objects ✅
`activitypub/parse.ts` returns `APActor` / `APObject` / `APActivity` (`apmodel.ts`) — still
pure protocol vocabulary (`preferredUsername`, `attributedTo`, `Create`, `Announce`). It
contains **no** product types. Tested by `test/openweb.test.ts` ("activitypub parser").

### 3. Normalization converts protocol objects into domain objects ✅
`normalize/` is the **only** place AP vocabulary becomes product vocabulary. A domain
`Person`/`Moment` carries no protocol fields.
- **Check (in tests):** `JSON.stringify(person)` must not match
  `preferredUsername|attributedTo|outbox|Note`.

### 4. Platform-specific code is isolated ✅
- The generic core (`activitypub/`, `normalize/`) names no vendor.
- The **only** vendor-specific file is `sources/mastodon.ts` (an optional REST discovery
  shim), quarantined behind the `DiscoverySource` interface. Remove it and the generic
  `SeedSource` still works everywhere.
- Small object-type breadth (Lemmy `Page`, BookWyrm `Review`, Mobilizon `Event`) lives as
  **set entries** in `normalize/moment.ts`, not as per-platform branches.

### 5. Adding another ActivityPub implementation is minimal ✅
If a home serves standard actors/objects: **zero** code — it already reads (the seed or a
handle is enough). Unusual object type or field: one set entry or a few defensive lines in
the parser/normalizer. No UI, domain, route, or product change.

### 6. A future non-ActivityPub protocol could be added without changing UI or domain ✅
The domain model (`Person`, `Moment`, `Media`, `Source`, `Conversation`) and the UI depend
only on the domain — never on ActivityPub. To add, say, **AT Protocol (Bluesky)**:

1. Add `atproto/` next to `activitypub/`: a parser producing canonical AT records
   (its own model) and its own fetch/auth primitive.
2. Add `normalize/atproto.ts` mapping those records → the **same** domain types.
3. Add an `AtprotoSource` implementing the **same** `DiscoverySource` interface, and list
   it in `registry.ts`.

Nothing above the adapter changes: not the domain, not `/api/openweb/*`, not a single line
of UI. The product would present Bluesky people and posts identically to Mastodon ones,
with a "Bluesky" source badge. That is the test — *if the protocol vanished, the product
still makes sense* — and the structure passes it.

## The boundary, in one line

> `activitypub/` speaks the protocol. `normalize/` speaks the product. `sources/` decides
> what to fetch. The UI knows only the product. Each can change without the others.

See the [adapter README](../../src/openweb/README.md) and
[compatibility matrix](compatibility.md).
