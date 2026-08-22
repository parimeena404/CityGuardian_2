"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface FundingGrant {
  id: string;
  source: string;
  sourceType: "Corporate CSR" | "NCAP National Grant" | "Municipal Green Bond" | "World Bank Urban";
  grantAmountInr: number;
  disbursedAmountInr: number;
  allocatedToProject: string;
  ward: string;
  milestoneStatus: "fully_disbursed" | "milestone_2_released" | "staged_pending_audit" | "approval_queue";
  milestoneProgress: number; // %
  lastAuditDate: string;
}

const FUNDING_GRANTS: FundingGrant[] = [
  {
    id: "fnd-01",
    source: "Tata Power & Renewables CSR Trust",
    sourceType: "Corporate CSR",
    grantAmountInr: 25000000,
    disbursedAmountInr: 20000000,
    allocatedToProject: "Ward 14 Decentralized Biodigester Hub & Methane Turbine",
    ward: "Ward 14 - Cyber Hub",
    milestoneStatus: "milestone_2_released",
    milestoneProgress: 80,
    lastAuditDate: "15 Aug 2026",
  },
  {
    id: "fnd-02",
    source: "National Clean Air Programme (NCAP) MoEFCC",
    sourceType: "NCAP National Grant",
    grantAmountInr: 50000000,
    disbursedAmountInr: 50000000,
    allocatedToProject: "Smart Anti-Smog Gun Array & Continuous Dust Sprinklers",
    ward: "Ward 18 & Ward 22",
    milestoneStatus: "fully_disbursed",
    milestoneProgress: 100,
    lastAuditDate: "10 Aug 2026",
  },
  {
    id: "fnd-03",
    source: "Delhi Municipal Green Infrastructure Bond (Series A)",
    sourceType: "Municipal Green Bond",
    grantAmountInr: 120000000,
    disbursedAmountInr: 45000000,
    allocatedToProject: "Yamuna Canal Micro-Plastics Catchment Booms & Bio-Swales",
    ward: "Ward 18 - Riverfront",
    milestoneStatus: "staged_pending_audit",
    milestoneProgress: 38,
    lastAuditDate: "01 Aug 2026",
  },
  {
    id: "fnd-04",
    source: "Infosys Foundation Green Cities Mandate",
    sourceType: "Corporate CSR",
    grantAmountInr: 15000000,
    disbursedAmountInr: 15000000,
    allocatedToProject: "Community Solar Benches & LiFePO4 Micro-Grid Stations",
    ward: "Ward 03 - University",
    milestoneStatus: "fully_disbursed",
    milestoneProgress: 100,
    lastAuditDate: "20 Jul 2026",
  },
  {
    id: "fnd-05",
    source: "World Bank South Asia Clean Air Initiative",
    sourceType: "World Bank Urban",
    grantAmountInr: 80000000,
    disbursedAmountInr: 20000000,
    allocatedToProject: "Automated Industrial OCEMS Telemetry Gateway Upgrades",
    ward: "Ward 22 - Industrial",
    milestoneStatus: "staged_pending_audit",
    milestoneProgress: 25,
    lastAuditDate: "22 Aug 2026",
  },
];

