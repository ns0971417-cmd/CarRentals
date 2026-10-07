alter table public.cars
  add column if not exists vehicle_type text not null default 'car';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.cars'::regclass
      and conname = 'cars_vehicle_type_check'
  ) then
    alter table public.cars
      add constraint cars_vehicle_type_check check (vehicle_type in ('car', 'bike'));
  end if;
end $$;
