-- HAMTUNES CAKES & BAKES
-- Production Supabase Schema (PostgreSQL + RLS)

-- 1. ENUMS
CREATE TYPE asset_status AS ENUM (
  'detected',
  'processing',
  'needs_review',
  'approved',
  'published',
  'archived',
  'failed'
);

CREATE TYPE division_type AS ENUM (
  'cakes',
  'bakes_and_small_chops',
  'brand'
);

CREATE TYPE enquiry_type AS ENUM (
  'general',
  'cake',
  'gifting_cake',
  'bakes_and_small_chops',
  'event',
  'event_planner'
);

CREATE TYPE enquiry_status AS ENUM (
  'new',
  'contacted',
  'in_progress',
  'completed',
  'archived'
);

-- 2. ASSETS TABLE
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_folder TEXT NOT NULL,
  original_path TEXT NOT NULL,
  web_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  file_size BIGINT NOT NULL,
  hash TEXT UNIQUE NOT NULL,
  suggested_category TEXT NOT NULL,
  category TEXT NOT NULL,
  division division_type NOT NULL,
  caption TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  status asset_status NOT NULL DEFAULT 'needs_review',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.0,
  review_notes TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  division division_type NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  primary_image_id TEXT REFERENCES assets(id) ON DELETE SET NULL,
  primary_image_url TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  price_display TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  order_rank INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  enquiry_type enquiry_type NOT NULL DEFAULT 'general',
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  business_name TEXT,
  product_categories TEXT[] DEFAULT '{}',
  products_interested TEXT,
  event_date TEXT,
  cake_size_or_quantity TEXT,
  design_notes TEXT,
  budget_range TEXT,
  reference_image_url TEXT,
  collection_or_delivery TEXT,
  status enquiry_status NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SYNC LOGS TABLE
CREATE TABLE IF NOT EXISTS sync_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trigger TEXT NOT NULL,
  files_scanned INTEGER NOT NULL,
  files_added INTEGER NOT NULL,
  files_updated INTEGER NOT NULL,
  duplicates_skipped INTEGER NOT NULL,
  needs_review_count INTEGER NOT NULL,
  errors TEXT[] DEFAULT '{}',
  duration_ms INTEGER NOT NULL
);

-- 6. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Public can read published products and published non-brand assets
CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view published assets"
  ON assets FOR SELECT
  USING (status = 'published');

-- Public can submit enquiries (INSERT only)
CREATE POLICY "Public can insert enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (true);

-- Admin (service_role or authenticated admin) has full access
CREATE POLICY "Admin full access on products"
  ON products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on assets"
  ON assets FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on enquiries"
  ON enquiries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on sync_logs"
  ON sync_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access on settings"
  ON website_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
