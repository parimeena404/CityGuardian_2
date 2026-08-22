"use client";

import React, { useState } from "react";
import {
  getLinkedInShareUrl,
  shareViaWebAPI,
  buildShareText,
  generateShareUrl,
  type ShareableType,
} from "@/lib/share";

interface ShareImpactButtonProps {
  type: ShareableType;
  id: string;
  title: string;
  stat?: string;
  ward?: string;
  compact?: boolean;
}

export default function ShareImpactButton({
  type,
  id,
  title,
  stat,
  ward,
  compact = false,
}: ShareImpactButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const { title: shareTitle, text: shareText } = buildShareText({ type, title, stat, ward });
  const shareUrl = generateShareUrl(type, id);

  const handleLinkedIn = () => {
    const url = getLinkedInShareUrl({ type, id, title, summary: shareText });
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    setShowDropdown(false);
  };

  const handleWebShare = async () => {
    const result = await shareViaWebAPI({ title: shareTitle, text: shareText, url: shareUrl });
    if (result.method === "clipboard" && result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowDropdown(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className={`group flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 ${
          compact
            ? "text-[10px] px-2 py-1 rounded"
            : "text-xs px-3 py-1.5 rounded-lg"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(57, 255, 136, 0.2), rgba(0, 119, 182, 0.15))",
          color: "var(--sq-green)",
          border: "1px solid rgba(57, 255, 136, 0.4)",
        }}
      >
        <svg
          width={compact ? 12 : 14}
          height={compact ? 12 : 14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        {copied ? "COPIED!" : "SHARE IMPACT"}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div
            className="absolute right-0 top-full mt-1 z-50 glass-panel rounded-xl overflow-hidden border font-mono text-xs min-w-[200px]"
            style={{
              background: "#0d1410",
              borderColor: "rgba(57, 255, 136, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* LinkedIn */}
            <button
              type="button"
              onClick={handleLinkedIn}
              className="w-full px-4 py-3 text-left flex items-center gap-2.5 hover:bg-emerald-950/40 transition-colors text-gray-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="font-bold">Share on LinkedIn</span>
            </button>

            {/* Web Share (Mobile) */}
            <button
              type="button"
              onClick={handleWebShare}
              className="w-full px-4 py-3 text-left flex items-center gap-2.5 hover:bg-emerald-950/40 transition-colors text-gray-200 border-t border-gray-900"
            >
              <span className="text-base">📱</span>
              <span className="font-bold">Share via WhatsApp / X</span>
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full px-4 py-3 text-left flex items-center gap-2.5 hover:bg-emerald-950/40 transition-colors text-gray-200 border-t border-gray-900"
            >
              <span className="text-base">🔗</span>
              <span className="font-bold">Copy Share Link</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
