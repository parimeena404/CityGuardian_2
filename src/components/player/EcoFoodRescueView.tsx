"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface EcoFoodProps {
  section: "ecofood-marketplace" | "restaurant-partner" | "ngo-food-rescue";
}

export default function EcoFoodRescueView({ section }: EcoFoodProps) {
  const { triggerSealAlert } = usePlayerStore();

  const [restaurantName, setRestaurantName] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodType, setFoodType] = useState("Cooked Banquet Meals");

  const handleRescueDispatch = (donor: string, qty: string) => {
    triggerSealAlert(
      "FOOD RESCUE DISPATCH INITIATED",
      75,
      `NGO courier assigned to collect ${qty} from ${donor}. Clean transit protocol activated. +75 PTS awarded.`
    );
  };

  const handleLogSurplus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName || !foodQuantity) return;
    triggerSealAlert(
      "RESTAURANT SURPLUS LOGGED",
      50,
      `Logged ${foodQuantity} of ${foodType} from ${restaurantName}. Emergency shelter notified. +50 PTS awarded.`
    );
    setRestaurantName("");
    setFoodQuantity("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black tracking-[3px] uppercase text-pink-400 font-mono">
            ○ △ □ ECOFOOD RESCUE NETWORK
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-black tracking-wider uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
        >
          {section === "ecofood-marketplace"
            ? "ECOFOOD MARKETPLACE // 50% OFF"
            : section === "restaurant-partner"
            ? "RESTAURANT PARTNER SURPLUS CONSOLE"
            : "NGO FOOD RESCUE DISPATCH"}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Zero food waste protocol. Divert pristine commercial kitchen surplus to community kitchens and discounted citizen distribution.
        </p>
      </div>

      {section === "ecofood-marketplace" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              hotel: "The Imperial Grand Banquet",
              item: "Gourmet Continental & Mediterranean Buffet Surplus",
              qty: "40 Portions Available",
              originalPrice: 850,
              discountPrice: 250,
              discount: "70% OFF",
              expiry: "Pickup within 90 mins",
              photo: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=60",
            },
            {
              hotel: "Artisan Sourdough Bakery",
              item: "Fresh Artisan Baguettes, Brioche & Croissants Assortment",
              qty: "18 Packs Available",
              originalPrice: 400,
              discountPrice: 160,
              discount: "60% OFF",
              expiry: "Pickup by 9:00 PM",
              photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60",
            },
            {
              hotel: "Green Leaf Organic Café",
              item: "Cold-Pressed Detox Juices & Fresh Salads Batch",
              qty: "12 Bottles",
              originalPrice: 350,
              discountPrice: 140,
              discount: "60% OFF",
              expiry: "Pickup within 2 hours",
              photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60",
            },
          ].map((deal, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden border border-pink-950 flex flex-col justify-between bg-black/60 transition-all hover:border-pink-500/50"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden relative">
                  <img src={deal.photo} alt={deal.item} className="w-full h-full object-cover" />
                  <span
                    className="absolute top-2 right-2 px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-mono tracking-wider"
                    style={{
                      background: "rgba(255, 46, 109, 0.9)",
                      color: "#ffffff",
                    }}
                  >
                    {deal.discount}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[10px] text-pink-400 font-mono">{deal.hotel}</div>
                  <h3
                    className="text-sm font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {deal.item}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono">📦 {deal.qty}</div>
                  <div className="text-[11px] text-amber-300 font-mono">⏳ {deal.expiry}</div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between font-mono text-xs border-t border-gray-900 pt-2">
                  <span className="text-gray-500 line-through">₹{deal.originalPrice}</span>
                  <span className="text-pink-400 font-black text-sm">₹{deal.discountPrice}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRescueDispatch(deal.hotel, deal.qty)}
                  className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase font-mono transition-all"
                  style={{
                    background: "rgba(255, 46, 109, 0.2)",
                    color: "var(--sq-pink)",
                    border: "1px solid var(--sq-pink)",
                  }}
                >
                  RESERVE ECO-MEAL // +75 PTS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "restaurant-partner" && (
        <div className="max-w-2xl mx-auto glass-panel p-6 rounded-2xl border border-pink-950/80 bg-black/60 space-y-4">
          <div className="flex items-center gap-2 border-b border-pink-950 pb-3 font-mono text-xs text-pink-400">
            <span>🍽️ RESTAURANT SURPLUS LOGGING DESK</span>
          </div>

          <form onSubmit={handleLogSurplus} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Establishment Name
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Radisson Blu Kitchen Ward 14"
                className="w-full bg-black/60 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Surplus Quantity (kg / portions)
                </label>
                <input
                  type="text"
                  required
                  value={foodQuantity}
                  onChange={(e) => setFoodQuantity(e.target.value)}
                  placeholder="e.g. 50 Portions / 25 kg"
                  className="w-full bg-black/60 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Food Category
                </label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="w-full bg-black/60 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                >
                  <option value="Cooked Banquet Meals">Cooked Banquet Meals</option>
                  <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                  <option value="Raw Produce & Vegetables">Raw Produce & Vegetables</option>
                  <option value="Packaged Dairy & Juices">Packaged Dairy & Juices</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-xs font-black tracking-widest uppercase font-mono transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(255, 46, 109, 0.3), rgba(255, 46, 109, 0.1))",
                color: "var(--sq-pink)",
                border: "1px solid var(--sq-pink)",
              }}
            >
              TRANSMIT SURPLUS LOG // CLAIM +50 PTS
            </button>
          </form>
        </div>
      )}

      {section === "ngo-food-rescue" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                ngo: "Annapurna Food Shelter Foundation",
                ward: "Ward 14 & 15 Central Area",
                activeCouriers: 6,
                mealsDeliveredToday: 340,
                contact: "+91 99880 11223",
              },
              {
                ngo: "Feeding Bharat City Matrix",
                ward: "Ward 18 Riverfront & Cyber Zone",
                activeCouriers: 11,
                mealsDeliveredToday: 780,
                contact: "+91 98110 55442",
              },
            ].map((ngo, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-pink-950 bg-black/60 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-pink-400 font-mono">
                    🛡️ NGO RESCUE CORPS
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ACTIVE SQUAD
                  </span>
                </div>

                <h3
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {ngo.ngo}
                </h3>
                <div className="space-y-1.5 text-xs font-mono text-gray-300">
                  <div>Sector Grid: {ngo.ward}</div>
                  <div>Active Field Couriers: {ngo.activeCouriers} Units</div>
                  <div>Meals Routed Today: {ngo.mealsDeliveredToday} portions</div>
                  <div className="text-gray-400">Emergency Helpline: {ngo.contact}</div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerSealAlert("VOLUNTEER SQUAD ENLISTED", 50, "Enrolled as on-demand food rescue driver.")}
                  className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase font-mono"
                  style={{
                    background: "rgba(255, 46, 109, 0.15)",
                    color: "var(--sq-pink)",
                    border: "1px solid rgba(255, 46, 109, 0.4)",
                  }}
                >
                  ENLIST AS FIELD COURIER // +50 PTS
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
