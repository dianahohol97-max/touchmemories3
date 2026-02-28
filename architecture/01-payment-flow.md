# Architecture 01 — Payment Flow

## Goal
Reliably process online payments via Monobank Acquiring, linking the payment result back to a specific order in Supabase without losing state.

## Core Flow
1. **Checkout (Client):** User completes the form on `/checkout` and submits.
2. **Invoice Creation (Server):** 
   - `POST /api/checkout` receives the payload.
   - Saves order to Supabase `orders` table with status `pending`.
   - Calls Monobank `/api/merchant/invoice/create` with the `amount`, `webhookUrl`, and `reference` (the Supabase `order_id`).
   - Retrieves the `pageUrl` (Monobank payment page) and returns it to the client.
3. **Redirect:** The client redirects the user to the `pageUrl`.
4. **Payment:** User enters card details and pays.
5. **Webhook Receiving (Server):**
   - Monobank sends a `POST` request to `/api/webhooks/monobank`.
   - **Crucial:** The handler MUST verify the `X-Sign` header using the webhook secret to prevent spoofing.
   - Parses the payload to find the `reference` (our `order_id`) and the new `status` (`success` or `failure`).
6. **State Update:**
   - Updates the Supabase `orders` table for that `order_id` with the new status (e.g., `paid`).
7. **Triggers:**
   - If `status == 'success'`, trigger the Checkbox fiscalization flow (Architecture 02).

## Edge Cases & Error Handling
- **Duplicate Webhooks:** Ensure the webhook handler is idempotent. If the order is already `paid`, acknowledge with 200 OK but do nothing else.
- **Webhook Timeout:** Monobank expects a 200 OK within 10 seconds. Webhook processing must be fast. Async triggers (like Checkbox) should not block the 200 OK response.
- **Amounts:** Monobank expects amounts in *kopiiky* (integers). DB should store kopiiky.

## Required Variables
- `MONOBANK_TOKEN`
- `MONOBANK_WEBHOOK_SECRET`
- `MONOBANK_WEBHOOK_URL` (must be public)
