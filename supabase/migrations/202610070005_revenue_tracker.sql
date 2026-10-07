create table if not exists public.revenue_entries (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12,2) not null check (amount > 0),
  received_on date not null default current_date,
  description text,
  created_at timestamptz not null default now()
);

alter table public.revenue_entries enable row level security;
drop policy if exists "Admins manage revenue entries" on public.revenue_entries;
create policy "Admins manage revenue entries"
  on public.revenue_entries for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select, insert, update, delete on public.revenue_entries to authenticated;
