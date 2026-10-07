-- Safe to run after a partial or repeated schema setup.
drop trigger if exists cars_updated_at on public.cars;
create trigger cars_updated_at
  before update on public.cars
  for each row execute function public.set_updated_at();

drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

drop trigger if exists settings_updated_at on public.business_settings;
create trigger settings_updated_at
  before update on public.business_settings
  for each row execute function public.set_updated_at();

drop trigger if exists booking_requires_available_car on public.bookings;
create trigger booking_requires_available_car
  before insert or update of car_id on public.bookings
  for each row execute function public.validate_booking_car();
