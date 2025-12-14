-- Create user_profiles table (extends auth.users)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_number text unique not null,
  total numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled')),
  pickup_location text not null check (pickup_location in ('Catacte', 'Plaridel', 'Baliuag')),
  quick_order_flag boolean default false,
  payment_method text default 'cash_on_pickup',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.orders enable row level security;

-- Users can view their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Users can create their own orders
create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Admins can view all orders
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can update all orders
create policy "Admins can update all orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create order_items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_type text not null check (product_type in ('flower', 'keychain', 'customization')),
  product_id uuid,
  product_code text,
  product_title text not null,
  product_image text,
  quantity integer not null default 1 check (quantity > 0),
  price_at_order numeric(10, 2) not null,
  customization text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.order_items enable row level security;

-- Users can view order items for their orders
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_items.order_id and user_id = auth.uid()
    )
  );

-- Users can create order items for their orders
create policy "Users can create own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_items.order_id and user_id = auth.uid()
    )
  );

-- Admins can view all order items
create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create chat_rooms table
create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  customer_id uuid not null references auth.users(id) on delete cascade,
  admin_id uuid references auth.users(id) on delete set null,
  room_type text not null default 'general' check (room_type in ('general', 'order')),
  last_message_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.chat_rooms enable row level security;

-- Users can view their own chat rooms
create policy "Users can view own chat rooms"
  on public.chat_rooms for select
  using (auth.uid() = customer_id);

-- Users can create their own chat rooms
create policy "Users can create own chat rooms"
  on public.chat_rooms for insert
  with check (auth.uid() = customer_id);

-- Admins can view all chat rooms
create policy "Admins can view all chat rooms"
  on public.chat_rooms for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can update all chat rooms
create policy "Admins can update all chat rooms"
  on public.chat_rooms for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create chat_messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  image_url text,
  read_status boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.chat_messages enable row level security;

-- Users can view messages in their chat rooms
create policy "Users can view own chat messages"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.chat_rooms
      where id = chat_messages.room_id and customer_id = auth.uid()
    )
  );

-- Users can create messages in their chat rooms
create policy "Users can create own chat messages"
  on public.chat_messages for insert
  with check (
    exists (
      select 1 from public.chat_rooms
      where id = chat_messages.room_id and customer_id = auth.uid()
    )
  );

-- Users can update read status of their messages
create policy "Users can update own chat messages"
  on public.chat_messages for update
  using (
    exists (
      select 1 from public.chat_rooms
      where id = chat_messages.room_id and customer_id = auth.uid()
    )
  );

-- Admins can view all messages
create policy "Admins can view all chat messages"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can create messages in any room
create policy "Admins can create chat messages"
  on public.chat_messages for insert
  with check (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can update read status
create policy "Admins can update chat messages"
  on public.chat_messages for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Enable real-time for chat_messages
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chat_rooms;
alter publication supabase_realtime add table public.orders;

-- Create function to generate order number
create or replace function generate_order_number()
returns text as $$
declare
  new_order_number text;
  order_count integer;
begin
  -- Get count of orders today
  select count(*) into order_count
  from public.orders
  where date(created_at) = current_date;
  
  -- Generate order number: LVN-YYYYMMDD-XXX
  new_order_number := 'LVN-' || to_char(current_date, 'YYYYMMDD') || '-' || lpad((order_count + 1)::text, 3, '0');
  
  return new_order_number;
end;
$$ language plpgsql;

-- Create trigger to auto-generate order number
create or replace function set_order_number()
returns trigger as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := generate_order_number();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_order_number_trigger
  before insert on public.orders
  for each row
  execute function set_order_number();

-- Create trigger to update updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at trigger to orders
create trigger on_order_update
  before update on public.orders
  for each row
  execute function handle_updated_at();

-- Add updated_at trigger to chat_rooms
create trigger on_chat_room_update
  before update on public.chat_rooms
  for each row
  execute function handle_updated_at();

-- Add updated_at trigger to user_profiles
create trigger on_user_profile_update
  before update on public.user_profiles
  for each row
  execute function handle_updated_at();

-- Create function to update chat_room last_message_at
create or replace function update_chat_room_last_message()
returns trigger as $$
begin
  update public.chat_rooms
  set last_message_at = now(),
      updated_at = now()
  where id = new.room_id;
  return new;
end;
$$ language plpgsql;

create trigger update_chat_room_last_message_trigger
  after insert on public.chat_messages
  for each row
  execute function update_chat_room_last_message();

-- Add price column to flower_products if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
    and table_name = 'flower_products'
    and column_name = 'price'
  ) then
    alter table public.flower_products add column price text;
  end if;
end $$;

-- Create index for better performance
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_chat_messages_room_id on public.chat_messages(room_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages(created_at);
create index if not exists idx_chat_rooms_customer_id on public.chat_rooms(customer_id);
create index if not exists idx_chat_rooms_order_id on public.chat_rooms(order_id);

