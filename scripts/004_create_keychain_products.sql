-- Create keychain products table
create table if not exists public.keychain_products (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  title text not null,
  image_url text not null,
  price text not null,
  description text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.keychain_products enable row level security;

-- Public can view active products
create policy "Keychain products are viewable by everyone"
  on public.keychain_products for select
  using (is_active = true);

-- Admins can do everything
create policy "Admins can manage keychain products"
  on public.keychain_products for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Create trigger for auto-updating updated_at
create trigger on_keychain_product_update
  before update on public.keychain_products
  for each row
  execute function public.handle_updated_at();

-- Insert default keychain products
insert into public.keychain_products (code, title, image_url, price, description, display_order) values
  ('A4', 'Ribbon Keychain', '/keychain-code-a4.jpg', '₱15', 'Good for group of friends', 1),
  ('A5', 'Flower Keychain Trio', '/keychain-code-a5.jpg', '₱45', 'Good for trio bestie (5 pcs available only)', 2),
  ('A3', 'Ice Pop Keychain', '/keychain-code-a3.jpg', '₱15', 'Available colors: Violet, Orange, Pink, Blue', 3),
  ('A1', 'Family Keychain', '/keychain-code-a1.jpg', '₱3 for 89', 'Good for trio bestie', 4),
  ('A8', 'Mini Flower Bouquet', '/keychain-code-a8.jpg', '₱50', 'Tulips & flowers (Pink/Blue/Violet)', 5),
  ('A2', 'Tulips Keychain', '/keychain-code-a2.jpg', '₱25', 'Available: Pink, Blue, Yellow', 6),
  ('A6', 'Small Flower Keychain', '/keychain-code-a6.jpg', '₱10', 'Good for group of friends', 7),
  ('Custom', 'Customize Flower', '/keychain-customize-flowers.jpg', '₱99-110', 'Black ₱99, Blue ₱99, Yellow ₱110', 8),
  ('A9', 'Cherry Keychain', '/keychain-code-a9.jpg', '₱15', 'Cute cherry pair charm', 9),
  ('A7', 'Mini Keychain', '/keychain-code-a7.jpg', '₱15', 'Available: Orange, Blue, Pink', 10)
on conflict do nothing;
