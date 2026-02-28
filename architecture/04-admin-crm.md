# Architecture 04 — Admin CRM & Auth

## Goal
Provide a secure dashboard for the store owner to view orders, update product catalogs, and trigger fulfillment actions like generating TTNs.

## Core Flow
1. **Authentication:**
   - Protected via Supabase Auth (Email/Password).
   - Only Specific admin emails (or accounts with a specific `role` claim in Supabase profiles) should access the CRM.
   - **Protection:** A Next.js Middleware (`middleware.ts`) must intercept all requests to `/admin/*`. If the user has no valid session token (in standard Supabase auth cookies), redirect to `/admin/login`.
2. **SEO Prevention:**
   - `app/admin/layout.tsx` must inject `<meta name="robots" content="noindex, nofollow" />`.
   - `/robots.txt` must `Disallow: /admin`.
3. **Dashboard (`/admin/page.tsx`):**
   - Displays KPIs: Monthly revenue, open orders, successful payments today.
   - Simple, read-heavy queries.
4. **Orders Management (`/admin/orders`):**
   - Live view of incoming `orders` (polling or Supabase Realtime).
   - Displays payment statuses.
   - Action buttons: "Generate TTN" (calls out to Architecture 03), "Mark Delivered".
5. **Product Management (`/admin/products`):**
   - CRUD for the products table.
   - Image uploads utilize the Supabase JS client to upload directly to Supabase Storage, then save the returned public URL to the `image_url` field in Postgres.

## Edge Cases & Error Handling
- **Image Deletion:** When a product is deleted, consider deleting the associated image from Supabase Storage to avoid bloat (or keep for history).
- **Session Expiry:** Supabase auth cookies expire. Ensure the UI gracefully redirects to login rather than crashing API calls.

## Required Config
- Supabase Project URL and Anon/Service Keys (already set for Phase 2).
