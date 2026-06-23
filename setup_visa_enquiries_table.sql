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

-- RLS disabled for visa_enquiries table to allow team members (who login via custom RPC and run as 'anon' role) to manage/view enquiries.
-- ALTER TABLE public.visa_enquiries ENABLE ROW LEVEL SECURITY;

