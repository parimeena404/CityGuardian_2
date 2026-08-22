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
  type: "waste_report" | "verified_bonus" | "challenge_complete" | "build_upvote" | "reward_redeemed" | "food_rescue" | "community_join" | "civic_issue" | "meal_reserved";
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
  rankChange: number;
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

// ════════════════════════════════════════════════════════════════
// ECOFOOD RESCUE MODELS
// ════════════════════════════════════════════════════════════════
export interface RestaurantPartner {
  id: string;
  name: string;
  address: string;
  geoLat: number;
  geoLng: number;
  contact: string;
  fssaiLicense: string;
  businessType: string;
  verified: boolean;
}

export interface FoodListing {
  id: string;
  restaurantId: string;
  restaurantName: string;
  item: string;
  description: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  isDonation: boolean;
  quantity: string;
  expiresAt: string; // ISO string
  status: "available" | "claimed" | "expired" | "collected";
  photoUrl: string;
  claimedBy?: string;
  pickupCode?: string;
}

export interface NGOClaim {
  id: string;
  listingId: string;
  listingItem: string;
  restaurantName: string;
  ngoName: string;
  claimedAt: string;
  pickupStatus: "claimed" | "en_route" | "collected";
  portionsCount: number;
  courierName: string;
  courierPhone: string;
}

// ════════════════════════════════════════════════════════════════
// CIVIC ACTION TICKET MODELS (ACCOUNTABILITY PIPELINE)
// ════════════════════════════════════════════════════════════════
export type CivicCategory =
  | "waste_burning"
  | "pothole_road"
  | "drainage_water"
  | "hazardous_chemical"
  | "air_pollution_spike"
  | "streetlight_power";

export type CivicStatus = "reported" | "verified" | "assigned" | "in_progress" | "resolved";

export interface CivicActionTicket {
  id: string;
  trackingId: string;
  title: string;
  category: CivicCategory;
  department: string;
  geoLat: number;
  geoLng: number;
  locationName: string;
  description: string;
  beforePhotoUrl: string;
  afterPhotoUrl?: string;
  verificationCount: number;
  verificationThreshold: number;
  status: CivicStatus;
  slaHours: number;
  deadline: string; // ISO
  assignedOfficer: string;
  hasVerified?: boolean;
  createdAt: string;
  resolvedAt?: string;
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

  // EcoFood State
  restaurantPartners: RestaurantPartner[];
  foodListings: FoodListing[];
  ngoClaims: NGOClaim[];
  mealsRescuedCount: number;

  // Civic Tickets State
  civicTickets: CivicActionTicket[];

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

  // EcoFood Actions
  registerRestaurant: (partner: Omit<RestaurantPartner, "id" | "verified">) => void;
  createFoodListing: (listing: Omit<FoodListing, "id" | "status" | "claimedBy" | "pickupCode">) => void;
  reserveFoodListing: (listingId: string) => void;
  claimForNGO: (listingId: string, ngoName: string) => void;
  updateNGOClaimStatus: (claimId: string, status: "claimed" | "en_route" | "collected") => void;

