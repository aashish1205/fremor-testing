-- 1. Create the tours table
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 4.8,
    primary_image TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    description_1 TEXT,
    description_2 TEXT,
    highlights_text TEXT,
    highlights_list JSONB DEFAULT '[]'::jsonb,
    basic_info_text TEXT,
    included_list JSONB DEFAULT '[]'::jsonb,
    excluded_list JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- 3. Create a master policy for full public/admin access
CREATE POLICY "Allow All Actions"
ON public.tours
FOR ALL
USING (true)
WITH CHECK (true);
