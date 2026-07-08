-- Workspaces: an owned identity space. For now one default (personal) workspace per
-- device; later, business/project identities can be added without a migration nightmare.
-- All user-owned content (saved, collections, notes, reading later, pinned, recently
-- viewed, future drafts/settings) is scoped to a workspace via the existing profile_id —
-- the workspace id EQUALS its profile id (1:1), so nothing has to be re-keyed. The
-- me_profiles row is that workspace's identity.

CREATE TABLE me_workspaces (
  id         TEXT PRIMARY KEY,                 -- equals the owning profile id (1:1 for now)
  name       TEXT NOT NULL DEFAULT '',         -- workspace label (e.g. "Personal", "VNTA")
  kind       TEXT NOT NULL DEFAULT 'personal', -- personal | business (future)
  is_default INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- Expand the local identity with the public-facing fields (mirrors what a remote profile
-- exposes). Avatar/banner are stored as URLs for now (no upload pipeline yet).
ALTER TABLE me_profiles ADD COLUMN workspace_id TEXT;
ALTER TABLE me_profiles ADD COLUMN avatar_url TEXT;
ALTER TABLE me_profiles ADD COLUMN banner_url TEXT;
ALTER TABLE me_profiles ADD COLUMN website TEXT;
ALTER TABLE me_profiles ADD COLUMN location TEXT;
ALTER TABLE me_profiles ADD COLUMN fields_json TEXT NOT NULL DEFAULT '[]';

-- Backfill: give every existing profile a default workspace and link it. Existing saved
-- posts, collections, notes, etc. are untouched — they already reference the profile id,
-- which is now the workspace id.
INSERT INTO me_workspaces (id, name, kind, is_default, created_at)
  SELECT id, CASE WHEN display_name <> '' THEN display_name ELSE 'Personal' END, 'personal', 1, created_at
  FROM me_profiles;
UPDATE me_profiles SET workspace_id = id WHERE workspace_id IS NULL;
