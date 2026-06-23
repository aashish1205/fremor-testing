-- Create the visas table
CREATE TABLE IF NOT EXISTS public.visas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL UNIQUE,
    country_code VARCHAR(10) DEFAULT 'un',
    flag_url TEXT,
    visa_type VARCHAR(255) DEFAULT 'E-VISA',
    price NUMERIC DEFAULT 0,
    service_fee NUMERIC DEFAULT 0,
    processing_time_text VARCHAR(255) NOT NULL,
    processing_days_max INTEGER DEFAULT 0,
    processing_type VARCHAR(50) DEFAULT 'working_days', -- 'working_days', 'calendar_days', 'hours', 'interview'
    visas_processed VARCHAR(100) DEFAULT '10k+',
    landmark_image TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    important_info JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS disabled for visas table to allow team members (who login via custom RPC and run as 'anon' role) to manage visas.
-- ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;

