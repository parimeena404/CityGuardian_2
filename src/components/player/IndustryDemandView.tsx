"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function IndustryDemandView() {
  const { b2bDemands, triggerSealAlert } = usePlayerStore();
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const handleOfferSupply = (listingTitle: string) => {
    triggerSealAlert(
      "B2B SUPPLY OFFER TRANSMITTED",
      35,
      `Industrial procurement team notified for ${listingTitle}. +35 PTS credited for supply chain linkage.`
    );
    setSelectedListing(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ B2B CIRCULAR SUPPLY DESK
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            INDUSTRY DEMAND LISTINGS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Direct procurement bulletin where registered manufacturers and recycling plants bid on high-volume secondary raw materials.
          </p>
        </div>

        <div
          className="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3 shrink-0"
          style={{ borderColor: "var(--sq-green)" }}
        >
          <span className="text-xl">🏭</span>
          <div className="font-mono">
            <div className="text-[9px] uppercase text-gray-400">Total B2B Demand</div>
            <div className="text-xs font-bold text-emerald-400">39.5 TONS / MONTH ACTIVE</div>
          </div>
        </div>
      </div>

      {/* Listings Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {b2bDemands.map((demand) => (
          <div
            key={demand.id}
            className="glass-panel p-6 rounded-2xl border flex flex-col justify-between space-y-4 bg-black/60 transition-all hover:border-emerald-700/80"
            style={{ borderColor: "rgba(57, 255, 136, 0.25)" }}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/60 uppercase">
                  {demand.industryCategory}
                </span>

                <span
                  className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono tracking-wider"
                  style={{
                    background:
                      demand.urgency === "high"
                        ? "rgba(255, 46, 109, 0.15)"
                        : "rgba(255, 209, 102, 0.15)",
                    color:
                      demand.urgency === "high"
                        ? "var(--sq-pink)"
                        : "var(--sq-gold)",
                    border: "1px solid currentColor",
                  }}
                >
                  ⚡ {demand.urgency.toUpperCase()} URGENCY
                </span>
              </div>

              <h3
                className="text-base font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {demand.industryName}
              </h3>
              <p className="text-xs text-emerald-400 font-mono mb-3">
                Material Required: <span className="text-white font-bold">{demand.materialNeeded}</span>
              </p>

              <div className="p-3.5 rounded-xl bg-black/80 border border-emerald-950/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target Volume:</span>
                  <span className="text-white font-bold">{demand.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Offered Price:</span>
                  <span className="text-amber-300 font-bold">{demand.priceOffered}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 text-gray-400 border-t border-gray-900">
                  <span>Procurement Desk:</span>
                  <span className="text-gray-300">{demand.contact}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleOfferSupply(demand.industryName)}
                className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all font-mono"
                style={{
                  background: "linear-gradient(135deg, rgba(57, 255, 136, 0.25), rgba(57, 255, 136, 0.05))",
                  color: "var(--sq-green)",
                  border: "1px solid var(--sq-green)",
                  cursor: "pointer",
                }}
              >
                OFFER FEEDSTOCK SUPPLY // +35 PTS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