export default function FundingCsrTrackerView() {
  const { triggerSealAlert } = usePlayerStore();
  const [grants, setGrants] = useState<FundingGrant[]>(FUNDING_GRANTS);

  const totalCommitted = grants.reduce((acc, g) => acc + g.grantAmountInr, 0);
  const totalDisbursed = grants.reduce((acc, g) => acc + g.disbursedAmountInr, 0);
  const disbursementPct = Math.round((totalDisbursed / totalCommitted) * 100);

  const handleReleaseTranche = (id: string) => {
    setGrants((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              disbursedAmountInr: g.grantAmountInr,
              milestoneProgress: 100,
              milestoneStatus: "fully_disbursed",
            }
          : g
      )
    );

    triggerSealAlert(
      "GRANT TRANCHE RELEASED",
      100,
      "Audit requirements verified. Capital disbursed directly to project escrow account."
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
                background: "rgba(255, 209, 102, 0.15)",
                color: "var(--sq-gold)",
                border: "1px solid rgba(255, 209, 102, 0.3)",
              }}
            >
              ● TRANSPARENT CAPITAL ESCROW LEDGER
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            FUNDING & CSR PROJECT TRACKER
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Eliminating funding opacity. Track statutory CSR allocations, municipal green bond disbursements, and milestone release verification.
          </p>
        </div>

        {/* Total Ledger Balance */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="glass-panel px-4 py-2.5 rounded-xl border border-pink-500/40 bg-black/70 font-mono text-center">
            <div className="text-[9px] text-gray-400 uppercase">Total Capital Pool</div>
            <div className="text-lg font-black text-pink-400">
              ₹{(totalCommitted / 10000000).toFixed(1)} Cr INR
            </div>
          </div>

          <div className="glass-panel px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-black/70 font-mono text-center">
            <div className="text-[9px] text-gray-400 uppercase">Disbursed ({disbursementPct}%)</div>
            <div className="text-lg font-black text-emerald-400">
              ₹{(totalDisbursed / 10000000).toFixed(1)} Cr INR
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar of Capital Deployment */}
      <div className="glass-panel p-5 rounded-2xl border border-pink-950/80 bg-black/70 space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-gray-400">Metropolitan Capital Deployment Velocity:</span>
          <span className="text-emerald-400 font-bold">{disbursementPct}% Disbursed</span>
        </div>
        <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${disbursementPct}%` }}
          />
        </div>
      </div>

      {/* Capital Ledger Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-pink-950/80 bg-black/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-black/90 border-b border-pink-950/80 text-[10px] uppercase text-gray-400 tracking-wider">
                <th className="p-4 px-6">Funding Sponsor / Type</th>
                <th className="p-4">Allocated Project & Sector</th>
                <th className="p-4 text-right">Committed Capital</th>
                <th className="p-4 text-right">Disbursed</th>
                <th className="p-4 text-center">Milestone Status</th>
                <th className="p-4 text-right">Audit Release</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-xs">
              {grants.map((g) => (
                <tr key={g.id} className="hover:bg-pink-950/15 transition-colors">
                  {/* Sponsor */}
                  <td className="p-4 px-6">
                    <div className="font-bold text-white text-xs">{g.source}</div>
                    <div className="text-[10px] text-pink-400 mt-0.5">{g.sourceType}</div>
                  </td>

                  {/* Allocated Project */}
                  <td className="p-4 max-w-xs">
                    <div className="text-gray-200 text-xs font-bold leading-tight truncate">
                      {g.allocatedToProject}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">📍 {g.ward}</div>
                  </td>

                  {/* Committed */}
                  <td className="p-4 text-right font-bold text-white">
                    ₹{(g.grantAmountInr / 100000).toFixed(1)} Lakh
                  </td>

                  {/* Disbursed */}
                  <td className="p-4 text-right font-black text-emerald-400">
                    ₹{(g.disbursedAmountInr / 100000).toFixed(1)} Lakh
                  </td>

                  {/* Milestone Status */}
                  <td className="p-4 text-center">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider"
                      style={{
                        background:
                          g.milestoneStatus === "fully_disbursed"
                            ? "rgba(57, 255, 136, 0.15)"
                            : "rgba(255, 209, 102, 0.15)",
                        color:
                          g.milestoneStatus === "fully_disbursed"
                            ? "var(--sq-green)"
                            : "var(--sq-gold)",
                        border: "1px solid currentColor",
                      }}
                    >
                      ● {g.milestoneStatus.replace(/_/g, " ").toUpperCase()} ({g.milestoneProgress}%)
                    </span>
                  </td>

                  {/* Audit / Release Action */}
                  <td className="p-4 text-right">
                    {g.milestoneProgress < 100 ? (
                      <button
                        type="button"
                        onClick={() => handleReleaseTranche(g.id)}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase font-mono bg-pink-500/20 text-pink-400 border border-pink-500/40 hover:scale-105 transition-all"
                      >
                        Verify & Disburse
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Audited {g.lastAuditDate}
                      </span>
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
