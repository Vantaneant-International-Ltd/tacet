-- Stories: casual, ephemeral posts that fade after 24h. No view count, no "seen by", no
-- ring that nags (Amendment 1 feature filter — keep the casual, drop the FOMO machinery).
CREATE TABLE stories (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id),
  kind       TEXT NOT NULL CHECK (kind IN ('text', 'image')),
  body       TEXT NOT NULL DEFAULT '',
  image_key  TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX idx_stories_active ON stories(expires_at, created_at DESC);
