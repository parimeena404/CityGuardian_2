-- ════════════════════════════════════════════════════════════════
-- CITY GUARDIAN — COMPREHENSIVE SEED DATA (SEED.SQL)
-- POPULATES COMPLETE PRODUCTION ENVIRONMENT & DEMO SUITE
-- ════════════════════════════════════════════════════════════════

-- 1. SEED WARDS
INSERT INTO public.wards (id, name, zone, population, geo_lat, geo_lng) VALUES
('ward-14', 'Ward 14 (Cyber Hub / Sector 14)', 'Zone 4 North', 145000, 28.6139, 77.2090),
('ward-18', 'Ward 18 (Yamuna Riverfront)', 'Zone 2 East', 110000, 28.6250, 77.2400),
('ward-22', 'Ward 22 (Industrial Belt)', 'Zone 5 South', 95000, 28.5800, 77.1900),
('ward-03', 'Ward 03 (University Campus)', 'Zone 1 North', 65000, 28.6850, 77.2100),
('ward-09', 'Ward 09 (Old City Grid)', 'Zone 3 Central', 180000, 28.6500, 77.2300),
('ward-07', 'Ward 07 (Anand Vihar Corridor)', 'Zone 2 East', 135000, 28.6470, 77.3150)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED USERS (3 PLAYERS, 3 FRONTMEN)
INSERT INTO public.users (id, name, email, role, points, badge_tier, team_name) VALUES
('a0000000-0000-0000-0000-000000000001', 'Contestant 456 (Player)', 'contestant456@cityguardian.in', 'player', 1240, 'silver', 'ECHO STRIKER'),
('a0000000-0000-0000-0000-000000000002', 'Contestant 067 (Player)', 'contestant067@cityguardian.in', 'player', 2180, 'gold', 'SOLAR SANGHA'),
('a0000000-0000-0000-0000-000000000003', 'Contestant 218 (Player)', 'contestant218@cityguardian.in', 'player', 920, 'bronze', 'DELTA RECON'),
('a0000000-0000-0000-0000-000000000004', 'Front Man (Authority)', 'frontman@cityguardian.in', 'frontman', 0, 'none', 'MUNICIPAL COMMAND'),
('a0000000-0000-0000-0000-000000000005', 'CPCB Enforcer 01', 'cpcb.officer@cpcb.gov.in', 'frontman', 0, 'none', 'AIR ENFORCEMENT'),
('a0000000-0000-0000-0000-000000000006', 'Jal Board Chief', 'chief.engineer@djb.gov.in', 'frontman', 0, 'none', 'WATERWAYS')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED DIGITAL WARD CLOCKS
INSERT INTO public.ward_clocks (id, ward_id, category, unit, initial_value, current_value, target_value, badge_tier, assigned_dept, deadline) VALUES
('b0000000-0000-0000-0000-000000000001', 'ward-14', 'Air Quality (AQI)', 'AQI', 220, 142, 80, 'silver', 'CPCB Air Enforcement Division', NOW() + INTERVAL '14 days'),
('b0000000-0000-0000-0000-000000000002', 'ward-14', 'Sewage & Waste Index', 'INDEX', 100, 68, 40, 'gold', 'Municipal Solid Waste Wing', NOW() + INTERVAL '21 days'),
('b0000000-0000-0000-0000-000000000003', 'ward-18', 'Water Quality (BOD)', 'mg/L', 32, 18.5, 8, 'silver', 'Delhi Jal Board Waterways Taskforce', NOW() + INTERVAL '30 days'),
('b0000000-0000-0000-0000-000000000004', 'ward-18', 'Dust & Urban Heat', 'PM10', 130, 84, 50, 'silver', 'PWD Smog & Road Dust Suppression', NOW() + INTERVAL '10 days'),
('b0000000-0000-0000-0000-000000000005', 'ward-22', 'Air Quality (AQI)', 'AQI', 290, 198, 110, 'gold', 'CPCB Industrial OCEMS Oversight', NOW() + INTERVAL '7 days'),
('b0000000-0000-0000-0000-000000000006', 'ward-03', 'Sewage & Waste Index', 'INDEX', 80, 34, 30, 'gold', 'Campus Zero-Waste Taskforce', NOW() + INTERVAL '18 days')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED CHALLENGES
INSERT INTO public.challenges (id, title, description, initial_index, target_index, current_index, reward_amount, reward_points, deadline, status) VALUES
('c0000000-0000-0000-0000-000000000001', 'Ward 14 Single-Use Plastic Elimination', 'Divert 500kg unsegregated PET bottles from landfill into certified circular recycling streams.', 100.0, 60.0, 74.5, '₹25,000', 500, NOW() + INTERVAL '5 days', 'active'),
('c0000000-0000-0000-0000-000000000002', 'Riverfront BOD Reduction Sprint', 'Deploy biological floating wetlands to suppress open tributary biochemical oxygen demand.', 45.0, 20.0, 32.0, '₹40,000', 800, NOW() + INTERVAL '12 days', 'active'),
('c0000000-0000-0000-0000-000000000003', 'Sector 22 E-Waste Interception Mission', 'Extract printed circuit boards from informal scrap channels; route to authorized recyclers.', 80.0, 30.0, 52.0, '₹15,000', 350, NOW() + INTERVAL '3 days', 'active'),
('c0000000-0000-0000-0000-000000000004', 'Zero Organic Waste University Sprint', 'Route 100% campus canteen wet waste to on-site anaerobic bio-digester units.', 90.0, 20.0, 28.0, '₹10,000', 250, NOW() + INTERVAL '8 days', 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED RESTAURANT PARTNERS & FOOD LISTINGS
INSERT INTO public.restaurant_partners (id, name, address, geo_lat, geo_lng, contact, fssai_license, business_type, verified) VALUES
('d0000000-0000-0000-0000-000000000001', 'Green Leaf Bistro & Bakery', 'Shop 12, Sector 14 Central Plaza', 28.6139, 77.2090, '+91 98110 44552', 'FSSAI-10022011004521', 'Bakery / Cafe', true),
('d0000000-0000-0000-0000-000000000002', 'Royal Kitchens Cloud Facility', 'Plot 44, Udyog Vihar Phase 2', 28.5020, 77.0850, '+91 99550 12389', 'FSSAI-10023022009844', 'Cloud Kitchen', true),
('d0000000-0000-0000-0000-000000000003', 'Punjab Sweets & Caterers', 'Main Market, Ward 09', 28.6500, 77.2300, '+91 98765 43210', 'FSSAI-10021011001122', 'Restaurant / Sweets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.food_listings (id, restaurant_id, restaurant_name, item, description, category, original_price, discount_price, discount_percent, is_donation, quantity, expires_at, status, photo_url) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Green Leaf Bistro & Bakery', 'Assorted Sourdough & Croissant Box (6 pcs)', 'Fresh morning bake with 4-hour shelf life remaining. Vacuum packed.', 'Bakery', 450, 180, 60, false, '8 Boxes Available', NOW() + INTERVAL '3 hours', 'available', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60'),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'Royal Kitchens Cloud Facility', 'Bulk Paneer Butter Masala + Jeera Rice Trays', 'Prepared for corporate luncheon, excess 40 portions untouched in hot-box containers.', 'Cooked Meals', 3200, 0, 100, true, '40 Portions', NOW() + INTERVAL '2 hours', 'available', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED REALTIME ALERTS
INSERT INTO public.realtime_alerts (id, alert_type, ward_id, ward_name, message, severity, is_acknowledged) VALUES
('f0000000-0000-0000-0000-000000000001', 'threshold_breach', 'ward-22', 'Ward 22 (Industrial Belt)', 'AQI exceeded 200 threshold — CPCB enforcement dispatched', 'critical', false),
('f0000000-0000-0000-0000-000000000002', 'clock_target_met', 'ward-03', 'Ward 03 (University Campus)', 'Waste Segregation Index met 90% target — Gold Badge earned', 'info', true)
ON CONFLICT (id) DO NOTHING;
