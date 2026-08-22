"use client";

import React, { useState } from "react";
import { usePlayerStore, type CommunityProject } from "@/store/usePlayerStore";

export default function CommunityProjectsView() {
  const { projects, upvoteProject, joinProject, createProject } = usePlayerStore();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Waterways Cleanliness");
  const [ward, setWard] = useState("Ward 14 - Cyber Hub");

  const proposed = projects.filter((p) => p.status === "proposed");
  const inProgress = projects.filter((p) => p.status === "in_progress");
  const completed = projects.filter((p) => p.status === "completed");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createProject({
      title: title.trim(),
      description: description.trim(),
      category,
      leaderName: "Contestant 456",
      ward,
      status: "proposed",
    });

    setShowModal(false);
    setTitle("");
    setDescription("");
  };

  const renderCard = (project: CommunityProject) => (
    <div
      key={project.id}
      className="glass-panel p-4 rounded-xl space-y-3 border transition-all hover:border-emerald-700/80 bg-black/60"
      style={{ borderColor: "rgba(57, 255, 136, 0.2)" }}
    >
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
          {project.category}
        </span>
        <span className="text-gray-500">📍 {project.ward}</span>
      </div>

      <h4
        className="text-sm font-bold text-white leading-snug"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {project.title}
      </h4>

      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
        {project.description}
      </p>

      <div className="text-[10px] text-gray-500 font-mono">
        LEADER: {project.leaderName}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-950/80">
        <button
          type="button"
          onClick={() => upvoteProject(project.id)}
          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
            project.hasUpvoted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400"
              : "bg-black/60 text-gray-400 border border-gray-800 hover:border-emerald-500"
          }`}
        >
          <span>▲</span>
          <span>{project.upvotes}</span>
        </button>

        <button
          type="button"
          onClick={() => joinProject(project.id)}
          className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
            project.hasJoined
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400"
              : "bg-emerald-950/40 text-gray-300 border border-emerald-900/60 hover:text-emerald-400"
          }`}
        >
          {project.hasJoined ? `✓ SQUAD (${project.volunteerCount})` : `+ JOIN (${project.volunteerCount})`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ CIVIC COLLABORATION KANBAN
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            COMMUNITY PROJECTS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Propose municipal eco-infrastructure, vote on community initiatives, and join active volunteer taskforces.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl text-xs font-black tracking-widest uppercase cursor-pointer transition-all hover:scale-105 shrink-0"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, rgba(57, 255, 136, 0.3), rgba(57, 255, 136, 0.1))",
            color: "var(--sq-green)",
            border: "1px solid var(--sq-green)",
            boxShadow: "0 0 20px rgba(57, 255, 136, 0.2)",
          }}
        >
          + PROPOSE NEW PROJECT
        </button>
      </div>

      {/* Kanban Board 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Proposed Column */}
        <div className="space-y-4">
          <div
            className="p-3 rounded-xl flex items-center justify-between border"
            style={{
              background: "rgba(255, 209, 102, 0.08)",
              borderColor: "rgba(255, 209, 102, 0.3)",
            }}
          >
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-black tracking-wider uppercase text-amber-300">
                PROPOSED
              </span>
            </div>
            <span className="text-xs font-mono text-gray-400 font-bold">{proposed.length}</span>
          </div>

          <div className="space-y-3">
            {proposed.map((p) => renderCard(p))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="space-y-4">
          <div
            className="p-3 rounded-xl flex items-center justify-between border"
            style={{
              background: "rgba(57, 255, 136, 0.08)",
              borderColor: "rgba(57, 255, 136, 0.3)",
            }}
          >
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-emerald-400">
                IN PROGRESS
              </span>
            </div>
            <span className="text-xs font-mono text-gray-400 font-bold">{inProgress.length}</span>
          </div>

          <div className="space-y-3">
            {inProgress.map((p) => renderCard(p))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="space-y-4">
          <div
            className="p-3 rounded-xl flex items-center justify-between border"
            style={{
              background: "rgba(0, 200, 255, 0.08)",
              borderColor: "rgba(0, 200, 255, 0.3)",
            }}
          >
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-black tracking-wider uppercase text-cyan-300">
                COMPLETED & ACTIVE
              </span>
            </div>
            <span className="text-xs font-mono text-gray-400 font-bold">{completed.length}</span>
          </div>

          <div className="space-y-3">
            {completed.map((p) => renderCard(p))}
          </div>
        </div>
      </div>

      {/* Propose Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="glass-panel p-6 max-w-lg w-full rounded-2xl border space-y-4"
            style={{
              background: "rgba(10, 16, 12, 0.95)",
              borderColor: "var(--sq-green)",
              boxShadow: "0 0 40px rgba(57, 255, 136, 0.2)",
            }}
          >
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <h3
                className="text-base font-black tracking-wider uppercase"
                style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
              >
                PROPOSE CIVIC PROJECT
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ward 14 Rainwater Catchment Swales"
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Biomass Energy">Biomass Energy</option>
                    <option value="Waterways Cleanliness">Waterways Cleanliness</option>
                    <option value="Renewable Tech">Renewable Tech</option>
                    <option value="Rooftop Farming">Rooftop Farming</option>
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
                  Project Description & Action Plan
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the objective, materials needed, and community impact..."
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-mono uppercase border border-gray-800 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase font-mono"
                  style={{
                    background: "var(--sq-green)",
                    color: "var(--sq-bg)",
                  }}
                >
                  LOG PROPOSAL // +30 PTS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
