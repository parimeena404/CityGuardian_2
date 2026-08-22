"use client";

import React from "react";
import { useParams } from "next/navigation";
import PlaceholderPage from "@/components/PlaceholderPage";
import { getModuleTitle, getSectionName, getValidSlugs } from "@/lib/navigation";
import Link from "next/link";

export default function AdminSectionPage() {
  const params = useParams();
  const section = params.section as string;

  const validSlugs = getValidSlugs("frontman");

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
            This sector does not exist in the command center.
          </p>
          <Link
            href="/admin/control-center"
            className="inline-block text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg no-underline transition-all hover:opacity-80"
            style={{
              fontFamily: "var(--font-display)",
              background: "rgba(255, 46, 109, 0.1)",
              color: "var(--sq-pink)",
              border: "1px solid rgba(255, 46, 109, 0.2)",
            }}
          >
            Return to Control Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PlaceholderPage
      title={getModuleTitle(section, "frontman")}
      section={getSectionName(section, "frontman")}
      slug={section}
      mode="frontman"
    />
  );
}
