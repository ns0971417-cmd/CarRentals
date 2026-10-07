-- Complete the security and trigger setup after an interrupted initial schema run.
-- This migration is safe to re-run and does not reset business settings.

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end
$$;

create or replace function public.validate_booking_car()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.car_id is null or not exists (
    select 1 from public.cars
    where id = new.car_id and availability = true and status = 'active'
  ) then
    raise exception 'This vehicle is currently not available';
  end if;
  return new;
end
$$;

 drop trigger if exists cars_updated_at on public.cars;
create trigger cars_updated_at before update on public.cars
  for each row execute function public.set_updated_at();
drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
drop trigger if exists settings_updated_at on public.business_settings;
create trigger settings_updated_at before update on public.business_settings
  for each row execute function public.set_updated_at();
drop trigger if exists booking_requires_available_car on public.bookings;
create trigger booking_requires_available_car before insert or update of car_id on public.bookings
  for each row execute function public.validate_booking_car();

alter table public.admins enable row level security;
alter table public.cars enable row level security;
alter table public.car_images enable row level security;
alter table public.bookings enable row level security;
alter table public.business_settings enable row level security;

drop policy if exists "Admins can read their own membership" on public.admins;
create policy "Admins can read their own membership" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Public can read active cars" on public.cars;
create policy "Public can read active cars" on public.cars
  for select to anon, authenticated using (status = 'active');
drop policy if exists "Admins manage cars" on public.cars;
create policy "Admins manage cars" on public.cars
  for all to authenticated using ((select public.is_admin()))
  with check ((select public.is_admin()));
drop policy if exists "Public can read car images" on public.car_images;
create policy "Public can read car images" on public.car_images
  for select to anon, authenticated using (
    exists (select 1 from public.cars c where c.id = car_id and c.status = 'active')
  );
drop policy if exists "Admins manage car images" on public.car_images;
create policy "Admins manage car images" on public.car_images
  for all to authenticated using ((select public.is_admin()))
  with check ((select public.is_admin()));
drop policy if exists "Customers can submit pending requests for available cars" on public.bookings;
create policy "Customers can submit pending requests for available cars" on public.bookings
  for insert to anon, authenticated with check (
    status = 'pending' and exists (
      select 1 from public.cars c
      where c.id = car_id and c.availability and c.status = 'active'
    )
  );
drop policy if exists "Admins can manage rental requests" on public.bookings;
create policy "Admins can manage rental requests" on public.bookings
  for all to authenticated using ((select public.is_admin()))
  with check ((select public.is_admin()));
drop policy if exists "Public can read business settings" on public.business_settings;
create policy "Public can read business settings" on public.business_settings
  for select to anon, authenticated using (true);
drop policy if exists "Admins manage business settings" on public.business_settings;
create policy "Admins manage business settings" on public.business_settings
  for all to authenticated using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.cars, public.car_images, public.business_settings to anon, authenticated;
grant insert, update, delete on public.cars, public.car_images, public.business_settings to authenticated;
grant insert on public.bookings to anon, authenticated;
grant select, update, delete on public.bookings to authenticated;
grant select on public.admins to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('car-images','car-images',true,10485760,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view business and car images" on storage.objects;
create policy "Anyone can view business and car images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'car-images');
drop policy if exists "Admins upload images" on storage.objects;
create policy "Admins upload images" on storage.objects
  for insert to authenticated with check (bucket_id = 'car-images' and (select public.is_admin()));
drop policy if exists "Admins update images" on storage.objects;
create policy "Admins update images" on storage.objects
  for update to authenticated using (bucket_id = 'car-images' and (select public.is_admin()))
  with check (bucket_id = 'car-images' and (select public.is_admin()));
drop policy if exists "Admins delete images" on storage.objects;
create policy "Admins delete images" on storage.objects
  for delete to authenticated using (bucket_id = 'car-images' and (select public.is_admin()));
