"use client";

import React, { useState } from "react";
import { type BadgeTier } from "@/store/usePlayerStore";

interface DepartmentScorecard {
  id: string;
  name: string;
  headOfficer: string;
  jurisdiction: string;
  assignedClocks: number;
  initialAvgIndex: number;
  currentAvgIndex: number;
  improvementPct: number;
  badgeTier: BadgeTier;
  actionTicketsResolved: number;
  slaCompliance: number;
  subClocks: {
    title: string;
    ward: string;
    reduction: number;
    tier: BadgeTier;
  }[];
}

const DEPARTMENTS: DepartmentScorecard[] = [
  {
    id: "dept-1",
    name: "CPCB Air Enforcement Division",
    headOfficer: "Dr. Arvind Swaminathan (Director Enforcement)",
    jurisdiction: "Metropolitan Air Quality & OCEMS Oversight",
    assignedClocks: 6,
    initialAvgIndex: 240,
    currentAvgIndex: 154,
    improvementPct: 35.8,
    badgeTier: "gold",
    actionTicketsResolved: 84,
    slaCompliance: 96.4,
    subClocks: [
      { title: "Ward 14 AQI Suppression", ward: "Ward 14", reduction: 35.4, tier: "gold" },
      { title: "Ward 22 Industrial Emission Clock", ward: "Ward 22", reduction: 31.7, tier: "gold" },
      { title: "Anand Vihar Smog Hotspot Clock", ward: "Ward 07", reduction: 28.2, tier: "silver" },
    ],
  },
  {
    id: "dept-2",
    name: "Delhi Jal Board & Waterways Taskforce",
    headOfficer: "Er. Suniti Rao (Chief Engineer)",
    jurisdiction: "Yamuna Tributary & Stormwater Outflow Canal Grids",
    assignedClocks: 4,
    initialAvgIndex: 32.0,
    currentAvgIndex: 23.2,
    improvementPct: 27.5,
    badgeTier: "silver",
    actionTicketsResolved: 42,
    slaCompliance: 91.2,
    subClocks: [
      { title: "Riverfront BOD Interception Clock", ward: "Ward 18", reduction: 42.1, tier: "gold" },
      { title: "Old Mandi Effluent Treatment Clock", ward: "Ward 09", reduction: 18.4, tier: "bronze" },
    ],
  },
  {
    id: "dept-3",
    name: "Municipal Solid Waste Diversion Wing",
    headOfficer: "Shri K.L. Meena (Commissioner Sanitation)",
    jurisdiction: "Source Segregation, Bio-Digesters & Landfill Zero",
    assignedClocks: 8,
    initialAvgIndex: 110,
    currentAvgIndex: 78,
    improvementPct: 29.1,
    badgeTier: "silver",
    actionTicketsResolved: 128,
    slaCompliance: 94.8,
    subClocks: [
      { title: "Ward 14 PET Segregation Clock", ward: "Ward 14", reduction: 32.0, tier: "gold" },
      { title: "Commercial Food Rescue Clock", ward: "Ward 18", reduction: 24.5, tier: "silver" },
      { title: "University Zero-Waste Hub Clock", ward: "Ward 03", reduction: 57.5, tier: "gold" },
    ],
  },
  {
    id: "dept-4",
    name: "Public Works Dept (PWD) Smog & Roadways",
    headOfficer: "Er. Rajesh Kashyap (Superintending Engineer)",
    jurisdiction: "Anti-Smog Guns, Road Dust Suppression & Pothole SLA",
    assignedClocks: 5,
    initialAvgIndex: 140,
    currentAvgIndex: 118,
    improvementPct: 15.7,
    badgeTier: "bronze",
    actionTicketsResolved: 68,
    slaCompliance: 88.5,
    subClocks: [
      { title: "Sector 29 Road Dust Sprinkler Clock", ward: "Ward 14", reduction: 18.2, tier: "bronze" },
      { title: "Ring Road Pothole Closure SLA Clock", ward: "Ward 11", reduction: 12.5, tier: "bronze" },
    ],
  },
];

