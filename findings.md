# Findings Log

## Project: touchmemories3
**Initialized:** 2026-02-27

---

## 🔍 Research & Discoveries

### 2026-02-27 — Monobank Acquiring API
- Monobank Acquiring uses a webhook-based payment flow: merchant creates an invoice, user pays, Monobank POSTs result to webhook URL
- Webhook payload contains `reference` field — use this to link back to `order_id` in Supabase
- Must verify webhook signature using `X-Sign` header to prevent fraud
- Invoice creation endpoint: `POST https://api.monobank.ua/api/merchant/invoice/create`
- Webhook must respond with HTTP 200 within 10s or Monobank will retry
- **Key constraint:** Payment amounts are in _kopiiky_ (hundredths of UAH), integers only
- Docs: https://api.monobank.ua/docs/acquiring.html

### 2026-02-27 — Checkbox ПРРО API
- Checkbox is a Ukrainian fiscalization SaaS registered with the tax authority (ДПС)
- Flow: create a shift → create a receipt → receipt gets a fiscal number → send receipt URL to customer
- SLA requirement: receipt must be issued ≤30s after payment confirmation
- Receipt must include: product name, quantity, price, VAT (PDV 20%), total
- Amounts also in kopiiky (integer cents)
- Auth: Bearer token obtained by logging in with cashier credentials
- **Key constraint:** Shift must be open before receipts can be created; implement shift auto-open logic
- Docs: https://dev.checkbox.ua/

### 2026-02-27 — Nova Poshta API
- Nova Poshta has a JSON-RPC style API (all calls POST to single endpoint)
- TTN (ТТН) creation: `Waybills.save` model
- City/warehouse search: `Address.getCities`, `Address.getWarehouses`
- TTN tracking: `TrackingDocument.getStatusDocuments`
- Sender details must be pre-configured in Nova Poshta merchant account
- **Key constraint:** Nova Poshta API key is for a specific sender counterparty ref
- Docs: https://developers.novaposhta.ua/

### 2026-02-27 — Supabase
- Use Supabase JS client (`@supabase/supabase-js`) in Next.js
- Service Role key (server-side only, in API routes) vs Anon key (client-side, respects RLS)
- Supabase Storage: use for product images, max file size configurable in project settings
- RLS (Row Level Security) must be configured for all public-facing tables
- **Key constraint:** Never expose Service Role key to client-side code

### 2026-02-27 — Next.js + Vercel
- Use Next.js 14+ App Router for SSR/ISR on product pages
- `generateStaticParams` + `revalidate` for ISR on product catalog
- Vercel Edge Functions for webhook routes (fast cold start)
- Environment variables set in Vercel dashboard for production
- Admin routes: use Next.js middleware to protect `/admin/*` with auth check
- `robots.txt` to disallow `/admin` from crawlers

---

## ⚠️ Constraints & Limitations

| Constraint | Source | Impact |
|-----------|--------|--------|
| Monobank kopiiky integers | Monobank API | All prices stored as integers (kopiiky) |
| Checkbox shift must be open | Checkbox API | Need shift management logic |
| Webhook signature verification | Monobank | Required for security |
| Supabase Service key server-only | Supabase | Client uses Anon key + RLS |
| Nova Poshta sender ref required | Nova Poshta | Merchant account pre-config needed |
| Fiscal receipt SLA: ≤30s | Business rule | Async trigger immediately on webhook |

---

## 📌 Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Next.js App Router over Pages Router | SSR/ISR, best-in-class DX, Vercel native | 2026-02-27 |
| Supabase over custom DB | Managed Postgres + Storage + Auth in one | 2026-02-27 |
| Amounts stored as kopiiky integers | Avoids floating point errors in payments | 2026-02-27 |
| Resend for transactional email | Simple API, generous free tier, Ukrainian-friendly | 2026-02-27 |
