-- Create storage bucket for chat images
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

-- Set up storage policies for chat-images bucket
-- Allow authenticated users to upload
create policy "Users can upload chat images"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-images' and
    auth.role() = 'authenticated'
  );

-- Allow public to view images
create policy "Public can view chat images"
  on storage.objects for select
  using (bucket_id = 'chat-images');

-- Allow users to delete their own images
create policy "Users can delete own chat images"
  on storage.objects for delete
  using (
    bucket_id = 'chat-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

