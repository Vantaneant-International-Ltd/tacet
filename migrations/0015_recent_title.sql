-- Continue (Today context column) shows genuinely resumable items by their real TITLE —
-- never the first words of a body. The recently-viewed snapshot didn't store the title
-- (me_saved already does); add it so titled long-form items can resume honestly.
ALTER TABLE me_recently_viewed ADD COLUMN title TEXT;
