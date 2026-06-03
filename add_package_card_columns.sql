-- SQL Migration Script to add package card columns to destinations table
-- Run this query in your Supabase SQL Editor:

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS original_price NUMERIC DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS badge_text VARCHAR(255) DEFAULT 'Recommended';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS inclusions JSONB DEFAULT '{"hotel": true, "sightseeing": true, "meals": true, "manager": true, "flights": false, "transfers": false}'::jsonb;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS itinerary_summary VARCHAR(500) DEFAULT '';

