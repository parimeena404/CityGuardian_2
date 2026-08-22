"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function NgoFoodRescueView() {
  const {
    foodListings,
    ngoClaims,
    claimForNGO,
    updateNGOClaimStatus,
    mealsRescuedCount,
  } = usePlayerStore();

  const [selectedNgo, setSelectedNgo] = useState("Annapurna Food Shelter Foundation");

  // Only show donation items available for NGO relief dispatch
  const donationListings = foodListings.filter((f) => f.isDonation && f.status === "available");

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ NGO RELIEF DISPATCH NETWORK
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            NGO FOOD RESCUE & HUNGER RELIEF
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Dedicated logistics console for verified NGOs. Claim donated commercial food batches and track real-time dispatch couriers from kitchen to hunger shelters.
          </p>
        </div>

        {/* Impact Counter */}
        <div
          className="glass-panel px-5 py-3 rounded-xl border border-emerald-500/40 bg-black/60 text-center shrink-0"
        >
          <div className="text-[9px] uppercase text-gray-400 font-mono">Meals Routed to Shelters</div>
          <div
            className="text-xl font-black font-mono text-emerald-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {mealsRescuedCount.toLocaleString()} PORTIONS
          </div>
        </div>
      </div>

      {/* Select NGO Identity Header */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-950 bg-black/60 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-gray-300">
          <span>Active NGO Organization:</span>
          <select
            value={selectedNgo}
            onChange={(e) => setSelectedNgo(e.target.value)}
            className="bg-black/80 border border-emerald-950 rounded px-2.5 py-1 text-emerald-400 font-bold"
          >
            <option value="Annapurna Food Shelter Foundation">Annapurna Food Shelter Foundation</option>
            <option value="Robin Hood Army Delhi Corps">Robin Hood Army Delhi Corps</option>
            <option value="Feeding Bharat Relief Matrix">Feeding Bharat Relief Matrix</option>
          </select>
        </div>

        <span className="text-[10px] font-mono text-gray-400">
          DISPATCH COORDINATOR: SQUAD 04 (WARD 14/18)
        </span>
      </div>

      {/* Available Donated Food Batches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm font-black tracking-wider uppercase text-gray-200 font-mono"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AVAILABLE DONATION BATCHES ({donationListings.length})
          </h2>
          <span className="text-xs font-mono text-emerald-400">100% FREE RELIEF INTAKE</span>
        </div>

        {donationListings.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-xl border border-gray-900 text-gray-500 text-xs font-mono">
            No unclaimed donation lots available right now. Partner kitchens notify automatically when batches are cooked.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donationListings.map((listing) => (
              <div
                key={listing.id}
                className="glass-panel p-6 rounded-2xl border border-emerald-950 bg-black/60 flex flex-col justify-between space-y-4 transition-all hover:border-emerald-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      🎁 DONATION BATCH
                    </span>
                    <span className="text-xs font-mono text-amber-300">
                      Intake Volume: {listing.quantity}
                    </span>
                  </div>

                  <h3
                    className="text-base font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {listing.item}
                  </h3>
                  <div className="text-xs text-emerald-400 font-mono mb-2">
                    Donor: {listing.restaurantName}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-900">
                  <button
                    type="button"
                    onClick={() => claimForNGO(listing.id, selectedNgo)}
                    className="w-full py-2.5 rounded-lg text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.01]"
                    style={{
                      background: "linear-gradient(135deg, rgba(57, 255, 136, 0.35), rgba(57, 255, 136, 0.1))",
                      color: "var(--sq-green)",
                      border: "1px solid var(--sq-green)",
                    }}
                  >
                    CLAIM FOR RELIEF DRIVE // +75 PTS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Logistics Pipeline (Claimed → En Route → Collected) */}
      <div className="space-y-4">
        <h2
          className="text-sm font-black tracking-wider uppercase text-gray-200 font-mono"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ACTIVE RELIEF PICKUP LOGISTICS PIPELINE
        </h2>

        <div className="space-y-3">
          {ngoClaims.map((claim) => (
            <div
              key={claim.id}
              className="glass-panel p-5 rounded-2xl border border-emerald-950 bg-black/60 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono">CLAIM REF #{claim.id}</span>
                  <h3 className="text-sm font-bold text-white font-mono mt-0.5">
                    {claim.listingItem}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono">
                    From: <span className="text-emerald-400 font-bold">{claim.restaurantName}</span> ➔ To:{" "}
                    <span className="text-white font-bold">{claim.ngoName}</span>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {claim.portionsCount} Meals Escorted
                </span>
              </div>

              {/* Visual Logistics Stepper (Claimed → En Route → Collected) */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2">
                <button
                  type="button"
                  onClick={() => updateNGOClaimStatus(claim.id, "claimed")}
                  className={`p-2.5 rounded-xl border transition-all ${
                    claim.pickupStatus === "claimed"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400 font-bold"
                      : "bg-black/60 text-gray-500 border-gray-900"
                  }`}
                >
                  1. CLAIMED
                </button>

                <button
                  type="button"
                  onClick={() => updateNGOClaimStatus(claim.id, "en_route")}
                  className={`p-2.5 rounded-xl border transition-all ${
                    claim.pickupStatus === "en_route"
                      ? "bg-pink-500/20 text-pink-400 border-pink-400 font-bold shadow-[0_0_15px_rgba(255,46,109,0.2)]"
                      : "bg-black/60 text-gray-500 border-gray-900"
                  }`}
                >
                  2. 🚚 EN ROUTE
                </button>

                <button
                  type="button"
                  onClick={() => updateNGOClaimStatus(claim.id, "collected")}
                  className={`p-2.5 rounded-xl border transition-all ${
                    claim.pickupStatus === "collected"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-400 font-bold"
                      : "bg-black/60 text-gray-500 border-gray-900"
                  }`}
                >
                  3. ✓ COLLECTED
                </button>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-gray-400 pt-1 border-t border-gray-900">
                <span>Field Courier: {claim.courierName}</span>
                <span>Helpline: {claim.courierPhone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
