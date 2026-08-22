-- ════════════════════════════════════════════════════════════════
-- CITY GUARDIAN — SUPABASE POSTGRES SCHEMA (MIGRATION 0003)
-- PRODUCTION DATA PIPELINE, TIME-SERIES & TELEMETRY
-- ════════════════════════════════════════════════════════════════

-- 1. WARDS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.wards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  zone TEXT NOT NULL,
  population INTEGER DEFAULT 120000,
  geo_lat DOUBLE PRECISION NOT NULL,
  geo_lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DIGITAL WARD CLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.ward_clocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ward_id TEXT REFERENCES public.wards(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'Air Quality (AQI)',
    'Water Quality (BOD)',
    'Sewage & Waste Index',
    'Dust & Urban Heat',
    'Energy Grid Load',
    'Drainage Capacity'
  )),
  unit TEXT NOT NULL,
  initial_value DOUBLE PRECISION NOT NULL,
  current_value DOUBLE PRECISION NOT NULL,
  target_value DOUBLE PRECISION NOT NULL,
  improvement_pct DOUBLE PRECISION GENERATED ALWAYS AS (
    CASE WHEN initial_value > 0 
      THEN ((initial_value - current_value) / initial_value) * 100 
      ELSE 0 
    END
  ) STORED,
  badge_tier TEXT NOT NULL CHECK (badge_tier IN ('none', 'bronze', 'silver', 'gold')) DEFAULT 'none',
  assigned_dept TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WARD CLOCK READINGS (TIME-SERIES TELEMETRY)
CREATE TABLE IF NOT EXISTS public.ward_clock_readings (
  id BIGSERIAL PRIMARY KEY,
  clock_id UUID REFERENCES public.ward_clocks(id) ON DELETE CASCADE,
  ward_id TEXT NOT NULL,
  category TEXT NOT NULL,
  measured_value DOUBLE PRECISION NOT NULL,
  source_sensor_id TEXT,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clock_readings_measured_at ON public.ward_clock_readings(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_clock_readings_ward_cat ON public.ward_clock_readings(ward_id, category);

-- 4. REALTIME ALERTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.realtime_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('threshold_breach', 'clock_target_met', 'civic_escalation', 'efir_triggered')),
  ward_id TEXT NOT NULL,
  ward_name TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
  is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SENSOR TELEMETRY LOGS (STRUCTURED FOR KAFKA / INFLUXDB INTEGRATION)
CREATE TABLE IF NOT EXISTS public.sensor_telemetry (
  id BIGSERIAL PRIMARY KEY,
  sensor_id TEXT NOT NULL,
  sensor_type TEXT NOT NULL, -- 'AQI_CAAMS', 'RTWQMS_BOD', 'SMART_METER', 'FLOW_METER'
  ward_id TEXT NOT NULL,
  geo_lat DOUBLE PRECISION,
  geo_lng DOUBLE PRECISION,
  parameter_name TEXT NOT NULL, -- 'PM2.5', 'PM10', 'BOD', 'COD', 'NO2', 'SO2'
  parameter_value DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  quality_flag TEXT DEFAULT 'VALID', -- 'VALID', 'SUSPECT', 'CALIBRATING'
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_telemetry_time ON public.sensor_telemetry(recorded_at DESC);

-- Enable RLS
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ward_clocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ward_clock_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_telemetry ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read on wards" ON public.wards FOR SELECT USING (true);
CREATE POLICY "Allow public read on ward_clocks" ON public.ward_clocks FOR SELECT USING (true);
CREATE POLICY "Allow public read on realtime_alerts" ON public.realtime_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read on sensor_telemetry" ON public.sensor_telemetry FOR SELECT USING (true);
