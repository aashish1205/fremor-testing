-- 1. Alter the destinations table to add a continent column if it doesn't exist
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS continent VARCHAR(255);

-- 2. Create the navbar_items table
CREATE TABLE IF NOT EXISTS public.navbar_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    url VARCHAR(255),
    parent_id UUID REFERENCES public.navbar_items(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    is_mega BOOLEAN DEFAULT false,
    special_type VARCHAR(50), -- 'outbound_mega', 'inbound_dropdown', 'domestic_dropdown', or NULL
    mega_group VARCHAR(255), -- Represents column name in a mega menu
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.navbar_items ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist to make script idempotent
DROP POLICY IF EXISTS "Allow public read access" ON public.navbar_items;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON public.navbar_items;
DROP POLICY IF EXISTS "Allow authenticated update access" ON public.navbar_items;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON public.navbar_items;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.navbar_items
    FOR SELECT USING (true);

-- Create policies to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert access" ON public.navbar_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access" ON public.navbar_items
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access" ON public.navbar_items
    FOR DELETE USING (auth.role() = 'authenticated');

-- Clean up any existing 'Asia' item under Outbound (Global) if it exists
DELETE FROM public.navbar_items WHERE label = 'Asia';

-- Seed initial data matching the current menu structure
DO $$
DECLARE
    v_explore_id UUID;
    v_outbound_id UUID;
    v_about_id UUID;
BEGIN
    -- Only seed if the table is empty
    IF NOT EXISTS (SELECT 1 FROM public.navbar_items) THEN
        
        -- 1. Simple Link: Home
        INSERT INTO public.navbar_items (label, url, order_index)
        VALUES ('Home', '/', 1);

        -- 2. Dropdown: Explore Tours
        INSERT INTO public.navbar_items (label, url, order_index, is_mega)
        VALUES ('Explore Tours', '/destination', 2, false)
        RETURNING id INTO v_explore_id;

        -- Sub items of Explore Tours
        INSERT INTO public.navbar_items (label, url, parent_id, order_index, special_type) VALUES
        ('Outbound (Global)', '/destination/outbound', v_explore_id, 1, 'outbound_mega')
        RETURNING id INTO v_outbound_id;

        INSERT INTO public.navbar_items (label, url, parent_id, order_index, special_type) VALUES
        ('Inbound (India)', '/destination/inbound', v_explore_id, 2, 'inbound_dropdown'),
        ('Domestic', '/destination/domestic', v_explore_id, 3, 'domestic_dropdown');

        -- Seed continents under Outbound (Global)
        INSERT INTO public.navbar_items (label, url, parent_id, order_index) VALUES
        ('Asia', '/destination/outbound/asia', v_outbound_id, 1),
        ('Europe', '/destination/outbound', v_outbound_id, 2),
        ('Africa', '/destination/outbound', v_outbound_id, 3),
        ('North America', '/destination/outbound', v_outbound_id, 4),
        ('South America', '/destination/outbound', v_outbound_id, 5),
        ('Australia', '/destination/outbound', v_outbound_id, 6);

        -- 3. Simple Link: Visa
        INSERT INTO public.navbar_items (label, url, order_index)
        VALUES ('Visa', '/visa', 3);

        -- 4. Simple Link: Cruises
        INSERT INTO public.navbar_items (label, url, order_index)
        VALUES ('Cruises', '/cruise', 4);

        -- 5. Dropdown: About Us
        INSERT INTO public.navbar_items (label, url, order_index, is_mega)
        VALUES ('About Us', '/about', 5, false)
        RETURNING id INTO v_about_id;

        -- Sub items of About Us
        INSERT INTO public.navbar_items (label, url, parent_id, order_index) VALUES
        ('Our Story', '/about', v_about_id, 1),
        ('FAQ', '/faq', v_about_id, 2),
        ('Support', '/contact', v_about_id, 3);

    END IF;
END $$;
