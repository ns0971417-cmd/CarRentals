# NS Cars and Rentals

Responsive car rental website and management panel built with React, TypeScript, Vite, Tailwind CSS, React Router, Lucide and Supabase.

## Setup

1. Create a Supabase project and copy `.env.example` to `.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the project publishable/anon key).
3. Apply every SQL file in `supabase/migrations/` in filename order. This creates the schema, applies the verified business details, and adds the revenue tracker table.
4. In Supabase Authentication, create an admin user. Then add that user to the protected admin allowlist from the SQL editor:

   ```sql
   insert into public.admins (user_id, name, email)
   select id, 'Admin', email from auth.users where email = 'YOUR_ADMIN_EMAIL';
   ```

5. Install dependencies and run `npm run dev`.

The migrations include the supplied business name, Guntur location, Maps link, and owner phone. Other contact details remain blank until an admin fills them in. Cars are not seeded in the live database; add them in the admin panel. Never put a Supabase service role key in the frontend environment.

For a client preview without Supabase, use `npm run dev:demo` or build with `npm run build:demo`. Demo changes are stored only in that browser. See [DEMO.md](./DEMO.md) for publishing instructions.

## Admin access

Open `/admin`, sign in with the Supabase Auth account, and ensure its user ID has an entry in `public.admins`. Authenticated accounts without that allowlist entry cannot access the dashboard or mutate protected data.

## Deployment

Build with `npm run build`; serve the `dist` directory with SPA fallback routing enabled. Set the same two public Supabase variables in the deployment environment. Supabase RLS and storage policies are defined in the migration. The public site subscribes to car, image and business setting changes using Supabase Realtime.
