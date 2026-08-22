"use client";

import React, { useState } from "react";

interface MatrixCell {
  score: number; // 0 to 100 where higher is better (or lower pollution)
  status: "critical" | "warning" | "on_track" | "optimal";
  valueText: string;
  metric: string;
  trend: string;
}

interface WardRow {
  wardCode: string;
  wardName: string;
  zone: string;
  airQuality: MatrixCell;
  waterPurity: MatrixCell;
  wasteSegregation: MatrixCell;
  dustSuppression: MatrixCell;
  solarRenewable: MatrixCell;
  greenCover: MatrixCell;
}

const IMPACT_MATRIX_DATA: WardRow[] = [
  {
    wardCode: "W-14",
    wardName: "Ward 14 (Cyber Hub)",
    zone: "North Corridor",
    airQuality: { score: 45, status: "warning", valueText: "142 AQI", metric: "PM2.5: 68", trend: "▼ -18%" },
    waterPurity: { score: 72, status: "on_track", valueText: "14.2 BOD", metric: "Outflows: 4", trend: "▼ -22%" },
    wasteSegregation: { score: 86, status: "optimal", valueText: "88% Seg.", metric: "450kg Recycled", trend: "▲ +34%" },
    dustSuppression: { score: 62, status: "on_track", valueText: "78 PM10", metric: "4 Cannons", trend: "▼ -14%" },
    solarRenewable: { score: 91, status: "optimal", valueText: "4.2 MW", metric: "82% Capacity", trend: "▲ +40%" },
    greenCover: { score: 58, status: "warning", valueText: "18% Cover", metric: "2,400 Trees", trend: "▲ +5%" },
  },
  {
    wardCode: "W-18",
    wardName: "Ward 18 (Riverfront)",
    zone: "East Buffer",
    airQuality: { score: 68, status: "on_track", valueText: "112 AQI", metric: "PM2.5: 52", trend: "▼ -24%" },
    waterPurity: { score: 38, status: "critical", valueText: "28.5 BOD", metric: "Tributary Outflow", trend: "▲ +8%" },
    wasteSegregation: { score: 74, status: "on_track", valueText: "76% Seg.", metric: "320kg Wet", trend: "▲ +18%" },
    dustSuppression: { score: 82, status: "optimal", valueText: "54 PM10", metric: "Sprinklers Live", trend: "▼ -28%" },
    solarRenewable: { score: 64, status: "on_track", valueText: "1.8 MW", metric: "Grid Tied", trend: "▲ +12%" },
    greenCover: { score: 88, status: "optimal", valueText: "32% Cover", metric: "Buffer Forest", trend: "▲ +15%" },
  },
  {
    wardCode: "W-09",
    wardName: "Ward 09 (Old City Grid)",
    zone: "Central Heritage",
    airQuality: { score: 32, status: "critical", valueText: "215 AQI", metric: "Dense Traffic", trend: "▲ +4%" },
    waterPurity: { score: 55, status: "warning", valueText: "19.8 BOD", metric: "Old Drainage", trend: "▼ -6%" },
    wasteSegregation: { score: 48, status: "warning", valueText: "52% Seg.", metric: "Heavy Litter", trend: "▲ +10%" },
    dustSuppression: { score: 40, status: "critical", valueText: "148 PM10", metric: "Unpaved Scraps", trend: "▲ +12%" },
    solarRenewable: { score: 35, status: "critical", valueText: "0.6 MW", metric: "Dense Roofs", trend: "▲ +4%" },
    greenCover: { score: 28, status: "critical", valueText: "8% Cover", metric: "High Concrete", trend: "▬ 0%" },
  },
  {
    wardCode: "W-22",
    wardName: "Ward 22 (Industrial Belt)",
    zone: "South Industrial",
    airQuality: { score: 28, status: "critical", valueText: "248 AQI", metric: "Furnace Smoke", trend: "▲ +15%" },
    waterPurity: { score: 42, status: "critical", valueText: "26.4 BOD", metric: "Chemical Runoff", trend: "▼ -4%" },
    wasteSegregation: { score: 78, status: "on_track", valueText: "82% Seg.", metric: "B2B Metal Hub", trend: "▲ +22%" },
    dustSuppression: { score: 35, status: "critical", valueText: "162 PM10", metric: "Heavy Haulers", trend: "▲ +8%" },
    solarRenewable: { score: 85, status: "optimal", valueText: "6.8 MW", metric: "Factory Sheds", trend: "▲ +45%" },
    greenCover: { score: 34, status: "critical", valueText: "11% Cover", metric: "Industrial Sump", trend: "▲ +2%" },
  },
  {
    wardCode: "W-03",
    wardName: "Ward 03 (University Campus)",
    zone: "North Academic",
    airQuality: { score: 88, status: "optimal", valueText: "64 AQI", metric: "Clean Air Grid", trend: "▼ -38%" },
    waterPurity: { score: 92, status: "optimal", valueText: "6.2 BOD", metric: "Rainwater Swales", trend: "▼ -45%" },
    wasteSegregation: { score: 96, status: "optimal", valueText: "98% Seg.", metric: "Zero Landfill", trend: "▲ +55%" },
    dustSuppression: { score: 90, status: "optimal", valueText: "38 PM10", metric: "Paved Walkways", trend: "▼ -40%" },
    solarRenewable: { score: 94, status: "optimal", valueText: "5.4 MW", metric: "Hostel Solar", trend: "▲ +60%" },
    greenCover: { score: 95, status: "optimal", valueText: "44% Cover", metric: "Botanical Park", trend: "▲ +20%" },
  },
  {
    wardCode: "W-11",
    wardName: "Ward 11 (Market Central)",
    zone: "Commercial Core",
    airQuality: { score: 54, status: "warning", valueText: "155 AQI", metric: "Delivery Vans", trend: "▼ -10%" },
    waterPurity: { score: 68, status: "on_track", valueText: "16.0 BOD", metric: "Clean Traps", trend: "▼ -15%" },
    wasteSegregation: { score: 72, status: "on_track", valueText: "75% Seg.", metric: "Banquet Hub", trend: "▲ +25%" },
    dustSuppression: { score: 60, status: "on_track", valueText: "82 PM10", metric: "Sweepers Live", trend: "▼ -12%" },
    solarRenewable: { score: 70, status: "on_track", valueText: "2.8 MW", metric: "Mall Rooftops", trend: "▲ +18%" },
    greenCover: { score: 42, status: "warning", valueText: "14% Cover", metric: "Potted Trees", trend: "▲ +4%" },
  },
];

