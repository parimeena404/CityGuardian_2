"use client";

import React from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface PeopleViewProps {
  section: "citizen-reports-queue" | "restaurant-ngo-partners";
}

export default function PeopleViews({ section }: PeopleViewProps) {
  const {
    wasteReports,
    verifyWasteReport,
    restaurantPartners,
    ngoClaims,
    mealsRescuedCount,
  } = usePlayerStore();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-black tracking-[3px] uppercase px-2 py-0.5 rounded font-mono"
            style={{
              background: "rgba(255, 46, 109, 0.15)",
              color: "var(--sq-pink)",
              border: "1px solid rgba(255, 46, 109, 0.3)",
            }}
          >
            ● PEOPLE & CIVIL STAKEHOLDER MATRIX
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-black tracking-wider uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
        >
          {section === "citizen-reports-queue"
            ? "CITIZEN REPORTS VERIFICATION QUEUE"
            : "RESTAURANT & NGO PARTNERS AUDIT DESK"}
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-mono">
          Municipal supervisory oversight. Review incoming citizen geotagged evidence, audit registered kitchens, and inspect food rescue routing.
        </p>
      </div>

      {/* 1. Citizen Reports Queue */}
      {section === "citizen-reports-queue" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-gray-400">
            <span>INCOMING QUEUE: {wasteReports.length} HOTSPOTS LOGGED</span>
            <span className="text-pink-400">AUTOMATIC GEO-FENCE AUDIT ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteReports.map((report) => (
              <div
                key={report.id}
                className="glass-panel rounded-2xl overflow-hidden border border-pink-950/80 bg-black/70 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden relative bg-black">
                    <img
                      src={report.photoUrl}
                      alt={report.locationName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-pink-400 border border-pink-900">
                      {report.category.toUpperCase()}
                    </span>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-gray-300">
                      📍 {report.geoLat.toFixed(4)}, {report.geoLng.toFixed(4)}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 font-mono text-xs">
                    <div className="font-bold text-white truncate">{report.locationName}</div>
                    <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">
                      {report.notes}
                    </p>
                    <div className="text-[10px] text-gray-500">
                      Logged: {new Date(report.createdAt).toLocaleTimeString()} • Status:{" "}
                      <span className="text-white font-bold uppercase">{report.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {report.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() => verifyWasteReport(report.id)}
                      className="w-full py-2 rounded-lg text-xs font-black uppercase font-mono bg-pink-500/20 text-pink-400 border border-pink-500/40 hover:scale-105 transition-all"
                    >
                      Verify & Award +20 Bonus
                    </button>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center font-mono text-xs text-emerald-400 font-bold">
                      ✓ VERIFIED BY MUNICIPAL NODE
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Restaurant & NGO Partners Desk */}
      {section === "restaurant-ngo-partners" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Verified Kitchens</div>
              <div className="text-3xl font-black text-pink-400 mt-1">
                {restaurantPartners.length} PARTNERS
              </div>
              <div className="text-[11px] text-gray-500">FSSAI License Validated</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Total Food Rescued</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {mealsRescuedCount.toLocaleString()} MEALS
              </div>
              <div className="text-[11px] text-emerald-400">Zero Commercial Dump Waste</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-pink-950 bg-black/70">
              <div className="text-xs text-gray-400">Active NGO Claims</div>
              <div className="text-3xl font-black text-amber-300 mt-1">
                {ngoClaims.length} RELIEF LOTS
              </div>
              <div className="text-[11px] text-gray-500">Fleet Dispatch Armed</div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-pink-950/80 bg-black/80">
            <div className="px-6 py-4 border-b border-pink-950/60 font-mono text-xs font-bold text-white uppercase">
              REGISTERED COMMERCIAL FOOD ESTABLISHMENTS
            </div>
            <div className="divide-y divide-gray-900 font-mono text-xs">
              {restaurantPartners.map((p) => (
                <div key={p.id} className="p-4 px-6 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.address} • Contact: {p.contact}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                      FSSAI: {p.fssaiLicense}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
