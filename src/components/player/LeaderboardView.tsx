"use client";

import React, { useState, useMemo } from "react";
import { usePlayerStore, type BadgeTier, type LeaderboardEntry } from "@/store/usePlayerStore";

const TIER_WEIGHT: Record<BadgeTier, number> = {
  gold: 4,
  silver: 3,
  bronze: 2,
  none: 1,
};

export default function LeaderboardView() {
  const { leaderboard, points, badgeTier } = usePlayerStore();

  const [sortBy, setSortBy] = useState<"points" | "tier" | "improvement">("points");

  const sortedList = useMemo(() => {
    const list = [...leaderboard];
    if (sortBy === "points") {
      return list.sort((a, b) => b.points - a.points);
    } else if (sortBy === "tier") {
      return list.sort((a, b) => TIER_WEIGHT[b.badgeTier] - TIER_WEIGHT[a.badgeTier]);
    } else {
      return list.sort((a, b) => b.improvementPct - a.improvementPct);
    }
  }, [leaderboard, sortBy]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ SURVIVAL ARENA STANDINGS
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            ARENA LEADERBOARD
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time citizen squad rankings evaluated on telemetry points, waste reduction %, and earned badge tiers.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 shrink-0 border border-emerald-950">
          <button
            onClick={() => setSortBy("points")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              sortBy === "points"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sort by Points
          </button>
          <button
            onClick={() => setSortBy("tier")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              sortBy === "tier"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sort by Tier
          </button>
          <button
            onClick={() => setSortBy("improvement")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              sortBy === "improvement"
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sort by % Drop
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Card List */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-emerald-950/80">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-6 py-3.5 bg-black/60 border-b border-emerald-950 text-[10px] font-mono uppercase tracking-widest text-gray-400">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5 md:col-span-4">Contestant / Squad</div>
          <div className="col-span-2 text-center">Badge Tier</div>
          <div className="col-span-2 text-center">Index Drop</div>
          <div className="col-span-2 md:col-span-3 text-right">Points</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-emerald-950/40">
          {sortedList.map((entry, index) => {
            const isUser = entry.isCurrentUser;
            const rankDisplay = index + 1;

            return (
              <div
                key={entry.id}
                className={`grid grid-cols-12 gap-2 px-6 py-4 items-center transition-all ${
                  isUser
                    ? "bg-emerald-950/30 border-l-4 border-l-emerald-400"
                    : "hover:bg-black/40"
                }`}
              >
                {/* Rank & Change Indicator */}
                <div className="col-span-1 flex items-center gap-1.5 font-mono">
                  <span
                    className={`text-sm font-black ${
                      rankDisplay === 1
                        ? "text-yellow-400"
                        : rankDisplay === 2
                        ? "text-gray-200"
                        : rankDisplay === 3
                        ? "text-amber-600"
                        : "text-gray-400"
                    }`}
                  >
                    #{rankDisplay}
                  </span>

                  {/* Rank Change Indicator */}
                  {entry.rankChange > 0 && (
                    <span className="text-[10px] text-emerald-400 font-bold">▲{entry.rankChange}</span>
                  )}
                  {entry.rankChange < 0 && (
                    <span className="text-[10px] text-pink-400 font-bold">▼{Math.abs(entry.rankChange)}</span>
                  )}
                  {entry.rankChange === 0 && (
                    <span className="text-[10px] text-gray-600 font-bold">▬</span>
                  )}
                </div>

                {/* Contestant / Team */}
                <div className="col-span-5 md:col-span-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold tracking-wide"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: isUser ? "var(--sq-green)" : "var(--sq-text)",
                      }}
                    >
                      {entry.name}
                    </span>
                    {isUser && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {entry.team}
                  </div>
                </div>

                {/* Badge Tier Pill */}
                <div className="col-span-2 text-center">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider"
                    style={{
                      background:
                        entry.badgeTier === "gold"
                          ? "rgba(255, 209, 102, 0.15)"
                          : entry.badgeTier === "silver"
                          ? "rgba(200, 200, 200, 0.15)"
                          : entry.badgeTier === "bronze"
                          ? "rgba(205, 127, 50, 0.15)"
                          : "rgba(100, 100, 100, 0.15)",
                      color:
                        entry.badgeTier === "gold"
                          ? "var(--sq-gold)"
                          : entry.badgeTier === "silver"
                          ? "#e0e0e0"
                          : entry.badgeTier === "bronze"
                          ? "#cd7f32"
                          : "#888888",
                      border: "1px solid currentColor",
                    }}
                  >
                    ● {entry.badgeTier.toUpperCase()}
                  </span>
                </div>

                {/* Improvement % */}
                <div className="col-span-2 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">-{entry.improvementPct}%</span>
                </div>

                {/* Points */}
                <div className="col-span-2 md:col-span-3 text-right font-mono">
                  <span
                    className="text-sm font-black"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: isUser ? "var(--sq-green)" : "var(--sq-gold)",
                    }}
                  >
                    {entry.points.toLocaleString()} PTS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
