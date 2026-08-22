"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

/**
 * AuthGate — Client-side role guard wrapper
 * Blocks /admin/* routes when role is "player"
 * In demo mode, uses the Zustand store role toggle
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAppStore();

  const isAdminRoute = pathname.startsWith("/admin");
  const isPlayerRoute = pathname.startsWith("/player");

  // If accessing admin routes as a player, show access denied
  if (isAdminRoute && role !== "frontman") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div
          className="glass-panel p-10 text-center max-w-lg rounded-2xl border relative overflow-hidden"
          style={{
            borderColor: "var(--sq-pink)",
            boxShadow: "0 0 60px rgba(255, 46, 109, 0.2)",
          }}
        >
          {/* Floating shapes */}
          <div className="absolute top-4 left-6 text-6xl opacity-10 text-pink-500">○</div>
          <div className="absolute bottom-4 right-6 text-5xl opacity-10 text-pink-500">△</div>
          <div className="absolute top-1/2 right-10 text-4xl opacity-10 text-pink-500">□</div>

          <div
            className="text-6xl mb-4 animate-pulse"
            style={{ color: "var(--sq-pink)" }}
          >
            ▲
          </div>

          <div className="text-[10px] font-black tracking-[5px] uppercase text-pink-400 font-mono mb-3">
            ○ △ □ CLEARANCE VIOLATION
          </div>

          <h1
            className="text-xl font-black tracking-wider uppercase mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-pink)" }}
          >
            ACCESS DENIED
          </h1>

          <p className="text-sm text-gray-400 mb-2 font-mono">
            INSUFFICIENT CLEARANCE LEVEL
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Front Man Command Console requires authority clearance.
            Switch to Front Man mode using the role toggle in the sidebar.
          </p>

          <a
            href="/player/overview"
            className="inline-block text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg no-underline transition-all hover:scale-105 font-mono"
            style={{
              background: "rgba(57, 255, 136, 0.1)",
              color: "var(--sq-green)",
              border: "1px solid rgba(57, 255, 136, 0.3)",
            }}
          >
            RETURN TO PLAYER ARENA →
          </a>
        </div>
      </div>
    );
  }

  // If accessing player routes as frontman, still allow (frontman can view player mode)
  return <>{children}</>;
}
