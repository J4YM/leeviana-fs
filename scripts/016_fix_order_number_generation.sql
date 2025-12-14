-- Fix order number generation to prevent duplicates
-- Use a sequence for guaranteed uniqueness

-- Drop existing function
drop function if exists generate_order_number();

-- Create sequence for order numbers
create sequence if not exists order_number_seq;

-- Create improved order number generation function
create or replace function generate_order_number()
returns text as $$
declare
  new_order_number text;
  order_count integer;
  sequence_num integer;
begin
  -- Get sequence number (guaranteed unique)
  sequence_num := nextval('order_number_seq');
  
  -- Get count of orders today (for reference, but use sequence for uniqueness)
  select count(*) into order_count
  from public.orders
  where date(created_at) = current_date;
  
  -- Generate order number: LVN-YYYYMMDD-XXX (XXX from sequence, padded)
  new_order_number := 'LVN-' || to_char(current_date, 'YYYYMMDD') || '-' || lpad(sequence_num::text, 4, '0');
  
  -- Ensure uniqueness by checking if it exists (shouldn't happen with sequence, but safety check)
  while exists (select 1 from public.orders where order_number = new_order_number) loop
    sequence_num := nextval('order_number_seq');
    new_order_number := 'LVN-' || to_char(current_date, 'YYYYMMDD') || '-' || lpad(sequence_num::text, 4, '0');
  end loop;
  
  return new_order_number;
end;
$$ language plpgsql;

-- Reset sequence to start after existing orders (optional, for clean numbering)
-- Uncomment if you want sequential numbering from now on:
-- select setval('order_number_seq', (select coalesce(max(cast(substring(order_number from 'LVN-\d{8}-(\d+)') as integer)), 0) from public.orders));

