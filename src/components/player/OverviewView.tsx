"use client";

import React from "react";
import Link from "next/link";
import { usePlayerStore, calculateImprovementTier } from "@/store/usePlayerStore";
import ShareImpactButton from "@/components/ShareImpactButton";

export default function OverviewView() {
  const {
    points,
    badgeTier,
    initialIndex,
    currentIndex,
    challenges,
    wasteReports,
    contributions,
  } = usePlayerStore();

  const { pct } = calculateImprovementTier(initialIndex, currentIndex);
  const activeChallenge = challenges.find((c) => c.isJoined) || challenges[0];
  const pendingReportsCount = wasteReports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Contestant Status */}
      <div className="contestant-card animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(57, 255, 136, 0.1)",
                color: "var(--sq-green)",
                border: "1px solid rgba(57, 255, 136, 0.3)",
              }}
            >
              ○
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-black tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
                >
                  CONTESTANT 456
                </h1>
                <span className="status-pill status-pill-active">
                  <span className="dot" />
                  ARENA ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                SQUAD: <span className="text-white font-bold">ECHO STRIKER</span> • WARD 14 SECTOR GRID
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-emerald-950">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Total Score</div>
                <div
                  className="text-2xl font-black"
                  style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
                >
                  {points.toLocaleString()} <span className="text-xs font-normal text-gray-400">PTS</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Badge Tier</div>
                <div
                  className="text-2xl font-black uppercase"
                  style={{
                    fontFamily: "var(--font-display)",
                    color:
                      badgeTier === "gold"
                        ? "var(--sq-gold)"
                        : badgeTier === "silver"
                        ? "#c0c0c0"
                        : "var(--sq-green)",
                  }}
                >
                  {badgeTier}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Suppression</div>
                <div
                  className="text-2xl font-black"
                  style={{ fontFamily: "var(--font-display)", color: "var(--sq-gold)" }}
                >
                  {pct}%
                </div>
              </div>
            </div>

            <div className="pt-2 sm:pt-0 shrink-0">
              <ShareImpactButton
                type="badge"
                id="user-badge"
                title={`${badgeTier.toUpperCase()} BADGE`}
                stat={`${points} PTS • ${pct}% Index Suppression`}
                ward="Ward 14 • Delhi NCR"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/player/report-waste"
          className="glass-panel p-5 rounded-xl block no-underline transition-all hover:scale-[1.02] group"
          style={{ borderColor: "rgba(57, 255, 136, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">📸</span>
            <span
              className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(57, 255, 136, 0.15)",
                color: "var(--sq-green)",
              }}
            >
              +10 PTS
            </span>
          </div>
          <h3
            className="text-base font-bold tracking-wide group-hover:text-emerald-400 transition-colors"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            Report Waste
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Capture geo-tagged photo & log sector hotspot.
          </p>
        </Link>

        <Link
          href="/player/eco-challenges"
          className="glass-panel p-5 rounded-xl block no-underline transition-all hover:scale-[1.02] group"
          style={{ borderColor: "rgba(255, 209, 102, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">⚔️</span>
            <span
              className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(255, 209, 102, 0.15)",
                color: "var(--sq-gold)",
              }}
            >
              ARENA
            </span>
          </div>
          <h3
            className="text-base font-bold tracking-wide group-hover:text-amber-300 transition-colors"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            Eco Challenges
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Compete for ₹25k pool & tier multiplier.
          </p>
        </Link>

        <Link
          href="/player/build-from-waste"
          className="glass-panel p-5 rounded-xl block no-underline transition-all hover:scale-[1.02] group"
          style={{ borderColor: "rgba(57, 255, 136, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🛠️</span>
            <span
              className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(57, 255, 136, 0.15)",
                color: "var(--sq-green)",
              }}
            >
              +50 PTS
            </span>
          </div>
          <h3
            className="text-base font-bold tracking-wide group-hover:text-emerald-400 transition-colors"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            Build From Waste
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Showcase upcycled projects to community.
          </p>
        </Link>

        <Link
          href="/player/eco-ai-handler"
          className="glass-panel p-5 rounded-xl block no-underline transition-all hover:scale-[1.02] group"
          style={{ borderColor: "rgba(255, 46, 109, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🤖</span>
            <span
              className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(255, 46, 109, 0.15)",
                color: "var(--sq-pink)",
              }}
            >
              COPILOT
            </span>
          </div>
          <h3
            className="text-base font-bold tracking-wide group-hover:text-pink-400 transition-colors"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            Eco AI Handler
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Tactical routing & upcycling advice.
          </p>
        </Link>
      </div>

      {/* Main Grid: Active Mission Briefing + Live Feed Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Arena Challenge & Scoring Simulator */}
        <div className="lg:col-span-2 space-y-6">
          {activeChallenge && (
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span
                    className="text-xs font-black tracking-[3px] uppercase"
                    style={{ fontFamily: "var(--font-display)", color: "var(--sq-gold)" }}
                  >
                    ACTIVE ARENA OPERATION
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {activeChallenge.deadline}
                </span>
              </div>

              <h2
                className="text-xl font-bold tracking-wider mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
              >
                {activeChallenge.title}
              </h2>
              <p className="text-sm text-gray-300 mb-5 leading-relaxed">
                {activeChallenge.description}
              </p>

              {/* Progress Index Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Baseline Index: {activeChallenge.initialIndex}</span>
                  <span className="text-emerald-400 font-bold">Current: {activeChallenge.currentIndex}</span>
                  <span className="text-amber-400">Target: &lt; {activeChallenge.targetIndex}</span>
                </div>
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-emerald-950">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((activeChallenge.initialIndex - activeChallenge.currentIndex) / (activeChallenge.initialIndex - activeChallenge.targetIndex)) * 100)}%`,
                      background: "linear-gradient(90deg, #39ff88, #ffd166)",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-emerald-950 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Reward Pool:</span>
                  <span
                    className="text-base font-bold text-amber-300 font-mono"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeChallenge.rewardAmount} + {activeChallenge.rewardPoints} PTS
                  </span>
                </div>

                <Link
                  href="/player/eco-challenges"
                  className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase no-underline transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "rgba(57, 255, 136, 0.15)",
                    color: "var(--sq-green)",
                    border: "1px solid rgba(57, 255, 136, 0.3)",
                  }}
                >
                  VIEW FORMULA & SQUAD →
                </Link>
              </div>
            </div>
          )}

          {/* Pending verification status strip */}
          {pendingReportsCount > 0 && (
            <div
              className="p-4 rounded-xl flex items-center justify-between flex-wrap gap-3"
              style={{
                background: "rgba(255, 209, 102, 0.05)",
                border: "1px solid rgba(255, 209, 102, 0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⏳</span>
                <div>
                  <div className="text-xs font-bold text-amber-300 font-mono">
                    {pendingReportsCount} WASTE LOGS UNDER MUNICIPAL VERIFICATION
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Each verified log unlocks +20 PTS bonus automatically.
                  </div>
                </div>
              </div>
              <Link
                href="/player/my-contributions"
                className="text-xs text-amber-400 underline font-mono"
              >
                Track Status →
              </Link>
            </div>
          )}
        </div>

        {/* Right Col: Live Activity Feed */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-bold tracking-[2px] uppercase"
                style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
              >
                ACTIVITY TELEMETRY
              </span>
              <Link
                href="/player/my-contributions"
                className="text-[11px] text-gray-400 hover:text-emerald-400 no-underline transition-colors"
              >
                All Feed →
              </Link>
            </div>

            <div className="space-y-3">
              {contributions.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg flex items-start justify-between gap-2 text-xs border border-emerald-950/60"
                  style={{ background: "rgba(10, 15, 12, 0.6)" }}
                >
                  <div>
                    <div className="font-bold text-gray-200">{item.title}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <span
                    className="font-bold font-mono px-1.5 py-0.5 rounded text-[10px] shrink-0"
                    style={{
                      color: item.points >= 0 ? "var(--sq-green)" : "var(--sq-pink)",
                      background: item.points >= 0 ? "rgba(57, 255, 136, 0.1)" : "rgba(255, 46, 109, 0.1)",
                    }}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
