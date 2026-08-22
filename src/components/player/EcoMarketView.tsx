"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function EcoMarketView() {
  const { marketItems, points, triggerSealAlert } = usePlayerStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Furniture", "Apparel", "Kitchenware", "Gardening"];
  const filtered = selectedCategory === "all"
    ? marketItems
    : marketItems.filter((i) => i.category === selectedCategory);

  const handlePurchase = (itemTitle: string, pricePoints: number) => {
    if (points < pricePoints) {
      alert("Insufficient points in your arena wallet.");
      return;
    }
    triggerSealAlert(
      "ECOMARKET ORDER CONFIRMED",
      -pricePoints,
      `Purchased ${itemTitle}. Dispatching package from circular artisan workshop.`
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ ZERO-WASTE COMMERCE
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            ECOMARKET
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Exchange points or currency for verified upcycled goods, recovered surplus items, and artisan zero-waste home products.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 shrink-0 border border-emerald-950 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase transition-all ${
                selectedCategory === c
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {c === "all" ? "All Goods" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-2xl overflow-hidden border border-emerald-950 flex flex-col justify-between transition-all hover:border-emerald-700/80 bg-black/60"
          >
            <div>
              <div className="aspect-square w-full bg-black/80 overflow-hidden relative">
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-400 border border-emerald-900">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-1.5">
                <div className="text-[10px] text-gray-500 font-mono">
                  WORKSHOP: {item.sellerName}
                </div>
                <h3
                  className="text-sm font-bold text-white line-clamp-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-2">
                  {item.condition}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono border-t border-emerald-950/80 pt-2">
                <span className="text-emerald-400 font-bold">{item.pricePoints} PTS</span>
                <span className="text-gray-400">or ₹{item.priceInr}</span>
              </div>

              <button
                type="button"
                onClick={() => handlePurchase(item.title, item.pricePoints)}
                className="w-full py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-all font-mono"
                style={{
                  background: "rgba(57, 255, 136, 0.15)",
                  color: "var(--sq-green)",
                  border: "1px solid rgba(57, 255, 136, 0.3)",
                }}
              >
                ACQUIRE PRODUCT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
