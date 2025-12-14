-- Fix infinite recursion in RLS policies by creating a security definer function
-- This function bypasses RLS to check admin status

create or replace function public.is_admin(user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.user_profiles
    where id = user_id and is_admin = true
  );
end;
$$;

-- Drop existing admin policies that cause recursion
drop policy if exists "Admins can view all profiles" on public.user_profiles;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Admins can update all orders" on public.orders;
drop policy if exists "Admins can view all order items" on public.order_items;
drop policy if exists "Admins can view all chat rooms" on public.chat_rooms;
drop policy if exists "Admins can update all chat rooms" on public.chat_rooms;
drop policy if exists "Admins can view all chat messages" on public.chat_messages;
drop policy if exists "Admins can create chat messages" on public.chat_messages;
drop policy if exists "Admins can update chat messages" on public.chat_messages;

-- Recreate admin policies using the function (no recursion)
create policy "Admins can view all profiles"
  on public.user_profiles for select
  using (public.is_admin(auth.uid()));

create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin(auth.uid()));

create policy "Admins can update all orders"
  on public.orders for update
  using (public.is_admin(auth.uid()));

create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin(auth.uid()));

create policy "Admins can view all chat rooms"
  on public.chat_rooms for select
  using (public.is_admin(auth.uid()));

create policy "Admins can update all chat rooms"
  on public.chat_rooms for update
  using (public.is_admin(auth.uid()));

create policy "Admins can view all chat messages"
  on public.chat_messages for select
  using (public.is_admin(auth.uid()));

create policy "Admins can create chat messages"
  on public.chat_messages for insert
  with check (public.is_admin(auth.uid()));

create policy "Admins can update chat messages"
  on public.chat_messages for update
  using (public.is_admin(auth.uid()));

-- Grant execute permission to authenticated users
grant execute on function public.is_admin(uuid) to authenticated;

