-- Maps URL supplied by the business owner. Preserve any URL an admin already set.
update public.business_settings
set maps_url = 'https://maps.app.goo.gl/UzzX13CnHZfioN7a8'
where maps_url is null or maps_url = '';
