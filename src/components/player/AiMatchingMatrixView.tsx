"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function AiMatchingMatrixView() {
  const { ecoMatches, dispatchEcoMatch } = usePlayerStore();
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = filterType === "all"
    ? ecoMatches
    : ecoMatches.filter((m) => m.matchedEntityType === filterType);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ NEURAL ROUTING ENGINE
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            AI MATCHING MATRIX
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Algorithmic matchmaking correlating citizen-reported waste categories to localized verified recyclers, NGOs, and industrial remanufacturers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 shrink-0 border border-emerald-950">
          {["all", "recycler", "industry", "ngo"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase transition-all ${
                filterType === t
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "all" ? "All Channels" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((match) => (
          <div
            key={match.id}
            className="glass-panel p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all hover:border-emerald-700/80 bg-black/60"
            style={{ borderColor: "rgba(57, 255, 136, 0.25)" }}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-mono tracking-wider"
                  style={{
                    background:
                      match.matchedEntityType === "recycler"
                        ? "rgba(57, 255, 136, 0.15)"
                        : match.matchedEntityType === "industry"
                        ? "rgba(0, 200, 255, 0.15)"
                        : "rgba(255, 209, 102, 0.15)",
                    color:
                      match.matchedEntityType === "recycler"
                        ? "var(--sq-green)"
                        : match.matchedEntityType === "industry"
                        ? "#00c8ff"
                        : "var(--sq-gold)",
                    border: "1px solid currentColor",
                  }}
                >
                  ● {match.matchedEntityType.toUpperCase()}
                </span>

                <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">{match.matchScore}% MATCH</span>
                </div>
              </div>

              <div className="text-[10px] uppercase text-gray-500 font-mono">
                Target Waste Classification:
              </div>
              <h3
                className="text-base font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.wasteType}
              </h3>

              <div className="p-3 rounded-xl bg-black/80 border border-emerald-950 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Matched Entity:</span>
                  <span className="text-gray-200 font-bold">{match.entityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Distance Radius:</span>
                  <span className="text-amber-300">{match.distanceKm} km away</span>
                </div>
                {match.rateOffered && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Yield Rate:</span>
                    <span className="text-emerald-400 font-bold">{match.rateOffered}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] pt-1 text-gray-400 border-t border-gray-900">
                  <span>Direct Contact:</span>
                  <span className="text-gray-300">{match.contactInfo}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={match.status === "dispatched"}
                onClick={() => dispatchEcoMatch(match.id)}
                className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all font-mono"
                style={{
                  background:
                    match.status === "dispatched"
                      ? "rgba(57, 255, 136, 0.15)"
                      : "linear-gradient(135deg, rgba(57, 255, 136, 0.3), rgba(57, 255, 136, 0.1))",
                  color: "var(--sq-green)",
                  border: "1px solid var(--sq-green)",
                  cursor: match.status === "dispatched" ? "default" : "pointer",
                }}
              >
                {match.status === "dispatched" ? "✓ DISPATCH SCHEDULED" : "SCHEDULE DISPATCH // +40 PTS"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
