"use client";

import React, { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface GovConnectProps {
  section: "government-connect" | "civic-issue-tracker";
}

export default function GovernmentConnectView({ section }: GovConnectProps) {
  const { triggerSealAlert } = usePlayerStore();

  const [issueTitle, setIssueTitle] = useState("");
  const [ward, setWard] = useState("Ward 14 - Cyber Hub");
  const [department, setDepartment] = useState("Pollution Control / CPCB");
  const [issueDesc, setIssueDesc] = useState("");

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle || !issueDesc) return;

    triggerSealAlert(
      "CIVIC e-FIR FILED",
      25,
      `Ticket generated for ${department}. Municipal tracking ID #EFIR-${Date.now().toString().slice(-6)}. +25 PTS granted.`
    );

    setIssueTitle("");
    setIssueDesc("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
            ○ △ □ GOVERNMENT & CIVIC DIRECTIVES
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-black tracking-wider uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
        >
          {section === "government-connect"
            ? "CPCB & MISSION LiFE CITIZEN DIRECTIVES"
            : "CIVIC ISSUE & e-FIR TRACKER"}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Official statutory coordination interface connecting citizen reporting directly with the Central Pollution Control Board (CPCB) and Urban Local Bodies (ULB).
        </p>
      </div>

      {section === "government-connect" && (
        <div className="space-y-6">
          {/* Mission LiFE Banner */}
          <div
            className="glass-panel p-6 rounded-2xl border bg-black/60 space-y-3"
            style={{ borderColor: "var(--sq-green)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-400 font-mono">
                🌱 MISSION LiFE (LIFESTYLE FOR ENVIRONMENT) DIRECTIVES
              </span>
              <span className="text-[10px] font-mono text-gray-400">CPCB REGULATION v4.1</span>
            </div>

            <h3
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              National Circular Economy & Landfill Zero Mandate
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Citizens reporting commercial unsegregated dumping zones directly enable municipal sanctions and municipal waste diversion points. Every verified log submits an auto-generated compliance certificate.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/80 border border-emerald-950">
                <div className="text-[10px] font-mono text-gray-400">MUNICIPAL TARGET</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">100% Segregation at Source</div>
              </div>
              <div className="p-3 rounded-xl bg-black/80 border border-emerald-950">
                <div className="text-[10px] font-mono text-gray-400">CITIZEN BOUNTY</div>
                <div className="text-sm font-bold text-amber-300 font-mono">+10 SUBMIT / +20 VERIFY</div>
              </div>
              <div className="p-3 rounded-xl bg-black/80 border border-emerald-950">
                <div className="text-[10px] font-mono text-gray-400">COMPLIANCE SLA</div>
                <div className="text-sm font-bold text-white font-mono">24-Hour Municipal Dispatch</div>
              </div>
            </div>
          </div>

          {/* Statutory Directives List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                code: "EPR-2022-PLASTIC",
                title: "Extended Producer Responsibility (EPR) Plastic Quota",
                desc: "Brand owners must recover 100% of rigid & flexible multi-layered packaging.",
                agency: "CPCB Hazardous Division",
              },
              {
                code: "SOLID-WASTE-2016",
                title: "Bulk Waste Generator On-Site Composting Mandate",
                desc: "Gated communities & commercial malls exceeding 100kg/day must process wet waste on-site.",
                agency: "Urban Local Body (ULB)",
              },
            ].map((dir, i) => (
              <div
                key={i}
                className="glass-panel p-5 rounded-xl border border-emerald-950 bg-black/60 space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">{dir.code}</span>
                  <span className="text-gray-500">{dir.agency}</span>
                </div>
                <h4
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {dir.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">{dir.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === "civic-issue-tracker" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Issue Form */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-emerald-950 bg-black/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-950 pb-3 font-mono text-xs text-emerald-400">
              <span>⚖️ LODGE FORMAL CIVIC e-FIR</span>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Violation Subject
                </label>
                <input
                  type="text"
                  required
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="e.g. Illegal Open Waste Burning at Sector 14 Drainage"
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                    Department Liaison
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Pollution Control / CPCB">Pollution Control / CPCB</option>
                    <option value="Municipal Corporation Sanitation">Municipal Sanitation</option>
                    <option value="Waterways Authority">Waterways Authority</option>
                    <option value="Industrial Safety Inspectorate">Industrial Safety</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                    Ward Location
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Incident Evidence & Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  placeholder="State specific coordinates, estimated volume, and repeat violation history..."
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-xs font-black tracking-widest uppercase font-mono transition-all"
                style={{
                  background: "linear-gradient(135deg, rgba(57, 255, 136, 0.3), rgba(57, 255, 136, 0.1))",
                  color: "var(--sq-green)",
                  border: "1px solid var(--sq-green)",
                }}
              >
                LODGE OFFICIAL e-FIR // CLAIM +25 PTS
              </button>
            </form>
          </div>

          {/* Active Tickets Timeline */}
          <div className="lg:col-span-6 space-y-4">
            <h3
              className="text-sm font-bold tracking-wider uppercase text-gray-300 font-mono"
            >
              LIVE CIVIC TICKET TIMELINE
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: "EFIR-998241",
                  title: "Open Incineration of Plastic Packaging",
                  dept: "CPCB Hazardous Enforcement",
                  status: "INVESTIGATION DISPATCHED",
                  statusColor: "var(--sq-pink)",
                  time: "2 hours ago",
                },
                {
                  id: "EFIR-998120",
                  title: "Unsegregated Debris Blocking Storm Drainage",
                  dept: "Municipal Sanitation Node",
                  status: "RESOLVED & AUDITED",
                  statusColor: "var(--sq-green)",
                  time: "14 hours ago",
                },
                {
                  id: "EFIR-997904",
                  title: "Hazardous Chemical Runoff in Drain 4",
                  dept: "Waterways Authority",
                  status: "EVIDENCE SAMPLES TAKEN",
                  statusColor: "var(--sq-gold)",
                  time: "1 day ago",
                },
              ].map((t) => (
                <div
                  key={t.id}
                  className="glass-panel p-4 rounded-xl border border-emerald-950/80 bg-black/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-gray-400 font-bold">{t.id}</span>
                    <span
                      className="px-2 py-0.5 rounded font-black uppercase text-[9px]"
                      style={{
                        background: "rgba(0,0,0,0.6)",
                        color: t.statusColor,
                        border: `1px solid ${t.statusColor}`,
                      }}
                    >
                      ● {t.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white">{t.title}</div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-900">
                    <span>{t.dept}</span>
                    <span>{t.time}</span>
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
