"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import Sidebar from "@/components/Sidebar";
import ShapeMotifs from "@/components/ShapeMotifs";
import SquidToast from "@/components/SquidToast";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { role, sidebarOpen, setSidebarOpen } = useAppStore();

  // Set data-role on document for CSS variable switching
  useEffect(() => {
    document.documentElement.setAttribute("data-role", role);
  }, [role]);

  return (
    <div className="scanline-overlay grid-bg min-h-screen">
      <ShapeMotifs />
      <SquidToast />

      {/* Mobile overlay */}
      <div
        className={`drawer-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out"
        style={{
          width: "280px",
          background: "var(--sq-panel)",
          borderRight: "1px solid var(--sq-accent-border)",
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
      >
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>
        <div
          className="lg:hidden h-full transition-transform duration-300"
          style={{
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "280px",
            background: "var(--sq-panel)",
            borderRight: "1px solid var(--sq-accent-border)",
            zIndex: 50,
          }}
        >
          <Sidebar />
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{
          background: "var(--sq-panel)",
          border: "1px solid var(--sq-accent-border)",
          color: "var(--sq-accent)",
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {sidebarOpen ? (
            <path d="M6 6L18 18M6 18L18 6" />
          ) : (
            <>
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </>
          )}
        </svg>
      </button>

      {/* Main content */}
      <main
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: "0" }}
      >
        <div className="hidden lg:block" style={{ marginLeft: "280px" }}>
          <div className="p-6 lg:p-8">{children}</div>
        </div>
        <div className="lg:hidden">
          <div className="p-4 pt-16">{children}</div>
        </div>
      </main>
    </div>
  );
}