export default function DepartmentConsoleView() {
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>("dept-1");

  const toggleExpand = (id: string) => {
    setExpandedDeptId((prev) => (prev === id ? null : id));
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
              ● OUTCOME-BASED ACCOUNTABILITY SCORECARDS
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            DEPARTMENT PERFORMANCE CONSOLE
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Departments are scored exclusively on MEASURED environmental outcomes and verified SLA completions, eliminating opaque progress reports.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg border border-pink-500/40 bg-pink-950/40 text-pink-400 font-bold">
            AUDIT CYCLE: Q3 ACTIVE
          </span>
        </div>
      </div>

      {/* Department Scorecard Table with Expandable Rows */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-pink-950/80 bg-black/70">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-6 py-4 bg-black/80 border-b border-pink-950/60 text-[10px] font-mono uppercase tracking-widest text-gray-400">
          <div className="col-span-4">Department / Enforcement Unit</div>
          <div className="col-span-2 text-center">Outcome Score</div>
          <div className="col-span-2 text-center">Badge Tier</div>
          <div className="col-span-2 text-center">SLA Compliance</div>
          <div className="col-span-2 text-right">Assigned Clocks</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-900">
          {DEPARTMENTS.map((dept) => {
            const isExpanded = expandedDeptId === dept.id;

            return (
              <div key={dept.id} className="transition-all">
                <div
                  onClick={() => toggleExpand(dept.id)}
                  className="grid grid-cols-12 gap-2 px-6 py-5 items-center cursor-pointer transition-colors hover:bg-pink-950/15"
                >
                  {/* Department Name & Head */}
                  <div className="col-span-4 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">
                        {dept.name}
                      </span>
                      <span className="text-xs text-pink-400">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      Lead: {dept.headOfficer}
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">
                      Scope: {dept.jurisdiction}
                    </div>
                  </div>

                  {/* Outcome Score % */}
                  <div className="col-span-2 text-center font-mono">
                    <span className="text-base font-black text-emerald-400">
                      -{dept.improvementPct}%
                    </span>
                    <div className="text-[9px] text-gray-500">INDEX SUPPRESSION</div>
                  </div>

                  {/* Badge Tier Earned */}
                  <div className="col-span-2 text-center">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider"
                      style={{
                        background:
                          dept.badgeTier === "gold"
                            ? "rgba(255, 209, 102, 0.2)"
                            : dept.badgeTier === "silver"
                            ? "rgba(200, 200, 200, 0.2)"
                            : "rgba(205, 127, 50, 0.2)",
                        color:
                          dept.badgeTier === "gold"
                            ? "var(--sq-gold)"
                            : dept.badgeTier === "silver"
                            ? "#ffffff"
                            : "#cd7f32",
                        border: "1px solid currentColor",
                      }}
                    >
                      ● {dept.badgeTier.toUpperCase()} BADGE
                    </span>
                  </div>

                  {/* SLA Compliance */}
                  <div className="col-span-2 text-center font-mono">
                    <span className="text-sm font-bold text-white">
                      {dept.slaCompliance}%
                    </span>
                    <div className="text-[9px] text-emerald-400">
                      {dept.actionTicketsResolved} Tickets Closed
                    </div>
                  </div>

                  {/* Assigned Clocks */}
                  <div className="col-span-2 text-right font-mono">
                    <span className="text-sm font-bold text-pink-400">
                      {dept.assignedClocks} Clocks
                    </span>
                    <div className="text-[9px] text-gray-500">ACTIVE TELEMETRY</div>
                  </div>
                </div>

                {/* Expanded Details: Assigned Ward Clocks Drilldown */}
                {isExpanded && (
                  <div className="px-6 py-4 bg-black/90 border-t border-b border-pink-950/40 space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold">
                      ASSIGNED DIGITAL CLOCKS // AUDIT TELEMETRY BREAKDOWN:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {dept.subClocks.map((sub, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-black/60 border border-gray-800 space-y-1 font-mono text-xs"
                        >
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>{sub.ward}</span>
                            <span className="text-emerald-400 font-bold">
                              -{sub.reduction}% SUPPRESSION
                            </span>
                          </div>
                          <div className="font-bold text-white text-xs">{sub.title}</div>
                          <div className="flex justify-between items-center pt-1 text-[10px]">
                            <span className="text-gray-500">Tier Status:</span>
                            <span className="text-amber-300 font-bold uppercase">
                              {sub.tier} BADGE
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
