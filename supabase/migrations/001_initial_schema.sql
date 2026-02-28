-- supabase/migrations/001_initial_schema.sql
-- ----------------------------------------------------------------------------
-- touchmemories3 — Initial Database Schema
-- Run this in the Supabase SQL Editor to create tables and RLS policies
-- ----------------------------------------------------------------------------

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_ua TEXT NOT NULL,
  description_ua TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name_ua TEXT NOT NULL,
  description_ua TEXT,
  price_uah INTEGER NOT NULL, -- Price in kopiiky (e.g. 129900 = 1299.00 UAH)
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT -1, -- -1 means unlimited
  metadata JSONB DEFAULT '{}'::jsonb, -- Store customization options schema here
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('nova_poshta', 'self_pickup')),
  delivery_city_ref TEXT,
  delivery_warehouse_ref TEXT,
  delivery_address_label TEXT,
  total_amount_uah INTEGER NOT NULL, -- Total in kopiiky
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_invoice_id TEXT, -- Monobank invoice ID
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
  product_name TEXT NOT NULL, -- Snapshot of name at time of purchase
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_uah INTEGER NOT NULL, -- Snapshot of price at time of purchase
  customization JSONB DEFAULT '{}'::jsonb, -- User's specific choices (e.g., uploaded photo links)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Fiscal Receipts Table (Checkbox)
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
  fiscal_number TEXT NOT NULL,
  amount_uah INTEGER NOT NULL,
  tax_percent INTEGER DEFAULT 20,
  sent_to_email TEXT NOT NULL,
  checkbox_receipt_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Delivery Tracking (Nova Poshta TTNs)
CREATE TABLE ttn_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE UNIQUE NOT NULL,
  ttn_number TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  city_ref TEXT NOT NULL,
  warehouse_ref TEXT NOT NULL,
  weight_kg NUMERIC(5,2) DEFAULT 0.5,
  declared_value_uah INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttn_records ENABLE ROW LEVEL SECURITY;

-- Categories: Publicly readable, admin writable
CREATE POLICY "Public profiles are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable/updatable by admins only." ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Products: Publicly readable (only active), admin writable
CREATE POLICY "Active products are viewable by everyone." ON products FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Products are manageable by admins only." ON products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: Can only be read/updated by the user possessing the Service Role key (API logic) OR authenticated admins
CREATE POLICY "Orders are manageable by service role or admins" ON orders FOR ALL USING (auth.role() = 'authenticated');
-- (Note: Server-side API endpoints bypass RLS using the Service Role Key. Client should not fetch orders directly unless viewing their own, which would require auth.)

-- Same for other tables
CREATE POLICY "Order items manageable by authenticated only" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Receipts manageable by authenticated only" ON receipts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "TTN records manageable by authenticated only" ON ttn_records FOR ALL USING (auth.role() = 'authenticated');

-- Add function for updating 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
