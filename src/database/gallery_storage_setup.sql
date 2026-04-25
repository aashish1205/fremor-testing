-- Create the instagram-gallery bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('instagram-gallery', 'instagram-gallery', true)
on conflict (id) do nothing;

-- Set up storage policies for the instagram-gallery bucket

-- Allow public read access to the bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'instagram-gallery' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'instagram-gallery' and auth.role() = 'authenticated' );

-- Allow authenticated users to update their files
create policy "Authenticated users can update"
on storage.objects for update
using ( bucket_id = 'instagram-gallery' and auth.role() = 'authenticated' );

-- Allow authenticated users to delete files
create policy "Authenticated users can delete"
on storage.objects for delete
using ( bucket_id = 'instagram-gallery' and auth.role() = 'authenticated' );
