"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getValidSlugs } from "@/lib/navigation";

// Real feature components for Front Man / Admin Mode
import ControlCenterView from "@/components/admin/ControlCenterView";
import DepartmentConsoleView from "@/components/admin/DepartmentConsoleView";
import WardClocksView from "@/components/admin/WardClocksView";
import ImpactMatrixView from "@/components/admin/ImpactMatrixView";
import ComplianceEfirLogView from "@/components/admin/ComplianceEfirLogView";
import FundingCsrTrackerView from "@/components/admin/FundingCsrTrackerView";
import CityIntelligenceViews from "@/components/admin/CityIntelligenceViews";
import PeopleViews from "@/components/admin/PeopleViews";

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
            COMMAND SECTOR NOT FOUND
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--sq-text-muted)" }}>
            This sector does not exist in the Front Man authority console.
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

  // Render designated Front Man views based on route slug
  switch (section) {
    case "control-center":
      return <ControlCenterView />;
    case "department-console":
      return <DepartmentConsoleView />;
    case "ward-clocks":
      return <WardClocksView />;
    case "city-monitor":
      return <CityIntelligenceViews section="city-monitor" />;
    case "energy-grid":
      return <CityIntelligenceViews section="energy-grid" />;
    case "water-monitor":
      return <CityIntelligenceViews section="water-monitor" />;
    case "waste-analytics":
      return <CityIntelligenceViews section="waste-analytics" />;
    case "impact-matrix":
      return <ImpactMatrixView />;
    case "compliance-efir-log":
      return <ComplianceEfirLogView />;
    case "funding-csr-tracker":
      return <FundingCsrTrackerView />;
    case "citizen-reports-queue":
      return <PeopleViews section="citizen-reports-queue" />;
    case "restaurant-ngo-partners":
      return <PeopleViews section="restaurant-ngo-partners" />;
    default:
      return <ControlCenterView />;
  }
}
