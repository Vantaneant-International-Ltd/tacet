-- Conversation context captured with a saved post: reactions / replies / shares as they
-- stood when the user saved it. Nullable — absence means the home didn't expose that count
-- (never rendered as zero). Contextual, not engagement; no ranking is ever derived from it.
ALTER TABLE me_saved ADD COLUMN reactions INTEGER;
ALTER TABLE me_saved ADD COLUMN replies INTEGER;
ALTER TABLE me_saved ADD COLUMN shares INTEGER;
