-- 1. Add tracking and robust fields to destinations
ALTER TABLE public.destinations
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.8,
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS description_1 TEXT,
ADD COLUMN IF NOT EXISTS description_2 TEXT,
ADD COLUMN IF NOT EXISTS highlights_text TEXT,
ADD COLUMN IF NOT EXISTS highlights_list JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS basic_info_text TEXT,
ADD COLUMN IF NOT EXISTS included_list JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS excluded_list JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;
