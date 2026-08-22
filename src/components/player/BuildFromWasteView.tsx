"use client";

import React, { useState } from "react";
import { usePlayerStore, type UpcycledBuild } from "@/store/usePlayerStore";

export default function BuildFromWasteView() {
  const { builds, upvoteBuild, submitBuild } = usePlayerStore();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState("");
  const [creatorName, setCreatorName] = useState("Contestant 456");
  const [description, setDescription] = useState("");
  const [materialsStr, setMaterialsStr] = useState("");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60"
  );

  const featuredBuild = builds.find((b) => b.isFeatured) || builds[0];
  const galleryBuilds = builds.filter((b) => b.id !== featuredBuild?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    submitBuild({
      creatorName: creatorName.trim() || "Contestant 456",
      title: title.trim(),
      description: description.trim(),
      materials: materialsStr
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      photoUrl,
    });

    setShowSubmitModal(false);
    setTitle("");
    setDescription("");
    setMaterialsStr("");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ CIRCULAR ECONOMY SHOWCASE
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            BUILD FROM WASTE GALLERY
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Showcase upcycled creations built exclusively from discarded urban materials. Submit your prototype to earn <span className="text-emerald-400 font-bold">+50 PTS</span> and crowd acclaim.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-5 py-3 rounded-xl text-xs font-black tracking-widest uppercase cursor-pointer transition-all hover:scale-105 shrink-0"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, rgba(57, 255, 136, 0.3), rgba(57, 255, 136, 0.1))",
            color: "var(--sq-green)",
            border: "1px solid var(--sq-green)",
            boxShadow: "0 0 20px rgba(57, 255, 136, 0.2)",
          }}
        >
          + SUBMIT YOUR BUILD
        </button>
      </div>

      {/* Featured Build Hero Slot */}
      {featuredBuild && (
        <div
          className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden border-2"
          style={{
            borderColor: "var(--sq-green)",
            boxShadow: "0 0 35px rgba(57, 255, 136, 0.2)",
          }}
        >
          {/* Top Banner Tag */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span
                className="text-xs font-black tracking-[3px] uppercase font-mono text-emerald-400"
                style={{ fontFamily: "var(--font-display)" }}
              >
                FEATURED CIRCULAR MASTERPIECE
              </span>
            </div>
            <span className="text-xs font-mono text-gray-400">
              COMMUNITY PICK OF THE WEEK
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Image */}
            <div className="lg:col-span-6 aspect-video rounded-xl overflow-hidden border border-emerald-950 bg-black/60 relative">
              <img
                src={featuredBuild.photoUrl}
                alt={featuredBuild.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-400">
                BY: {featuredBuild.creatorName.toUpperCase()}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-6 space-y-4">
              <h2
                className="text-xl md:text-2xl font-bold tracking-wide text-white leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {featuredBuild.title}
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                {featuredBuild.description}
              </p>

              {/* Upcycled Materials Chips */}
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1.5">
                  Upcycled Feedstock Components:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {featuredBuild.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-900/60"
                    >
                      ♻️ {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upvote & Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => upvoteBuild(featuredBuild.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                    featuredBuild.hasUpvoted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400"
                      : "bg-black/60 text-gray-300 border border-gray-800 hover:border-emerald-500"
                  }`}
                >
                  <span>▲</span>
                  <span>{featuredBuild.upvotes} Upvotes</span>
                </button>

                <span className="text-[11px] font-mono text-gray-500">
                  {new Date(featuredBuild.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Gallery Grid */}
      <div className="space-y-4">
        <h2
          className="text-base font-bold tracking-wider uppercase text-gray-300"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CITIZEN PROTOTYPE REGISTRY
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryBuilds.map((build) => (
            <div
              key={build.id}
              className="glass-panel rounded-xl overflow-hidden border border-emerald-950 flex flex-col justify-between transition-all hover:border-emerald-800"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-black/60 relative">
                  <img
                    src={build.photoUrl}
                    alt={build.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-emerald-500/30 text-[9px] font-mono text-emerald-400">
                    {build.creatorName}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3
                    className="text-sm font-bold text-white line-clamp-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {build.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {build.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {build.materials.slice(0, 2).map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-gray-300 border border-gray-800"
                      >
                        {m}
                      </span>
                    ))}
                    {build.materials.length > 2 && (
                      <span className="text-[9px] font-mono text-gray-500 px-1 py-0.5">
                        +{build.materials.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => upvoteBuild(build.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    build.hasUpvoted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400"
                      : "bg-black/60 text-gray-400 border border-gray-800 hover:border-emerald-500"
                  }`}
                >
                  <span>▲</span>
                  <span>{build.upvotes}</span>
                </button>

                <span className="text-[10px] font-mono text-gray-500">
                  {new Date(build.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Build Modal */}
      {showSubmitModal && (
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
                SUBMIT UPCYCLED PROTOTYPE
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Prototype Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Desk Lamp from Scrap Server Boards"
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Creator / Squad Name
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Feedstock Materials Used (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={materialsStr}
                  onChange={(e) => setMaterialsStr(e.target.value)}
                  placeholder="Scrap PCBs, Copper Pipe, Jute Sack"
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Photo URL or Link
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Engineering & Fabrication Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain how you upcycled discarded items..."
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
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
                  PUBLISH // +50 PTS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
