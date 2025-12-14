-- Add price column to flower_products table
alter table public.flower_products 
add column if not exists price text;

-- Update existing products with default prices (you can customize these)
update public.flower_products set price = '₱299' where price is null;
