# B.L.A.S.T. Task Plan

## Project: touchmemories3
**Initialized:** 2026-02-27

---

## 🟢 Protocol 0: Initialization
- [x] Create `task_plan.md`
- [x] Create `findings.md`
- [x] Create `progress.md`
- [x] Initialize `gemini.md` (Project Constitution)
- [x] Receive answers to 5 Discovery Questions
- [x] Define JSON Data Schema in `gemini.md`
- [x] Get Blueprint approved → unlock Phase 2

---

## ⚡ Phase 2: L — Link (Connectivity)
- [/] Populate `.env.local` with all API keys ← **USER ACTION REQUIRED**
- [x] `tools/verify_supabase.py` — created
- [x] `tools/verify_monobank.py` — created
- [x] `tools/verify_checkbox.py` — created
- [x] `tools/verify_nova_poshta.py` — created
- [ ] Run all 4 scripts — all must pass → proceed to Phase 3

---

## ⚙️ Phase 3: A — Architect (3-Layer Build)

### Layer 1: Architecture SOPs
- [x] `architecture/01-payment-flow.md`
- [x] `architecture/02-fiscalization.md`
- [x] `architecture/03-nova-poshta.md`
- [x] `architecture/04-admin-crm.md`

### Layer 2: Next.js Project Bootstrap
- [x] Init Next.js 14 App Router + TypeScript
- [x] Configure `next.config.ts` (ISR, image domains)
- [x] Set up `.gitignore`, `.env.local` template

### Layer 3: Database & Library Layer
- [x] `supabase/migrations/001_initial_schema.sql`
- [x] `lib/supabase.ts`
- [x] `lib/monobank.ts`
- [x] `lib/checkbox.ts`
- [x] `lib/nova-poshta.ts`

### API Routes
- [x] `app/api/checkout/route.ts`
- [x] `app/api/webhooks/monobank/route.ts`
- [x] `app/api/nova-poshta/cities/route.ts`
- [x] `app/api/nova-poshta/warehouses/route.ts`
- [x] `app/api/admin/ttn/route.ts`

---

## 🎨 Phase 4: S — Stylize (UI Build)

### Public Pages
- [x] Global Layout & `components/Header.tsx`
- [x] Homepage (`app/page.tsx`) (Hero + Featured)
- [x] Catalog Page (`app/catalog/page.tsx`)
- [x] Product Page (`app/products/[slug]/page.tsx`)
- [x] Cart Page (`app/cart/page.tsx`)
- [x] Checkout Page (`app/checkout/page.tsx`)

### Admin Panel (`/admin`)
- [x] Protect routes with Supabase Auth Middleware
- [x] Dashboard (`app/admin/page.tsx`)
- [x] Orders CRM (`app/admin/orders/page.tsx`)
- [x] Products Manager (`app/admin/products/page.tsx`)

### Shared Components
- [ ] Header, Footer
- [ ] ProductCard
- [ ] NovaPoshtaPicker (city + warehouse autocomplete)

---

## 🛰️ Phase 5: T — Trigger (Deployment)
- [ ] Deploy to Vercel (`vercel --prod`)
- [ ] Set all env vars in Vercel dashboard
- [ ] Live payment test (Monobank test card)
- [ ] Verify fiscal receipt arrives ≤30s
- [ ] Finalize `gemini.md` Maintenance Log

---

## 🚦 Status
**Current Phase:** Phase 2 — Link (USER must fill `.env.local` then run verify scripts)
