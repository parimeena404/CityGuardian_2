-- ════════════════════════════════════════════════════════════════
-- CITY GUARDIAN — SUPABASE POSTGRES SCHEMA (MIGRATION 0001)
-- ════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('player', 'frontman')) DEFAULT 'player',
  points INTEGER NOT NULL DEFAULT 1240,
  badge_tier TEXT NOT NULL CHECK (badge_tier IN ('none', 'bronze', 'silver', 'gold')) DEFAULT 'silver',
  team_name TEXT DEFAULT 'ECHO STRIKER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WASTE REPORTS
CREATE TABLE IF NOT EXISTS public.waste_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  photo_url TEXT NOT NULL,
  geo_lat DOUBLE PRECISION NOT NULL,
  geo_lng DOUBLE PRECISION NOT NULL,
  location_name TEXT,
  category TEXT NOT NULL CHECK (category IN ('plastic', 'electronic', 'organic', 'industrial', 'paper', 'hazardous')),
  points_awarded INTEGER NOT NULL DEFAULT 10,
  status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'action_ticket')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 3. CONTRIBUTIONS (UNIFIED ACTIVITY FEED)
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('waste_report', 'verified_bonus', 'challenge_complete', 'build_upvote', 'reward_redeemed', 'food_rescue', 'community_join')),
  title TEXT NOT NULL,
  description TEXT,
  ref_id UUID,
  points INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  initial_index DOUBLE PRECISION NOT NULL DEFAULT 100.0,
  target_index DOUBLE PRECISION NOT NULL DEFAULT 60.0,
  current_index DOUBLE PRECISION NOT NULL DEFAULT 78.5,
  reward_amount TEXT NOT NULL DEFAULT '₹25,000',
  reward_points INTEGER NOT NULL DEFAULT 500,
  deadline TIMESTAMPTZ NOT NULL,
  participants JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'expired')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BADGES
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  title TEXT NOT NULL,
  earned_for TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ECO MATCHES (AI MATCHING MATRIX)
CREATE TABLE IF NOT EXISTS public.eco_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  waste_type TEXT NOT NULL,
  matched_entity_type TEXT NOT NULL CHECK (matched_entity_type IN ('recycler', 'ngo', 'industry')),
  entity_name TEXT NOT NULL,
  distance_km DOUBLE PRECISION NOT NULL DEFAULT 2.4,
  match_score INTEGER NOT NULL DEFAULT 95,
  contact_info TEXT,
  status TEXT NOT NULL CHECK (status IN ('available', 'dispatched', 'processing', 'completed')) DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. B2B DEMAND LISTINGS (INDUSTRY DEMAND)
CREATE TABLE IF NOT EXISTS public.b2b_demand_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_name TEXT NOT NULL,
  industry_category TEXT NOT NULL,
  material_needed TEXT NOT NULL,
  quantity TEXT NOT NULL,
  price_offered TEXT,
  urgency TEXT CHECK (urgency IN ('high', 'medium', 'standard')) DEFAULT 'medium',
  contact TEXT NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. COMMUNITY PROJECTS
CREATE TABLE IF NOT EXISTS public.community_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  volunteer_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('proposed', 'in_progress', 'completed')) DEFAULT 'proposed',
  leader_name TEXT DEFAULT 'Citizen Guardian',
  ward TEXT DEFAULT 'Ward 14 - Cyber Hub',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BUILD FROM WASTE (UPCYCLED BUILDS)
