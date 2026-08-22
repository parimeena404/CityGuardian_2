"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import ShapeMotifs from "@/components/ShapeMotifs";

export default function LandingPage() {
  const { role } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-role", role);
  }, [role]);

  const teamName = "ECHO STRIKER";
  const contestantId = "CG-00456";

  return (
    <div className="scanline-overlay grid-bg min-h-screen flex flex-col items-center justify-center relative px-4 py-12">
      <ShapeMotifs />

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-2xl space-y-8">
        {/* Welcome header */}
        <div className="text-center animate-fade-in-up">
          <p
            className="text-xs tracking-[6px] uppercase mb-4"
            style={{ color: "var(--sq-text-muted)", fontFamily: "var(--font-display)" }}
          >
            ○ △ □ — CITY GUARDIAN PROTOCOL — □ △ ○
          </p>
          <h1
            className="text-4xl md:text-6xl font-black tracking-wider mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            WELCOME,
          </h1>
          <h2
            className="text-3xl md:text-5xl font-black tracking-wider"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
          >
            {teamName}
          </h2>
        </div>

        {/* Contestant Badge Card */}
        <div className="contestant-card animate-fade-in-up-delay-1 animate-glow-pulse">
          {/* Exit Arena button */}
          <div className="absolute top-4 right-4">
            <button
              className="text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg transition-all hover:opacity-80"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(255, 46, 109, 0.1)",
                color: "var(--sq-pink)",
                border: "1px solid rgba(255, 46, 109, 0.3)",
              }}
            >
              Exit Arena
            </button>
          </div>

          <div className="flex items-start gap-6 flex-wrap">
            {/* Avatar / ID icon */}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(57, 255, 136, 0.08)",
                color: "var(--sq-green)",
                border: "1px solid rgba(57, 255, 136, 0.2)",
              }}
            >
              △
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span
                  className="text-lg font-bold tracking-wider"
                  style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
                >
                  CONTESTANT
                </span>
                <span className="status-pill status-pill-active">
                  <span className="dot" />
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] tracking-wider uppercase block" style={{ color: "var(--sq-text-muted)" }}>
                    ID Code
                  </span>
                  <span
                    className="text-sm font-bold tracking-[3px]"
                    style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
                  >
                    {contestantId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase block" style={{ color: "var(--sq-text-muted)" }}>
                    Team
                  </span>
                  <span
                    className="text-sm font-bold tracking-wider"
                    style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
                  >
                    {teamName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase block" style={{ color: "var(--sq-text-muted)" }}>
                    Points
                  </span>
                  <span
                    className="text-sm font-bold tracking-wider"
                    style={{ fontFamily: "var(--font-display)", color: "var(--sq-gold)" }}
                  >
                    1,240
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Mission Panel */}
        <div className="glass-panel p-6 animate-fade-in-up-delay-2">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--sq-gold)", boxShadow: "0 0 8px var(--sq-gold)" }}
            />
            <span
              className="text-xs font-bold tracking-[3px] uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--sq-gold)" }}
            >
              ASSIGNED MISSION
            </span>
          </div>

          <h3
            className="text-lg font-bold tracking-wider mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            Operation: Clean Grid Delta
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--sq-text-muted)" }}>
            Identify and report 5 waste accumulation hotspots in your ward. Document evidence via
            geo-tagged photos and classify waste type. Collaborate with 2+ team members to validate
            findings. Deadline: 72 hours from mission deployment.
          </p>

          {/* Seal strip */}
          <div className="seal-strip py-3 px-4 rounded-lg flex items-center gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="shrink-0"
            >
              <circle cx="9" cy="9" r="8" stroke="var(--sq-green)" strokeWidth="1.5" opacity="0.6" />
              <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="var(--sq-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="text-xs tracking-wider"
              style={{ color: "var(--sq-green)", opacity: 0.8 }}
            >
              Your mission has been logged. Progress is tracked continuously.
            </span>
          </div>
        </div>

        {/* Enter button */}
        <div className="text-center animate-fade-in-up-delay-3">
          <Link
            href="/player/overview"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold tracking-[3px] uppercase no-underline transition-all hover:scale-105"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, rgba(57, 255, 136, 0.15), rgba(57, 255, 136, 0.05))",
              color: "var(--sq-green)",
              border: "1px solid rgba(57, 255, 136, 0.3)",
              boxShadow: "0 0 30px rgba(57, 255, 136, 0.1)",
            }}
          >
            <span>ENTER THE ARENA</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>

          <p className="text-[10px] tracking-widest uppercase mt-4" style={{ color: "var(--sq-text-muted)" }}>
            ○ △ □ — Every action counts. Every point matters. — □ △ ○
          </p>
        </div>
      </div>
    </div>
  );
}
