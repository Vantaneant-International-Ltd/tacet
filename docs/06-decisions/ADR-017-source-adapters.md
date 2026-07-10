# ADR-017: Source adapters — one normalization contract for the whole open web

> **Numbering note.** The source-adapter work was scoped informally as "ADR-013," but
> `ADR-013` was already taken (three-column desktop canvas). This is the same decision under
> the next free number. Code and docs refer to it as **ADR-017**.

## Status
Accepted (2026-07). Implemented in `src/sources/` and **shipped live on 2026-07-10** —
ActivityPub, RSS/Atom/JSON Feed, AT Protocol (Bluesky), and Nostr all merge into `/today`.

## Context
Tacet is a home for the *whole* open social web, not one protocol. ADR-007 already settled
that the protocol is a replaceable adapter at the edge and the domain leads. Until now there
was exactly one adapter — the ActivityPub reader in `src/openweb/` — so the seam was real
but untested by variety. Reaching Bluesky (AT Protocol), Nostr, and the vast RSS/Atom/JSON
Feed world (blogs, news, podcasts, YouTube channels, public Reddit/GitHub/Discourse feeds)
means several adapters must coexist behind one boundary without any of their protocol
vocabulary leaking upward, and without the existing ActivityPub reader being disturbed.

These sources differ in shape and transport. ActivityPub and feeds and Bluesky are **pull**
(HTTP polling); Nostr is **push** (a relay socket). Cloudflare Workers cannot hold a
long-lived socket on a cron trigger, so a "push" source has to be collected in short-lived
windows. And feeds/Bluesky/Nostr are too slow to poll live on every Today request, so they
must be refreshed on a schedule into a store and read back cheaply.

## Decision
**One normalization contract; every source implements it; Today merges the results.**

### The normalized schema
Every adapter emits the product's existing domain objects — nothing new to learn:

- **post** (`Moment`): `id`, `author` (person), `text`, `media[]`, `url` (canonical link),
  `createdAt`/timestamps in **ISO-8601 UTC**, optional conversation reference, and a `source`.
- **person** (`Person`): `name`, `avatarUrl`, `handle`, `source` (home).
- **source** (`Source`): a human `name` (home or publication), `url` (origin), a friendly
  `software` label ("Mastodon", "Bluesky", "Nostr", "Podcast" — a network/medium, never a
  protocol), an optional `iconUrl` (favicon), and an internal `adapter` provenance tag.

### The interface
Adapters are **leaf modules** in `src/sources/<name>/` implementing `SourceAdapter`
(`src/sources/contract.ts`):

```
fetchLatest(ctx) → Raw[]      // pull the latest raw items from every underlying source
normalize(raw)   → Post|null  // map ONE raw item to the schema (or drop it)
healthcheck()    → HealthReport
```

`Raw` is private to each module; `normalize` is the only thing that turns it into a
`NormalizedPost`. The interface supports **both** transports: pull adapters poll in
`fetchLatest`; push adapters (Nostr) implement `fetchLatest` as a short-lived socket window
(open, request since the cursor, collect, close).

### The rules (non-negotiable)
- **Protocol language never crosses the boundary.** The UI receives human labels only — "on
  Bluesky", "on Mastodon", a publication name — never "ActivityPub", "RSS", "AT-URI",
  "relay". The single internal exception is `Source.adapter`, which the UI never renders.
- **Dedup by canonical URL, then source id.** The same content reaching us twice (a boost, a
  cross-post, the same Nostr event on two relays) collapses to one card.
- **UTC timestamps** everywhere.
- **Read-only, public sources only.** No credentials, no auth, no secrets.

### Two roles behind the one contract
- **ActivityPub is read live** through the untouched `src/openweb/` reader, mapped onto the
  contract by `src/sources/activitypub/adapter.ts`. It is the *first adapter behind the
  contract* and the reference for the rest. Its Today path is unchanged.
- **Feeds, AT Protocol, and Nostr are collectors.** A cron trigger refreshes them into a
  shared D1 item store (`source_items`); Today reads them back cheaply and merges them with
  the live ActivityPub results. Because everything is a `NormalizedPost`, the merge, dedup,
  and calm interleave (ADR-011/012 — recency + source variety, never engagement) don't know
  which adapter produced any card.

## Consequences
- **Benefit — coverage is additive.** A new open network is "add a leaf module in
  `src/sources/`," with no change to the domain, the UI, or the other adapters. ADR-007's
  acceptance test holds: swap or add a protocol and home/Today are unchanged.
- **Benefit — the existing reader is untouched.** ActivityPub keeps its live path; the new
  contract wraps it rather than rewriting it.
- **Cost — a shared store and a cron.** Collectors need persistence and a refresh cycle
  (registered in the git-ignored deploy config; the tracked `wrangler.jsonc` is untouched).
  Today also lazily kicks a refresh on read so content materializes without waiting for the
  next tick.
- **Cost — the adapter carries the impedance.** Each adapter faithfully represents a richer
  or poorer source on the common schema (a podcast enclosure becomes media; a YouTube feed
  becomes a video card), never shrinking to a lowest common denominator.

## Closed platforms
Instagram, TikTok, X, LinkedIn, and Facebook expose no read APIs and are **permanently out
of scope** as sources. They appear in the product only as orientation (naming the
fragmentation problem), never as something we read. This is a permanent boundary, not a
"not yet."

## Threads note
`threads.net` is **not** domain-blocked from our fetches (a probe of its
`/.well-known/nodeinfo` returns a 301 redirect, i.e. reachable, not refused). Threads
federates selectively and per-account: accounts that have turned on fediverse sharing are
reachable **through the ActivityPub adapter** like any other AP account, by handle. There is
no separate Threads adapter and there will not be one — closed by default, AP when opened.

## References
- ADR-007 (protocols are replaceable infrastructure) — the parent decision.
- ADR-008 (human language over protocol language) — the UI-facing rule enforced here.
- ADR-011 / ADR-012 (metrics are context, the Context Column law) — the calm merge order.
- `src/sources/contract.ts`, `src/sources/README.md` — the implementation.
- [docs/05-federation/](../05-federation/) — ActivityPub as one adapter among several.
