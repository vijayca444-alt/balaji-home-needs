-- Balaji Home Needs customer accounts: username + email + password, no email confirmation.
-- Run AFTER supabase-setup.sql in Supabase Dashboard > SQL Editor.

alter table public.orders
  add column if not exists customer_id uuid references auth.users(id) on delete set null;

create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  username text,
  phone text not null default '',
  address text not null default '',
  must_change_password boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.customer_profiles add column if not exists username text;
alter table public.customer_profiles add column if not exists must_change_password boolean not null default false;
create unique index if not exists customer_profiles_username_lower_uidx
  on public.customer_profiles (lower(username)) where username is not null and username <> '';

alter table public.customer_profiles enable row level security;

drop policy if exists "Customers can view own profile" on public.customer_profiles;
create policy "Customers can view own profile" on public.customer_profiles
  for select to authenticated using (id = auth.uid());
drop policy if exists "Customers can create own profile" on public.customer_profiles;
create policy "Customers can create own profile" on public.customer_profiles
  for insert to authenticated with check (id = auth.uid());
drop policy if exists "Customers can update own profile" on public.customer_profiles;
create policy "Customers can update own profile" on public.customer_profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- Customer account listing and password resets are performed by a protected
-- Supabase Edge Function after verifying the configured store-admin email.
-- Do not add a public/admin browser policy that exposes customer profile records.

grant select, insert, update on public.customer_profiles to authenticated;

-- Public guest orders remain allowed. Signed-in customer orders are tied to their own user ID.
drop policy if exists "Public can submit order requests" on public.orders;
create policy "Public can submit order requests" on public.orders
  for insert to anon, authenticated
  with check (
    is_deleted = false and (
      (auth.uid() is null and customer_id is null)
      or (auth.uid() is not null and customer_id = auth.uid())
    )
  );
drop policy if exists "Customers can read own orders" on public.orders;
create policy "Customers can read own orders" on public.orders
  for select to authenticated using (customer_id = auth.uid());
grant select on public.orders to authenticated;
grant insert on public.orders to anon, authenticated;

-- Keep the existing admin-only order update policy from supabase-setup.sql.
