"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function RewardsVaultView() {
  const { rewards, points, badgeTier, claimReward } = usePlayerStore();
  const [selectedRewardCode, setSelectedRewardCode] = useState<string | null>(null);

  const handleClaim = (id: string, code: string) => {
    const success = claimReward(id);
    if (success) {
      setSelectedRewardCode(code);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-amber-400 font-mono">
              ○ △ □ ARENA REWARD DISPENSARY
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            REWARDS VAULT
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Exchange your verified telemetry points for transit passes, zero-waste gear, Mission LiFE grocery grants, and tree dedications.
          </p>
        </div>

        {/* Live Points Available Pill */}
        <div
          className="glass-panel px-5 py-3 rounded-xl flex items-center gap-3 shrink-0"
          style={{ borderColor: "var(--sq-gold)" }}
        >
          <span className="text-2xl">💳</span>
          <div>
            <div className="text-[10px] uppercase text-gray-400">Available Balance</div>
            <div
              className="text-xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--sq-gold)" }}
            >
              {points.toLocaleString()} <span className="text-xs font-normal text-gray-400">PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((rew) => {
          const isUnlocked = points >= rew.pointsRequired;
          const isClaimed = rew.isClaimed;

          return (
            <div
              key={rew.id}
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 border transition-all ${
                isClaimed
                  ? "border-emerald-500/40 bg-emerald-950/20"
                  : isUnlocked
                  ? "border-amber-400/40 bg-black/60 shadow-[0_0_20px_rgba(255,209,102,0.1)]"
                  : "border-gray-900 bg-black/40 opacity-70"
              }`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{rew.icon}</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 uppercase">
                      {rew.category}
                    </span>
                    {isClaimed ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase font-bold">
                        CLAIMED
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase font-bold">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-500 border border-gray-800 uppercase font-bold">
                        🔒 LOCKED
                      </span>
                    )}
                  </div>
                </div>

                <h3
                  className="text-base font-bold tracking-wide text-white mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {rew.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {rew.description}
                </p>
              </div>

              {/* Action / Cost Footer */}
              <div className="space-y-3 pt-3 border-t border-gray-900">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">Required Points:</span>
                  <span
                    className="text-sm font-black"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: isUnlocked ? "var(--sq-gold)" : "var(--sq-text-muted)",
                    }}
                  >
                    {rew.pointsRequired} PTS
                  </span>
                </div>

                {isClaimed ? (
                  <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-center font-mono">
                    <div className="text-[9px] uppercase text-emerald-400">VOUCHER CODE</div>
                    <div className="text-xs font-black text-white tracking-widest">{rew.code}</div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => handleClaim(rew.id, rew.code)}
                    className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: isUnlocked
                        ? "linear-gradient(135deg, rgba(255, 209, 102, 0.3), rgba(255, 209, 102, 0.1))"
                        : "rgba(30, 30, 30, 0.5)",
                      color: isUnlocked ? "var(--sq-gold)" : "#555555",
                      border: isUnlocked ? "1px solid var(--sq-gold)" : "1px solid #333333",
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                    }}
                  >
                    {isUnlocked ? "CLAIM REWARD" : `NEED ${rew.pointsRequired - points} MORE PTS`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
