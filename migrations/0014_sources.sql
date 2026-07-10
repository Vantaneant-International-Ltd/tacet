-- Open-web source adapters (ADR-017). A cron refresh collects content from the slow,
-- pollable sources — RSS/Atom/JSON feeds, AT Protocol (Bluesky), Nostr — into ONE shared
-- item store, which Today reads back cheaply and merges with the live ActivityPub reader.
-- Everything here is public, read-only data; no credentials, no user data.

-- The feed registry: which feeds we poll, plus the conditional-fetch + backoff state that
-- keeps polling cheap and polite. Seeded from src/sources/feeds/seeds.json on first refresh.
CREATE TABLE feeds (
  id               TEXT PRIMARY KEY,               -- stable id (hash of the feed url)
  url              TEXT NOT NULL UNIQUE,           -- the feed URL we fetch
  title            TEXT,                           -- discovered publication name (human label)
  site_url         TEXT,                           -- the site the feed belongs to
  icon_url         TEXT,                           -- favicon, discovered best-effort
  kind             TEXT NOT NULL DEFAULT 'blog',   -- medium hint: blog|news|podcast|video|forum
  etag             TEXT,                           -- If-None-Match for conditional fetch
  last_modified    TEXT,                           -- If-Modified-Since for conditional fetch
  last_fetched_at  TEXT,                           -- ISO-8601 UTC of the last poll attempt
  last_status      INTEGER,                        -- HTTP status of the last poll
  failure_count    INTEGER NOT NULL DEFAULT 0,     -- consecutive failures (drives backoff)
  next_earliest_at TEXT,                           -- backoff: do not poll before this time
  enabled          INTEGER NOT NULL DEFAULT 1,
  created_at       TEXT NOT NULL
);
CREATE INDEX idx_feeds_enabled ON feeds(enabled);

-- The shared, normalized item store. Every collector writes a full NormalizedPost (the
-- product's Moment) as JSON, keyed by its canonical dedup key, so the same content arriving
-- twice collapses. Today reads recent rows and returns them straight to the UI — no
-- re-normalization, no per-adapter read path.
CREATE TABLE source_items (
  key         TEXT PRIMARY KEY,                    -- dedupeKey: canonical URL (or id), lowercased
  adapter     TEXT NOT NULL,                       -- 'feeds' | 'atproto' | 'nostr'
  origin_id   TEXT,                                -- feed id / account did / relay-group (diagnostics)
  url         TEXT NOT NULL,                       -- canonical permalink
  created_at  TEXT NOT NULL,                       -- the post's own timestamp (ISO UTC) — recency order
  fetched_at  TEXT NOT NULL,                       -- when we collected it (ISO UTC)
  post_json   TEXT NOT NULL                        -- the full NormalizedPost, serialized
);
CREATE INDEX idx_source_items_created ON source_items(created_at DESC);
CREATE INDEX idx_source_items_adapter ON source_items(adapter, created_at DESC);

-- Tiny key/value scratch for refresh coordination (last-run lock, cursors). Not user data.
CREATE TABLE source_state (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
