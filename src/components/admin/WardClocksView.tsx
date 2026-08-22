"use client";

import React, { useState } from "react";
import WardClock, { type WardClockProps } from "./WardClock";

const WARD_CLOCKS_DATA: WardClockProps[] = [
  {
    wardName: "Ward 14 - Cyber Hub",
    category: "Air Quality (AQI)",
    currentValue: 142,
    targetValue: 80,
    initialValue: 220,
    unit: "AQI",
    deadline: "2d 14h left",
    assignedDept: "CPCB Air Enforcement Unit 02",
  },
  {
    wardName: "Ward 14 - Cyber Hub",
    category: "Sewage & Waste Index",
    currentValue: 68,
    targetValue: 40,
    initialValue: 100,
    unit: "INDEX",
    deadline: "3d 08h left",
    assignedDept: "Municipal Waste Taskforce Zone 4",
  },
  {
    wardName: "Ward 18 - Riverfront",
    category: "Water Quality (BOD)",
    currentValue: 18.5,
    targetValue: 8.0,
    initialValue: 32.0,
    unit: "mg/L",
    deadline: "4d 18h left",
    assignedDept: "Delhi Jal Board Waterways Taskforce",
  },
  {
    wardName: "Ward 18 - Riverfront",
    category: "Dust & Urban Heat",
    currentValue: 84,
    targetValue: 50,
    initialValue: 130,
    unit: "PM10",
    deadline: "1d 22h left",
    assignedDept: "PWD Smog Cannon & Sprinkler Squad",
  },
  {
    wardName: "Ward 09 - Old City Grid",
    category: "Sewage & Waste Index",
    currentValue: 78,
    targetValue: 50,
    initialValue: 110,
    unit: "INDEX",
    deadline: "5d 04h left",
    assignedDept: "Old Delhi Sanitation Operations",
  },
  {
    wardName: "Ward 22 - Industrial Belt",
    category: "Air Quality (AQI)",
    currentValue: 198,
    targetValue: 110,
    initialValue: 290,
    unit: "AQI",
    deadline: "1d 12h left",
    assignedDept: "CPCB Industrial OCEMS Oversight",
  },
  {
    wardName: "Ward 03 - University Campus",
    category: "Dust & Urban Heat",
    currentValue: 52,
    targetValue: 40,
    initialValue: 95,
    unit: "PM10",
    deadline: "6d 10h left",
    assignedDept: "Green Buffer & Urban Forest Wing",
  },
  {
    wardName: "Ward 03 - University Campus",
    category: "Sewage & Waste Index",
    currentValue: 34,
    targetValue: 30,
    initialValue: 80,
    unit: "INDEX",
    deadline: "2d 06h left",
    assignedDept: "Campus Zero-Waste Taskforce",
  },
];

export default function WardClocksView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Air Quality (AQI)", "Water Quality (BOD)", "Sewage & Waste Index", "Dust & Urban Heat"];

  const filtered = selectedCategory === "all"
    ? WARD_CLOCKS_DATA
    : WARD_CLOCKS_DATA.filter((c) => c.category === selectedCategory);

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
              ● DIGITAL WARD TIMEPIECES
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            WARD CLOCKS DISPENSARY
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Outcome-based municipal digital clocks. Each widget measures real parameter suppression against statutory targets within an active countdown window.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 shrink-0 border border-pink-950 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase transition-all ${
                selectedCategory === cat
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "All Clocks" : cat.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Digital Ward Clocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((clock, index) => (
          <WardClock key={index} {...clock} />
        ))}
      </div>
    </div>
  );
}
