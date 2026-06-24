-- SQL Migration to add banner_image column to destinations table
-- Run this in your Supabase SQL Editor:
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS banner_image TEXT;
