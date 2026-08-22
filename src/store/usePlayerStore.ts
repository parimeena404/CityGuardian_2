"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import confetti from "canvas-confetti";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type BadgeTier = "none" | "bronze" | "silver" | "gold";
export type WasteCategory = "plastic" | "electronic" | "organic" | "industrial" | "paper" | "hazardous";
export type ReportStatus = "pending" | "verified" | "action_ticket";

export interface WasteReport {
  id: string;
  photoUrl: string;
  geoLat: number;
  geoLng: number;
  locationName: string;
  category: WasteCategory;
  pointsAwarded: number;
  status: ReportStatus;
  notes?: string;
  createdAt: string;
}

export interface Contribution {
  id: string;
  type: "waste_report" | "verified_bonus" | "challenge_complete" | "build_upvote" | "reward_redeemed" | "food_rescue" | "community_join";
  title: string;
  description: string;
  points: number; // positive or negative
  status: "verified" | "pending" | "redeemed";
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  initialIndex: number;
  currentIndex: number;
  targetIndex: number;
  rewardAmount: string;
  rewardPoints: number;
  deadline: string;
  participantsCount: number;
  isJoined: boolean;
  category: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  team: string;
  points: number;
  badgeTier: BadgeTier;
  improvementPct: number;
  rank: number;
  rankChange: number; // +2, -1, 0
  isCurrentUser?: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: string;
  badgeReq: BadgeTier;
  code: string;
  icon: string;
  isClaimed?: boolean;
}

export interface UpcycledBuild {
  id: string;
  creatorName: string;
  title: string;
  description: string;
  materials: string[];
  photoUrl: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CommunityProject {
  id: string;
  title: string;
  description: string;
  category: string;
  upvotes: number;
  volunteerCount: number;
  status: "proposed" | "in_progress" | "completed";
  leaderName: string;
  ward: string;
  hasUpvoted?: boolean;
  hasJoined?: boolean;
  createdAt: string;
}

export interface EcoMatch {
  id: string;
  wasteType: string;
  matchedEntityType: "recycler" | "ngo" | "industry";
  entityName: string;
  distanceKm: number;
  matchScore: number;
  contactInfo: string;
  status: "available" | "dispatched" | "processing" | "completed";
  rateOffered?: string;
}

export interface B2BDemand {
  id: string;
  industryName: string;
  industryCategory: string;
  materialNeeded: string;
  quantity: string;
  priceOffered: string;
  urgency: "high" | "medium" | "standard";
  contact: string;
  verified: boolean;
}

export interface EcoMarketItem {
  id: string;
  sellerName: string;
  title: string;
  category: string;
  pricePoints: number;
  priceInr: number;
  photoUrl: string;
  stock: number;
  condition: string;
}

export interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  tags?: string[];
}

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  pointsDelta: number;
  type: "success" | "pink" | "gold";
  stampText?: string;
}

interface PlayerState {
  // User Profile
  userName: string;
  teamName: string;
  contestantId: string;
  points: number;
  badgeTier: BadgeTier;
  initialIndex: number;
  currentIndex: number;

  // Active Toast / Seal Animation
  activeToast: ToastAlert | null;
  showSealModal: boolean;
  sealModalData: { title: string; points: number; subtext: string } | null;

