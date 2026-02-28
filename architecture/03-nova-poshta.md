# Architecture 03 — Nova Poshta Delivery & TTN

## Goal
Manage physical delivery dispatch via Nova Poshta (NP). Allow customers to select branches at checkout, and admins to generate Electronic Waybills (Е-ТТН/TTN) in one click.

## Core Flow
1. **Frontend Branch Picker:**
   - The user selects "Nova Poshta" at `/checkout`.
   - Using a search bar, the UI calls our proxy endpoint `GET /api/nova-poshta/cities?query=Київ`. We proxy through the server to avoid exposing the NP API Key to the client.
   - After city selection, the UI calls `GET /api/nova-poshta/warehouses?cityRef={ref}` to populate a dropdown.
   - The final `delivery` object stored in `orders` contains the `cityRef`, `warehouseRef`, and human-readable labels.
2. **TTN Generation (Admin CRM):**
   - The Admin views an order in `/admin/orders/[id]`.
   - The Admin clicks "Generate TTN".
   - `POST /api/admin/ttn` is called with the `order_id`.
   - The server maps the order details:
      - `Sender`: configured via `NOVA_POSHTA_SENDER_REF`.
      - `Recipient`: the customer's name and phone.
      - `Destination`: the saved `cityRef` and `warehouseRef`.
      - `Cargo details`: total weight (calculated or fixed default e.g., 0.5kg), declared cost (the total `amount / 100` UAH).
   - Server calls `InternetDocument.save` via NP API.
   - Retrieves the `IntDocNumber` (the TTN).
3. **Storage and Tracking:**
   - Save the `ttn_number` to the `orders` (or a `ttn_records`) table.
   - Change order `status` to `shipped`.
   - Send email notification to user with tracking info.

## Edge Cases & Error Handling
- **Invalid Phone Numbers:** NP is strict on formatting. The checkout form must validate phone numbers matching `+380XXXXXXXXX`.
- **Sender Counterparty Issues:** If the `SENDER_REF` is invalid, NP will return business errors. The admin UI must catch and display these errors.

## Required Variables
- `NOVA_POSHTA_API_KEY`
- `NOVA_POSHTA_SENDER_REF`
- `NOVA_POSHTA_SENDER_CONTACT_REF`
- `NOVA_POSHTA_SENDER_ADDRESS_REF`
