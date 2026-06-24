-- ====================================================================
-- SQL Script: Enable Row Level Security (RLS) & Set Up Public Policies
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This permits both Admins (authenticated) and Team Members (anon) to manage data.
-- ====================================================================

-- 1. Enable RLS on all key tables
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cruises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_video_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_booked_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
-- destinations
DROP POLICY IF EXISTS "Allow public read access on destinations" ON public.destinations;
DROP POLICY IF EXISTS "Allow public insert on destinations" ON public.destinations;
DROP POLICY IF EXISTS "Allow public update on destinations" ON public.destinations;
DROP POLICY IF EXISTS "Allow public delete on destinations" ON public.destinations;
DROP POLICY IF EXISTS "Allow All Actions" ON public.destinations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.destinations;

-- tours
DROP POLICY IF EXISTS "Allow public read access on tours" ON public.tours;
DROP POLICY IF EXISTS "Allow public insert on tours" ON public.tours;
DROP POLICY IF EXISTS "Allow public update on tours" ON public.tours;
DROP POLICY IF EXISTS "Allow public delete on tours" ON public.tours;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tours;

-- blogs
DROP POLICY IF EXISTS "Allow public read access on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public insert on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public update on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public delete on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.blogs;

-- visas
DROP POLICY IF EXISTS "Allow public read access on visas" ON public.visas;
DROP POLICY IF EXISTS "Allow public insert on visas" ON public.visas;
DROP POLICY IF EXISTS "Allow public update on visas" ON public.visas;
DROP POLICY IF EXISTS "Allow public delete on visas" ON public.visas;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.visas;

-- cruises
DROP POLICY IF EXISTS "Allow public read access on cruises" ON public.cruises;
DROP POLICY IF EXISTS "Allow public insert on cruises" ON public.cruises;
DROP POLICY IF EXISTS "Allow public update on cruises" ON public.cruises;
DROP POLICY IF EXISTS "Allow public delete on cruises" ON public.cruises;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cruises;

-- customer_video_reviews
DROP POLICY IF EXISTS "Allow public read access on customer_video_reviews" ON public.customer_video_reviews;
DROP POLICY IF EXISTS "Allow public insert on customer_video_reviews" ON public.customer_video_reviews;
DROP POLICY IF EXISTS "Allow public update on customer_video_reviews" ON public.customer_video_reviews;
DROP POLICY IF EXISTS "Allow public delete on customer_video_reviews" ON public.customer_video_reviews;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.customer_video_reviews;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.customer_video_reviews;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.customer_video_reviews;
DROP POLICY IF EXISTS "Allow public read access" ON public.customer_video_reviews;

-- testimonials
DROP POLICY IF EXISTS "Allow public read access on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public insert on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public update on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public delete on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.testimonials;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.testimonials;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.testimonials;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.testimonials;

-- instagram_gallery
DROP POLICY IF EXISTS "Allow public read access on instagram_gallery" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Allow public insert on instagram_gallery" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Allow public update on instagram_gallery" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Allow public delete on instagram_gallery" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.instagram_gallery;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.instagram_gallery;

-- visa_enquiries
DROP POLICY IF EXISTS "Allow public read access on visa_enquiries" ON public.visa_enquiries;
DROP POLICY IF EXISTS "Allow public insert on visa_enquiries" ON public.visa_enquiries;
DROP POLICY IF EXISTS "Allow public update on visa_enquiries" ON public.visa_enquiries;
DROP POLICY IF EXISTS "Allow public delete on visa_enquiries" ON public.visa_enquiries;
DROP POLICY IF EXISTS "Allow public read" ON public.visa_enquiries;
DROP POLICY IF EXISTS "Allow public insert" ON public.visa_enquiries;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.visa_enquiries;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.visa_enquiries;

-- package_enquiries
DROP POLICY IF EXISTS "Allow public read access on package_enquiries" ON public.package_enquiries;
DROP POLICY IF EXISTS "Allow public insert on package_enquiries" ON public.package_enquiries;
DROP POLICY IF EXISTS "Allow public update on package_enquiries" ON public.package_enquiries;
DROP POLICY IF EXISTS "Allow public delete on package_enquiries" ON public.package_enquiries;
DROP POLICY IF EXISTS "Allow public read" ON public.package_enquiries;
DROP POLICY IF EXISTS "Allow public insert" ON public.package_enquiries;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.package_enquiries;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.package_enquiries;

-- recently_booked_settings
DROP POLICY IF EXISTS "Allow public read access on recently_booked_settings" ON public.recently_booked_settings;
DROP POLICY IF EXISTS "Allow public insert on recently_booked_settings" ON public.recently_booked_settings;
DROP POLICY IF EXISTS "Allow public update on recently_booked_settings" ON public.recently_booked_settings;
DROP POLICY IF EXISTS "Allow public delete on recently_booked_settings" ON public.recently_booked_settings;


-- 3. Create public SELECT, INSERT, UPDATE, DELETE policies for each table
-- destinations
CREATE POLICY "Allow public select on destinations" ON public.destinations FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on destinations" ON public.destinations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on destinations" ON public.destinations FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on destinations" ON public.destinations FOR DELETE TO public USING (true);

-- tours
CREATE POLICY "Allow public select on tours" ON public.tours FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on tours" ON public.tours FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on tours" ON public.tours FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on tours" ON public.tours FOR DELETE TO public USING (true);

-- blogs
CREATE POLICY "Allow public select on blogs" ON public.blogs FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on blogs" ON public.blogs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on blogs" ON public.blogs FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on blogs" ON public.blogs FOR DELETE TO public USING (true);

