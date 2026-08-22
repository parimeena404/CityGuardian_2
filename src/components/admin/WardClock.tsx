"use client";

import React from "react";
import { calculateImprovementTier, type BadgeTier } from "@/store/usePlayerStore";

export interface WardClockProps {
  wardName: string;
  category: "Air Quality (AQI)" | "Water Quality (BOD)" | "Sewage & Waste Index" | "Dust & Urban Heat";
  currentValue: number;
  targetValue: number;
  initialValue: number;
  unit: string;
  deadline: string;
  assignedDept: string;
  status?: "critical" | "warning" | "on_track" | "target_met";
}

export default function WardClock({
  wardName,
  category,
  currentValue,
  targetValue,
  initialValue,
  unit,
  deadline,
  assignedDept,
}: WardClockProps) {
  // Score formula: (InitialIndex - NewIndex) / InitialIndex * 100
  const { pct, tier } = calculateImprovementTier(initialValue, currentValue);

  // Progress ring percentage toward target
  const totalGap = Math.abs(initialValue - targetValue) || 1;
  const achieved = Math.abs(initialValue - currentValue);
  const progressPct = Math.min(100, Math.max(0, Math.round((achieved / totalGap) * 100)));

  // SVG ring math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  // Determine color theme based on tier & value vs target
  const isTargetMet = currentValue <= targetValue;
  const isNearTarget = progressPct >= 60;
  const ringColor = isTargetMet ? "#39ff88" : isNearTarget ? "#ffd166" : "#ff2e6d";

  return (
    <div
      className="glass-panel p-5 rounded-2xl border flex flex-col justify-between space-y-4 bg-black/75 transition-all hover:border-pink-500/50 relative overflow-hidden group"
      style={{ borderColor: "rgba(255, 46, 109, 0.25)" }}
    >
      {/* Top Header: Ward & Department */}
      <div>
        <div className="flex items-center justify-between text-[10px] font-mono mb-2">
          <span className="text-pink-400 font-bold uppercase tracking-wider">
            🏛️ {wardName}
          </span>
          <span className="text-gray-400">⏳ {deadline}</span>
        </div>

        <h3
          className="text-sm font-bold text-white tracking-wide truncate"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {category}
        </h3>
        <div className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
          DEPT: {assignedDept}
        </div>
      </div>

      {/* Center: Digital Clock Progress Ring */}
      <div className="flex items-center justify-center my-2 relative">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Background Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={ringColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: "stroke-dashoffset 0.8s ease-in-out",
                filter: `drop-shadow(0 0 8px ${ringColor}80)`,
              }}
            />
          </svg>

          {/* Central Digital Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
            <span
              className="text-2xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: ringColor }}
            >
              {currentValue}
            </span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest -mt-0.5">
              {unit}
            </span>
            <span className="text-[9px] text-gray-500 font-bold mt-0.5">
              {progressPct}% MET
            </span>
          </div>
        </div>
      </div>

      {/* Target & Measured Outcome Badging */}
      <div className="space-y-2 pt-2 border-t border-gray-900 font-mono text-xs">
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-400">Baseline (Init): {initialValue}</span>
          <span className="text-pink-400 font-bold">Goal: &lt; {targetValue}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[10px] text-gray-400">
            Outcome: <span className="text-white font-bold">-{pct}%</span>
          </div>

          {/* Badge Tier Earned */}
          <span
            className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
            style={{
              background:
                tier === "gold"
                  ? "rgba(255, 209, 102, 0.2)"
                  : tier === "silver"
                  ? "rgba(200, 200, 200, 0.2)"
                  : tier === "bronze"
                  ? "rgba(205, 127, 50, 0.2)"
                  : "rgba(255, 46, 109, 0.2)",
              color:
                tier === "gold"
                  ? "var(--sq-gold)"
                  : tier === "silver"
                  ? "#ffffff"
                  : tier === "bronze"
                  ? "#cd7f32"
                  : "var(--sq-pink)",
              border: "1px solid currentColor",
            }}
          >
            ● {tier.toUpperCase()} TIER
          </span>
        </div>
      </div>
    </div>
  );
}
