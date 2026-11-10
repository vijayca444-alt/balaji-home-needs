-- BALAJI HOME NEEDS: free customer email/password accounts + private order history.
-- Run this once in Supabase Dashboard > SQL Editor after the existing supabase-setup.sql.

-- Attach each signed-in customer's orders to their Supabase Auth user.
alter table public.orders
  add column if not exists customer_id uuid references auth.users(id) on delete set null;

-- Customer profile data (name, phone, saved delivery address).
create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  address text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.customer_profiles enable row level security;

-- Customers can only view and edit their own profile.
drop policy if exists "Customers can view own profile" on public.customer_profiles;
create policy "Customers can view own profile"
  on public.customer_profiles for select to authenticated
  using (id = auth.uid());

drop policy if exists "Customers can create own profile" on public.customer_profiles;
create policy "Customers can create own profile"
  on public.customer_profiles for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "Customers can update own profile" on public.customer_profiles;
create policy "Customers can update own profile"
  on public.customer_profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

grant select, insert, update on public.customer_profiles to authenticated;

-- Replace the public order insert policy so anonymous guests may submit without an account,
-- while signed-in customers may only submit orders assigned to their own user ID.
drop policy if exists "Public can submit order requests" on public.orders;
create policy "Public can submit order requests"
  on public.orders for insert to anon, authenticated
  with check (
    is_deleted = false
    and (
      (auth.uid() is null and customer_id is null)
      or (auth.uid() is not null and customer_id = auth.uid())
    )
  );

-- Customers can read only their own orders. Existing admin-read policy remains in place.
drop policy if exists "Customers can read own orders" on public.orders;
create policy "Customers can read own orders"
  on public.orders for select to authenticated
  using (customer_id = auth.uid());

grant select on public.orders to authenticated;
grant insert on public.orders to anon, authenticated;

-- Important: keep the existing admin-only update policy. Customers cannot update order status or prices.
