-- Step 1: Add avatar_url column to user_profiles
alter table public.user_profiles
add column if not exists avatar_url text;

-- Step 2: Create a public storage bucket for profile images
-- Run this in Supabase SQL Editor OR do it via the Storage UI
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- Step 3: Allow authenticated users to upload to their own folder
create policy "Users can upload their own avatar" on storage.objects
for insert with check (
    bucket_id = 'profile-images'
    and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own avatar" on storage.objects
for update using (
    bucket_id = 'profile-images'
    and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own avatar" on storage.objects
for delete using (
    bucket_id = 'profile-images'
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- Step 4: Make profile images publicly readable
create policy "Profile images are publicly viewable" on storage.objects
for select using (bucket_id = 'profile-images');
