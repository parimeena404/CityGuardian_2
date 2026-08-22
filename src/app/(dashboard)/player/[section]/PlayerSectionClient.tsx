"use client";

import React from "react";
import Link from "next/link";
import { getValidSlugs } from "@/lib/navigation";

// Real feature components for Player Mode
import OverviewView from "@/components/player/OverviewView";
import ReportWasteView from "@/components/player/ReportWasteView";
import ContributionsView from "@/components/player/ContributionsView";
import EcoAiHandlerView from "@/components/player/EcoAiHandlerView";
import EcoChallengesView from "@/components/player/EcoChallengesView";
import LeaderboardView from "@/components/player/LeaderboardView";
import RewardsVaultView from "@/components/player/RewardsVaultView";
import BuildFromWasteView from "@/components/player/BuildFromWasteView";
import CommunityProjectsView from "@/components/player/CommunityProjectsView";
import AiMatchingMatrixView from "@/components/player/AiMatchingMatrixView";
import IndustryDemandView from "@/components/player/IndustryDemandView";
import EcoMarketView from "@/components/player/EcoMarketView";
import EcoFoodMarketplaceView from "@/components/player/EcoFoodMarketplaceView";
import RestaurantPartnerView from "@/components/player/RestaurantPartnerView";
import NgoFoodRescueView from "@/components/player/NgoFoodRescueView";
import GovernmentConnectView from "@/components/player/GovernmentConnectView";
import CivicIssueTrackerView from "@/components/player/CivicIssueTrackerView";

export default function PlayerSectionClient({ section }: { section: string }) {
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
            SECTOR NOT FOUND
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--sq-text-muted)" }}>
            This sector does not exist in the arena grid.
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

  switch (section) {
    case "overview":
      return <OverviewView />;
    case "report-waste":
      return <ReportWasteView />;
    case "my-contributions":
      return <ContributionsView />;
    case "eco-ai-handler":
      return <EcoAiHandlerView />;
    case "ecomarket":
      return <EcoMarketView />;
    case "industry-demand":
      return <IndustryDemandView />;
    case "ai-matching-matrix":
      return <AiMatchingMatrixView />;
    case "build-from-waste":
      return <BuildFromWasteView />;
    case "community-projects":
      return <CommunityProjectsView />;
    case "eco-challenges":
      return <EcoChallengesView />;
    case "leaderboard":
      return <LeaderboardView />;
    case "rewards-vault":
      return <RewardsVaultView />;
    case "ecofood-marketplace":
      return <EcoFoodMarketplaceView />;
    case "restaurant-partner":
      return <RestaurantPartnerView />;
    case "ngo-food-rescue":
      return <NgoFoodRescueView />;
    case "government-connect":
      return <GovernmentConnectView />;
    case "civic-issue-tracker":
      return <CivicIssueTrackerView />;
    default:
      return <OverviewView />;
  }
}
