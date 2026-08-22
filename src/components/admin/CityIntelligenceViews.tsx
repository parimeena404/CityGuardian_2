"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface IntelligenceViewProps {
  section: "city-monitor" | "energy-grid" | "water-monitor" | "waste-analytics";
}

const ENERGY_DATA = [
  { time: "06:00", solarMw: 0.8, gridDemandMw: 4.2, batteryChargePct: 45 },
  { time: "09:00", solarMw: 3.4, gridDemandMw: 5.8, batteryChargePct: 62 },
  { time: "12:00", solarMw: 6.8, gridDemandMw: 6.4, batteryChargePct: 94 },
  { time: "15:00", solarMw: 5.2, gridDemandMw: 6.0, batteryChargePct: 88 },
  { time: "18:00", solarMw: 1.4, gridDemandMw: 7.2, batteryChargePct: 75 },
  { time: "21:00", solarMw: 0.0, gridDemandMw: 6.8, batteryChargePct: 52 },
];

const WATER_DATA = [
  { station: "Canal 01", bod: 12.4, cod: 28.0, ph: 7.2, flowMld: 45 },
  { station: "Canal 02", bod: 24.8, cod: 54.0, ph: 6.8, flowMld: 62 },
  { station: "Canal 03", bod: 8.2, cod: 18.5, ph: 7.4, flowMld: 38 },
  { station: "Canal 04", bod: 18.5, cod: 42.0, ph: 7.0, flowMld: 55 },
];

const WASTE_ANALYTICS_DATA = [
  { category: "Rigid PET/HDPE", tonsDiverted: 48.5, b2bRecycled: 42.0 },
  { category: "E-Waste / PCB", tonsDiverted: 14.2, b2bRecycled: 13.8 },
  { category: "Organic Wet Food", tonsDiverted: 128.0, b2bRecycled: 110.0 },
  { category: "C&D Debris", tonsDiverted: 92.4, b2bRecycled: 75.0 },
  { category: "Corrugated Paper", tonsDiverted: 64.0, b2bRecycled: 58.0 },
];