export default function ImpactMatrixView() {
  const [selectedCell, setSelectedCell] = useState<{
    ward: string;
    category: string;
    cell: MatrixCell;
  } | null>(null);

  const getCellBg = (status: MatrixCell["status"]) => {
    switch (status) {
      case "optimal":
        return "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40";
      case "on_track":
        return "bg-yellow-950/40 border-yellow-500/40 text-yellow-300 hover:bg-yellow-900/40";
      case "warning":
        return "bg-amber-950/60 border-amber-600/50 text-amber-300 hover:bg-amber-900/50";
      case "critical":
        return "bg-pink-950/70 border-pink-500/60 text-pink-300 hover:bg-pink-900/60 shadow-[0_0_15px_rgba(255,46,109,0.15)]";
    }
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
              ● CROSS-SECTOR HEATMAP INTELLIGENCE
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            METROPOLITAN IMPACT MATRIX
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            State-of-the-City panoramic heatmap. Color intensity correlates measured parameter suppression and statutory compliance across all municipal wards.
          </p>
        </div>

        {/* Legend */}
        <div className="glass-panel p-2.5 rounded-xl border border-pink-950 bg-black/60 flex items-center gap-3 font-mono text-[10px] flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
            <span className="text-emerald-400 font-bold">Optimal (&gt;80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-yellow-400" />
            <span className="text-yellow-300 font-bold">On Track (60-80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span className="text-amber-400 font-bold">Warning (40-60)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-pink-500" />
            <span className="text-pink-400 font-bold">Critical Alert (&lt;40)</span>
          </div>
        </div>
      </div>

      {/* Heatmap Cross-Tab Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-pink-950/80 bg-black/80 shadow-[0_0_40px_rgba(255,46,109,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-black/90 border-b border-pink-950/80 text-[10px] uppercase text-gray-400 tracking-wider">
                <th className="p-4 px-6">Municipal Ward</th>
                <th className="p-4 text-center">Air Quality (AQI)</th>
                <th className="p-4 text-center">Water Purity (BOD)</th>
                <th className="p-4 text-center">Waste Segregation</th>
                <th className="p-4 text-center">Dust Suppression</th>
                <th className="p-4 text-center">Solar Generation</th>
                <th className="p-4 text-center">Urban Green Cover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-xs">
              {IMPACT_MATRIX_DATA.map((row) => (
                <tr key={row.wardCode} className="hover:bg-pink-950/10 transition-colors">
                  {/* Ward Label */}
                  <td className="p-4 px-6 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[10px]">
                        {row.wardCode}
                      </span>
                      <span>{row.wardName}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-normal mt-0.5">
                      {row.zone}
                    </div>
                  </td>

                  {/* Columns */}
                  {[
                    { key: "airQuality", name: "Air Quality (AQI)", data: row.airQuality },
                    { key: "waterPurity", name: "Water Purity (BOD)", data: row.waterPurity },
                    { key: "wasteSegregation", name: "Waste Segregation", data: row.wasteSegregation },
                    { key: "dustSuppression", name: "Dust Suppression", data: row.dustSuppression },
                    { key: "solarRenewable", name: "Solar Generation", data: row.solarRenewable },
                    { key: "greenCover", name: "Urban Green Cover", data: row.greenCover },
                  ].map((col) => (
                    <td key={col.key} className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCell({
                            ward: row.wardName,
                            category: col.name,
                            cell: col.data,
                          })
                        }
                        className={`w-full p-2.5 rounded-xl border text-center transition-all cursor-pointer ${getCellBg(
                          col.data.status
                        )}`}
                      >
                        <div className="font-bold text-xs">{col.data.valueText}</div>
                        <div className="text-[9px] opacity-80 mt-0.5 flex items-center justify-center gap-1 font-mono">
                          <span>{col.data.trend}</span>
                        </div>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Telemetry Inspector Modal */}
      {selectedCell && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="glass-panel p-6 max-w-md w-full rounded-2xl border space-y-4 bg-black/95 text-center font-mono"
            style={{
              borderColor: "var(--sq-pink)",
              boxShadow: "0 0 40px rgba(255, 46, 109, 0.3)",
            }}
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-black text-pink-400 uppercase">
                TELEMETRY CELL INSPECTOR
              </span>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 py-2">
              <div className="text-sm font-bold text-white">{selectedCell.ward}</div>
              <div className="text-xs text-pink-400">{selectedCell.category}</div>

              <div className="my-4 p-4 rounded-xl bg-black/80 border border-gray-800">
                <div className="text-3xl font-black text-white">{selectedCell.cell.valueText}</div>
                <div className="text-xs text-emerald-400 mt-1">
                  Trend: {selectedCell.cell.trend} Measured Suppression
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  Sub-metric: {selectedCell.cell.metric}
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-900">
                <span>Compliance Rating:</span>
                <span className="text-white font-bold uppercase">{selectedCell.cell.status}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCell(null)}
              className="w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/40"
            >
              CLOSE INSPECTOR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
