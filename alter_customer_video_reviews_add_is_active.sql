-- Alter customer_video_reviews table to add is_active column
ALTER TABLE public.customer_video_reviews ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
