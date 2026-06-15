-- Add is_popular_story column to the blogs table
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS is_popular_story BOOLEAN DEFAULT false;
