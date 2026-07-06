-- Amendment 4: public reactions. Every post can be liked (♥) or disliked (👎), with public
-- counts (the Mastodon/Pixelfed model; maps onto ActivityPub's Like activity). One reaction
-- per person per post (like OR dislike), toggled. Keep (bookmark) stays private and separate.
CREATE TABLE reactions (
  user_id    TEXT NOT NULL REFERENCES users(id),
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('like', 'dislike')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, post_id)
);
CREATE INDEX idx_reactions_post ON reactions(post_id, kind);
