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

-- Enable Row Level Security
ALTER TABLE public.instagram_gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so anyone can view the active images on the frontend)
CREATE POLICY "Enable read access for all users" 
ON public.instagram_gallery FOR SELECT 
USING (true);

-- Allow authenticated users (like your admin) to insert new images
CREATE POLICY "Enable insert for authenticated users only" 
ON public.instagram_gallery FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update images
CREATE POLICY "Enable update for authenticated users only" 
ON public.instagram_gallery FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated users to delete images
CREATE POLICY "Enable delete for authenticated users only" 
ON public.instagram_gallery FOR DELETE 
TO authenticated 
USING (true);
