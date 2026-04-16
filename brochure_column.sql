-- Add brochure_url column to destinations table for storing PDF brochure links
ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS brochure_url TEXT;
