/**
 * City Guardian — Unified Sharing Utilities
 * LinkedIn share-intent (no OAuth) + Web Share API + clipboard fallback
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://city-guardian-2-affg.vercel.app";

export type ShareableType = "badge" | "challenge" | "civic-ticket" | "food-rescue" | "waste-report";

/**
 * Generate a public shareable URL for an achievement
 */
export function generateShareUrl(type: ShareableType, id: string): string {
  return `${APP_URL}/share/${type}/${id}`;
}

/**
 * Generate LinkedIn share-intent URL (genuinely functional, no OAuth needed)
 */
export function getLinkedInShareUrl(params: {
  type: ShareableType;
  id: string;
  title: string;
  summary?: string;
}): string {
  const shareUrl = generateShareUrl(params.type, params.id);
  // LinkedIn share-intent URL — opens LinkedIn compose with pre-filled content
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
}

/**
 * Share via Web Share API (mobile: WhatsApp, X, Telegram, etc.)
 * Falls back to clipboard copy if Web Share API unavailable
 */
export async function shareViaWebAPI(params: {
  title: string;
  text: string;
  url: string;
}): Promise<{ method: "webshare" | "clipboard" | "failed"; success: boolean }> {
  // Try Web Share API first (mobile browsers, some desktop)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: params.title,
        text: params.text,
        url: params.url,
      });
      return { method: "webshare", success: true };
    } catch (err) {
      // User cancelled or API error — fall through to clipboard
      if ((err as Error).name === "AbortError") {
        return { method: "webshare", success: false };
      }
    }
  }

  // Fallback: copy to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${params.title}\n${params.text}\n${params.url}`);
      return { method: "clipboard", success: true };
    } catch {
      return { method: "clipboard", success: false };
    }
  }

  return { method: "failed", success: false };
}

/**
 * Build share text for different achievement types
 */
export function buildShareText(params: {
  type: ShareableType;
  title: string;
  stat?: string;
  ward?: string;
}): { title: string; text: string } {
  const cityTag = "City Guardian — Civic Survival Platform";

  switch (params.type) {
    case "badge":
      return {
        title: `🏅 ${params.title} — ${cityTag}`,
        text: `I earned the ${params.title} badge on City Guardian! ${params.stat || ""} Our ward's environmental index improved through verified citizen action. #CityGuardian #Sustainability #SquidHack`,
      };
    case "challenge":
      return {
        title: `🏆 Challenge Complete — ${cityTag}`,
        text: `Just completed "${params.title}" on City Guardian! ${params.stat || ""} Real measured environmental improvement, not just participation points. #CityGuardian #CleanAir`,
      };
    case "civic-ticket":
      return {
        title: `✅ Civic Issue Resolved — ${cityTag}`,
        text: `Civic issue "${params.title}" in ${params.ward || "our ward"} has been RESOLVED with verified before/after evidence on City Guardian. Transparent accountability works. #CityGuardian #CivicTech`,
      };
    case "food-rescue":
      return {
        title: `🍲 Food Rescued — ${cityTag}`,
        text: `${params.stat || "Meals"} rescued from commercial waste through City Guardian's EcoFood Rescue Network! Zero food waste, maximum impact. #CityGuardian #ZeroFoodWaste`,
      };
    case "waste-report":
      return {
        title: `📸 Waste Hotspot Verified — ${cityTag}`,
        text: `Verified a waste hotspot in ${params.ward || "our ward"} on City Guardian. Community-sourced environmental monitoring driving real municipal action. #CityGuardian #SwachhBharat`,
      };
  }
}
