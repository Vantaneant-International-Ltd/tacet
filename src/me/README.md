# Me — your local-first home

This is where Tacet stops being a beautiful reader and becomes **your place**. Everything
here belongs to the user and lives in Tacet's own database — never on Mastodon, Pixelfed,
or Lemmy, never federated, never published. The whole surface is **read-only toward the
open web**: it only stores what the user chose to keep.

## Layering (UI → Domain → Persistence → Storage)

```
client/src/app/  (UI)          Me screen, SavedCard, Save control — knows only domain shapes
      │  fetch /api/me/*
src/routes/me.ts (HTTP)        resolves the local profile, delegates to the repository
      │
src/me/repo.ts   (Persistence) the ONLY place that writes SQL; returns domain objects
      │
D1 (Storage)                   tables from migrations/0011_me.sql
```

- `types.ts` — domain models (`Profile`, `SavedPost`, `CollectionSummary`, `RecentView`).
  Product-shaped; no SQL, no columns.
- `repo.ts` — every query. Maps rows → domain. Callers never see a column name.
- `profile.ts` — the local identity: a signed `tacet_me` cookie binds a device to one
  `me_profiles` row. **Not** remote auth, **not** a federation identity — just "whose home
  is this." Created automatically on first visit.
- `../routes/me.ts` — the API. Ties HTTP to the repo; writes no SQL.

The UI never imports `src/me/*`; it talks to `/api/me/*` and renders domain objects
(`client/src/app/me.ts`).

## What persists

- **Saved** — a self-contained snapshot of a remote post. Because the snapshot is stored
  locally, a saved post **survives the remote being deleted**. Idempotent by remote id.
- **Private notes** — a note attached to a saved post. Never leaves Tacet.
- **Pinned / Reading later** — facets (flags) of a saved post.
- **Collections** — local, user-made groupings of saved posts (many-to-many).
- **Recently viewed** — a passive, privacy-respecting local history (bounded to 100), which
  the user can clear.
- **Profile** — a local display name, preferred handle, and bio.

## Endpoints (`/api/me/*`)

| Method + path | Purpose |
|---|---|
| `GET /profile` · `PATCH /profile` | Read/update the local profile (auto-creates on first call) |
| `GET /saved?filter=all\|pinned\|read_later\|notes` · `GET /saved?collection=<id>` | List saved posts |
| `POST /saved` · `DELETE /saved/:id` · `PATCH /saved/:id` | Save (snapshot) / unsave / set note·pin·readLater |
| `GET /collections` · `POST /collections` · `DELETE /collections/:id` | Collections |
| `POST /collections/:id/items` · `DELETE /collections/:id/items/:savedId` | Add/remove a saved post |
| `GET /recent` · `POST /recent` · `DELETE /recent` | Recently viewed: list / record / clear |

## Schema

See [`migrations/0011_me.sql`](../../migrations/0011_me.sql): `me_profiles`, `me_saved`,
`me_collections`, `me_collection_items`, `me_recently_viewed`.

## Future identity hooks (foundations, not built)

The schema is shaped for long-term growth without over-engineering today:

- **Multiple accounts / auth:** `me_profiles` is already a first-class table keyed by id;
  a future login simply resolves a different `profile_id` (today it's a device cookie).
- **Drafts / publishing:** a future `me_drafts` table sits beside `me_saved` with the same
  profile ownership; publishing would be a new *outbound* adapter — this milestone adds no
  write path, so nothing here presumes one.
- **Sync / offline / federation identity:** `avatar_key`, stable ULIDs, and ISO timestamps
  give a clean basis for later sync; the local `handle` is deliberately *not* a federation
  handle yet, so a real identity can adopt or supersede it without migration pain.

None of this changes the UI or the domain model — exactly the boundary this milestone
protects.
