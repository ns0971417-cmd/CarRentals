-- Owner contact number supplied by the business owner.
update public.business_settings
set phone = '85002 18518'
where phone is null or phone = '';
