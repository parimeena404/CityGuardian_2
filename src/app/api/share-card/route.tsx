import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * OG Share Card Image Generator
 * Generates Squid-Game-themed impact card images for social sharing
 * Used as the og:image when LinkedIn/WhatsApp previews a share URL
 */

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "badge";
  const title = searchParams.get("title") || "City Guardian Achievement";
  const stat = searchParams.get("stat") || "Environmental Impact Verified";
  const ward = searchParams.get("ward") || "Ward 14 • Delhi NCR";

  const bgColor = "#0a0a0a";
  const accentColor = type === "badge" ? "#ffd166" : type === "civic-ticket" ? "#39ff88" : "#ff2e6d";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background shapes */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            fontSize: "180px",
            color: "rgba(255, 46, 109, 0.06)",
            display: "flex",
          }}
        >
          ○
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "160px",
            color: "rgba(57, 255, 136, 0.06)",
            display: "flex",
          }}
        >
          △
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "60px",
            fontSize: "120px",
            color: "rgba(255, 209, 102, 0.05)",
            display: "flex",
          }}
        >
          □
        </div>

        {/* Content card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 64px",
            border: `3px solid ${accentColor}`,
            borderRadius: "24px",
            backgroundColor: "rgba(13, 20, 16, 0.95)",
            boxShadow: `0 0 60px ${accentColor}40`,
            maxWidth: "900px",
            textAlign: "center",
          }}
        >
          {/* Badge/Icon */}
          <div
            style={{
              fontSize: "72px",
              marginBottom: "16px",
              display: "flex",
            }}
          >
            {type === "badge" ? "🏅" : type === "challenge" ? "🏆" : type === "civic-ticket" ? "✅" : type === "food-rescue" ? "🍲" : "📸"}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "12px",
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* Stat */}
          <div
            style={{
              fontSize: "20px",
              color: accentColor,
              fontWeight: 700,
              marginBottom: "20px",
              display: "flex",
            }}
          >
            {stat}
          </div>

          {/* Ward / Location */}
          <div
            style={{
              fontSize: "16px",
              color: "#9ca3af",
              display: "flex",
            }}
          >
            📍 {ward}
          </div>

          {/* Branding */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#ff2e6d",
                fontWeight: 900,
                letterSpacing: "4px",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              ○ △ □ CITY GUARDIAN
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
