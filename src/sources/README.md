# src/sources — open-web source adapters

Every open network Tacet reads is a leaf module here, behind one contract. See
[ADR-017](../../docs/06-decisions/ADR-017-source-adapters.md) for the decision and the rules.

```
contract.ts            The SourceAdapter interface + NormalizedPost schema + dedup helpers.
registry.ts            Which adapters are wired in (live readers vs cron collectors).
store.ts               The shared D1 item store (source_items) collectors write / Today reads.
refresh.ts             The cron/lazy refresh cycle that runs the collectors.
activitypub/           ActivityPub, mapped onto the contract (reuses src/openweb, untouched).
feeds/                 RSS 2.0 / Atom / JSON Feed — blogs, news, podcasts, YouTube, etc.
atproto/               AT Protocol (Bluesky), public read, no auth.
nostr/                 Nostr, public relays, read-only, short-lived fetch windows.
```

## The contract, in one line
`fetchLatest → Raw[]`, `normalize(raw) → NormalizedPost | null`, `healthcheck → HealthReport`.
Everything a source emits is a `Moment` (the product's post type). **Protocol words never
cross this boundary** — the UI gets human labels only ("on Bluesky", a publication name),
never "ActivityPub", "RSS", or "relay".

## Two roles
- **Live reader:** ActivityPub is read at request time through the untouched `src/openweb/`
  reader. `activitypub/adapter.ts` is its contract-conformant face.
- **Collectors:** feeds, AT Protocol, and Nostr are refreshed by cron into `source_items`
  (D1) and read back cheaply. Today merges live ActivityPub + the collected items, dedupes
  by canonical URL, and interleaves calmly (recency + source variety, never engagement).

All sources are **public and read-only** — no auth, no credentials, no secrets.
