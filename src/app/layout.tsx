import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "City Guardian — Civic Survival Platform",
  description:
    "A gamified civic-sustainability platform. Report waste, earn rewards, rescue food, and track civic impact — all in the arena.",
  keywords: ["sustainability", "civic", "gamification", "waste management", "eco", "city guardian"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
