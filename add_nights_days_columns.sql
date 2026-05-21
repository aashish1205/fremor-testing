-- SQL Migration Script to add nights and days columns to destinations table
-- Run this query in your Supabase SQL Editor:

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS nights INTEGER DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS days INTEGER DEFAULT 0;

-- Optional: Update existing rows by parsing duration if possible, or setting default values
UPDATE destinations 
SET 
  nights = COALESCE(CAST(SUBSTRING(duration FROM '([0-9]+)\s*[Nn]') AS INTEGER), 0),
  days = COALESCE(CAST(SUBSTRING(duration FROM '([0-9]+)\s*[Dd]') AS INTEGER), 0)
WHERE duration IS NOT NULL;

-- If your duration doesn't specify nights/days directly (e.g. just "7 Days"),
-- you can set nights = days - 1 where days is found, or leave it as default.
UPDATE destinations
SET
  days = COALESCE(CAST(SUBSTRING(duration FROM '([0-9]+)\s*[Dd]') AS INTEGER), 0),
  nights = GREATEST(0, COALESCE(CAST(SUBSTRING(duration FROM '([0-9]+)\s*[Dd]') AS INTEGER), 1) - 1)
WHERE duration IS NOT NULL AND (nights = 0 OR nights IS NULL) AND (days = 0 OR days IS NULL);
