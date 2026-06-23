-- SQL Migration Script to add tier_pricing column to public.destinations table
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS tier_pricing JSONB DEFAULT '{}'::jsonb;
