-- Create flower products table
create table if not exists public.flower_products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.flower_products enable row level security;

-- Public can view active products
create policy "Flower products are viewable by everyone"
  on public.flower_products for select
  using (is_active = true);

-- Admins can do everything
create policy "Admins can manage flower products"
  on public.flower_products for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Create trigger for auto-updating updated_at
create trigger on_flower_product_update
  before update on public.flower_products
  for each row
  execute function public.handle_updated_at();

-- Insert default flower products
insert into public.flower_products (title, image_url, display_order) values
  ('Tangled Decorative Flower', '/featured-flower-1.jpg', 1),
  ('Purple & Blue Bouquet', '/featured-flower-2.jpg', 2),
  ('Pink & White Stems', '/featured-flower-3.jpg', 3),
  ('Golden Orange Daisy', '/featured-flower-4.jpg', 4),
  ('Pink & Magenta Orchids', '/featured-flower-5.jpg', 5),
  ('Blue Gerbera Bouquet', '/featured-flower-6.jpg', 6),
  ('Pink Lily Elegance', '/featured-pink-lily-bouquet.jpg', 7),
  ('Striped Pink Beauty', '/featured-pink-stripe-bouquet.jpg', 8),
  ('Folded Pink Masterpiece', '/featured-pink-fold-bouquet.jpg', 9)
on conflict do nothing;
