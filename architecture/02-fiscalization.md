# Architecture 02 — Fiscalization Pipeline

## Goal
Automatically issue a valid Ukrainian fiscal receipt (ПРРО) within 30 seconds of receiving a successful payment payload from Monobank.

## Core Flow
1. **Trigger:** `POST /api/webhooks/monobank` receives a `success` payload.
2. **Shift Check (Server):** 
   - Look up the current shift via the Checkbox API `GET /api/v1/shifts/current`.
   - If the status is `OPENED`, proceed.
   - If `CLOSED`, or no active shift, `POST /api/v1/shifts` to open a new one. Wait up to 5s if necessary, but returning immediately is preferred.
   - *Alternative Pattern:* For simplicity, open the shift on the very first request of the day when a receipt is needed.
3. **Receipt Payload Creation:**
   - Query Supabase `orders` and `order_items` for the `order_id` (found via Monobank's `reference`).
   - Construct the JSON payload with:
      - `goods`: array of items (name, quantity, price in *kopiiky*).
      - `delivery`: add delivery charge as a service (if applicable).
      - `payments`: array containing the total amount paid by `CARD`.
      - `discounts`: any applied discounts.
      - `tax`: typically 20% PDV (calculated per item).
4. **Receipt Submission:**
   - `POST /api/v1/receipts/sell` to Checkbox.
   - Wait for the Checkbox response, which includes the `id` (fiscal number) and `receipt_url` (public Checkbox link).
5. **Storage and Delivery:**
   - Update `receipts` table in Supabase (link to `order_id`, store `receipt_id`, `fiscal_number`, `checkbox_receipt_url`).
   - Trigger Resend API to send the `checkbox_receipt_url` to the customer's email.

## Edge Cases & Error Handling
- **Missing Token:** The Checkbox JWT expires. `lib/checkbox.ts` must catch 401s, re-authenticate using `CHECKBOX_LOGIN` and `CHECKBOX_PASSWORD`, and retry the request.
- **SLA Breach:** The Checkbox request can be slow (2-5 seconds). Because Monobank expects a webhook response within 10s, the Checkbox call should ideally be performed *asynchronously* (e.g., using `waitUntil` in a Serverless/Edge function if Vercel supports it, or returning 200 to Monobank before starting the `createReceipt` promise chain).
- **Shift Sync:** A cron job or an admin action should `POST /api/v1/shifts/close` nightly to close the register (Z-report).

## Required Variables
- `CHECKBOX_API_URL`
- `CHECKBOX_LOGIN`
- `CHECKBOX_PASSWORD`
- `RESEND_API_KEY`
