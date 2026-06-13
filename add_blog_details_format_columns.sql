-- Add columns for detailed blog country formatting to the blogs table
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cities_info JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS hidden_facts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS story_title VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS story_content TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS story_image VARCHAR(255) DEFAULT '';
