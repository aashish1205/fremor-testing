-- SQL Migration Script to add details page columns to destinations table
-- Run this query in your Supabase SQL Editor:

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS itinerary_route VARCHAR(500) DEFAULT '';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS tour_type VARCHAR(100) DEFAULT 'Group Tour';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS terms_conditions TEXT DEFAULT '';
