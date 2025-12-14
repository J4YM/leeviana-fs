-- Ensure users only have one general chat room
-- This script removes duplicate general chat rooms, keeping only the most recent one per user

-- Delete duplicate general chat rooms, keeping the most recent one
delete from public.chat_rooms
where id in (
  select id
  from (
    select id,
           row_number() over (partition by customer_id order by created_at desc) as rn
    from public.chat_rooms
    where room_type = 'general'
  ) t
  where rn > 1
);

-- Create unique constraint to prevent duplicate general rooms per user
-- First, drop existing constraint if it exists
alter table public.chat_rooms
drop constraint if exists unique_user_general_room;

-- Add unique constraint: one general room per customer
create unique index if not exists unique_user_general_room
on public.chat_rooms (customer_id)
where room_type = 'general';

-- Also ensure admin users don't have chat rooms created for them
-- Delete any chat rooms where customer is an admin
delete from public.chat_rooms
where customer_id in (
  select id from public.user_profiles where is_admin = true
);

