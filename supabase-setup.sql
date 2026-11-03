-- BALAJI HOME NEEDS: run this entire script in Supabase SQL Editor.
create table if not exists public.orders (
  id text primary key,
  payload jsonb not null,
  status text not null default 'Order Received',
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.products enable row level security;

-- Anyone can submit an order request, but customers cannot read orders.
drop policy if exists "Public can submit order requests" on public.orders;
create policy "Public can submit order requests" on public.orders
for insert to anon, authenticated with check (is_deleted = false);

-- Only the configured admin email can read/change orders.
drop policy if exists "Admin can read orders" on public.orders;
create policy "Admin can read orders" on public.orders
for select to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = 'vijay.ca444@gmail.com');
drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders" on public.orders
for update to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = 'vijay.ca444@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email','')) = 'vijay.ca444@gmail.com');

-- Product catalogue is public to read; only admin can add/edit/delete.
drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products" on public.products
for select to anon, authenticated using (true);
drop policy if exists "Admin can manage products" on public.products;
create policy "Admin can manage products" on public.products
for all to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = 'vijay.ca444@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email','')) = 'vijay.ca444@gmail.com');

-- Restrict exposed tables to the API roles.
grant select on public.products to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;
grant insert, update, delete on public.products to authenticated;