CREATE TABLE IF NOT EXISTS public.build_from_waste (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  creator_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  materials TEXT[] DEFAULT '{}',
  photo_url TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ECO MARKET ITEMS
CREATE TABLE IF NOT EXISTS public.ecomarket_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price_points INTEGER,
  price_inr INTEGER,
  photo_url TEXT,
  stock INTEGER DEFAULT 1,
  condition TEXT DEFAULT 'Upcycled / Like New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. REWARDS VAULT
CREATE TABLE IF NOT EXISTS public.rewards_vault (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  category TEXT NOT NULL,
  badge_req TEXT DEFAULT 'none',
  code TEXT,
  stock INTEGER DEFAULT 50,
  icon TEXT DEFAULT '🎁'
);

-- ════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ════════════════════════════════════════════════════════════════
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_demand_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_from_waste ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecomarket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_vault ENABLE ROW LEVEL SECURITY;

-- Public read policies for authenticated/anon users
CREATE POLICY "Public read for users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public read for waste_reports" ON public.waste_reports FOR SELECT USING (true);
CREATE POLICY "Public insert for waste_reports" ON public.waste_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read for contributions" ON public.contributions FOR SELECT USING (true);
CREATE POLICY "Public insert for contributions" ON public.contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read for challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Public read for badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Public read for eco_matches" ON public.eco_matches FOR SELECT USING (true);
CREATE POLICY "Public read for b2b_demand_listings" ON public.b2b_demand_listings FOR SELECT USING (true);
CREATE POLICY "Public read for community_projects" ON public.community_projects FOR SELECT USING (true);
CREATE POLICY "Public insert for community_projects" ON public.community_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for community_projects" ON public.community_projects FOR UPDATE USING (true);
CREATE POLICY "Public read for build_from_waste" ON public.build_from_waste FOR SELECT USING (true);
CREATE POLICY "Public insert for build_from_waste" ON public.build_from_waste FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for build_from_waste" ON public.build_from_waste FOR UPDATE USING (true);
CREATE POLICY "Public read for ecomarket_items" ON public.ecomarket_items FOR SELECT USING (true);
CREATE POLICY "Public read for rewards_vault" ON public.rewards_vault FOR SELECT USING (true);

-- ════════════════════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════════════════════
INSERT INTO public.challenges (title, description, initial_index, current_index, target_index, reward_amount, reward_points, deadline)
VALUES 
('Operation: Ward 14 Clean Grid', 'Reduce unsegregated landfill waste index from baseline 100 to below 60 in Ward 14.', 100.0, 74.2, 55.0, '₹25,000', 500, NOW() + INTERVAL '5 days'),
('Zero Plastic Campus Sprint', 'Eliminate single-use plastic disposal points across Sector 29 Tech Park.', 85.0, 62.0, 45.0, '₹15,000', 350, NOW() + INTERVAL '3 days'),
('Metropolitan E-Waste Rally', 'Collect and route 2.5 Tons of decommissioned electronics to certified lithium-ion recyclers.', 120.0, 78.0, 60.0, '₹50,000', 1000, NOW() + INTERVAL '9 days');

INSERT INTO public.b2b_demand_listings (industry_name, industry_category, material_needed, quantity, price_offered, urgency, contact)
VALUES
('GreenTech Polymers Ltd', 'Plastic Recycling', 'Clean PET Flakes / Shredded Bottles', '5.0 Tons / month', '₹34 / kg', 'high', 'procurement@greentechpoly.in'),
('EcoBoard Infrastructure', 'Upcycled Wood/Paper', 'Compressed Cardboard & Fiber Pulp', '12.0 Tons / month', '₹12 / kg', 'medium', 'supply@ecoboard.co'),
('Apex Metal Reclamation', 'E-Waste & Metals', 'Aluminium Scrap & PCB Boards', '2.5 Tons / batch', '₹185 / kg', 'high', 'recycle@apexmetals.com'),
('BioFuel Nexus Energy', 'Organic Biomass', 'Segregated Hotel & Agri Wet Waste', '20.0 Tons / month', '₹4,500 / ton', 'standard', 'ops@biofuelnexus.org');

INSERT INTO public.eco_matches (waste_type, matched_entity_type, entity_name, distance_km, match_score, contact_info, status)
VALUES
('Rigid HDPE Plastic', 'recycler', 'Metro Recyclers Plant 04', 1.8, 98, '+91 98112 34567', 'available'),
('Lithium Batteries & PCBs', 'industry', 'LithiumCycle India Pvt', 3.4, 94, 'dispatch@lithiumcycle.in', 'available'),
('Food Waste & Cooked Greens', 'ngo', 'Annapurna Food Rescue Foundation', 0.9, 99, '+91 99880 11223', 'dispatched'),
('Corrugated Carton Boxes', 'industry', 'GreenKraft Paper Mills', 4.1, 91, 'inquiries@greenkraft.in', 'available');

INSERT INTO public.rewards_vault (title, description, points_required, category, badge_req, code, icon)
VALUES
('Delhi Metro Eco Green Pass', '100% discount pass for 30 daily commutes on all lines.', 350, 'Transport', 'bronze', 'DMRC-ECO-994', '🚇'),
('Zero-Waste Bamboo Warrior Kit', 'Handcrafted bamboo cutlery, insulated flask & tote bag.', 600, 'Merchandise', 'bronze', 'ZW-KIT-BAMBOO', '🎋'),
('₹1,000 LiFE Sustainable Voucher', 'Redeemable at 50+ partnered sustainable grocers & apparel.', 1000, 'Vouchers', 'silver', 'LIFE-INR-1000', '💳'),
('Urban Forest Tree Dedication', 'Native neem tree planted with geotagged live growth dashboard.', 1200, 'Impact', 'silver', 'TREE-GEO-552', '🌳'),
('Front Man VIP Exemption Pass', 'Special immunity permit and priority dispatch handler access.', 2500, 'Arena Perks', 'gold', 'ARENA-VIP-GOLD', '👑');
