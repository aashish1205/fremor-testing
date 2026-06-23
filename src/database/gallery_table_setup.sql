-- Create the instagram_gallery table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.instagram_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    instagram_link TEXT,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS disabled for instagram_gallery table to allow team members (who login via custom RPC and run as 'anon' role) to manage the gallery.
-- ALTER TABLE public.instagram_gallery ENABLE ROW LEVEL SECURITY;

