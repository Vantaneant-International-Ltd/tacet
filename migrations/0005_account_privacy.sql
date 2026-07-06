-- Account privacy (settings panel). A private account's profile + posts are for approved
-- followers; enforcement lands fully with profiles/federation (P4). The stored flag is real.
ALTER TABLE users ADD COLUMN is_private INTEGER NOT NULL DEFAULT 0 CHECK (is_private IN (0, 1));
