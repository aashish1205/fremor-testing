-- Create wishlists table linking user profiles and destinations
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, destination_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to view, add, and delete their own wishlisted items
-- and allow administrators (admin / team) to select all records for marketing/CRM.
CREATE POLICY "Allow select for owner or admin" ON public.wishlists
    FOR SELECT USING (
        auth.uid() = user_id 
        OR (SELECT role FROM public.user_profiles WHERE id = auth.uid()) IN ('admin', 'team')
    );

CREATE POLICY "Allow insert for owner" ON public.wishlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow delete for owner" ON public.wishlists
    FOR DELETE USING (auth.uid() = user_id);
