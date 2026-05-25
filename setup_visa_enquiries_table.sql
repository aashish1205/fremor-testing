-- Create the visa_enquiries table
CREATE TABLE IF NOT EXISTS public.visa_enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    travel_date DATE,
    travellers INTEGER DEFAULT 1,
    message TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.visa_enquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON public.visa_enquiries
    FOR INSERT WITH CHECK (true);

-- Create policies to allow authenticated users to select/update/delete
CREATE POLICY "Allow authenticated read access" ON public.visa_enquiries
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access" ON public.visa_enquiries
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access" ON public.visa_enquiries
    FOR DELETE USING (auth.role() = 'authenticated');
