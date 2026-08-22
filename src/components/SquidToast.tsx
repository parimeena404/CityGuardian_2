"use client";

import React from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function SquidToast() {
  const { activeToast, showSealModal, sealModalData, dismissToast, dismissSealModal } = usePlayerStore();

  return (
    <>
      {/* Toast popup in top right */}
      {activeToast && (
        <div
          className="fixed top-6 right-6 z-50 max-w-md w-full animate-fade-in-up"
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="glass-panel p-4 rounded-xl relative overflow-hidden"
            style={{
              background: "rgba(13, 20, 16, 0.92)",
              border: "1px solid var(--sq-green)",
              boxShadow: "0 0 25px rgba(57, 255, 136, 0.25)",
            }}
          >
            {/* Ambient glowing top bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  activeToast.pointsDelta > 0
                    ? "linear-gradient(90deg, #39ff88, #ffd166)"
                    : "linear-gradient(90deg, #ff2e6d, #ffd166)",
              }}
            />

            <div className="flex items-start gap-3">
              {/* Squid Game Symbol */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  background: "rgba(57, 255, 136, 0.15)",
                  color: "var(--sq-green)",
                  border: "1px solid rgba(57, 255, 136, 0.4)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {activeToast.pointsDelta > 0 ? "△" : "○"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-black tracking-wider uppercase"
                    style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
                  >
                    {activeToast.title}
                  </span>
                  {activeToast.pointsDelta !== 0 && (
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-black tracking-wider"
                      style={{
                        fontFamily: "var(--font-display)",
                        background:
                          activeToast.pointsDelta > 0
                            ? "rgba(57, 255, 136, 0.2)"
                            : "rgba(255, 46, 109, 0.2)",
                        color:
                          activeToast.pointsDelta > 0
                            ? "var(--sq-green)"
                            : "var(--sq-pink)",
                        border:
                          activeToast.pointsDelta > 0
                            ? "1px solid rgba(57, 255, 136, 0.4)"
                            : "1px solid rgba(255, 46, 109, 0.4)",
                      }}
                    >
                      {activeToast.pointsDelta > 0
                        ? `+${activeToast.pointsDelta} PTS`
                        : `${activeToast.pointsDelta} PTS`}
                    </span>
                  )}
                </div>

                <p className="text-xs mt-1 text-gray-300 leading-relaxed">
                  {activeToast.message}
                </p>

                {activeToast.stampText && (
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(255, 209, 102, 0.1)",
                        color: "var(--sq-gold)",
                        border: "1px solid rgba(255, 209, 102, 0.3)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      ✓ {activeToast.stampText}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={dismissToast}
                className="text-gray-400 hover:text-white p-1 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Squid-Game-style Stamp / Seal Modal Confirmation Effect */}
      {showSealModal && sealModalData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)" }}
          onClick={dismissSealModal}
        >
          <div
            className="glass-panel p-8 max-w-lg w-full relative text-center overflow-hidden animate-fade-in-up"
            style={{
              background: "rgba(10, 16, 12, 0.95)",
              border: "2px solid var(--sq-green)",
              boxShadow: "0 0 50px rgba(57, 255, 136, 0.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Seal Watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"
              style={{ fontSize: "280px", color: "var(--sq-green)" }}
            >
              ○△□
            </div>

            {/* In-Universe Stamp Badge */}
            <div className="relative z-10">
              <div
                className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-[4px] uppercase mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "rgba(57, 255, 136, 0.15)",
                  color: "var(--sq-green)",
                  border: "1px solid var(--sq-green)",
                }}
              >
                CITY GUARDIAN PROTOCOL // STAGE VERIFIED
              </div>

              {/* Stamped Box Graphic */}
              <div
                className="my-6 py-6 px-4 rounded-xl relative transform -rotate-1 border-2 border-dashed"
                style={{
                  borderColor: "var(--sq-green)",
                  background: "rgba(57, 255, 136, 0.05)",
                }}
              >
                <div
                  className="text-2xl md:text-3xl font-black tracking-wider uppercase mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
                >
                  {sealModalData.title}
                </div>

                <div
                  className="text-4xl md:text-5xl font-black my-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: sealModalData.points >= 0 ? "var(--sq-green)" : "var(--sq-gold)",
                    textShadow: "0 0 20px rgba(57, 255, 136, 0.5)",
                  }}
                >
                  {sealModalData.points > 0 ? `+${sealModalData.points}` : sealModalData.points} PTS
                </div>

                <div
                  className="text-[10px] tracking-[3px] uppercase"
                  style={{ color: "var(--sq-text-muted)", fontFamily: "var(--font-display)" }}
                >
                  TRANSACTION SEALED • ARENA LEDGER UPDATED
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                {sealModalData.subtext}
              </p>

              <button
                onClick={dismissSealModal}
                className="px-8 py-3 rounded-lg text-xs font-black tracking-[3px] uppercase cursor-pointer transition-all hover:scale-105"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "linear-gradient(135deg, rgba(57, 255, 136, 0.25), rgba(57, 255, 136, 0.1))",
                  color: "var(--sq-green)",
                  border: "1px solid var(--sq-green)",
                  boxShadow: "0 0 20px rgba(57, 255, 136, 0.3)",
                }}
              >
                ACKNOWLEDGE & RETURN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
