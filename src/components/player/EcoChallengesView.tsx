"use client";

import React, { useState } from "react";
import { usePlayerStore, calculateImprovementTier, type BadgeTier } from "@/store/usePlayerStore";

export default function EcoChallengesView() {
  const { challenges, joinChallenge, initialIndex, currentIndex } = usePlayerStore();

  // Interactive Scoring Formula Simulator
  const [simInitial, setSimInitial] = useState<number>(initialIndex);
  const [simCurrent, setSimCurrent] = useState<number>(currentIndex);

  const { pct: simPct, tier: simTier } = calculateImprovementTier(simInitial, simCurrent);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-amber-400 font-mono">
              ○ △ □ SURVIVAL ARENA PROTOCOL
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            ECO CHALLENGES & SCORING MATRIX
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Compete in sector unsegregated waste index suppression. Higher reduction grants superior badge tiers and cash bounty pools.
          </p>
        </div>

        <div
          className="glass-panel px-5 py-3 rounded-xl flex items-center gap-3 shrink-0"
          style={{ borderColor: "var(--sq-gold)" }}
        >
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-[10px] uppercase text-gray-400">Total Bounty Pool</div>
            <div
              className="text-lg font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--sq-gold)" }}
            >
              ₹90,000 INR
            </div>
          </div>
        </div>
      </div>

      {/* Official Scoring Formula Explainer & Interactive Simulator */}
      <div
        className="glass-panel p-6 rounded-2xl border relative overflow-hidden"
        style={{ borderColor: "rgba(255, 209, 102, 0.3)" }}
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📐</span>
            <h2
              className="text-sm font-black tracking-[2px] uppercase text-amber-300"
              style={{ fontFamily: "var(--font-display)" }}
            >
              OFFICIAL ARENA SCORING FORMULA
            </h2>
          </div>
          <span className="text-[10px] font-mono text-gray-400">RULESET: ISO-14001 / SQUID ECO</span>
        </div>

        {/* Formula Box */}
        <div className="p-4 rounded-xl bg-black/70 border border-amber-500/30 text-center my-3">
          <div
            className="text-base md:text-lg font-black font-mono tracking-wider"
            style={{ color: "var(--sq-gold)" }}
          >
            Improvement % = ((Initial Index − New Index) ÷ Initial Index) × 100
          </div>
        </div>

        {/* Tier Classification Bands */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 rounded-xl bg-black/40 border border-gray-800 text-center">
            <div className="text-[10px] uppercase text-gray-500 font-mono">0% – 9%</div>
            <div className="text-sm font-bold text-gray-400 font-mono mt-1">NO TIER</div>
            <div className="text-[10px] text-gray-600 mt-0.5">Base Multiplier (1.0x)</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40 text-center">
            <div className="text-[10px] uppercase text-amber-600 font-mono">10% – 19%</div>
            <div className="text-sm font-bold text-amber-400 font-mono mt-1">🥉 BRONZE TIER</div>
            <div className="text-[10px] text-gray-400 mt-0.5">1.2x Point Multiplier</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-gray-400/40 text-center">
            <div className="text-[10px] uppercase text-gray-400 font-mono">20% – 29%</div>
            <div className="text-sm font-bold text-gray-200 font-mono mt-1">🥈 SILVER TIER</div>
            <div className="text-[10px] text-gray-300 mt-0.5">1.5x Point Multiplier</div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-yellow-500/50 text-center">
            <div className="text-[10px] uppercase text-yellow-500 font-mono">30%+</div>
            <div className="text-sm font-bold text-yellow-400 font-mono mt-1">🥇 GOLD TIER</div>
            <div className="text-[10px] text-yellow-300 mt-0.5">2.0x Multiplier + Cash Claim</div>
          </div>
        </div>

        {/* Interactive Simulator Sliders */}
        <div className="pt-4 border-t border-amber-950/60 space-y-4">
          <div className="text-xs font-bold uppercase text-gray-300 font-mono">
            🎛️ Interactive Index Simulator:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                <span>Baseline Index (Initial):</span>
                <span className="text-white font-bold">{simInitial}</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={simInitial}
                onChange={(e) => setSimInitial(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                <span>Current Hotspot Index (New):</span>
                <span className="text-white font-bold">{simCurrent}</span>
              </div>
              <input
                type="range"
                min="20"
                max={simInitial}
                value={simCurrent}
                onChange={(e) => setSimCurrent(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* Calculated Output Pill */}
          <div className="p-3.5 rounded-xl bg-black/80 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs text-gray-300">
              Formula Result: <span className="text-emerald-400 font-mono font-bold">{simPct}% Reduction</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Awarded Tier:</span>
              <span
                className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider font-mono"
                style={{
                  background:
                    simTier === "gold"
                      ? "rgba(255, 209, 102, 0.2)"
                      : simTier === "silver"
                      ? "rgba(200, 200, 200, 0.2)"
                      : simTier === "bronze"
                      ? "rgba(205, 127, 50, 0.2)"
                      : "rgba(100, 100, 100, 0.2)",
                  color:
                    simTier === "gold"
                      ? "var(--sq-gold)"
                      : simTier === "silver"
                      ? "#ffffff"
                      : simTier === "bronze"
                      ? "#cd7f32"
                      : "#888888",
                  border: "1px solid currentColor",
                }}
              >
                ● {simTier.toUpperCase()} BADGE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Arena Challenges List */}
      <div className="space-y-4">
        <h2
          className="text-base font-bold tracking-wider uppercase text-gray-300"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ACTIVE ARENA BOUNTIES & SPRINT OPERATIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((chal) => {
            const { pct } = calculateImprovementTier(chal.initialIndex, chal.currentIndex);
            return (
              <div
                key={chal.id}
                className="glass-panel p-5 rounded-xl flex flex-col justify-between space-y-4 border transition-all hover:scale-[1.01]"
                style={{
                  borderColor: chal.isJoined ? "var(--sq-green)" : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{
                        background: "rgba(57, 255, 136, 0.1)",
                        color: "var(--sq-green)",
                      }}
                    >
                      {chal.category}
                    </span>
                    <span className="text-gray-400">⏳ {chal.deadline}</span>
                  </div>

                  <h3
                    className="text-base font-bold tracking-wide mb-2 text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {chal.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {chal.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-emerald-950/80">
                  {/* Progress indices */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-gray-400">Baseline: {chal.initialIndex}</span>
                      <span className="text-emerald-400 font-bold">Current: {chal.currentIndex}</span>
                      <span className="text-amber-400">Goal: {chal.targetIndex}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"
                        style={{
                          width: `${Math.min(100, ((chal.initialIndex - chal.currentIndex) / (chal.initialIndex - chal.targetIndex)) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-right text-gray-500 font-mono">
                      Reduction: {pct}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">Bounty:</span>
                    <span className="text-amber-300 font-bold">
                      {chal.rewardAmount} + {chal.rewardPoints} PTS
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">Enlisted Squad:</span>
                    <span className="text-gray-200">{chal.participantsCount} Units</span>
                  </div>

                  <button
                    type="button"
                    disabled={chal.isJoined}
                    onClick={() => joinChallenge(chal.id)}
                    className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: chal.isJoined
                        ? "rgba(57, 255, 136, 0.15)"
                        : "linear-gradient(135deg, rgba(255, 209, 102, 0.25), rgba(255, 209, 102, 0.05))",
                      color: chal.isJoined ? "var(--sq-green)" : "var(--sq-gold)",
                      border: chal.isJoined ? "1px solid var(--sq-green)" : "1px solid var(--sq-gold)",
                      cursor: chal.isJoined ? "default" : "pointer",
                    }}
                  >
                    {chal.isJoined ? "✓ ENLISTED IN SPRINT" : "ENLIST IN SPRINT"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
