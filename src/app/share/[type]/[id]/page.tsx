import { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://city-guardian-2.vercel.app";

type PageParams = Promise<{ type: string; id: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { type, id } = await params;
  const title = `City Guardian — ${type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Achievement`;
  const ogImageUrl = `${APP_URL}/api/share-card?type=${type}&id=${id}&title=${encodeURIComponent(title)}`;

  return {
    title,
    description: "Verified civic sustainability impact on City Guardian — the gamified civic survival platform. Join the arena.",
    openGraph: {
      title,
      description: "Verified civic sustainability impact through measured environmental outcomes.",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: { params: PageParams }) {
  const { type, id } = await params;

  const typeLabel = type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        color: "#ffffff",
        padding: "2rem",
      }}
    >
      {/* Floating shapes */}
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "10%",
          fontSize: "200px",
          opacity: 0.04,
          color: "#ff2e6d",
          pointerEvents: "none",
        }}
      >
        ○
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          right: "10%",
          fontSize: "180px",
          opacity: 0.04,
          color: "#39ff88",
          pointerEvents: "none",
        }}
      >
        △
      </div>

      {/* Achievement Card */}
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          padding: "3rem",
          border: "2px solid rgba(255, 46, 109, 0.4)",
          borderRadius: "1.5rem",
          background: "rgba(13, 20, 16, 0.95)",
          textAlign: "center",
          boxShadow: "0 0 60px rgba(255, 46, 109, 0.15)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "1rem" }}>
          {type === "badge" ? "🏅" : type === "challenge" ? "🏆" : type === "civic-ticket" ? "✅" : type === "food-rescue" ? "🍲" : "📸"}
        </div>

        <div
          style={{
            fontSize: "10px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#ff2e6d",
            fontWeight: 900,
            marginBottom: "0.5rem",
          }}
        >
          ○ △ □ CITY GUARDIAN VERIFIED
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#ffffff",
            margin: "0.5rem 0",
          }}
        >
          {typeLabel} Achievement
        </h1>

        <p
          style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            lineHeight: 1.6,
            margin: "1rem 0",
          }}
        >
          This achievement was earned through verified citizen action on City Guardian — the gamified civic sustainability platform where measured environmental outcomes drive real accountability.
        </p>

        <div
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          Achievement ID: {id}
        </div>

        {/* CTA */}
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.75rem 2rem",
            borderRadius: "0.75rem",
            background: "rgba(255, 46, 109, 0.15)",
            color: "#ff2e6d",
            border: "1px solid rgba(255, 46, 109, 0.4)",
            textDecoration: "none",
            fontSize: "0.75rem",
            fontWeight: 900,
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          JOIN THE ARENA →
        </a>
      </div>
    </div>
  );
}
