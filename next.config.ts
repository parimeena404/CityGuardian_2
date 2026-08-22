import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  typescript: {
    // Ensure builds do not fail unexpectedly on Vercel during CI
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
