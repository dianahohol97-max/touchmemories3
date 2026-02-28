# gemini.md — Project Constitution

## Project: touchmemories3
**Initialized:** 2026-02-27
**Status:** 🟡 BLUEPRINT — Schema Confirmed. Awaiting Blueprint Approval.

> ⚠️ This file is LAW. No code in `tools/` or `app/` may contradict what is defined here.
> Only update when: (1) a schema changes, (2) a rule is added, (3) architecture is modified.

---

## 1. North Star

> A complete Ukrainian e-commerce website for selling photo books and photo products.
> Customers browse the catalog, customize orders, pay online, and receive a fiscal receipt automatically.
> The owner manages everything through an admin panel and CRM.

---

## 2. Data Schema

> ⚠️ Coding does not begin until this section is confirmed by the user.

### 2.1 Input Payloads

#### 2.1.a — Customer Checkout Order (→ Supabase `orders` table)
```json
{
  "order_id": "uuid",
  "customer": {
    "name": "string",
    "email": "string",
    "phone": "+380XXXXXXXXX"
  },
  "delivery": {
    "method": "nova_poshta | self_pickup",
    "city": "string",
    "warehouse_ref": "string",
    "warehouse_label": "string"
  },
  "items": [
    {
      "product_id": "uuid",
      "product_name": "string",
      "quantity": 1,
      "unit_price_uah": 129900,
      "customization": {}
    }
  ],
  "total_amount_uah": 129900,
  "status": "pending | paid | processing | shipped | delivered | cancelled"
}
```

#### 2.1.b — Monobank Acquiring Webhook (incoming after payment)
```json
{
  "invoiceId": "string",
  "status": "success | failure | processing",
  "amount": 129900,
  "ccy": 980,
  "finalAmount": 129900,
  "createdDate": 1677519600,
  "modifiedDate": 1677519605,
  "reference": "order_uuid"
}
```

---

### 2.2 Output Payloads

#### 2.2.a — Checkbox Fiscal Receipt (auto-generated ≤30s after Monobank confirms payment)
```json
{
  "receipt_id": "uuid",
  "fiscal_number": "string",
  "order_id": "uuid",
  "amount_uah": 129900,
  "tax_percent": 20,
  "sent_to_email": "string",
  "checkbox_receipt_url": "https://...",
  "created_at": "ISO8601"
}
```

#### 2.2.b — Nova Poshta TTN (created by admin when order is dispatched)
```json
{
  "ttn_number": "string",
  "order_id": "uuid",
  "recipient_name": "string",
  "recipient_phone": "+380XXXXXXXXX",
  "city_ref": "string",
  "warehouse_ref": "string",
  "weight_kg": 0.5,
  "declared_value_uah": 129900,
  "created_at": "ISO8601"
}
```

---

## 3. Integrations

| Service | Purpose | Auth Method | Status |
|---------|---------|-------------|--------|
| Monobank Acquiring | Online payments | Token in `.env` | 🔴 Unverified |
| Checkbox ПРРО | Auto fiscal receipt | Login + token in `.env` | 🔴 Unverified |
| Nova Poshta | Delivery tracking + TTN creation | API Key in `.env` | 🔴 Unverified |
| Supabase | PostgreSQL DB + File Storage | URL + Anon/Service keys in `.env` | 🔴 Unverified |
| Vercel | Hosting + Edge Functions | CLI deploy | 🔴 Unverified |
| SMTP/Resend | Transactional email (receipt, confirm) | API Key in `.env` | 🔴 Unverified |

---

## 4. Behavioral Rules

- **Language:** Ukrainian UI, English code and comments
- **Currency:** All prices in UAH (kopiiky as integers, e.g. 129900 = 1299.00 ₴)
- **Design:** Mobile-first responsive; premium aesthetic
- **SEO:** Next.js SSR/ISR for all public product and catalog pages
- **Admin Panel:** Route `/admin/*` must include `<meta name="robots" content="noindex">` and be protected by auth
- **Fiscal Receipt SLA:** Checkbox receipt generated **within 30 seconds** of Monobank `status: success` webhook
- **Do Not Rules:**
  - Never hardcode API keys or secrets
  - Never store payment card data locally
  - Never run Checkbox fiscalization before payment is confirmed (`status !== "success"`)
  - Never expose admin routes in the public sitemap

---

## 5. Architectural Invariants

1. LLM reasoning ≠ business logic. All deterministic logic lives in API route handlers or `tools/` Python scripts.
2. All intermediate files (logs, exports) go in `.tmp/`. Never commit `.tmp/`.
3. Secrets live exclusively in `.env` / `.env.local`. Never hardcode credentials.
4. If logic changes → update `architecture/` SOP first → then update code.
5. A project is only "Complete" when the payload reaches its final cloud destination (Vercel + Supabase production).
6. Payments flow: Monobank webhook → Next.js API route → Supabase order update → Checkbox trigger → email.

---

## 6. File Structure

```
touchmemories3/
├── gemini.md                   # Project Constitution (this file)
├── task_plan.md                # Phases & checklists
├── findings.md                 # Research & discoveries
├── progress.md                 # Session log & errors
├── .env.local                  # API Keys/Secrets (never committed)
├── .gitignore
├── architecture/               # Layer 1: SOPs
│   ├── 01-payment-flow.md
│   ├── 02-fiscalization.md
│   ├── 03-nova-poshta.md
│   └── 04-admin-crm.md
├── app/                        # Next.js App Router
│   ├── (public)/               # Public-facing pages
│   │   ├── page.tsx            # Homepage
│   │   ├── catalog/
│   │   ├── products/[slug]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── order/[id]/         # Order tracking
│   ├── admin/                  # Protected admin panel
│   │   ├── layout.tsx          # noindex + auth guard
│   │   ├── page.tsx            # Dashboard
│   │   ├── orders/
│   │   └── products/
│   └── api/                    # API Routes
│       ├── webhooks/monobank/  # Payment webhook handler
│       ├── checkout/           # Create invoice
│       ├── nova-poshta/        # TTN creation
│       └── receipts/           # Checkbox trigger
├── components/                 # Shared UI components
├── lib/                        # API clients & utilities
│   ├── supabase.ts
│   ├── monobank.ts
│   ├── checkbox.ts
│   └── nova-poshta.ts
└── .tmp/                       # Temporary workbench (never committed)
```

---

## 7. Maintenance Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-02-27 | Initial constitution created | Protocol 0 initialization |
| 2026-02-27 | Full schema + integrations defined | Discovery Q&A complete |
