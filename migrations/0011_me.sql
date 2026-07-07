-- Me — the user's local-first home inside Tacet. A local profile plus everything they
-- save, collect, note, pin, and read later. All of this is LOCAL to this Tacet: it never
-- federates, never publishes, never leaves. Saving keeps a full snapshot so a saved post
-- survives the remote post being deleted. Schema is shaped for long-term growth (drafts,
-- publishing, sync, multiple accounts) without over-engineering today.

-- One local profile per device (established by a signed cookie; no remote auth).
CREATE TABLE me_profiles (
  id           TEXT PRIMARY KEY,               -- ULID
  display_name TEXT NOT NULL DEFAULT '',
  handle       TEXT NOT NULL DEFAULT '',       -- preferred local handle (not federated)
  bio          TEXT NOT NULL DEFAULT '',
  avatar_key   TEXT,                           -- R2 key placeholder for a future avatar
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

-- A saved post: a self-contained local snapshot of a remote post. Pinned / read-later /
-- private note are facets of a save; collections group saves.
CREATE TABLE me_saved (
  id                TEXT PRIMARY KEY,           -- ULID (local)
  profile_id        TEXT NOT NULL REFERENCES me_profiles(id) ON DELETE CASCADE,
  remote_id         TEXT NOT NULL,              -- canonical url/id of the remote post (dedupe)
  author_name       TEXT NOT NULL DEFAULT '',
  author_handle     TEXT NOT NULL DEFAULT '',
  author_avatar     TEXT,
  title             TEXT,
  text              TEXT NOT NULL DEFAULT '',
  url               TEXT NOT NULL DEFAULT '',
  media_json        TEXT NOT NULL DEFAULT '[]', -- JSON array of {url,kind,alt}
  source_id         TEXT NOT NULL DEFAULT '',   -- home host
  source_software   TEXT,                       -- friendly label ("Mastodon"…), if known
  remote_created_at TEXT,                       -- the post's published time, if known
  note              TEXT,                       -- private note; never leaves Tacet
  pinned            INTEGER NOT NULL DEFAULT 0,
  read_later        INTEGER NOT NULL DEFAULT 0,
  saved_at          TEXT NOT NULL,
  UNIQUE(profile_id, remote_id)
);
CREATE INDEX idx_me_saved_profile ON me_saved(profile_id, saved_at DESC);

-- Local, user-made collections (AI, Photography, Recipes…). No federation.
CREATE TABLE me_collections (
  id         TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES me_profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(profile_id, name)
);

CREATE TABLE me_collection_items (
  collection_id TEXT NOT NULL REFERENCES me_collections(id) ON DELETE CASCADE,
  saved_id      TEXT NOT NULL REFERENCES me_saved(id) ON DELETE CASCADE,
  added_at      TEXT NOT NULL,
  PRIMARY KEY (collection_id, saved_id)
);

-- Passive, privacy-respecting local viewing history. The user can clear it.
CREATE TABLE me_recently_viewed (
  id              TEXT PRIMARY KEY,
  profile_id      TEXT NOT NULL REFERENCES me_profiles(id) ON DELETE CASCADE,
  remote_id       TEXT NOT NULL,
  author_name     TEXT NOT NULL DEFAULT '',
  author_handle   TEXT NOT NULL DEFAULT '',
  text            TEXT NOT NULL DEFAULT '',
  url             TEXT NOT NULL DEFAULT '',
  source_id       TEXT NOT NULL DEFAULT '',
  source_software TEXT,
  viewed_at       TEXT NOT NULL,
  UNIQUE(profile_id, remote_id)
);
CREATE INDEX idx_me_recent_profile ON me_recently_viewed(profile_id, viewed_at DESC);
