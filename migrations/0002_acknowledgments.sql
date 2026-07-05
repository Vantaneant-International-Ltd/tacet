-- Amendment 1 (lockfile §10): the ACKNOWLEDGE verb and room default lenses.

-- An acknowledgment is one word from a fixed set, one per person per post. It is
-- attributed and visible to the room, never counted, never ranked, and never reorders
-- anything. There is no negative/downward word and no anonymous mode.
CREATE TABLE acknowledgments (
  user_id    TEXT NOT NULL REFERENCES users(id),
  post_id    TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  word       TEXT NOT NULL CHECK (word IN ('seen', 'with_you', 'more')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, post_id)
);
CREATE INDEX idx_acks_post ON acknowledgments(post_id, created_at ASC);

-- A room may suggest how to look at it. Always user-overridable via lens_prefs.
ALTER TABLE rooms ADD COLUMN default_lens TEXT NOT NULL DEFAULT 'timeline'
  CHECK (default_lens IN ('timeline', 'grid'));
