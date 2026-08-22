"use client";

import React from "react";
import { useAppStore, type RoleMode } from "@/store/useAppStore";

export default function RoleToggle() {
  const { role, setRole } = useAppStore();

  return (
    <div className="px-4 py-3">
      <div className="text-center mb-2">
        <span
          className="text-[9px] font-bold tracking-[2px] uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--sq-text-muted)" }}
        >
          ROLE MODE
        </span>
      </div>
      <div className="role-toggle">
        <button
          className={`role-toggle-btn ${role === "player" ? "active-player" : ""}`}
          onClick={() => setRole("player")}
          aria-pressed={role === "player"}
        >
          ○ Player
        </button>
        <button
          className={`role-toggle-btn ${role === "frontman" ? "active-frontman" : ""}`}
          onClick={() => setRole("frontman")}
          aria-pressed={role === "frontman"}
        >
          △ Front Man
        </button>
      </div>
    </div>
  );
}
