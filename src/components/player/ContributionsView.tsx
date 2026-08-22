"use client";

import React, { useMemo } from "react";
import { usePlayerStore, type Contribution } from "@/store/usePlayerStore";

// Group contributions by day
function groupContributionsByDay(contributions: Contribution[]) {
  const groups: { [key: string]: Contribution[] } = {};
  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

  contributions.forEach((item) => {
    const itemDate = new Date(item.createdAt).toDateString();
    let label = itemDate;
    if (itemDate === todayStr) label = "TODAY'S OPERATIONS";
    else if (itemDate === yesterdayStr) label = "YESTERDAY'S TELEMETRY";
    else {
      label = new Date(item.createdAt).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).toUpperCase();
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
}

export default function ContributionsView() {
  const { contributions, points } = usePlayerStore();

  const grouped = useMemo(() => groupContributionsByDay(contributions), [contributions]);

  const totalEarned = contributions
    .filter((c) => c.points > 0)
    .reduce((acc, c) => acc + c.points, 0);

  const totalSpent = contributions
    .filter((c) => c.points < 0)
    .reduce((acc, c) => acc + Math.abs(c.points), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ ARENA LEDGER
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            MY CONTRIBUTIONS & LOGS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Unified reverse-chronological activity stream. Every log, verification bonus, and reward redemption is cryptographically recorded.
          </p>
        </div>

        {/* Ledger Balance Quick Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="glass-panel px-4 py-2.5 rounded-xl text-center"
            style={{ borderColor: "var(--sq-green)" }}
          >
            <div className="text-[9px] uppercase tracking-wider text-gray-400">Total Yield</div>
            <div
              className="text-base font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
            >
              +{totalEarned} PTS
            </div>
          </div>

          <div
            className="glass-panel px-4 py-2.5 rounded-xl text-center"
            style={{ borderColor: "rgba(255, 46, 109, 0.4)" }}
          >
            <div className="text-[9px] uppercase tracking-wider text-gray-400">Redeemed</div>
            <div
              className="text-base font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--sq-pink)" }}
            >
              -{totalSpent} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Day Stream */}
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-xl text-gray-400 text-xs">
            No telemetry records logged yet. Report your first waste hotspot to begin.
          </div>
        ) : (
          Object.entries(grouped).map(([dayLabel, items]) => (
            <div key={dayLabel} className="space-y-3">
              {/* Day Header Pill */}
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-black tracking-[3px] uppercase px-3 py-1 rounded-md"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "rgba(57, 255, 136, 0.1)",
                    color: "var(--sq-green)",
                    border: "1px solid rgba(57, 255, 136, 0.25)",
                  }}
                >
                  {dayLabel}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-900/50 to-transparent" />
              </div>

              {/* Items in that Day */}
              <div className="space-y-2">
                {items.map((item) => {
                  const isPositive = item.points > 0;
                  return (
                    <div
                      key={item.id}
                      className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:bg-emerald-950/20"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                          style={{
                            background: isPositive
                              ? "rgba(57, 255, 136, 0.12)"
                              : "rgba(255, 46, 109, 0.12)",
                            color: isPositive ? "var(--sq-green)" : "var(--sq-pink)",
                            border: isPositive
                              ? "1px solid rgba(57, 255, 136, 0.3)"
                              : "1px solid rgba(255, 46, 109, 0.3)",
                          }}
                        >
                          {item.type === "verified_bonus"
                            ? "✓"
                            : item.type === "waste_report"
                            ? "📸"
                            : item.type === "reward_redeemed"
                            ? "🎁"
                            : item.type === "food_rescue"
                            ? "🍲"
                            : "⚡"}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-sm font-bold tracking-wide text-gray-200"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {item.title}
                            </span>
                            {/* Mini Status Pill */}
                            <span
                              className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                              style={{
                                background:
                                  item.status === "verified"
                                    ? "rgba(57, 255, 136, 0.15)"
                                    : item.status === "pending"
                                    ? "rgba(255, 209, 102, 0.15)"
                                    : "rgba(255, 46, 109, 0.15)",
                                color:
                                  item.status === "verified"
                                    ? "var(--sq-green)"
                                    : item.status === "pending"
                                    ? "var(--sq-gold)"
                                    : "var(--sq-pink)",
                                border:
                                  item.status === "verified"
                                    ? "1px solid rgba(57, 255, 136, 0.3)"
                                    : item.status === "pending"
                                    ? "1px solid rgba(255, 209, 102, 0.3)"
                                    : "1px solid rgba(255, 46, 109, 0.3)",
                              }}
                            >
                              ● {item.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="text-[10px] text-gray-500 font-mono mt-1">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} • ID: {item.id}
                          </div>
                        </div>
                      </div>

                      {/* Points Delta Badge */}
                      <div className="sm:text-right shrink-0">
                        <span
                          className="inline-block px-3 py-1 rounded-lg text-xs font-black tracking-wider font-mono"
                          style={{
                            background: isPositive
                              ? "rgba(57, 255, 136, 0.15)"
                              : "rgba(255, 46, 109, 0.15)",
                            color: isPositive ? "var(--sq-green)" : "var(--sq-pink)",
                            border: isPositive
                              ? "1px solid rgba(57, 255, 136, 0.3)"
                              : "1px solid rgba(255, 46, 109, 0.3)",
                          }}
                        >
                          {isPositive ? `+${item.points}` : item.points} PTS
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
