export interface NavItem {
  label: string;
  slug: string;
  badge?: string;
  badgeType?: "green" | "gold" | "pink";
  icon?: string; // shape motif character
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const playerNav: NavSection[] = [
  {
    title: "Mission Control",
    items: [
      { label: "Overview", slug: "overview", icon: "○" },
      { label: "Report Waste", slug: "report-waste", badge: "+10 Pts", badgeType: "gold", icon: "△" },
      { label: "My Contributions", slug: "my-contributions", icon: "□" },
      { label: "Eco AI Handler", slug: "eco-ai-handler", badge: "Copilot", badgeType: "green", icon: "○" },
    ],
  },
  {
    title: "Circular Economy",
    items: [
      { label: "EcoMarket", slug: "ecomarket", icon: "△" },
      { label: "Industry Demand", slug: "industry-demand", badge: "B2B", badgeType: "green", icon: "□" },
      { label: "AI Matching Matrix", slug: "ai-matching-matrix", icon: "○" },
      { label: "Build From Waste", slug: "build-from-waste", icon: "△" },
      { label: "Community Projects", slug: "community-projects", icon: "□" },
    ],
  },
  {
    title: "Survival Arena",
    items: [
      { label: "Eco Challenges", slug: "eco-challenges", badge: "₹25k", badgeType: "gold", icon: "○" },
      { label: "Leaderboard", slug: "leaderboard", icon: "△" },
      { label: "Rewards Vault", slug: "rewards-vault", icon: "□" },
    ],
  },
  {
    title: "EcoFood Rescue Network",
    items: [
      { label: "EcoFood Marketplace", slug: "ecofood-marketplace", badge: "50% OFF", badgeType: "pink", icon: "○" },
      { label: "Restaurant Partner", slug: "restaurant-partner", icon: "△" },
      { label: "NGO Food Rescue", slug: "ngo-food-rescue", icon: "□" },
    ],
  },
  {
    title: "Government & Civic",
    items: [
      { label: "Government Connect", slug: "government-connect", badge: "CPCB/LiFE", badgeType: "green", icon: "△" },
      { label: "Civic Issue Tracker", slug: "civic-issue-tracker", icon: "□" },
    ],
  },
];

export const frontmanNav: NavSection[] = [
  {
    title: "Command Overview",
    items: [
      { label: "Control Center", slug: "control-center", icon: "○" },
      { label: "Department Console", slug: "department-console", icon: "△" },
      { label: "Ward Clocks", slug: "ward-clocks", icon: "□" },
    ],
  },
  {
    title: "City Intelligence",
    items: [
      { label: "City Monitor", slug: "city-monitor", icon: "○" },
      { label: "Energy Grid", slug: "energy-grid", icon: "△" },
      { label: "Water Monitor", slug: "water-monitor", icon: "□" },
      { label: "Waste Analytics", slug: "waste-analytics", icon: "○" },
    ],
  },
  {
    title: "Accountability",
    items: [
      { label: "Impact Matrix", slug: "impact-matrix", icon: "△" },
      { label: "Compliance & e-FIR Log", slug: "compliance-efir-log", icon: "□" },
      { label: "Funding & CSR Tracker", slug: "funding-csr-tracker", icon: "○" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Citizen Reports Queue", slug: "citizen-reports-queue", icon: "△" },
      { label: "Restaurant/NGO Partners", slug: "restaurant-ngo-partners", icon: "□" },
    ],
  },
];

// Map slug → display name for placeholder pages
export function getModuleTitle(slug: string, mode: "player" | "frontman"): string {
  const nav = mode === "player" ? playerNav : frontmanNav;
  for (const section of nav) {
    for (const item of section.items) {
      if (item.slug === slug) return item.label;
    }
  }
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Get section name for a slug
export function getSectionName(slug: string, mode: "player" | "frontman"): string {
  const nav = mode === "player" ? playerNav : frontmanNav;
  for (const section of nav) {
    for (const item of section.items) {
      if (item.slug === slug) return section.title;
    }
  }
  return "Unknown Section";
}

// All valid slugs for validation
export function getValidSlugs(mode: "player" | "frontman"): string[] {
  const nav = mode === "player" ? playerNav : frontmanNav;
  return nav.flatMap((section) => section.items.map((item) => item.slug));
}
