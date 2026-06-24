-- ====================================================================
-- SQL Migration: Setup Supabase Storage Buckets & Policies for All Roles
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This permits both Admins (authenticated) and Team Members (anon) to read, upload, update, and delete images.
-- ====================================================================

-- 1. Ensure the buckets exist and are marked as public
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('blogs-images', 'blogs-images', true),
  ('destinationdetails_images', 'destinationdetails_images', true),
  ('destination-images', 'destination-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Drop any existing conflicting policies on these specific buckets
DROP POLICY IF EXISTS "Public Read Access blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access blogs-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access blogs-images" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access destinationdetails_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access destinationdetails_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access destinationdetails_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access destinationdetails_images" ON storage.objects;

DROP POLICY IF EXISTS "Public Read Access destination-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access destination-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access destination-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access destination-images" ON storage.objects;

-- 4. Create SELECT (Read) Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Read Access blogs-images" ON storage.objects 
  FOR SELECT TO public USING (bucket_id = 'blogs-images');

CREATE POLICY "Public Read Access destinationdetails_images" ON storage.objects 
  FOR SELECT TO public USING (bucket_id = 'destinationdetails_images');

CREATE POLICY "Public Read Access destination-images" ON storage.objects 
  FOR SELECT TO public USING (bucket_id = 'destination-images');

-- 5. Create INSERT (Upload) Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Insert Access blogs-images" ON storage.objects 
  FOR INSERT TO public WITH CHECK (bucket_id = 'blogs-images');

CREATE POLICY "Public Insert Access destinationdetails_images" ON storage.objects 
  FOR INSERT TO public WITH CHECK (bucket_id = 'destinationdetails_images');

CREATE POLICY "Public Insert Access destination-images" ON storage.objects 
  FOR INSERT TO public WITH CHECK (bucket_id = 'destination-images');

-- 6. Create UPDATE Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Update Access blogs-images" ON storage.objects 
  FOR UPDATE TO public USING (bucket_id = 'blogs-images');

CREATE POLICY "Public Update Access destinationdetails_images" ON storage.objects 
  FOR UPDATE TO public USING (bucket_id = 'destinationdetails_images');

CREATE POLICY "Public Update Access destination-images" ON storage.objects 
  FOR UPDATE TO public USING (bucket_id = 'destination-images');

-- 7. Create DELETE Policies (Public / Anon + Authenticated)
CREATE POLICY "Public Delete Access blogs-images" ON storage.objects 
  FOR DELETE TO public USING (bucket_id = 'blogs-images');

CREATE POLICY "Public Delete Access destinationdetails_images" ON storage.objects 
  FOR DELETE TO public USING (bucket_id = 'destinationdetails_images');

CREATE POLICY "Public Delete Access destination-images" ON storage.objects 
  FOR DELETE TO public USING (bucket_id = 'destination-images');
