-- Profile customization: a person's display name and bio. Handle stays the permanent @id;
-- display_name is what shows, bio is the line under it. Avatar stays an initial for now.
ALTER TABLE users ADD COLUMN display_name TEXT;
ALTER TABLE users ADD COLUMN bio TEXT;