-- visas
CREATE POLICY "Allow public select on visas" ON public.visas FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on visas" ON public.visas FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on visas" ON public.visas FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on visas" ON public.visas FOR DELETE TO public USING (true);

-- cruises
CREATE POLICY "Allow public select on cruises" ON public.cruises FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on cruises" ON public.cruises FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on cruises" ON public.cruises FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on cruises" ON public.cruises FOR DELETE TO public USING (true);

-- customer_video_reviews
CREATE POLICY "Allow public select on customer_video_reviews" ON public.customer_video_reviews FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on customer_video_reviews" ON public.customer_video_reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on customer_video_reviews" ON public.customer_video_reviews FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on customer_video_reviews" ON public.customer_video_reviews FOR DELETE TO public USING (true);

-- testimonials
CREATE POLICY "Allow public select on testimonials" ON public.testimonials FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on testimonials" ON public.testimonials FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on testimonials" ON public.testimonials FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on testimonials" ON public.testimonials FOR DELETE TO public USING (true);

-- instagram_gallery
CREATE POLICY "Allow public select on instagram_gallery" ON public.instagram_gallery FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on instagram_gallery" ON public.instagram_gallery FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on instagram_gallery" ON public.instagram_gallery FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on instagram_gallery" ON public.instagram_gallery FOR DELETE TO public USING (true);

-- visa_enquiries
CREATE POLICY "Allow public select on visa_enquiries" ON public.visa_enquiries FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on visa_enquiries" ON public.visa_enquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on visa_enquiries" ON public.visa_enquiries FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on visa_enquiries" ON public.visa_enquiries FOR DELETE TO public USING (true);

-- package_enquiries
CREATE POLICY "Allow public select on package_enquiries" ON public.package_enquiries FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on package_enquiries" ON public.package_enquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on package_enquiries" ON public.package_enquiries FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on package_enquiries" ON public.package_enquiries FOR DELETE TO public USING (true);

-- recently_booked_settings
CREATE POLICY "Allow public select on recently_booked_settings" ON public.recently_booked_settings FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on recently_booked_settings" ON public.recently_booked_settings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on recently_booked_settings" ON public.recently_booked_settings FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on recently_booked_settings" ON public.recently_booked_settings FOR DELETE TO public USING (true);


-- 4. Enable storage public access policies on storage buckets (Blogs, Destinations, Cruises, Testimonials, Gallery, Videos, and Tour Details)
-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('blogs-images', 'blogs-images', true),
  ('cruises-images', 'cruises-images', true),
  ('destination-images', 'destination-images', true),
  ('instagram-gallery', 'instagram-gallery', true),
  ('testimonials', 'testimonials', true),
  ('destinationdetails_images', 'destinationdetails_images', true),
  ('customer_videos', 'customer_videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Read Access blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access blogs-images" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access cruises-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access cruises-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access cruises-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access cruises-images" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access destination-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access destination-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access destination-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access destination-images" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access instagram-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access instagram-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access instagram-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access instagram-gallery" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Testimonials Authenticated users can delete" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access destinationdetails_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access destinationdetails_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access destinationdetails_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access destinationdetails_images" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access customer_videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access customer_videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access customer_videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access customer_videos" ON storage.objects;


-- Create STORAGE SELECT Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Read Access blogs-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'blogs-images');
CREATE POLICY "Public Read Access cruises-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'cruises-images');
CREATE POLICY "Public Read Access destination-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'destination-images');
CREATE POLICY "Public Read Access instagram-gallery" ON storage.objects FOR SELECT TO public USING (bucket_id = 'instagram-gallery');
CREATE POLICY "Public Read Access testimonials" ON storage.objects FOR SELECT TO public USING (bucket_id = 'testimonials');
CREATE POLICY "Public Read Access destinationdetails_images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'destinationdetails_images');
CREATE POLICY "Public Read Access customer_videos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'customer_videos');

-- Create STORAGE INSERT Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Insert Access blogs-images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'blogs-images');
CREATE POLICY "Public Insert Access cruises-images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'cruises-images');
CREATE POLICY "Public Insert Access destination-images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'destination-images');
CREATE POLICY "Public Insert Access instagram-gallery" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'instagram-gallery');
CREATE POLICY "Public Insert Access testimonials" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'testimonials');
CREATE POLICY "Public Insert Access destinationdetails_images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'destinationdetails_images');
CREATE POLICY "Public Insert Access customer_videos" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'customer_videos');

-- Create STORAGE UPDATE Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Update Access blogs-images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'blogs-images');
CREATE POLICY "Public Update Access cruises-images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'cruises-images');
CREATE POLICY "Public Update Access destination-images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'destination-images');
CREATE POLICY "Public Update Access instagram-gallery" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'instagram-gallery');
CREATE POLICY "Public Update Access testimonials" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'testimonials');
CREATE POLICY "Public Update Access destinationdetails_images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'destinationdetails_images');
CREATE POLICY "Public Update Access customer_videos" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'customer_videos');

-- Create STORAGE DELETE Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Delete Access blogs-images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'blogs-images');
CREATE POLICY "Public Delete Access cruises-images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'cruises-images');
CREATE POLICY "Public Delete Access destination-images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'destination-images');
CREATE POLICY "Public Delete Access instagram-gallery" ON storage.objects FOR DELETE TO public USING (bucket_id = 'instagram-gallery');
CREATE POLICY "Public Delete Access testimonials" ON storage.objects FOR DELETE TO public USING (bucket_id = 'testimonials');
CREATE POLICY "Public Delete Access destinationdetails_images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'destinationdetails_images');
CREATE POLICY "Public Delete Access customer_videos" ON storage.objects FOR DELETE TO public USING (bucket_id = 'customer_videos');
