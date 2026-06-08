-- SQL Migration Script to add recently booked columns to destinations table
-- Run this query in your Supabase SQL Editor:

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS show_recently_booked BOOLEAN DEFAULT FALSE;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS recent_booking_text VARCHAR(255) DEFAULT '';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS recent_booking_tag VARCHAR(100) DEFAULT '';
