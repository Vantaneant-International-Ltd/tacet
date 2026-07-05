-- Canonical-record step 1: public brand archives.
-- A room may be marked public. A public room is a brand archive: its posts are readable
-- without signing in, at a permanent public URL. Private rooms (the default) are unchanged.
ALTER TABLE rooms ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0 CHECK (is_public IN (0, 1));
