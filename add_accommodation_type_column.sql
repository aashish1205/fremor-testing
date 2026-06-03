-- SQL Migration Script to add accommodation_type column to destinations table
-- Run this query in your Supabase SQL Editor:

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS accommodation_type VARCHAR(100) DEFAULT '3 Star';

-- Optional: Populate existing rows with a default value of '3 Star' if needed
UPDATE destinations SET accommodation_type = '3 Star' WHERE accommodation_type IS NULL;
