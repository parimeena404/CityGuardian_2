"use client";

import React, { useState } from "react";
import { usePlayerStore, type CivicCategory, type CivicStatus } from "@/store/usePlayerStore";

const CATEGORIES: { id: CivicCategory; label: string; department: string; sla: number }[] = [
  { id: "waste_burning", label: "Illegal Open Waste Burning", department: "CPCB Air Enforcement Division", sla: 24 },
  { id: "pothole_road", label: "Hazardous Pothole / C&D Debris", department: "Public Works Department (PWD) Roads", sla: 48 },
  { id: "drainage_water", label: "Blocked Stormwater / Overflowing Sewage", department: "Municipal Water & Sanitation Board", sla: 24 },
  { id: "hazardous_chemical", label: "Toxic Chemical Runoff / Acid Spills", department: "State Pollution Control Board Emergency", sla: 12 },
  { id: "air_pollution_spike", label: "Industrial Smoke Plume Violation", department: "CPCB OCEMS Oversight Wing", sla: 12 },
  { id: "streetlight_power", label: "Street Lighting Dark Zone", department: "Municipal Electrical Infrastructure", sla: 48 },
];

export default function CivicIssueTrackerView() {
  const { civicTickets, submitCivicIssue, verifyCivicIssue, resolveCivicTicket } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<"pipeline" | "report">("pipeline");
  const [selectedCategory, setSelectedCategory] = useState<CivicCategory>("waste_burning");
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("Sector 14 Drainage Culvert, Ward 14");
  const [geoLat, setGeoLat] = useState(28.6139);
  const [geoLng, setGeoLng] = useState(77.2090);
  const [description, setDescription] = useState("");
  const [beforePhotoUrl, setBeforePhotoUrl] = useState(
    "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60"
  );
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=60"
  );

  const selectedCatObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    submitCivicIssue({
      title,
      category: selectedCategory,
      department: selectedCatObj.department,
      geoLat,
      geoLng,
      locationName,
      description,
      beforePhotoUrl,
      slaHours: selectedCatObj.sla,
    });

    setTitle("");
    setDescription("");
    setActiveTab("pipeline");
  };

  const handleResolve = (ticketId: string) => {
    resolveCivicTicket(ticketId, afterPhotoUrl);
    setResolvingTicketId(null);
  };

  const calculateSLARemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return "SLA OVERDUE";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ TRANSPARENT CIVIC ACCOUNTABILITY
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            CIVIC ISSUE & ACTION TICKET PIPELINE
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Solving the municipal trust gap. Every report requires community verification, auto-assigns official departmental action tickets, and enforces before/after photo audits to close.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 shrink-0 border border-emerald-950 font-mono text-xs">
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition-all ${
              activeTab === "pipeline"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📊 Active Action Tickets ({civicTickets.length})
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition-all ${
              activeTab === "report"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            + File Civic Violation
          </button>
        </div>
      </div>

      {/* 1. PIPELINE VIEW */}
      {activeTab === "pipeline" && (
        <div className="space-y-6">
          {/* Visual 5-Stage Accountability Legend */}
          <div className="glass-panel p-4 rounded-2xl border border-emerald-950 bg-black/60 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                <span>1. REPORTED</span>
              </div>
              <span>➔</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>2. VERIFIED (3 VOTES)</span>
              </div>
              <span>➔</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>3. ASSIGNED DEPT</span>
              </div>
              <span>➔</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                <span>4. IN PROGRESS</span>
              </div>
              <span>➔</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-bold">5. RESOLVED (BEFORE/AFTER)</span>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {civicTickets.map((ticket) => {
              const isResolved = ticket.status === "resolved";
              const slaText = calculateSLARemaining(ticket.deadline);

              return (
                <div
                  key={ticket.id}
                  className={`glass-panel p-6 rounded-2xl border bg-black/70 space-y-4 transition-all ${
                    isResolved
                      ? "border-emerald-500/40"
                      : ticket.status === "in_progress"
                      ? "border-pink-500/40 shadow-[0_0_20px_rgba(255,46,109,0.1)]"
                      : "border-amber-500/30"
                  }`}
                >
                  {/* Top Bar: Tracking ID, Department, SLA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="px-2.5 py-1 rounded text-xs font-black font-mono tracking-wider"
                        style={{
                          background: "rgba(57, 255, 136, 0.15)",
                          color: "var(--sq-green)",
                          border: "1px solid rgba(57, 255, 136, 0.3)",
                        }}
                      >
                        {ticket.trackingId}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        🏛️ {ticket.department}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isResolved
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : ticket.status === "in_progress"
                            ? "bg-pink-500/20 text-pink-400 border border-pink-500/40 animate-pulse"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        ● {ticket.status.toUpperCase()}
                      </span>

                      {!isResolved && (
                        <span className="text-amber-300 text-[11px]">
                          ⏱️ SLA: {slaText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Grid: Info + Before/After Photos */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-7 space-y-3">
                      <h3
                        className="text-base font-bold text-white"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {ticket.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {ticket.description}
                      </p>

                      <div className="p-3 rounded-xl bg-black/80 border border-gray-900 space-y-1 text-xs font-mono text-gray-400">
                        <div>Location: <span className="text-gray-200">{ticket.locationName}</span></div>
                        <div>GPS Coordinates: <span className="text-emerald-400">{ticket.geoLat.toFixed(4)}, {ticket.geoLng.toFixed(4)}</span></div>
                        <div>Assigned Municipal Officer: <span className="text-white font-bold">{ticket.assignedOfficer}</span></div>
                      </div>
                    </div>

                    {/* Photos Column */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-gray-400 mb-1">
                          BEFORE EVIDENCE
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black">
                          <img
                            src={ticket.beforePhotoUrl}
                            alt="Before Issue"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono uppercase text-gray-400 mb-1">
                          AFTER RESOLUTION
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black flex items-center justify-center">
                          {ticket.afterPhotoUrl ? (
                            <img
                              src={ticket.afterPhotoUrl}
                              alt="After Resolution"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-600 font-mono text-center px-2">
                              Awaiting municipal closure photo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-gray-800 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <button
                        type="button"
                        disabled={ticket.hasVerified}
                        onClick={() => verifyCivicIssue(ticket.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                          ticket.hasVerified
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                            : "bg-black/60 text-gray-300 border border-gray-800 hover:border-emerald-500 cursor-pointer"
                        }`}
                      >
                        <span>▲ Community Vote ({ticket.verificationCount}/{ticket.verificationThreshold})</span>
                      </button>

                      {ticket.verificationCount < ticket.verificationThreshold && (
                        <span className="text-[11px] text-gray-500">
                          Needs {ticket.verificationThreshold - ticket.verificationCount} more verification to auto-dispatch action ticket
                        </span>
                      )}
                    </div>

                    {!isResolved && (
                      <div>
                        {resolvingTicketId === ticket.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              value={afterPhotoUrl}
                              onChange={(e) => setAfterPhotoUrl(e.target.value)}
                              placeholder="After Photo URL"
                              className="bg-black/80 border border-emerald-500 rounded px-2.5 py-1 text-xs text-white font-mono"
                            />
                            <button
                              onClick={() => handleResolve(ticket.id)}
                              className="px-3 py-1 rounded bg-emerald-500 text-black text-xs font-black uppercase font-mono"
                            >
                              Seal Resolution // +50 PTS
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResolvingTicketId(ticket.id)}
                            className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40 text-xs font-mono font-bold hover:scale-105 transition-all"
                          >
                            Close Ticket with Evidence →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. REPORT NEW ISSUE FORM */}
      {activeTab === "report" && (
        <div className="max-w-2xl mx-auto glass-panel p-6 md:p-8 rounded-2xl border border-amber-500/40 bg-black/60 space-y-6">
          <div className="flex items-center justify-between border-b border-amber-950 pb-3">
            <h2
              className="text-base font-black tracking-wider uppercase text-amber-300"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FILE STATUTORY CIVIC ISSUE
            </h2>
            <span className="text-[10px] font-mono text-gray-400">+25 PTS ON FILING</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Violation Classification
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CivicCategory)}
                className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ➔ {cat.department} ({cat.sla}h SLA)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Issue Headline / Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Open plastic incineration pit behind commercial market"
                className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Location / Landmark
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Photo Evidence URL
                </label>
                <input
                  type="url"
                  value={beforePhotoUrl}
                  onChange={(e) => setBeforePhotoUrl(e.target.value)}
                  className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Detailed Violation Observations
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe scale of pollution, duration, and safety hazards..."
                className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 209, 102, 0.35), rgba(255, 209, 102, 0.1))",
                color: "var(--sq-gold)",
                border: "1px solid var(--sq-gold)",
              }}
            >
              LODGE CIVIC ISSUE // CLAIM +25 PTS
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
