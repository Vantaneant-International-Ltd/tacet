-- TACET Phase 1 schema (lockfile §7). IDs are ULIDs (text, time-sortable).
-- Timestamps are ISO-8601 UTC strings. Chronology is the only ordering: newest first
-- is `ORDER BY created_at DESC, id DESC`. No counts are stored against people or posts.

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id              TEXT PRIMARY KEY,
  handle          TEXT NOT NULL UNIQUE,
  passphrase_hash TEXT NOT NULL,
  created_at      TEXT NOT NULL,
  is_admin        INTEGER NOT NULL DEFAULT 0 CHECK (is_admin IN (0, 1))
);

CREATE TABLE invites (
  code       TEXT PRIMARY KEY,
  created_by TEXT NOT NULL REFERENCES users(id),
  used_by    TEXT REFERENCES users(id),
  created_at TEXT NOT NULL,
  used_at    TEXT
);
CREATE INDEX idx_invites_created_by ON invites(created_by);

CREATE TABLE rooms (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  created_by  TEXT NOT NULL REFERENCES users(id),
  created_at  TEXT NOT NULL
);

CREATE TABLE memberships (
  user_id   TEXT NOT NULL REFERENCES users(id),
  room_id   TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  joined_at TEXT NOT NULL,
  PRIMARY KEY (user_id, room_id)
);

CREATE TABLE posts (
  id         TEXT PRIMARY KEY,
  room_id    TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  author_id  TEXT NOT NULL REFERENCES users(id),
  kind       TEXT NOT NULL CHECK (kind IN ('text', 'image')),
  body       TEXT NOT NULL DEFAULT '',
  image_key  TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_posts_room_created ON posts(room_id, created_at DESC, id DESC);

CREATE TABLE replies (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  TEXT NOT NULL REFERENCES users(id),
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_replies_post_created ON replies(post_id, created_at ASC, id ASC);

-- A keep is private to the keeper. The author is only ever told THAT a post was kept,
-- never by whom and never how many times. No count is derived from this table for display.
CREATE TABLE keeps (
  user_id    TEXT NOT NULL REFERENCES users(id),
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, post_id)
);
CREATE INDEX idx_keeps_post ON keeps(post_id);

CREATE TABLE lens_prefs (
  user_id TEXT NOT NULL REFERENCES users(id),
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  lens    TEXT NOT NULL CHECK (lens IN ('timeline', 'grid')),
  PRIMARY KEY (user_id, room_id)
);
