-- ════════════════════════════════════════════════════════════════
-- CITY GUARDIAN — SUPABASE POSTGRES SCHEMA (MIGRATION 0002)
-- ECOFOOD RESCUE NETWORK & GOVERNMENT CIVIC ACCOUNTABILITY
-- ════════════════════════════════════════════════════════════════

-- 1. RESTAURANT PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  geo_lat DOUBLE PRECISION NOT NULL DEFAULT 28.6139,
  geo_lng DOUBLE PRECISION NOT NULL DEFAULT 77.2090,
  contact TEXT NOT NULL,
  fssai_license TEXT,
  business_type TEXT NOT NULL DEFAULT 'Banquet / Restaurant',
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. FOOD LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.food_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES public.restaurant_partners(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  item TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Cooked Meals',
  original_price INTEGER NOT NULL DEFAULT 500,
  discount_price INTEGER NOT NULL DEFAULT 250,
  discount_percent INTEGER NOT NULL DEFAULT 50,
  is_donation BOOLEAN DEFAULT FALSE,
  quantity TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'claimed', 'expired', 'collected')) DEFAULT 'available',
  photo_url TEXT,
  claimed_by_user UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. NGO CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.ngo_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.food_listings(id) ON DELETE CASCADE,
  ngo_name TEXT NOT NULL,
  ngo_id TEXT NOT NULL,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pickup_status TEXT NOT NULL CHECK (pickup_status IN ('claimed', 'en_route', 'collected')) DEFAULT 'claimed',
  courier_name TEXT,
  courier_phone TEXT,
  portions_routed INTEGER DEFAULT 30
);

-- 4. CIVIC ACTION TICKETS TABLE (ACCOUNTABILITY PIPELINE)
CREATE TABLE IF NOT EXISTS public.civic_action_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('waste_burning', 'pothole_road', 'drainage_water', 'hazardous_chemical', 'air_pollution_spike', 'streetlight_power')),
  department TEXT NOT NULL,
  geo_lat DOUBLE PRECISION NOT NULL,
  geo_lng DOUBLE PRECISION NOT NULL,
  location_name TEXT NOT NULL,
  description TEXT NOT NULL,
  before_photo_url TEXT NOT NULL,
  after_photo_url TEXT,
  verification_count INTEGER NOT NULL DEFAULT 1,
  verification_threshold INTEGER NOT NULL DEFAULT 3,
  status TEXT NOT NULL CHECK (status IN ('reported', 'verified', 'assigned', 'in_progress', 'resolved')) DEFAULT 'reported',
  sla_hours INTEGER NOT NULL DEFAULT 24,
  deadline TIMESTAMPTZ NOT NULL,
  assigned_officer TEXT DEFAULT 'Ward Inspector In-Charge',
  reported_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 5. AQI TELEMETRY LOGS (LIVE CPCB ADAPTER)
CREATE TABLE IF NOT EXISTS public.aqi_telemetry_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Delhi NCR',
  aqi INTEGER NOT NULL,
  category TEXT NOT NULL,
  pm25 DOUBLE PRECISION NOT NULL,
  pm10 DOUBLE PRECISION NOT NULL,
  no2 DOUBLE PRECISION,
  so2 DOUBLE PRECISION,
  co DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.restaurant_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_action_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aqi_telemetry_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read restaurant_partners" ON public.restaurant_partners FOR SELECT USING (true);
CREATE POLICY "Public insert restaurant_partners" ON public.restaurant_partners FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read food_listings" ON public.food_listings FOR SELECT USING (true);
CREATE POLICY "Public insert food_listings" ON public.food_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update food_listings" ON public.food_listings FOR UPDATE USING (true);
CREATE POLICY "Public read ngo_claims" ON public.ngo_claims FOR SELECT USING (true);
CREATE POLICY "Public insert ngo_claims" ON public.ngo_claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update ngo_claims" ON public.ngo_claims FOR UPDATE USING (true);
CREATE POLICY "Public read civic_action_tickets" ON public.civic_action_tickets FOR SELECT USING (true);
CREATE POLICY "Public insert civic_action_tickets" ON public.civic_action_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update civic_action_tickets" ON public.civic_action_tickets FOR UPDATE USING (true);
CREATE POLICY "Public read aqi_telemetry_logs" ON public.aqi_telemetry_logs FOR SELECT USING (true);

-- Seed Initial Data
INSERT INTO public.restaurant_partners (name, address, geo_lat, geo_lng, contact, fssai_license, business_type)
VALUES
('The Grand Imperial Banquets', 'Sector 14 Cyber Corridor, Ward 14', 28.6139, 77.2090, '+91 98110 44556', '10019011002241', 'Banquet & Events'),
('Artisan Sourdough Bakery & Deli', 'Galleria Market, Sector 29', 28.6189, 77.2145, '+91 99881 22334', '10021011005512', 'Bakery & Cafe'),
('Green Leaf Organic Kitchen', 'Riverfront Boulevard, Ward 18', 28.6050, 77.2210, '+91 97115 88990', '10022011008891', 'Farm-to-Table Restaurant');

INSERT INTO public.food_listings (restaurant_name, item, description, category, original_price, discount_price, discount_percent, is_donation, quantity, expires_at, status, photo_url)
VALUES
('The Grand Imperial Banquets', 'Continental & Mediterranean Buffet Surplus (Hot-Pack Trays)', 'Pristine, untouched buffet trays chilled post-event. Gourmet pasta, grilled veggies, falafel & dips.', 'Banquet Meals', 900, 270, 70, false, '35 Portions', NOW() + INTERVAL '2 hours', 'available', 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=60'),
('Artisan Sourdough Bakery & Deli', 'Sourdough Loaves, Croissants & Focaccia Assortment', 'Daily artisan bake overage in eco-kraft bags. Freshly baked at dawn.', 'Bakery', 450, 180, 60, false, '14 Assorted Packs', NOW() + INTERVAL '4 hours', 'available', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60'),
('Green Leaf Organic Kitchen', 'Cold-Pressed Detox Juices & Fresh Microgreen Bowls', 'Raw organic juices (ABC & Green Boost) + tossed grain bowls.', 'Healthy/Vegan', 380, 190, 50, false, '10 Sets', NOW() + INTERVAL '3 hours', 'available', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60'),
('The Grand Imperial Banquets', 'Dal Makhani, Steamed Basmati & Tandoori Roti Batch (Shelter Bulk)', 'Large bulk containers cooked in hygienic commercial kitchens for hunger relief.', 'Bulk Kitchen', 0, 0, 100, true, '80 Portions (Donation)', NOW() + INTERVAL '3 hours', 'available', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=60');
