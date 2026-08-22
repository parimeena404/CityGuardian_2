"use client";

import { create } from "zustand";

export type RoleMode = "player" | "frontman";

interface AppState {
  role: RoleMode;
  sidebarOpen: boolean;
  setRole: (role: RoleMode) => void;
  toggleRole: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const getInitialRole = (): RoleMode => {
  if (typeof window === "undefined") return "player";
  const stored = localStorage.getItem("cg-role");
  return stored === "frontman" ? "frontman" : "player";
};

export const useAppStore = create<AppState>((set) => ({
  role: getInitialRole(),
  sidebarOpen: false,
  setRole: (role) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cg-role", role);
    }
    set({ role });
  },
  toggleRole: () =>
    set((state) => {
      const newRole = state.role === "player" ? "frontman" : "player";
      if (typeof window !== "undefined") {
        localStorage.setItem("cg-role", newRole);
      }
      return { role: newRole };
    }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