  // Domain State
  wasteReports: WasteReport[];
  contributions: Contribution[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  rewards: RewardItem[];
  builds: UpcycledBuild[];
  projects: CommunityProject[];
  ecoMatches: EcoMatch[];
  b2bDemands: B2BDemand[];
  marketItems: EcoMarketItem[];
  copilotMessages: CopilotMessage[];

  // Actions
  calculateTier: (initialIdx: number, newIdx: number) => { pct: number; tier: BadgeTier };
  addWasteReport: (report: Omit<WasteReport, "id" | "pointsAwarded" | "status" | "createdAt">) => Promise<void>;
  verifyWasteReport: (id: string) => void;
  triggerSealAlert: (title: string, points: number, subtext: string) => void;
  dismissToast: () => void;
  dismissSealModal: () => void;
  joinChallenge: (challengeId: string) => void;
  claimReward: (rewardId: string) => boolean;
  upvoteBuild: (buildId: string) => void;
  submitBuild: (build: Omit<UpcycledBuild, "id" | "upvotes" | "createdAt" | "hasUpvoted" | "isFeatured">) => void;
  upvoteProject: (projectId: string) => void;
  joinProject: (projectId: string) => void;
  createProject: (project: Omit<CommunityProject, "id" | "upvotes" | "volunteerCount" | "createdAt" | "hasUpvoted" | "hasJoined">) => void;
  dispatchEcoMatch: (matchId: string) => void;
  sendCopilotMessage: (text: string) => void;
  syncWithSupabase: () => Promise<void>;
}

// Tier scoring formula: Improvement % = (InitialIndex − NewIndex) / InitialIndex × 100
export const calculateImprovementTier = (initial: number, current: number): { pct: number; tier: BadgeTier } => {
  if (initial <= 0) return { pct: 0, tier: "none" };
  const pct = Math.max(0, ((initial - current) / initial) * 100);
  let tier: BadgeTier = "none";
  if (pct >= 30) tier = "gold";
  else if (pct >= 20) tier = "silver";
  else if (pct >= 10) tier = "bronze";
  return { pct: Number(pct.toFixed(1)), tier };
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      userName: "Contestant 456",
      teamName: "ECHO STRIKER",
      contestantId: "CG-00456",
      points: 1240,
      badgeTier: "silver",
      initialIndex: 100.0,
      currentIndex: 74.5,

      activeToast: null,
      showSealModal: false,
      sealModalData: null,

      calculateTier: (init, curr) => calculateImprovementTier(init, curr),

      wasteReports: [
        {
          id: "rep-101",
          photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60",
          geoLat: 28.6139,
          geoLng: 77.2090,
          locationName: "Sector 14 Central Plaza, Ward 14",
          category: "plastic",
          pointsAwarded: 10,
          status: "verified",
          notes: "Accumulation of 45+ uncrushed single-use bottles near drainage channel.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "rep-102",
          photoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=60",
          geoLat: 28.6189,
          geoLng: 77.2145,
          locationName: "Cyber Green Corridor 3",
          category: "electronic",
          pointsAwarded: 10,
          status: "pending",
          notes: "Discarded UPS units and wiring harnesses by service lane.",
          createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
        },
        {
          id: "rep-103",
          photoUrl: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800&auto=format&fit=crop&q=60",
          geoLat: 28.6050,
          geoLng: 77.2210,
          locationName: "Old Market Mandi Gate 2",
          category: "organic",
          pointsAwarded: 10,
          status: "action_ticket",
          notes: "Decomposing wholesale vegetable crates blocking stormwater drain.",
          createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        },
      ],

      contributions: [
        {
          id: "con-1",
          type: "verified_bonus",
          title: "Waste Log Verification Bonus",
          description: "Geo-evidence validated by Ward 14 Municipal Validator. Sector 14 Plastic Hotspot cleared.",
          points: 20,
          status: "verified",
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
        {
          id: "con-2",
          type: "waste_report",
          title: "Report Waste: Sector 14 Plastic Hotspot",
          description: "Logged 45 single-use PET bottles with GPS coordinates.",
          points: 10,
          status: "verified",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "con-3",
          type: "waste_report",
          title: "Report Waste: Cyber Green E-Waste Hazard",
          description: "Decommissioned UPS units submitted for lithium recovery dispatch.",
          points: 10,
          status: "pending",
          createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
        },
        {
          id: "con-4",
          type: "challenge_complete",
          title: "Challenge: Clean Grid Sprint Phase 1",
          description: "Ranked Top 5% in Ward 14 unsegregated waste index suppression.",
          points: 250,
          status: "verified",
          createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        },
        {
          id: "con-5",
          type: "food_rescue",
          title: "EcoFood Rescue: Hotel Maurya Kitchen",
          description: "Escorted 65 kg untouched banquet surplus to Annapurna Shelter.",
          points: 75,
          status: "verified",
          createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
        },
      ],

      challenges: [
        {
          id: "chal-1",
          title: "Operation: Ward 14 Clean Grid",
          description: "Suppress Ward 14 unsegregated landfill waste index from baseline 100 to below 60. All verified reports grant double multipliers.",
          initialIndex: 100.0,
          currentIndex: 74.5,
          targetIndex: 55.0,
          rewardAmount: "₹25,000",
          rewardPoints: 500,
          deadline: "3d 14h remaining",
          participantsCount: 342,
          isJoined: true,
          category: "Landfill Suppression",
        },
        {
          id: "chal-2",
          title: "Zero Plastic Tech Park Sprint",
          description: "Eliminate single-use plastic disposal points across Sector 29 Corporate Zone. Install 8 sorting hubs.",
          initialIndex: 85.0,
          currentIndex: 62.0,
          targetIndex: 45.0,
          rewardAmount: "₹15,000",
          rewardPoints: 350,
          deadline: "1d 08h remaining",
          participantsCount: 189,
          isJoined: false,
          category: "Commercial Sector",
        },
        {
          id: "chal-3",
          title: "Metropolitan E-Waste Rally",
          description: "Extract and route 2.5 Tons of decommissioned electronics and PCB components to certified Lithium recyclers.",
          initialIndex: 120.0,
          currentIndex: 78.0,
          targetIndex: 60.0,
          rewardAmount: "₹50,000",
          rewardPoints: 1000,
          deadline: "8d 20h remaining",
          participantsCount: 520,
          isJoined: false,
          category: "Hazardous & Rare Metals",
        },
      ],

      leaderboard: [
        {
          id: "ld-1",
          name: "VORTEX 01",
          team: "ALPHA RECLAIMERS",
          points: 3450,
          badgeTier: "gold",
          improvementPct: 38.4,
          rank: 1,
          rankChange: 0,
        },
        {
          id: "ld-2",
          name: "TERRA SHIELD",
          team: "GREEN GUARDS",
          points: 2980,
          badgeTier: "gold",
          improvementPct: 32.1,
          rank: 2,
          rankChange: 2,
        },
        {
          id: "ld-3",
          name: "ECHO STRIKER (You)",
          team: "ECHO STRIKER",
          points: 1240,
          badgeTier: "silver",
          improvementPct: 25.5,
          rank: 3,
          rankChange: 1,
          isCurrentUser: true,
        },
        {
          id: "ld-4",
          name: "SOLARIS 9",
          team: "URBAN METABOLISM",
          points: 1190,
          badgeTier: "silver",
          improvementPct: 22.8,
          rank: 4,
          rankChange: -2,
        },
        {
          id: "ld-5",
          name: "NEO BIO WARRIOR",
          team: "COMPOST BRIGADE",
          points: 870,
          badgeTier: "bronze",
          improvementPct: 14.5,
          rank: 5,
          rankChange: 0,
        },
        {
          id: "ld-6",
          name: "GRID RUNNER 404",
          team: "SOLO OPS",
          points: 420,
          badgeTier: "none",
          improvementPct: 6.2,
          rank: 6,
          rankChange: -1,
        },
      ],

      rewards: [
        {
          id: "rew-1",
          title: "Delhi Metro Eco 30-Day Commute Pass",
          description: "100% subsidized rapid transit pass for all metropolitan lines. Reduce daily vehicle carbon emission.",
          pointsRequired: 350,
          category: "Transport",
          badgeReq: "bronze",
          code: "DMRC-ECO-PASS-884",
          icon: "🚇",
          isClaimed: false,
        },
        {
          id: "rew-2",
          title: "Tactical Zero-Waste Bamboo Kit",
          description: "Military-grade laser engraved bamboo cutlery set, insulated stainless flask & hemp organizer.",
          pointsRequired: 600,
          category: "Merchandise",
          badgeReq: "bronze",
          code: "ZW-BAMBOO-TAC-09",
          icon: "🎋",
          isClaimed: false,
        },
        {
          id: "rew-3",
          title: "₹1,000 Mission LiFE Grocery Grant",
          description: "Direct redeemable voucher across 120+ organic grocers & certified refill stations.",
          pointsRequired: 1000,
          category: "Vouchers",
          badgeReq: "silver",
          code: "LIFE-INR-GRANT-77",
          icon: "💳",
          isClaimed: false,
        },
        {
          id: "rew-4",
          title: "Geo-Tagged Urban Forest Tree Dedication",
          description: "Planting of 1 Native Neem + Teak tree in Green Buffer Zone with live IoT moisture & growth telemetry.",
          pointsRequired: 1200,
          category: "Impact",
          badgeReq: "silver",
          code: "TREE-GEO-NEEM-456",
          icon: "🌳",
          isClaimed: false,
        },
        {
          id: "rew-5",
          title: "Front Man Arena VIP Exemption Pass",
          description: "Direct access to Command Center observation deck, priority dispatch handling & gold insignia.",
          pointsRequired: 2500,
          category: "Arena Perks",
          badgeReq: "gold",
          code: "ARENA-VIP-GOLD-001",
          icon: "👑",
          isClaimed: false,
        },
      ],

      builds: [
        {
          id: "bld-1",
          creatorName: "Aarav 'Spark' Sharma",
          title: "Cyberpunk Desk Lamp from Decommissioned Motherboards & Copper Pipes",
          description: "Recovered 3 scrapped dual-socket server motherboards and plumbing copper lines. Wired with 5V diffused green LEDs running off USB-C. Zero new structural plastic purchased.",
          materials: ["Scrapped Server Motherboards", "Copper Plumbing Pipe", "5V USB-C LED Strip", "Recycled Acrylic Diffuser"],
          photoUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60",
          upvotes: 142,
          hasUpvoted: true,
          isFeatured: true,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: "bld-2",
          creatorName: "Maya & Team EcoMatrix",
          title: "Self-Watering Planters from 20L Water Jugs & Shredded Jute",
          description: "Sub-irrigated inverted reservoir planters made from commercial cracked mineral water carboys. Feeds community rooftop micro-greens.",
          materials: ["20L Polycarbonate Water Jugs", "Waste Jute Sack Cord", "Expanded Clay Aggregate"],
          photoUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=60",
          upvotes: 89,
          hasUpvoted: false,
          isFeatured: false,
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
        {
          id: "bld-3",
          creatorName: "Rohan Verma",
          title: "Acoustic Wall Panels from Compressed Corrugated Cardboard",
          description: "Geometric acoustic baffles engineered by slicing and honeycomb-pressing discarded appliance packaging boxes.",
          materials: ["Double-Wall Corrugated Cardboard", "Natural Starch Binder", "Charcoal Dye"],
          photoUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60",
          upvotes: 64,
          hasUpvoted: false,
          isFeatured: false,
          createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        },
      ],

      projects: [
        {
          id: "proj-1",
          title: "Ward 14 Decentralized Biodigester Hub",
          description: "Construct a 500kg/day anaerobic digestion unit converting commercial kitchen wet waste into methane gas for municipal heating and organic bio-fertilizer.",
          category: "Biomass Energy",
          upvotes: 128,
          volunteerCount: 16,
          status: "in_progress",
          leaderName: "Dr. Sunita Rao (CPCB Liaison)",
          ward: "Ward 14 - Cyber Hub",
          hasUpvoted: true,
          hasJoined: true,
          createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
        },
        {
          id: "proj-2",
          title: "Sector 29 Micro-Plastics Interceptor Boom",
          description: "Fabricate floating debris catchment barriers at 3 major canal outflow points to prevent HDPE packaging entering the Yamuna tributary.",
          category: "Waterways Cleanliness",
          upvotes: 94,
          volunteerCount: 8,
          status: "proposed",
          leaderName: "Karan Johar (EcoGuardians)",
          ward: "Ward 18 - Riverfront",
          hasUpvoted: false,
          hasJoined: false,
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
        {
          id: "proj-3",
          title: "Community Solar Charging & Battery Swap Bench",
          description: "Built 2 public seating benches equipped with 400W upcycled bifacial solar panels and 12V LiFePO4 battery banks for citizen devices.",
          category: "Renewable Tech",
          upvotes: 215,
          volunteerCount: 22,
          status: "completed",
          leaderName: "Priya Menon (Makers Collective)",
          ward: "Ward 11 - University District",
          hasUpvoted: true,
          hasJoined: false,
          createdAt: new Date(Date.now() - 3600000 * 180).toISOString(),
        },
      ],

      ecoMatches: [
        {
          id: "match-1",
          wasteType: "Rigid HDPE & PET Bottles",
          matchedEntityType: "recycler",
          entityName: "Metro Recyclers Plant 04",
          distanceKm: 1.8,
          matchScore: 98,
          contactInfo: "+91 98112 34567 • dispatch@metrorecyclers.in",
          status: "available",
          rateOffered: "₹34 / kg",
        },
        {
          id: "match-2",
          wasteType: "Lithium Batteries & PCB Scrap",
          matchedEntityType: "industry",
          entityName: "LithiumCycle India Technologies",
          distanceKm: 3.4,
          matchScore: 95,
          contactInfo: "+91 98223 77889 • intake@lithiumcycle.in",
          status: "available",
          rateOffered: "₹185 / kg",
        },
        {
          id: "match-3",
          wasteType: "Banquet Cooked Surplus & Food Waste",
          matchedEntityType: "ngo",
          entityName: "Annapurna Food Rescue Guild",
          distanceKm: 0.9,
          matchScore: 99,
          contactInfo: "+91 99880 11223 • emergency@annapurnaguild.org",
          status: "dispatched",
          rateOffered: "Free Swift Pickup (20 mins)",
        },
        {
          id: "match-4",
          wasteType: "Corrugated Packaging & Kraft Boxes",
          matchedEntityType: "industry",
          entityName: "GreenKraft Paper Mills Hub",
          distanceKm: 4.2,
          matchScore: 92,
          contactInfo: "+91 97110 55443 • procurement@greenkraft.in",
          status: "available",
          rateOffered: "₹12 / kg",
        },
      ],

      b2bDemands: [
        {
          id: "b2b-1",
          industryName: "GreenTech Polymers Ltd",
          industryCategory: "Plastic Remanufacturing",
          materialNeeded: "Clean Washed PET Flakes & Shredded Bottle Caps",
          quantity: "5.0 Tons / month",
          priceOffered: "₹34 - ₹38 / kg",
          urgency: "high",
          contact: "procurement@greentechpoly.in",
          verified: true,
        },
        {
          id: "b2b-2",
          industryName: "EcoBoard Structural Panels",
          industryCategory: "Construction Material",
          materialNeeded: "Dry Corrugated Cardboard, Kraft Paper & Fiber Pulp",
          quantity: "12.0 Tons / month",
          priceOffered: "₹12 - ₹14 / kg",
          urgency: "medium",
          contact: "supply@ecoboardpanels.co",
          verified: true,
        },
        {
          id: "b2b-3",
          industryName: "Apex Rare Metals & E-Waste Recovery",
          industryCategory: "Electronics Refinement",
          materialNeeded: "Discarded Mobile/Laptop PCBs, Aluminium Heatsinks & Copper Cables",
          quantity: "2.5 Tons / batch",
          priceOffered: "₹180 - ₹210 / kg",
          urgency: "high",
          contact: "intake@apexmetals.com",
          verified: true,
        },
        {
          id: "b2b-4",
          industryName: "BioFuel Nexus Energy Corp",
          industryCategory: "Biomass Gasification",
          materialNeeded: "Segregated Hotel Kitchen Wet Waste & Sugarcane Bagasse",
          quantity: "20.0 Tons / month",
          priceOffered: "₹4,500 / ton",
          urgency: "standard",
          contact: "feedstock@biofuelnexus.org",
          verified: true,
        },
      ],

      marketItems: [
        {
          id: "mkt-1",
          sellerName: "EcoMatrix Workshop",
          title: "Upcycled Industrial Drum Lounge Stool",
          category: "Furniture",
          pricePoints: 450,
          priceInr: 1499,
          photoUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop&q=60",
          stock: 4,
          condition: "Restored Oil Drum with Foam Top",
        },
        {
          id: "mkt-2",
          sellerName: "ReCycle Fiber Labs",
          title: "100% Recycled Cotton-Denim Tactical Tote Bag",
          category: "Apparel",
          pricePoints: 200,
          priceInr: 599,
          photoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60",
          stock: 15,
          condition: "Heavyweight Re-woven Denim",
        },
        {
          id: "mkt-3",
          sellerName: "GreenGlass Artisans",
          title: "Set of 4 Cut-Glass Tumblers from Wine Bottles",
          category: "Kitchenware",
          pricePoints: 280,
          priceInr: 799,
          photoUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=60",
          stock: 8,
          condition: "Flame-Polished Edges",
        },
        {
          id: "mkt-4",
          sellerName: "TerraCompost Delhi",
          title: "Enriched Microbial Vermicompost (10kg Bag)",
          category: "Gardening",
          pricePoints: 150,
          priceInr: 399,
          photoUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=60",
          stock: 50,
          condition: "Aged 60 Days, Pathogen Free",
        },
      ],

      copilotMessages: [
        {
          id: "msg-0",
          sender: "copilot",
          text: "COPILOT ONLINE. Tactical sustainability advisor ready. State your coordinates, query waste routing protocols, or demand matching matrices.",
          timestamp: "SYSTEM BOOT",
          tags: ["STATUS: ACTIVE", "TACTICAL ADVISOR"],
        },
      ],

      triggerSealAlert: (title, points, subtext) => {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ["#39ff88", "#ffd166", "#ffffff"],
          });
        } catch {
          // ignore if canvas not supported
        }

        set({
          showSealModal: true,
          sealModalData: { title, points, subtext },
          activeToast: {
            id: Date.now().toString(),
            title,
            message: subtext,
            pointsDelta: points,
            type: points > 0 ? "success" : "gold",
            stampText: "VERIFIED PROTOCOL",
          },
        });
      },

      dismissToast: () => set({ activeToast: null }),
      dismissSealModal: () => set({ showSealModal: false, sealModalData: null }),

      addWasteReport: async (newReportData) => {
        const newId = `rep-${Date.now()}`;
        const newReport: WasteReport = {
          id: newId,
          ...newReportData,
          pointsAwarded: 10,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        const newContribution: Contribution = {
          id: `con-${Date.now()}`,
          type: "waste_report",
          title: `Report Waste: ${newReport.locationName}`,
          description: `Logged category: ${newReport.category.toUpperCase()}. Evidence recorded in protocol ledger.`,
          points: 10,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        const updatedPoints = get().points + 10;
        const newCurrentIndex = Math.max(40, get().currentIndex - 0.8);
        const { tier } = calculateImprovementTier(get().initialIndex, newCurrentIndex);

        set((state) => ({
          wasteReports: [newReport, ...state.wasteReports],
          contributions: [newContribution, ...state.contributions],
          points: updatedPoints,
          currentIndex: newCurrentIndex,
          badgeTier: tier,
        }));

        get().triggerSealAlert(
          "WASTE REPORT LOGGED",
          10,
          `Location coordinates stored. +10 Points credited. Verification node armed for +20 PTS bonus.`
        );

        // Try inserting to Supabase if configured
        if (isSupabaseConfigured()) {
          try {
            await supabase.from("waste_reports").insert({
              photo_url: newReport.photoUrl,
              geo_lat: newReport.geoLat,
              geo_lng: newReport.geoLng,
              location_name: newReport.locationName,
              category: newReport.category,
              points_awarded: 10,
              status: "pending",
              notes: newReport.notes,
            });
            await supabase.from("contributions").insert({
              type: "waste_report",
              title: newContribution.title,
              description: newContribution.description,
              points: 10,
              status: "pending",
            });
          } catch (e) {
            console.error("Supabase insert error (falling back to local state):", e);
          }
        }

        // Simulate automatic verification after 8 seconds to demonstrate the +20 pts verification flow
        setTimeout(() => {
          get().verifyWasteReport(newId);
        }, 8000);
      },

      verifyWasteReport: (id) => {
        const report = get().wasteReports.find((r) => r.id === id);
        if (!report || report.status === "verified") return;

        const updatedReports = get().wasteReports.map((r) =>
          r.id === id ? { ...r, status: "verified" as const, pointsAwarded: r.pointsAwarded + 20 } : r
        );

        const verificationContribution: Contribution = {
          id: `con-ver-${Date.now()}`,
          type: "verified_bonus",
          title: `Verification Bonus: ${report.locationName}`,
          description: `Evidence verified by Municipal Node. Tier index suppressed.`,
          points: 20,
          status: "verified",
          createdAt: new Date().toISOString(),
        };

        const updatedPoints = get().points + 20;
        const newCurrentIndex = Math.max(35, get().currentIndex - 1.2);
        const { tier } = calculateImprovementTier(get().initialIndex, newCurrentIndex);

        set((state) => ({
          wasteReports: updatedReports,
          contributions: [verificationContribution, ...state.contributions],
          points: updatedPoints,
          currentIndex: newCurrentIndex,
          badgeTier: tier,
        }));

        get().triggerSealAlert(
          "REPORT VERIFIED // BONUS AWARDED",
          20,
          `Municipal validator confirmed GPS coordinates & image authenticity. +20 PTS granted.`
        );
      },

      joinChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === challengeId ? { ...c, isJoined: true, participantsCount: c.participantsCount + 1 } : c
          ),
        }));
        get().triggerSealAlert(
          "ARENA CHALLENGE JOINED",
          50,
          "Squad protocol synchronized. Landfill index suppression logged."
        );
      },

      claimReward: (rewardId) => {
        const reward = get().rewards.find((r) => r.id === rewardId);
        if (!reward || reward.isClaimed) return false;
        if (get().points < reward.pointsRequired) return false;

        const newPoints = get().points - reward.pointsRequired;
        const claimContribution: Contribution = {
          id: `con-rew-${Date.now()}`,
          type: "reward_redeemed",
          title: `Reward Claimed: ${reward.title}`,
          description: `Voucher Code: ${reward.code}. Present in arena terminals.`,
          points: -reward.pointsRequired,
          status: "redeemed",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          points: newPoints,
          rewards: state.rewards.map((r) => (r.id === rewardId ? { ...r, isClaimed: true } : r)),
          contributions: [claimContribution, ...state.contributions],
        }));

        get().triggerSealAlert(
          "REWARD UNLOCKED",
          -reward.pointsRequired,
          `Claim code generated: ${reward.code}. Check My Contributions for voucher certificate.`
        );
        return true;
      },

      upvoteBuild: (buildId) => {
        set((state) => ({
          builds: state.builds.map((b) => {
            if (b.id === buildId) {
              const delta = b.hasUpvoted ? -1 : 1;
              return { ...b, upvotes: b.upvotes + delta, hasUpvoted: !b.hasUpvoted };
            }
            return b;
          }),
        }));
      },

      submitBuild: (newBuild) => {
        const build: UpcycledBuild = {
          id: `bld-${Date.now()}`,
          ...newBuild,
          upvotes: 1,
          hasUpvoted: true,
          isFeatured: false,
          createdAt: new Date().toISOString(),
        };

        const buildContribution: Contribution = {
          id: `con-bld-${Date.now()}`,
          type: "build_upvote",
          title: `Submitted Build: ${build.title}`,
          description: `Upcycled materials submitted to Circular Economy Gallery.`,
          points: 50,
          status: "verified",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          builds: [build, ...state.builds],
          contributions: [buildContribution, ...state.contributions],
          points: state.points + 50,
        }));

        get().triggerSealAlert(
          "BUILD ENTERED INTO ARENA",
          50,
          "Your upcycled creation is live on the public gallery. +50 PTS awarded."
        );
      },

      upvoteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              const delta = p.hasUpvoted ? -1 : 1;
              return { ...p, upvotes: p.upvotes + delta, hasUpvoted: !p.hasUpvoted };
            }
            return p;
          }),
        }));
      },

      joinProject: (projectId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              const delta = p.hasJoined ? -1 : 1;
              return {
                ...p,
                volunteerCount: p.volunteerCount + delta,
                hasJoined: !p.hasJoined,
              };
            }
            return p;
          }),
        }));
        get().triggerSealAlert(
          "PROJECT VOLUNTEER SQUAD JOINED",
          25,
          "You are now registered as an active project contributor. +25 PTS granted."
        );
      },

      createProject: (newProject) => {
        const project: CommunityProject = {
          id: `proj-${Date.now()}`,
          ...newProject,
          upvotes: 1,
          volunteerCount: 1,
          hasUpvoted: true,
          hasJoined: true,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [project, ...state.projects],
          points: state.points + 30,
        }));

        get().triggerSealAlert(
          "CIVIC PROPOSAL LOGGED",
          30,
          "Project registered in Kanban board under PROPOSED status."
        );
      },

      dispatchEcoMatch: (matchId) => {
        set((state) => ({
          ecoMatches: state.ecoMatches.map((m) =>
            m.id === matchId ? { ...m, status: "dispatched" } : m
          ),
        }));
        get().triggerSealAlert(
          "RECYCLER DISPATCH DISPATCHED",
          40,
          "Material handover scheduled. Collector is en route to sector coordinates."
        );
      },

      sendCopilotMessage: (text) => {
        const userMsg: CopilotMessage = {
          id: `msg-${Date.now()}`,
          sender: "user",
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        set((state) => ({
          copilotMessages: [...state.copilotMessages, userMsg],
        }));

        // Generate terse, tactical sustainability-advisor response
        setTimeout(() => {
          let reply = "";
          let tags = ["TACTICAL COPILOT", "DIRECTIVE"];
          const lower = text.toLowerCase();

          if (lower.includes("density") || lower.includes("waste")) {
            reply = "ANALYSIS COMPLETE: Sector 14 shows high PET accumulation index (74.2). Recommend deploying 2 citizen units with QR geo-taggers to Plaza B drain grid. Expected yield: +30 Points.";
            tags = ["HOTSPOT: WARD 14", "ACTION: DISPATCH"];
          } else if (lower.includes("e-waste") || lower.includes("upcycl")) {
            reply = "ROUTING DIRECTIVE: E-Waste PCBs contain gold/lithium substrates. Matched with 'LithiumCycle India' (3.4km). Rate: ₹185/kg. Do not incinerate. Deploy to Circular Matrix.";
            tags = ["MATCH: HIGH VALUE", "SECTOR: E-WASTE"];
          } else if (lower.includes("reward") || lower.includes("tier") || lower.includes("points")) {
            const currentPoints = get().points;
            const tier = get().badgeTier;
            reply = `CURRENT STATUS: ${currentPoints} PTS. Tier: ${tier.toUpperCase()}. You are 260 PTS away from ₹1,000 LiFE Voucher. Log 3 verified waste hotspots or complete 'Ward 14 Clean Grid' sprint to cross threshold.`;
            tags = ["STATUS AUDIT", `TIER: ${tier.toUpperCase()}`];
          } else {
            reply = `TACTICAL ASSESSMENT: Directive received. '${text}' processed through LiFE municipal sustainability engine. Recommendation: Maintain waste segregation standards, monitor Ward Clocks, and route high-density recyclables to vetted B2B collectors.`;
          }

          const botMsg: CopilotMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: "copilot",
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            tags,
          };

          set((state) => ({
            copilotMessages: [...state.copilotMessages, botMsg],
          }));
        }, 600);
      },

      syncWithSupabase: async () => {
        if (!isSupabaseConfigured()) return;
        try {
          const { data: dbReports } = await supabase.from("waste_reports").select("*").limit(20);
          if (dbReports && dbReports.length > 0) {
            // Can merge or hydrate
          }
        } catch (e) {
          console.error("Supabase sync:", e);
        }
      },
    }),
    {
      name: "city-guardian-player-storage",
      partialize: (state) => ({
        points: state.points,
        badgeTier: state.badgeTier,
        initialIndex: state.initialIndex,
        currentIndex: state.currentIndex,
        wasteReports: state.wasteReports,
        contributions: state.contributions,
        challenges: state.challenges,
        rewards: state.rewards,
        builds: state.builds,
        projects: state.projects,
        ecoMatches: state.ecoMatches,
      }),
    }
  )
);