export default function CityIntelligenceViews({ section }: IntelligenceViewProps) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-black tracking-[3px] uppercase px-2 py-0.5 rounded font-mono"
            style={{
              background: "rgba(255, 46, 109, 0.15)",
              color: "var(--sq-pink)",
              border: "1px solid rgba(255, 46, 109, 0.3)",
            }}
          >
            ● CITY INTELLIGENCE SENSOR MATRIX
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-black tracking-wider uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
        >
          {section === "city-monitor"
            ? "MACRO CITY MONITOR & RADAR"
            : section === "energy-grid"
            ? "RENEWABLE ENERGY GRID & MICROGRID TELEMETRY"
            : section === "water-monitor"
            ? "WATER QUALITY & RIVERFRONT CANAL MONITOR"
            : "SOLID WASTE DIVERSION & CIRCULAR ANALYTICS"}
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-mono">
          Kafka-ready real-time telemetry stream. Structured for automated API ingestion and automated threshold alerting.
        </p>
      </div>

      {/* 1. Energy Grid */}
      {section === "energy-grid" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Peak Solar Generation</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">6.8 MW</div>
              <div className="text-[11px] text-gray-500">Rooftop Solar Array Capacity</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Battery Storage Reserve</div>
              <div className="text-3xl font-black text-amber-300 mt-1">88% SoC</div>
              <div className="text-[11px] text-gray-500">12 MWh LiFePO4 Battery Banks</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Clean Grid Displacement</div>
              <div className="text-3xl font-black text-pink-400 mt-1">42.8%</div>
              <div className="text-[11px] text-gray-500">Fossil Fuel Grid Offset</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/70 space-y-4">
            <h3
              className="text-sm font-black tracking-wider uppercase text-white font-mono"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SOLAR GENERATION VS GRID DEMAND (24H LOAD PROFILE)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ENERGY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#6b7280" fontSize={11} fontFamily="monospace" unit=" MW" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d1410",
                      borderColor: "#ff2e6d",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Area type="monotone" dataKey="solarMw" stroke="#39ff88" fill="#39ff8830" name="Solar Generation (MW)" />
                  <Line type="monotone" dataKey="gridDemandMw" stroke="#ff2e6d" strokeWidth={2} name="Total Grid Demand (MW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. Water Monitor */}
      {section === "water-monitor" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Average Tributary BOD</div>
              <div className="text-3xl font-black text-amber-300 mt-1">15.9 mg/L</div>
              <div className="text-[11px] text-gray-500">Statutory Target: &lt; 10 mg/L</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Total Wastewater Treated</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">200 MLD</div>
              <div className="text-[11px] text-gray-500">STP Operational Efficiency: 96%</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Micro-Plastics Intercepted</div>
              <div className="text-3xl font-black text-pink-400 mt-1">2.4 Tons/mo</div>
              <div className="text-[11px] text-gray-500">Canal Outflow Booms</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/70 space-y-4">
            <h3
              className="text-sm font-black tracking-wider uppercase text-white font-mono"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CANAL OUTFALL BOD & COD POLLUTION PROFILES
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WATER_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="station" stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#6b7280" fontSize={11} fontFamily="monospace" unit=" mg/L" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d1410",
                      borderColor: "#ff2e6d",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Bar dataKey="bod" fill="#ffd166" name="BOD (Biological Oxygen Demand)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cod" fill="#ff2e6d" name="COD (Chemical Oxygen Demand)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 3. Waste Analytics */}
      {section === "waste-analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Total Landfill Diversion</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">347 Tons</div>
              <div className="text-[11px] text-emerald-400">▲ +28% vs Baseline Month</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">B2B Circular Recycling Intake</div>
              <div className="text-3xl font-black text-pink-400 mt-1">298.8 Tons</div>
              <div className="text-[11px] text-gray-500">Routed to Registered Industries</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Methane Emission Suppressed</div>
              <div className="text-3xl font-black text-amber-300 mt-1">840 CO2e</div>
              <div className="text-[11px] text-gray-500">Bio-digestive Treatment</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/70 space-y-4">
            <h3
              className="text-sm font-black tracking-wider uppercase text-white font-mono"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CATEGORY-WISE DIVERSION & B2B REMANUFACTURING YIELD (TONS)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WASTE_ANALYTICS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="category" stroke="#6b7280" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#6b7280" fontSize={11} fontFamily="monospace" unit=" t" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d1410",
                      borderColor: "#39ff88",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Bar dataKey="tonsDiverted" fill="#39ff88" name="Total Tons Diverted" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="b2bRecycled" fill="#ffd166" name="B2B Circular Remanufactured" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. City Monitor Overview */}
      {section === "city-monitor" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
            <div className="glass-panel p-4 rounded-xl border border-pink-950 bg-black/70">
              <div className="text-[10px] text-gray-400">Total Wards Monitored</div>
              <div className="text-2xl font-black text-white mt-1">20 WARDS</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-pink-950 bg-black/70">
              <div className="text-[10px] text-gray-400">Compliance Rate</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">91.4%</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-pink-950 bg-black/70">
              <div className="text-[10px] text-gray-400">Active Action Tickets</div>
              <div className="text-2xl font-black text-pink-400 mt-1">18 TICKETS</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-pink-950 bg-black/70">
              <div className="text-[10px] text-gray-400">Citizen Telemetry Logs</div>
              <div className="text-2xl font-black text-amber-300 mt-1">2,840 LOGS</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/70 space-y-4">
            <h3
              className="text-sm font-black tracking-wider uppercase text-white font-mono"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CITY-WIDE SENSOR TELEMETRY PROFILE
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_AQI_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d1410",
                      borderColor: "#ff2e6d",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Area type="monotone" dataKey="aqi" stroke="#ff2e6d" fill="#ff2e6d20" name="Average City AQI" />
                  <Area type="monotone" dataKey="pm25" stroke="#39ff88" fill="#39ff8820" name="PM2.5 Trend" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const HOURLY_AQI_DATA = [
  { time: "00:00", aqi: 185, pm25: 84 },
  { time: "03:00", aqi: 192, pm25: 89 },
  { time: "06:00", aqi: 215, pm25: 104 },
  { time: "09:00", aqi: 178, pm25: 81 },
  { time: "12:00", aqi: 145, pm25: 64 },
  { time: "15:00", aqi: 138, pm25: 58 },
  { time: "18:00", aqi: 168, pm25: 75 },
  { time: "21:00", aqi: 162, pm25: 71 },
];
