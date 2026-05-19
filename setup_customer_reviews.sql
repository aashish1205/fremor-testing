-- Create the customer_video_reviews table
CREATE TABLE IF NOT EXISTS public.customer_video_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    trip_tag VARCHAR(255) NOT NULL,
    review_text TEXT,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: If you already created the table, run this instead:
-- ALTER TABLE public.customer_video_reviews ADD COLUMN review_text TEXT;

-- Set up Row Level Security (RLS)
ALTER TABLE public.customer_video_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.customer_video_reviews
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.customer_video_reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.customer_video_reviews
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.customer_video_reviews
    FOR DELETE USING (auth.role() = 'authenticated');

-- IMPORTANT: You also need to create a Storage Bucket named 'customer_videos'
-- Go to Supabase Dashboard -> Storage -> Create new bucket
-- Name: customer_videos
-- Check the "Public bucket" option.
