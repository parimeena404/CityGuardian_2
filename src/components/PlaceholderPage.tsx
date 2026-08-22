"use client";

import React from "react";

interface PlaceholderPageProps {
  title: string;
  section: string;
  slug: string;
  mode: "player" | "frontman";
}

const shapes = [
  // Circle SVG
  (
    <svg key="circle" viewBox="0 0 120 120" fill="none" className="w-28 h-28">
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="var(--sq-accent)"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <circle
        cx="60"
        cy="60"
        r="35"
        stroke="var(--sq-accent)"
        strokeWidth="0.5"
        opacity="0.15"
        strokeDasharray="4 4"
      />
    </svg>
  ),
  // Triangle SVG
  (
    <svg key="triangle" viewBox="0 0 120 120" fill="none" className="w-28 h-28">
      <polygon
        points="60,10 110,100 10,100"
        stroke="var(--sq-accent)"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <polygon
        points="60,30 95,90 25,90"
        stroke="var(--sq-accent)"
        strokeWidth="0.5"
        opacity="0.15"
        strokeDasharray="4 4"
      />
    </svg>
  ),
  // Square SVG
  (
    <svg key="square" viewBox="0 0 120 120" fill="none" className="w-28 h-28">
      <rect
        x="15"
        y="15"
        width="90"
        height="90"
        stroke="var(--sq-accent)"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <rect
        x="30"
        y="30"
        width="60"
        height="60"
        stroke="var(--sq-accent)"
        strokeWidth="0.5"
        opacity="0.15"
        strokeDasharray="4 4"
      />
    </svg>
  ),
];

// Deterministic shape based on slug
function getShapeIndex(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 3;
  }
  return hash;
}

// Deterministic stage number
function getStage(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 17 + slug.charCodeAt(i)) % 6;
  }
  return hash + 1;
}

export default function PlaceholderPage({ title, section, slug, mode }: PlaceholderPageProps) {
  const shapeIdx = getShapeIndex(slug);
  const stage = getStage(slug);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative px-4">
      {/* Shape motif */}
      <div className="animate-spin-slow mb-8 opacity-50">{shapes[shapeIdx]}</div>

      {/* Module title */}
      <h1
        className="text-2xl md:text-3xl font-bold tracking-wider text-center mb-3"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--sq-accent)",
        }}
      >
        {title}
      </h1>

      {/* Section breadcrumb */}
      <div
        className="text-xs tracking-widest uppercase mb-8"
        style={{ color: "var(--sq-text-muted)", fontFamily: "var(--font-display)" }}
      >
        {section} — {mode === "player" ? "PLAYER" : "FRONT MAN"} MODE
      </div>

      {/* Status card */}
      <div
        className="glass-panel px-8 py-6 max-w-md w-full text-center animate-fade-in-up"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: "var(--sq-accent)",
              boxShadow: "0 0 8px var(--sq-accent)",
            }}
          />
          <span
            className="text-xs font-bold tracking-[3px] uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-accent)" }}
          >
            MODULE ARMED
          </span>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--sq-text-muted)" }}>
          Building in Stage {stage}.
        </p>

        {/* Decorative line */}
        <div
          className="h-px w-full my-4"
          style={{
            background: "linear-gradient(90deg, transparent, var(--sq-accent-border), transparent)",
          }}
        />

        <div className="flex items-center justify-center gap-2 text-[10px] tracking-wider uppercase"
          style={{ color: "var(--sq-text-muted)" }}
        >
          <span>○</span>
          <span>△</span>
          <span>□</span>
          <span className="mx-2">—</span>
          <span>CITY GUARDIAN PROTOCOL</span>
        </div>
      </div>
    </div>
  );
}
