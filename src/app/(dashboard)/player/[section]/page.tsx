"use client";

import React from "react";
import { useParams } from "next/navigation";
import PlaceholderPage from "@/components/PlaceholderPage";
import { getModuleTitle, getSectionName, getValidSlugs } from "@/lib/navigation";
import Link from "next/link";

export default function PlayerSectionPage() {
  const params = useParams();
  const section = params.section as string;

  const validSlugs = getValidSlugs("player");

  if (!validSlugs.includes(section)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="glass-panel p-8 text-center max-w-md">
          <div className="text-6xl mb-4" style={{ color: "var(--sq-pink)" }}>△</div>
          <h1
            className="text-xl font-bold tracking-wider mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-pink)" }}
          >
            ROUTE NOT FOUND
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--sq-text-muted)" }}>
            This sector does not exist in the arena.
          </p>
          <Link
            href="/player/overview"
            className="inline-block text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg no-underline transition-all hover:opacity-80"
            style={{
              fontFamily: "var(--font-display)",
              background: "rgba(57, 255, 136, 0.1)",
              color: "var(--sq-green)",
              border: "1px solid rgba(57, 255, 136, 0.2)",
            }}
          >
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PlaceholderPage
      title={getModuleTitle(section, "player")}
      section={getSectionName(section, "player")}
      slug={section}
      mode="player"
    />
  );
}
