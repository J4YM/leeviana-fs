-- Create flower customization options table
create table if not exists public.flower_customization (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price text not null,
  image_url text not null,
  description text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.flower_customization enable row level security;

-- Public can view active products
create policy "Flower customization are viewable by everyone"
  on public.flower_customization for select
  using (is_active = true);

-- Admins can do everything
create policy "Admins can manage flower customization"
  on public.flower_customization for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Create trigger for auto-updating updated_at
create trigger on_flower_customization_update
  before update on public.flower_customization
  for each row
  execute function public.handle_updated_at();

-- Insert default customization options
insert into public.flower_customization (title, price, image_url, description, display_order) values
  ('Set A', '₱220', '/customize-set-a.jpg', 'Pink Guamamela, White Lily & Tulips with Pink Mini Flowers', 1),
  ('Set B', '₱190', '/customize-set-b.jpg', 'Pink Tulips, White Lily with White Mini Flowers', 2),
  ('Set C', '₱190', '/customize-set-c.jpg', 'Pink & Light Pink Lily with Blue Mini Flowers', 3),
  ('Set D', '₱190', '/customize-set-d.jpg', 'Yellow Lilies & Tulips with White Mini Flowers', 4),
  ('Set E', '₱230', '/customize-set-e.jpg', 'Pink Tulips, Daisy with Rolling Flow & Mini Flowers', 5),
  ('Set F', '₱220', '/customize-set-f.jpg', 'Pink Tulips, Pink Lily with Pink & White Mini Flowers', 6),
  ('Single Flower w/ Wrapped', '₱90 each', '/customize-single-flower.jpg', 'Mini or Lily Flower - Tulips, Lily, Tiger Lily', 7),
  ('Big Bouquet', '₱500', '/customize-big-bouquet.jpg', 'Heart, Rolling Flow, Tulips, Tiger Lily & Mini Flowers', 8)
on conflict do nothing;
