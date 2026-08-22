"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { usePlayerStore } from "@/store/usePlayerStore";

const HOURLY_AQI_DATA = [
  { time: "00:00", aqi: 185, target: 100, pm25: 84 },
  { time: "03:00", aqi: 192, target: 100, pm25: 89 },
  { time: "06:00", aqi: 215, target: 100, pm25: 104 },
  { time: "09:00", aqi: 178, target: 100, pm25: 81 },
  { time: "12:00", aqi: 145, target: 100, pm25: 64 },
  { time: "15:00", aqi: 138, target: 100, pm25: 58 },
  { time: "18:00", aqi: 168, target: 100, pm25: 75 },
  { time: "21:00", aqi: 162, target: 100, pm25: 71 },
];

const PARAMETER_TRENDS = [
  { day: "Mon", landfillTons: 142, bodLevel: 28, energyKwh: 420 },
  { day: "Tue", landfillTons: 135, bodLevel: 26, energyKwh: 460 },
  { day: "Wed", landfillTons: 124, bodLevel: 24, energyKwh: 510 },
  { day: "Thu", landfillTons: 110, bodLevel: 22, energyKwh: 580 },
  { day: "Fri", landfillTons: 98, bodLevel: 19, energyKwh: 640 },
  { day: "Sat", landfillTons: 89, bodLevel: 17, energyKwh: 710 },
  { day: "Sun", landfillTons: 76, bodLevel: 15, energyKwh: 790 },
];

export default function ControlCenterView() {
  const { civicTickets, wasteReports } = usePlayerStore();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              ● FRONT MAN COMMAND OVERVIEW
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            METROPOLITAN CONTROL CENTER
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Municipal command telemetry matrix. Real-time sensor triage, statutory compliance tracking, and outcome-based ward scorecards.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="glass-panel px-4 py-2 rounded-xl border border-pink-500/40 bg-black/60">
            <span className="text-[10px] text-gray-500 block uppercase">SYSTEM TIME</span>
            <span className="text-pink-400 font-bold">WAR_ROOM_LIVE • 16:20 IST</span>
          </div>
        </div>
      </div>

      {/* Top-Line KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="glass-panel p-5 rounded-2xl border bg-black/70 space-y-1"
          style={{ borderColor: "rgba(255, 46, 109, 0.35)" }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 uppercase">Active IoT Nodes</span>
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          </div>
          <div
            className="text-3xl font-black font-mono text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            1,420 <span className="text-xs text-gray-500 font-normal">SENSORS</span>
          </div>
          <div className="text-[11px] text-pink-400 font-mono">99.8% Online across 20 Wards</div>
        </div>

        <div
          className="glass-panel p-5 rounded-2xl border bg-black/70 space-y-1"
          style={{ borderColor: "rgba(255, 209, 102, 0.35)" }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 uppercase">City AQI Average</span>
            <span className="text-amber-300 font-bold">POOR</span>
          </div>
          <div
            className="text-3xl font-black font-mono text-amber-300"
            style={{ fontFamily: "var(--font-display)" }}
          >
            162 <span className="text-xs text-gray-500 font-normal">AQI</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">▼ -14.2% reduction this cycle</div>
        </div>

        <div
          className="glass-panel p-5 rounded-2xl border bg-black/70 space-y-1"
          style={{ borderColor: "rgba(57, 255, 136, 0.35)" }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 uppercase">Municipal SLA Rate</span>
            <span className="text-emerald-400 font-bold">BENCHMARK</span>
          </div>
          <div
            className="text-3xl font-black font-mono text-emerald-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            94.8%
          </div>
          <div className="text-[11px] text-gray-400 font-mono">Avg Closure SLA: 18.4 Hours</div>
        </div>

        <div
          className="glass-panel p-5 rounded-2xl border bg-black/70 space-y-1"
          style={{ borderColor: "rgba(255, 46, 109, 0.35)" }}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 uppercase">Breaches Flagged</span>
            <span className="text-pink-400 font-bold">3 ALERTS</span>
          </div>
          <div
            className="text-3xl font-black font-mono text-pink-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            3 <span className="text-xs text-gray-500 font-normal">UNRESOLVED</span>
          </div>
          <div className="text-[11px] text-pink-400 font-mono">Auto e-FIR Notices Dispatched</div>
        </div>
      </div>

      {/* Recharts Analytics Curves (24h Air Quality & Environmental Parameters) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 24h Air Quality vs Target Curve */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/70 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-sm font-black tracking-wider uppercase text-white font-mono"
                style={{ fontFamily: "var(--font-display)" }}
              >
                24-HOUR AIR QUALITY TELEMETRY CURVE
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Measured AQI vs Municipal Standard Limit (100 AQI)
              </p>
            </div>
            <span className="text-xs font-mono text-pink-400">SENSOR STREAM LIVE</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_AQI_DATA}>
                <defs>
                  <linearGradient id="aqiColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2e6d" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ff2e6d" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#6b7280" fontSize={11} fontFamily="monospace" domain={[50, 250]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1410",
                    borderColor: "#ff2e6d",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="aqi" stroke="#ff2e6d" strokeWidth={2} fillOpacity={1} fill="url(#aqiColor)" name="Measured AQI" />
                <Line type="monotone" dataKey="target" stroke="#39ff88" strokeWidth={2} strokeDasharray="5 5" name="Target (100)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Environmental Parameter Reduction Area Chart */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/70 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-sm font-black tracking-wider uppercase text-white font-mono"
                style={{ fontFamily: "var(--font-display)" }}
              >
                WEEKLY DIVERSION & SOLAR
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Landfill Tons Suppressed vs Solar MWh Generated
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PARAMETER_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1410",
                    borderColor: "#39ff88",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="landfillTons" stroke="#ffd166" strokeWidth={2} name="Landfill Tons" />
                <Line type="monotone" dataKey="energyKwh" stroke="#39ff88" strokeWidth={2} name="Solar Generation (kWh)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Incident Triage & Live Telemetry Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/70 space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-black tracking-wider uppercase text-pink-400 font-mono"
            style={{ fontFamily: "var(--font-display)" }}
          >
            REAL-TIME MUNICIPAL INCIDENT TRIAGE STREAM
          </h3>
          <span className="text-xs font-mono text-gray-400">
            {civicTickets.length} ACTIVE INCIDENTS UNDER SURVEILLANCE
          </span>
        </div>

        <div className="divide-y divide-gray-900">
          {civicTickets.map((t) => (
            <div
              key={t.id}
              className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[10px] font-bold">
                  {t.trackingId}
                </span>
                <span className="text-white font-bold">{t.title}</span>
                <span className="text-gray-500 text-[11px]">📍 {t.locationName}</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-gray-400">Assigned: <span className="text-gray-200">{t.department}</span></span>
                <span
                  className="px-2 py-0.5 rounded uppercase font-bold"
                  style={{
                    color: t.status === "resolved" ? "var(--sq-green)" : "var(--sq-pink)",
                    background: t.status === "resolved" ? "rgba(57,255,136,0.1)" : "rgba(255,46,109,0.1)",
                  }}
                >
                  ● {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
