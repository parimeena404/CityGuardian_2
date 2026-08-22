"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { playerNav, frontmanNav, type NavSection } from "@/lib/navigation";
import RoleToggle from "./RoleToggle";

function SectionGroup({
  section,
  basePath,
  isOpen,
  onToggle,
}: {
  section: NavSection;
  basePath: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { setSidebarOpen } = useAppStore();

  return (
    <div>
      <button
        onClick={onToggle}
        className="sidebar-section-title w-full flex items-center justify-between cursor-pointer hover:opacity-100 transition-opacity"
        style={{ border: "none", background: "none" }}
      >
        <span>{section.title}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "500px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        {section.items.map((item) => {
          const href = `${basePath}/${item.slug}`;
          const isActive = pathname === href;

          return (
            <Link
              key={item.slug}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <span style={{ opacity: 0.4, fontSize: "14px" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`nav-badge ${
                    item.badgeType === "gold"
                      ? "nav-badge-gold"
                      : item.badgeType === "pink"
                      ? "nav-badge-pink"
                      : ""
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { role } = useAppStore();
  const nav = role === "player" ? playerNav : frontmanNav;
  const basePath = role === "player" ? "/player" : "/admin";

  // Track which sections are open (all open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      [...playerNav, ...frontmanNav].forEach((s) => {
        init[s.title] = true;
      });
      return init;
    }
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo / Brand */}
      <div className="px-5 pt-6 pb-2">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{
              fontFamily: "var(--font-display)",
              background: "rgba(57, 255, 136, 0.1)",
              color: "var(--sq-green)",
              border: "1px solid rgba(57, 255, 136, 0.2)",
            }}
          >
            CG
          </div>
          <div>
            <div
              className="text-sm font-bold tracking-wider"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--sq-text)",
              }}
            >
              CITY GUARDIAN
            </div>
            <div className="text-[10px] tracking-widest" style={{ color: "var(--sq-text-muted)" }}>
              CIVIC SURVIVAL
            </div>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 h-px" style={{ background: "var(--sq-accent-border)" }} />

      {/* Role Toggle */}
      <RoleToggle />

      {/* Divider */}
      <div className="mx-4 my-1 h-px" style={{ background: "var(--sq-accent-border)" }} />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {nav.map((section) => (
          <SectionGroup
            key={section.title}
            section={section}
            basePath={basePath}
            isOpen={openSections[section.title] ?? true}
            onToggle={() => toggleSection(section.title)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "var(--sq-accent-border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "var(--sq-accent)",
              color: "var(--sq-bg)",
            }}
          >
            P
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: "var(--sq-text)" }}>
              PARTICIPANT
            </div>
            <div className="text-[10px]" style={{ color: "var(--sq-text-muted)" }}>
              CG-00456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
