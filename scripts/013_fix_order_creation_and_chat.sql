-- Ensure orders can be created by authenticated users
-- The existing policy should work, but let's verify and add a fallback

-- Make sure users can insert orders (this should already exist, but verify)
-- If the policy doesn't exist, create it
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
    and tablename = 'orders'
    and policyname = 'Users can create own orders'
  ) then
    create policy "Users can create own orders"
      on public.orders for insert
      with check (auth.uid() = user_id);
  end if;
end $$;

-- Ensure order_items can be created
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
    and tablename = 'order_items'
    and policyname = 'Users can create own order items'
  ) then
    create policy "Users can create own order items"
      on public.order_items for insert
      with check (
        exists (
          select 1 from public.orders
          where id = order_items.order_id and user_id = auth.uid()
        )
      );
  end if;
end $$;

-- Ensure chat_rooms can be created by users
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
    and tablename = 'chat_rooms'
    and policyname = 'Users can create own chat rooms'
  ) then
    create policy "Users can create own chat rooms"
      on public.chat_rooms for insert
      with check (auth.uid() = customer_id);
  end if;
end $$;

-- Ensure chat_messages can be created by users in their rooms
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
    and tablename = 'chat_messages'
    and policyname = 'Users can create own chat messages'
  ) then
    create policy "Users can create own chat messages"
      on public.chat_messages for insert
      with check (
        exists (
          select 1 from public.chat_rooms
          where id = chat_messages.room_id and customer_id = auth.uid()
        )
      );
  end if;
end $$;

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;

