# Balaji Home Needs — PWA setup

This project now includes an installable Progressive Web App (PWA) while keeping the existing React + Vite storefront, Supabase integration, catalogue, cart, recipe assistant and admin dashboard.

## What was added

- `public/app/manifest.json` — app name, standalone display, app start URL and icon declarations.
- `public/app/index.html` — dedicated `/app/` launch URL, which opens the existing storefront in the installed app window.
- `public/app/icons/` — 192px and 512px standard and maskable icons.
- `public/service-worker.js` — app-shell caching and offline navigation fallback.
- `src/pwa.js` — service worker registration.
- `src/PWAInstallPrompt.jsx` and CSS — install prompt for supported browsers and install instructions for iPhone/iPad.
- Root `index.html` — PWA manifest, theme colour and Apple home-screen metadata.

## Local test

1. Run `npm install`.
2. Run `npm run dev` to test the website. Browser installation prompts generally require HTTPS or localhost.
3. Run `npm run build`.
4. Run `npm run preview` and open the local preview URL.
5. On Android Chrome, use the Install button or browser menu > Install app.
6. On iPhone/iPad Safari, tap Share > Add to Home Screen.

## Cloudflare Pages deployment

Deploy the updated project from GitHub using the existing Cloudflare Pages configuration. Keep the current build command (`npm run build`) and output directory (`dist`). No new paid service or Play Store account is required for PWA installation.

After deployment, open `https://balaji-home-needs.pages.dev/app/` once. The app should redirect to the existing storefront and can then be installed from the browser. The manifest uses `/app/` as its install start URL and `/` as its scope, so the complete existing site opens in standalone mode.

## Notes

- PWA installation requires HTTPS (Cloudflare Pages already provides HTTPS).
- Supabase authentication, database calls, WhatsApp links and geolocation still require an internet connection.
- The service worker caches the app shell and same-origin static assets. It does not cache Supabase API responses or customer/order data.
- After changing the service worker, increment `CACHE_NAME` in `public/service-worker.js` to force a fresh cache version.
