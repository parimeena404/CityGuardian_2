"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface ComplianceBreach {
  id: string;
  efirNumber: string;
  violatorEntity: string;
  entityType: "Industrial Plant" | "Commercial Banquet" | "Construction Developer" | "Waste Hauler";
  ward: string;
  violationType: string;
  statutoryAct: string;
  measuredLevel: string;
  prescribedLimit: string;
  penaltyInr: number;
  status: "flagged" | "notice_issued" | "efir_dispatched" | "penalty_levied" | "resolved";
  flaggedAt: string;
}

const INITIAL_BREACHES: ComplianceBreach[] = [
  {
    id: "br-1",
    efirNumber: "EFIR-2026-CPCB-0084",
    violatorEntity: "Apex Chemical Synthetics Ltd",
    entityType: "Industrial Plant",
    ward: "Ward 22 - Industrial Belt",
    violationType: "Continuous Stack Emission SO2 & VOC Exceedance (OCEMS Trigger)",
    statutoryAct: "Air (Prevention & Control of Pollution) Act Sec 21",
    measuredLevel: "185 mg/Nm³",
    prescribedLimit: "80 mg/Nm³",
    penaltyInr: 500000,
    status: "penalty_levied",
    flaggedAt: "Today, 09:15 IST",
  },
  {
    id: "br-2",
    efirNumber: "EFIR-2026-CPCB-0085",
    violatorEntity: "Silver Oak Towers Construction Hub",
    entityType: "Construction Developer",
    ward: "Ward 14 - Cyber Hub",
    violationType: "Uncovered Construction & Demolition (C&D) Dust Plume",
    statutoryAct: "C&D Waste Management Rules 2016",
    measuredLevel: "284 PM10",
    prescribedLimit: "100 PM10",
    penaltyInr: 250000,
    status: "efir_dispatched",
    flaggedAt: "Today, 11:30 IST",
  },
  {
    id: "br-3",
    efirNumber: "EFIR-2026-ULB-0041",
    violatorEntity: "Metro Commercial Food Court Zone B",
    entityType: "Commercial Banquet",
    ward: "Ward 18 - Riverfront",
    violationType: "Direct Wet Organic Dumping into Open Stormwater Drain",
    statutoryAct: "Solid Waste Management Rules 2016",
    measuredLevel: "420 kg Unsegregated",
    prescribedLimit: "0 kg (Mandatory Bio-digestion)",
    penaltyInr: 100000,
    status: "notice_issued",
    flaggedAt: "Yesterday, 16:45 IST",
  },
  {
    id: "br-4",
    efirNumber: "EFIR-2026-CPCB-0079",
    violatorEntity: "Northern Scrap Smelting Furnace 02",
    entityType: "Industrial Plant",
    ward: "Ward 22 - Industrial Belt",
    violationType: "Night-time Furnace Bag-filter Bypass",
    statutoryAct: "Environment (Protection) Act 1986",
    measuredLevel: "340 µg/m³ PM2.5",
    prescribedLimit: "60 µg/m³",
    penaltyInr: 750000,
    status: "resolved",
    flaggedAt: "2 days ago",
  },
];

export default function ComplianceEfirLogView() {
  const { triggerSealAlert } = usePlayerStore();
  const [breaches, setBreaches] = useState<ComplianceBreach[]>(INITIAL_BREACHES);
  const [selectedBreach, setSelectedBreach] = useState<ComplianceBreach | null>(null);

  const totalPenalties = breaches.reduce((acc, b) => acc + b.penaltyInr, 0);

  const handleUpdateStatus = (id: string, nextStatus: ComplianceBreach["status"]) => {
    setBreaches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b))
    );
    triggerSealAlert(
      "STATUTORY ENFORCEMENT ESCALATED",
      50,
      `e-FIR status updated to ${nextStatus.toUpperCase()}. Legal notice recorded in State Pollution Board registry.`
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              ● LAW & ENVIRONMENTAL GOVERNANCE LOG
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            COMPLIANCE BREACH & e-FIR LOG
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Automated statutory breach tracker. Sensor OCEMS triggers and verified citizen telemetry auto-generate legal e-FIRs and penalty notices.
          </p>
        </div>

        {/* Penalty Counter */}
        <div className="glass-panel px-5 py-3 rounded-2xl border border-pink-500/40 bg-black/70 font-mono text-right shrink-0">
          <div className="text-[10px] text-gray-400 uppercase">Total Penalties Levied</div>
          <div
            className="text-xl font-black text-pink-400"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ₹{totalPenalties.toLocaleString()} INR
          </div>
        </div>
      </div>

      {/* Compliance Breaches Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-pink-950/80 bg-black/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-black/90 border-b border-pink-950/80 text-[10px] uppercase text-gray-400 tracking-wider">
                <th className="p-4 px-6">e-FIR Record / Entity</th>
                <th className="p-4">Violation Details</th>
                <th className="p-4">Telemetry vs Limit</th>
                <th className="p-4 text-right">Penalty</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Legal Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-xs">
              {breaches.map((b) => (
                <tr key={b.id} className="hover:bg-pink-950/15 transition-colors">
                  {/* Entity */}
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[10px] font-bold">
                        {b.efirNumber}
                      </span>
                    </div>
                    <div className="font-bold text-white mt-1">{b.violatorEntity}</div>
                    <div className="text-[10px] text-gray-500">{b.ward} • {b.entityType}</div>
                  </td>

                  {/* Violation */}
                  <td className="p-4 max-w-xs">
                    <div className="text-gray-200 text-xs font-bold leading-tight">{b.violationType}</div>
                    <div className="text-[10px] text-pink-400 mt-0.5">{b.statutoryAct}</div>
                  </td>

                  {/* Measured vs Limit */}
                  <td className="p-4">
                    <div className="text-pink-400 font-bold">{b.measuredLevel}</div>
                    <div className="text-[10px] text-gray-500">Limit: {b.prescribedLimit}</div>
                  </td>

                  {/* Penalty */}
                  <td className="p-4 text-right font-black text-amber-300">
                    ₹{b.penaltyInr.toLocaleString()}
                  </td>

                  {/* Status Pipeline Pill */}
                  <td className="p-4 text-center">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider"
                      style={{
                        background:
                          b.status === "resolved"
                            ? "rgba(57, 255, 136, 0.15)"
                            : b.status === "penalty_levied"
                            ? "rgba(255, 46, 109, 0.2)"
                            : "rgba(255, 209, 102, 0.15)",
                        color:
                          b.status === "resolved"
                            ? "var(--sq-green)"
                            : b.status === "penalty_levied"
                            ? "var(--sq-pink)"
                            : "var(--sq-gold)",
                        border: "1px solid currentColor",
                      }}
                    >
                      ● {b.status.replace("_", " ").toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    {b.status !== "resolved" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            b.id,
                            b.status === "notice_issued"
                              ? "efir_dispatched"
                              : b.status === "efir_dispatched"
                              ? "penalty_levied"
                              : "resolved"
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase font-mono bg-pink-500/20 text-pink-400 border border-pink-500/40 hover:scale-105 transition-all"
                      >
                        {b.status === "notice_issued" ? "Dispatch e-FIR" : b.status === "efir_dispatched" ? "Levy Penalty" : "Close Case"}
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold">✓ AUDITED</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
