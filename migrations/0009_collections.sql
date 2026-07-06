-- Highlights / Collections: curated, pinned sets of your own posts, shown on your profile.
-- Pure curation (Pixelfed/Instagram-highlights idea) — no counts, no metrics.
CREATE TABLE collections (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id),
  name       TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_collections_user ON collections(user_id, created_at DESC);

CREATE TABLE collection_items (
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  post_id       TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  added_at      TEXT NOT NULL,
  PRIMARY KEY (collection_id, post_id)
);
CREATE INDEX idx_collection_items_post ON collection_items(post_id);
