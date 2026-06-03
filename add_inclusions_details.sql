-- SQL Migration Script to add inclusions details column to destinations table
-- Run this query in your Supabase SQL Editor:

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS inclusions_details JSONB DEFAULT '{}'::jsonb;
