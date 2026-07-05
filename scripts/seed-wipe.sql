-- Remove all obviously-fake placeholder data. Placeholder users have handles like
-- 'placeholder-%' and placeholder rooms have slugs like 'placeholder-%'. Deletes run in
-- FK-dependency order so this works whether or not foreign keys are enforced.

DELETE FROM keeps
  WHERE user_id IN (SELECT id FROM users WHERE handle LIKE 'placeholder-%')
     OR post_id IN (SELECT id FROM posts WHERE room_id IN (SELECT id FROM rooms WHERE slug LIKE 'placeholder-%'));

DELETE FROM replies
  WHERE author_id IN (SELECT id FROM users WHERE handle LIKE 'placeholder-%')
     OR post_id IN (SELECT id FROM posts WHERE room_id IN (SELECT id FROM rooms WHERE slug LIKE 'placeholder-%'));

DELETE FROM posts
  WHERE author_id IN (SELECT id FROM users WHERE handle LIKE 'placeholder-%')
     OR room_id IN (SELECT id FROM rooms WHERE slug LIKE 'placeholder-%');

DELETE FROM lens_prefs
  WHERE user_id IN (SELECT id FROM users WHERE handle LIKE 'placeholder-%')
     OR room_id IN (SELECT id FROM rooms WHERE slug LIKE 'placeholder-%');

DELETE FROM memberships
  WHERE user_id IN (SELECT id FROM users WHERE handle LIKE 'placeholder-%')
     OR room_id IN (SELECT id FROM rooms WHERE slug LIKE 'placeholder-%');

DELETE FROM invites
  WHERE created_by IN (SELECT id FROM users WHERE handle LIKE 'placeholder-%')
     OR used_by IN (SELECT id FROM users WHERE handle LIKE 'placeholder-%');

DELETE FROM rooms WHERE slug LIKE 'placeholder-%';

DELETE FROM users WHERE handle LIKE 'placeholder-%';
