-- ==========================================
-- 1. Create testimonials table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT,
    image_url TEXT,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" 
ON public.testimonials FOR SELECT 
USING (true);

-- Allow authenticated users to insert, update, delete
CREATE POLICY "Enable insert for authenticated users only" 
ON public.testimonials FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON public.testimonials FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON public.testimonials FOR DELETE 
TO authenticated 
USING (true);

-- ==========================================
-- 2. Create testimonials storage bucket
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the testimonials bucket

-- Allow public read access to the bucket
CREATE POLICY "Testimonials Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'testimonials' );

-- Allow authenticated users to upload files
CREATE POLICY "Testimonials Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'testimonials' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update their files
CREATE POLICY "Testimonials Authenticated users can update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'testimonials' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete files
CREATE POLICY "Testimonials Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'testimonials' AND auth.role() = 'authenticated' );
