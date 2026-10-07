# Client demo

This demo mode is isolated from Supabase. It includes clearly labeled sample cars and rental requests, a one-click admin preview at `/admin`, and local browser storage for edits. Demo submissions never reach the business. Car and logo image uploads require the real Supabase setup.

## Preview locally

```sh
npm install
npm run dev:demo
```

Open the Vite URL and go to `/admin`, then choose **Enter demo admin**. The **Reset demo** control clears browser changes and restores the sample data.

## Build and publish a demo

Run `npm run build:demo`; the deployable site is in `dist`. For Vercel, import this repository and use:

- Build command: `npm run build:demo`
- Output directory: `dist`
- Environment variables: none required

`vercel.json` enables client-side route fallback. Do not configure Supabase variables on the demo deployment. After the client accepts, deploy the production site with the regular `npm run build` command and the Supabase URL and publishable key configured in the hosting project.
