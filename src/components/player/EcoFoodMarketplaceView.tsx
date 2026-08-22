"use client";

import React, { useState, useEffect } from "react";
import { usePlayerStore, type FoodListing } from "@/store/usePlayerStore";

export default function EcoFoodMarketplaceView() {
  const { foodListings, reserveFoodListing, mealsRescuedCount } = usePlayerStore();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activePickupCode, setActivePickupCode] = useState<string | null>(null);

  // Time remaining calculation helper
  const calculateRemainingTime = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "EXPIRED";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m left`;
  };

  const categories = ["all", "Banquet Meals", "Bakery", "Healthy/Vegan", "Relief Bulk"];

  const filtered = foodListings.filter((item) => {
    if (item.isDonation) return false; // Show for citizens on marketplace, donations routed to NGO view
    if (categoryFilter === "all") return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-pink-400 font-mono">
              ○ △ □ ZERO FOOD WASTE COMMERCE
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            ECOFOOD MARKETPLACE
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Premium cafes, artisan bakeries, and banquet kitchens selling fresh surplus food at 50%–70% off. Prevent landfill methane emissions.
          </p>
        </div>

        {/* Live Stat Badges */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div
            className="glass-panel px-4 py-2.5 rounded-xl border border-pink-500/40 bg-black/60 text-center"
          >
            <div className="text-[9px] uppercase text-gray-400 font-mono">Total Rescued</div>
            <div
              className="text-lg font-black font-mono text-pink-400"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {mealsRescuedCount.toLocaleString()} MEALS
            </div>
          </div>

          <div
            className="glass-panel px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-black/60 text-center"
          >
            <div className="text-[9px] uppercase text-gray-400 font-mono">CO2 Avoided</div>
            <div
              className="text-lg font-black font-mono text-emerald-400"
              style={{ fontFamily: "var(--font-display)" }}
            >
              12.4 TONS
            </div>
          </div>
        </div>
      </div>

      {/* Social-Proof Strip */}
      <div
        className="glass-panel p-4 rounded-xl border flex items-center justify-between flex-wrap gap-4"
        style={{
          background: "linear-gradient(90deg, rgba(255, 46, 109, 0.08), rgba(57, 255, 136, 0.08))",
          borderColor: "rgba(255, 46, 109, 0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍲</span>
          <div>
            <div className="text-xs font-bold text-white font-mono">
              COMMUNITY IMPACT METRIC: {mealsRescuedCount} CERTIFIED MEALS SAVED
            </div>
            <div className="text-[11px] text-gray-400">
              48 Partnered kitchens in Ward 14 & Ward 18 dispatching fresh food daily.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-bold">14 SURPLUS BATCHES ACTIVE NOW</span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 border border-pink-950 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase transition-all ${
                categoryFilter === cat
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "All Kitchens" : cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-gray-400">
          Showing {filtered.length} discounted listings
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isClaimed = item.status === "claimed";
          const remainingText = calculateRemainingTime(item.expiresAt);

          return (
            <div
              key={item.id}
              className={`glass-panel rounded-2xl overflow-hidden border flex flex-col justify-between transition-all ${
                isClaimed
                  ? "border-gray-800 bg-black/40 opacity-75"
                  : "border-pink-950/80 bg-black/60 hover:border-pink-500/50 shadow-[0_0_20px_rgba(255,46,109,0.05)]"
              }`}
            >
              <div>
                {/* Photo & Badge */}
                <div className="aspect-video w-full overflow-hidden relative bg-black/80">
                  <img
                    src={item.photoUrl}
                    alt={item.item}
                    className="w-full h-full object-cover"
                  />

                  {/* 50% OFF Pill */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-black uppercase font-mono tracking-wider"
                    style={{
                      background: "rgba(255, 46, 109, 0.95)",
                      color: "#ffffff",
                      boxShadow: "0 0 10px rgba(255, 46, 109, 0.6)",
                    }}
                  >
                    ⚡ {item.discountPercent}% OFF
                  </span>

                  {/* Countdown pill */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/80 border border-amber-500/40 text-[10px] font-mono text-amber-300">
                    ⏳ {remainingText}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="text-[10px] text-pink-400 font-mono uppercase tracking-wider">
                      {item.restaurantName}
                    </div>
                    <h3
                      className="text-base font-bold text-white mt-0.5 leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.item}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono pt-1 text-gray-300">
                    <span>Available Volume:</span>
                    <span className="text-white font-bold">{item.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-5 pt-0 space-y-3 border-t border-gray-900 mt-2">
                <div className="flex items-center justify-between font-mono pt-3">
                  <div>
                    <span className="text-xs text-gray-500 line-through mr-2">
                      ₹{item.originalPrice}
                    </span>
                    <span
                      className="text-lg font-black text-pink-400"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      ₹{item.discountPrice}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    +30 PTS BONUS
                  </span>
                </div>

                {isClaimed ? (
                  <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-center font-mono text-xs">
                    <span className="text-emerald-400 font-bold">✓ RESERVED BY YOU</span>
                    {item.pickupCode && (
                      <div className="text-[10px] text-gray-300 mt-0.5">
                        TOKEN: <span className="font-bold text-white">{item.pickupCode}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => reserveFoodListing(item.id)}
                    className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.01]"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 46, 109, 0.35), rgba(255, 46, 109, 0.1))",
                      color: "var(--sq-pink)",
                      border: "1px solid var(--sq-pink)",
                      boxShadow: "0 0 15px rgba(255, 46, 109, 0.2)",
                    }}
                  >
                    RESERVE MEAL // CLAIM CODE
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
