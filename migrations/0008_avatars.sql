-- Profile avatars. avatar_key non-null means the user has an uploaded avatar, served from
-- R2 at avatars/<user id>/variant. Absent → the initial-in-a-circle fallback.
ALTER TABLE users ADD COLUMN avatar_key TEXT;
