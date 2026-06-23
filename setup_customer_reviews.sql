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

-- RLS disabled for customer_video_reviews table to allow team members (who login via custom RPC and run as 'anon' role) to manage reviews.
-- ALTER TABLE public.customer_video_reviews ENABLE ROW LEVEL SECURITY;


-- IMPORTANT: You also need to create a Storage Bucket named 'customer_videos'
-- Go to Supabase Dashboard -> Storage -> Create new bucket
-- Name: customer_videos
-- Check the "Public bucket" option.