  // Civic Ticket Actions
  submitCivicIssue: (issue: Omit<CivicActionTicket, "id" | "trackingId" | "verificationCount" | "verificationThreshold" | "status" | "deadline" | "assignedOfficer" | "createdAt">) => void;
  verifyCivicIssue: (ticketId: string) => void;
  resolveCivicTicket: (ticketId: string, afterPhotoUrl: string) => void;
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
      mealsRescuedCount: 4892,

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
          id: "con-4",
          type: "challenge_complete",
          title: "Challenge: Clean Grid Sprint Phase 1",
          description: "Ranked Top 5% in Ward 14 unsegregated waste index suppression.",
          points: 250,
          status: "verified",
          createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
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
      ],

      builds: [
        {
          id: "bld-1",
          creatorName: "Aarav 'Spark' Sharma",
          title: "Cyberpunk Desk Lamp from Decommissioned Motherboards & Copper Pipes",
          description: "Recovered 3 scrapped dual-socket server motherboards and plumbing copper lines. Wired with 5V diffused green LEDs.",
          materials: ["Scrapped Server Motherboards", "Copper Plumbing Pipe", "5V USB-C LED Strip"],
          photoUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60",
          upvotes: 142,
          hasUpvoted: true,
          isFeatured: true,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ],

      projects: [
        {
          id: "proj-1",
          title: "Ward 14 Decentralized Biodigester Hub",
          description: "Construct a 500kg/day anaerobic digestion unit converting commercial kitchen wet waste into methane gas.",
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
      ],

      ecoMatches: [
        {
          id: "match-1",
          wasteType: "Rigid HDPE & PET Bottles",
          matchedEntityType: "recycler",
          entityName: "Metro Recyclers Plant 04",
          distanceKm: 1.8,
          matchScore: 98,
          contactInfo: "+91 98112 34567",
          status: "available",
          rateOffered: "₹34 / kg",
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

      // ════════════════════════════════════════════════════════════
      // ECOFOOD SEED DATA
      // ════════════════════════════════════════════════════════════
      restaurantPartners: [
        {
          id: "rest-1",
          name: "The Grand Imperial Banquets",
          address: "Sector 14 Cyber Corridor, Ward 14",
          geoLat: 28.6139,
          geoLng: 77.2090,
          contact: "+91 98110 44556",
          fssaiLicense: "10019011002241",
          businessType: "Banquet & Events",
          verified: true,
        },
        {
          id: "rest-2",
          name: "Artisan Sourdough Bakery & Deli",
          address: "Galleria Market, Sector 29",
          geoLat: 28.6189,
          geoLng: 77.2145,
          contact: "+91 99881 22334",
          fssaiLicense: "10021011005512",
          businessType: "Bakery & Cafe",
          verified: true,
        },
        {
          id: "rest-3",
          name: "Green Leaf Organic Kitchen",
          address: "Riverfront Boulevard, Ward 18",
          geoLat: 28.6050,
          geoLng: 77.2210,
          contact: "+91 97115 88990",
          fssaiLicense: "10022011008891",
          businessType: "Farm-to-Table Restaurant",
          verified: true,
        },
      ],

      foodListings: [
        {
          id: "food-1",
          restaurantId: "rest-1",
          restaurantName: "The Grand Imperial Banquets",
          item: "Continental & Mediterranean Buffet Trays (Pristine Chilled)",
          description: "Freshly prepared post-banquet surplus in sealed food-grade containers: Penne Alfredo, Grilled Veggies & Herb Falafel.",
          category: "Banquet Meals",
          originalPrice: 850,
          discountPrice: 250,
          discountPercent: 70,
          isDonation: false,
          quantity: "35 Portions",
          expiresAt: new Date(Date.now() + 3600000 * 2.5).toISOString(),
          status: "available",
          photoUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=60",
        },
        {
          id: "food-2",
          restaurantId: "rest-2",
          restaurantName: "Artisan Sourdough Bakery & Deli",
          item: "Artisan Sourdough Batards & Croissant Box",
          description: "Day-end bakery overage in eco-kraft packaging. Handcrafted with organic stone-ground flour.",
          category: "Bakery",
          originalPrice: 420,
          discountPrice: 160,
          discountPercent: 62,
          isDonation: false,
          quantity: "14 Assorted Packs",
          expiresAt: new Date(Date.now() + 3600000 * 4).toISOString(),
          status: "available",
          photoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60",
        },
        {
          id: "food-3",
          restaurantId: "rest-3",
          restaurantName: "Green Leaf Organic Kitchen",
          item: "Raw Cold-Pressed Detox Juices & Superfood Grain Bowls",
          description: "Organic harvest bowls with quinoa, avocado & activated sprouts + cold-pressed green juices.",
          category: "Healthy/Vegan",
          originalPrice: 380,
          discountPrice: 190,
          discountPercent: 50,
          isDonation: false,
          quantity: "10 Sets",
          expiresAt: new Date(Date.now() + 3600000 * 3).toISOString(),
          status: "available",
          photoUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60",
        },
        {
          id: "food-4",
          restaurantId: "rest-1",
          restaurantName: "The Grand Imperial Banquets",
          item: "Bulk Dal Makhani, Steamed Basmati & Tandoori Roti Cask",
          description: "Prepared specifically for high-capacity community relief distribution. Certified hygienic kitchen seal.",
          category: "Relief Bulk",
          originalPrice: 0,
          discountPrice: 0,
          discountPercent: 100,
          isDonation: true,
          quantity: "80 Portions (Donation)",
          expiresAt: new Date(Date.now() + 3600000 * 3.5).toISOString(),
          status: "available",
          photoUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=60",
        },
        {
          id: "food-5",
          restaurantId: "rest-3",
          restaurantName: "Green Leaf Organic Kitchen",
          item: "Fresh Vegetable Prep Trimmings & Soups (Kitchen Batch)",
          description: "Nutritious vegetable broth base and cut greens suitable for soup kitchens.",
          category: "Relief Bulk",
          originalPrice: 0,
          discountPrice: 0,
          discountPercent: 100,
          isDonation: true,
          quantity: "45 Liters (Donation)",
          expiresAt: new Date(Date.now() + 3600000 * 5).toISOString(),
          status: "available",
          photoUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=60",
        },
      ],

      ngoClaims: [
        {
          id: "claim-1",
          listingId: "food-4",
          listingItem: "Bulk Dal Makhani & Basmati Cask (80 Portions)",
          restaurantName: "The Grand Imperial Banquets",
          ngoName: "Annapurna Food Shelter Foundation",
          claimedAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
          pickupStatus: "en_route",
          portionsCount: 80,
          courierName: "Rakesh Kumar (Van 04)",
          courierPhone: "+91 99881 77665",
        },
      ],

      // ════════════════════════════════════════════════════════════
      // CIVIC ACTION TICKETS SEED DATA
      // ════════════════════════════════════════════════════════════
      civicTickets: [
        {
          id: "tkt-1",
          trackingId: "CG-TKT-99421",
          title: "Open Incineration of Plastic Packaging & Cables",
          category: "waste_burning",
          department: "CPCB Air Enforcement Division",
          geoLat: 28.6139,
          geoLng: 77.2090,
          locationName: "Sector 14 Drainage Culvert, Ward 14",
          description: "Commercial plastic packaging and insulation cables burnt in open pit. Heavy noxious smoke plume impacting residential blocks.",
          beforePhotoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60",
          afterPhotoUrl: undefined,
          verificationCount: 4,
          verificationThreshold: 3,
          status: "in_progress",
          slaHours: 24,
          deadline: new Date(Date.now() + 3600000 * 8).toISOString(),
          assignedOfficer: "Inspector V.K. Tyagi (Air Enforcement Unit 2)",
          createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
        },
        {
          id: "tkt-2",
          trackingId: "CG-TKT-99380",
          title: "Severe Roadway Pothole & C&D Debris Obstruction",
          category: "pothole_road",
          department: "Public Works Department (PWD) Roads",
          geoLat: 28.6189,
          geoLng: 77.2145,
          locationName: "Cyber Corridor Intersection 3",
          description: "2-meter wide collapsed asphalt depression filled with construction rubble, creating cyclist hazard.",
          beforePhotoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60",
          afterPhotoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=60",
          verificationCount: 6,
          verificationThreshold: 3,
          status: "resolved",
          slaHours: 48,
          deadline: new Date(Date.now() - 3600000 * 2).toISOString(),
          assignedOfficer: "Assistant Engineer S. Mehrotra",
          createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
          resolvedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "tkt-3",
          trackingId: "CG-TKT-99450",
          title: "Chemical Discharge in Stormwater Outflow 4",
          category: "hazardous_chemical",
          department: "State Pollution Control Board & Waterways",
          geoLat: 28.6050,
          geoLng: 77.2210,
          locationName: "Old Mandi Canal Outflow Grid",
          description: "Discolored oily chemical effluents draining directly into stormwater network from unauthorized workshop.",
          beforePhotoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=60",
          verificationCount: 2,
          verificationThreshold: 3,
          status: "reported",
          slaHours: 24,
          deadline: new Date(Date.now() + 3600000 * 22).toISOString(),
          assignedOfficer: "Awaiting Verification Threshold (2/3 Votes)",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
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
          // ignore
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

        // Show "thinking" indicator
        const thinkingMsg: CopilotMessage = {
          id: `msg-thinking-${Date.now()}`,
          sender: "copilot",
          text: "◉ PROCESSING DIRECTIVE... Querying AI Advisory Engine...",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          tags: ["AI PROCESSING"],
        };
        set((state) => ({
          copilotMessages: [...state.copilotMessages, thinkingMsg],
        }));

        // Call real AI Advisory endpoint
        fetch("/api/ai-advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ward: "Ward 14 (Cyber Hub)",
            category: "Air Quality (AQI)",
            currentValue: get().currentIndex,
            targetValue: 60,
            initialValue: get().initialIndex,
            unit: "INDEX",
            context: text,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            // Format the structured 3-step plan into chat
            let reply = "";
            const tags: string[] = [];

            if (data.summary && data.steps) {
              reply = `📋 ${data.summary}\n\n`;
              data.steps.forEach((step: { action: string; expected_impact: string; owner_dept: string }, i: number) => {
                reply += `▸ STEP ${i + 1}: ${step.action}\n  ➤ Impact: ${step.expected_impact}\n  ➤ Owner: ${step.owner_dept}\n\n`;
              });
              reply += `Confidence: ${data.confidence || "HIGH"} | Source: ${data.source || "AI Advisory Engine"}`;
              tags.push("AI ADVISORY", data.confidence || "HIGH", data.source === "gemini-2.0-flash-live" ? "GEMINI LIVE" : "TACTICAL ENGINE");
            } else {
              reply = data.error || "Directive processed. No structured plan available for this query.";
              tags.push("TACTICAL COPILOT", "FALLBACK");
            }

            // Remove thinking message and add real response
            set((state) => ({
              copilotMessages: [
                ...state.copilotMessages.filter((m) => m.id !== thinkingMsg.id),
                {
                  id: `msg-${Date.now() + 1}`,
                  sender: "copilot" as const,
                  text: reply,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  tags,
                },
              ],
            }));
          })
          .catch(() => {
            // Network error fallback
            set((state) => ({
              copilotMessages: [
                ...state.copilotMessages.filter((m) => m.id !== thinkingMsg.id),
                {
                  id: `msg-${Date.now() + 1}`,
                  sender: "copilot" as const,
                  text: `TACTICAL ASSESSMENT: Directive '${text}' processed locally. Recommendation: Maintain waste segregation standards, monitor Ward Clocks, and route high-density recyclables to vetted B2B collectors. AI Advisory Engine offline — using cached tactical directives.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  tags: ["OFFLINE MODE", "CACHED DIRECTIVE"],
                },
              ],
            }));
          });
      },

      // ════════════════════════════════════════════════════════════
      // ECOFOOD ACTIONS
      // ════════════════════════════════════════════════════════════
      registerRestaurant: (partnerData) => {
        const newPartner: RestaurantPartner = {
          id: `rest-${Date.now()}`,
          ...partnerData,
          verified: true,
        };
        set((state) => ({
          restaurantPartners: [newPartner, ...state.restaurantPartners],
          points: state.points + 100,
        }));
        get().triggerSealAlert(
          "RESTAURANT PARTNER ONBOARDED",
          100,
          `${partnerData.name} registered under FSSAI license. +100 PTS granted.`
        );
      },

      createFoodListing: (listingData) => {
        const newListing: FoodListing = {
          id: `food-${Date.now()}`,
          ...listingData,
          status: "available",
        };
        set((state) => ({
          foodListings: [newListing, ...state.foodListings],
          points: state.points + 40,
        }));
        get().triggerSealAlert(
          listingData.isDonation ? "DONATION LISTING PUBLISHED" : "SURPLUS MEAL LISTED",
          40,
          `Logged ${listingData.quantity} of ${listingData.item}. Public rescue network armed.`
        );
      },

      reserveFoodListing: (listingId) => {
        const listing = get().foodListings.find((f) => f.id === listingId);
        if (!listing || listing.status !== "available") return;

        const pickupCode = `MEAL-QR-${Math.floor(100000 + Math.random() * 900000)}`;

        const updatedListings = get().foodListings.map((f) =>
          f.id === listingId
            ? { ...f, status: "claimed" as const, claimedBy: "CG-00456", pickupCode }
            : f
        );

        const reservationContribution: Contribution = {
          id: `con-meal-${Date.now()}`,
          type: "meal_reserved",
          title: `Reserved Surplus Meal: ${listing.item}`,
          description: `Pickup Code: ${pickupCode} at ${listing.restaurantName}. Verified 0 Food Waste.`,
          points: 30,
          status: "verified",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          foodListings: updatedListings,
          contributions: [reservationContribution, ...state.contributions],
          points: state.points + 30,
          mealsRescuedCount: state.mealsRescuedCount + 1,
        }));

        get().triggerSealAlert(
          "SURPLUS MEAL RESERVED",
          30,
          `Pickup token generated: ${pickupCode}. Present at ${listing.restaurantName} before expiry.`
        );
      },

      claimForNGO: (listingId, ngoName) => {
        const listing = get().foodListings.find((f) => f.id === listingId);
        if (!listing) return;

        const claim: NGOClaim = {
          id: `claim-${Date.now()}`,
          listingId: listing.id,
          listingItem: listing.item,
          restaurantName: listing.restaurantName,
          ngoName,
          claimedAt: new Date().toISOString(),
          pickupStatus: "claimed",
          portionsCount: parseInt(listing.quantity) || 40,
          courierName: "Assigned Volunteer Driver (Auto-Dispatch)",
          courierPhone: "+91 99880 11223",
        };

        set((state) => ({
          ngoClaims: [claim, ...state.ngoClaims],
          foodListings: state.foodListings.map((f) =>
            f.id === listingId ? { ...f, status: "claimed" as const } : f
          ),
          mealsRescuedCount: state.mealsRescuedCount + (parseInt(listing.quantity) || 40),
          points: state.points + 75,
        }));

        get().triggerSealAlert(
          "NGO RELIEF DISPATCH CLAIMED",
          75,
          `Claimed ${listing.quantity} for ${ngoName}. Logistics courier notified.`
        );
      },

      updateNGOClaimStatus: (claimId, status) => {
        set((state) => ({
          ngoClaims: state.ngoClaims.map((c) =>
            c.id === claimId ? { ...c, pickupStatus: status } : c
          ),
        }));
      },

      // ════════════════════════════════════════════════════════════
      // CIVIC ACTION TICKETS ACTIONS
      // ════════════════════════════════════════════════════════════
      submitCivicIssue: (issueData) => {
        const trackingId = `CG-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
        const newTicket: CivicActionTicket = {
          id: `tkt-${Date.now()}`,
          trackingId,
          ...issueData,
          verificationCount: 1,
          verificationThreshold: 3,
          status: "reported",
          slaHours: 24,
          deadline: new Date(Date.now() + 3600000 * 24).toISOString(),
          assignedOfficer: "Pending Verification Threshold (1/3 Votes)",
          createdAt: new Date().toISOString(),
          hasVerified: true,
        };

        const newContribution: Contribution = {
          id: `con-civic-${Date.now()}`,
          type: "civic_issue",
          title: `Civic Issue Logged: ${newTicket.trackingId}`,
          description: `${newTicket.title} assigned to ${newTicket.department}.`,
          points: 25,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          civicTickets: [newTicket, ...state.civicTickets],
          contributions: [newContribution, ...state.contributions],
          points: state.points + 25,
        }));

        get().triggerSealAlert(
          "CIVIC ISSUE FILED",
          25,
          `Statutory tracking ID ${trackingId} generated. +25 PTS awarded. Reaching 3 citizen validations auto-generates official Municipal Action Ticket.`
        );
      },

      verifyCivicIssue: (ticketId) => {
        const ticket = get().civicTickets.find((t) => t.id === ticketId);
        if (!ticket || ticket.hasVerified) return;

        const newCount = ticket.verificationCount + 1;
        let newStatus: CivicStatus = ticket.status;
        let assignedOfficer = ticket.assignedOfficer;

        if (newCount >= ticket.verificationThreshold && ticket.status === "reported") {
          newStatus = "assigned";
          assignedOfficer = "Executive Sanitary Officer (Action Ticket Dispatched)";
        }

        set((state) => ({
          civicTickets: state.civicTickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  verificationCount: newCount,
                  status: newStatus,
                  assignedOfficer,
                  hasVerified: true,
                }
              : t
          ),
          points: state.points + 15,
        }));

        get().triggerSealAlert(
          newStatus === "assigned"
            ? "MUNICIPAL ACTION TICKET ARMED"
            : "CIVIC EVIDENCE VALIDATED",
          15,
          newStatus === "assigned"
            ? `Threshold met! Official Action Ticket dispatched to ${ticket.department} with 24h SLA.`
            : `Evidence vote recorded (${newCount}/3). +15 PTS granted.`
        );
      },

      resolveCivicTicket: (ticketId, afterPhotoUrl) => {
        set((state) => ({
          civicTickets: state.civicTickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status: "resolved" as const,
                  afterPhotoUrl,
                  resolvedAt: new Date().toISOString(),
                }
              : t
          ),
          points: state.points + 50,
        }));

        get().triggerSealAlert(
          "CIVIC TICKET RESOLVED & SEALED",
          50,
          "Before/After evidence validated by municipal oversight. SLA completed. +50 PTS awarded."
        );
      },
    }),
    {
      name: "city-guardian-player-storage",
      partialize: (state) => ({
        points: state.points,
        badgeTier: state.badgeTier,
        initialIndex: state.initialIndex,
        currentIndex: state.currentIndex,
        mealsRescuedCount: state.mealsRescuedCount,
        wasteReports: state.wasteReports,
        contributions: state.contributions,
        challenges: state.challenges,
        rewards: state.rewards,
        builds: state.builds,
        projects: state.projects,
        ecoMatches: state.ecoMatches,
        restaurantPartners: state.restaurantPartners,
        foodListings: state.foodListings,
        ngoClaims: state.ngoClaims,
        civicTickets: state.civicTickets,
      }),
    }
  )
);
