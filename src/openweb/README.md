# Open Social Web adapter (read-only)

This is the **adapter layer** — the replaceable seam between Tacet's product/domain and
the open social web. Nothing above it (the API routes, the client, the UI) knows which
protocol or vendor is underneath. That is the whole point:

```
Product UI → Tacet domain objects → this adapter → the open social web
```

> If ActivityPub were replaced by another open protocol tomorrow, only this folder
> would change. `Person`, `Moment`, and `Source` — and everything that renders them —
> would not.

## Files

| File | Responsibility |
|---|---|
| `types.ts` | Tacet domain types (`Person`, `Moment`, `Source`, `AdapterResult`, `AdapterError`, …) and the `OpenWebSource` interface. Protocol-agnostic. |
| `mastodon.ts` | The **one** place that speaks a concrete protocol/API. Reads public, unauthenticated endpoints of a Mastodon-compatible home and normalizes them into domain types. Pure mappers (`toPlainText`, `mapProfile`, `mapContent`) are exported and unit-tested. |
| `mock.ts` | Sample fallback data (domain-shaped), shown **only** when the open web can't be reached, always labelled `mock` in the UI. |
| `index.ts` | The facade: pick a source, fetch, cache briefly, and always return an `AdapterResult`, degrading **live → cached → mock**. Never throws to callers. |

## Data sources

- **Default source:** the public timeline and profile directory of a Mastodon-compatible
  home (`mastodon.social` by default). These are public, read-only, unauthenticated
  REST endpoints. No login, no keys, no writes.
  - Today → `GET https://<home>/api/v1/timelines/public`
  - People → `GET https://<home>/api/v1/directory`
- **Configure the home** with the `OPENWEB_INSTANCE` binding (e.g. `mastodon.social`).
- This is **read-only**. The adapter never posts, follows, likes, or authenticates.
- **Only the open social web.** No Instagram / X / TikTok / LinkedIn / YouTube. Tacet
  begins with the open social web.

## Data modes (honest provenance)

Every result carries a `mode` the UI labels plainly:

- `live` — freshly fetched from the open web.
- `cached` — served from a brief in-memory cache (or stale-on-error).
- `mock` — sample content, shown only because the open web couldn't be reached.

## Testing

- **Pure mapping + degradation logic** is covered by `test/openweb.test.ts` and runs
  with no network (`npm test`).
- **Live data** needs outbound network, which some build/CI environments block. To see
  real content, run locally on a networked machine:
  ```sh
  npm run dev
  # then:
  curl -s http://localhost:8787/api/openweb/today  | head
  curl -s http://localhost:8787/api/openweb/people | head
  ```
  When offline, both endpoints still return `200` with `"mode":"mock"` and an `error`
  describing why — the product degrades gracefully instead of failing.
