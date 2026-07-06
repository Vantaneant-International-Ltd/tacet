-- Follows: curation without a scoreboard (Amendment 3). A person follows a room/community
-- (brands and communities are rooms); its posts flow into their personal chronological feed.
-- Private: nobody sees a follower count. The act is core; the number does not exist.
CREATE TABLE follows (
  user_id    TEXT NOT NULL REFERENCES users(id),
  room_id    TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, room_id)
);
CREATE INDEX idx_follows_user ON follows(user_id, created_at DESC);
