"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

const SUGGESTED_PROMPTS = [
  "Analyze local waste density in Sector 14",
  "Optimal upcycling route for E-Waste PCBs",
  "Check reward eligibility & tier status",
];

export default function EcoAiHandlerView() {
  const { copilotMessages, sendCopilotMessage, points, badgeTier } = usePlayerStore();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [copilotMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendCopilotMessage(inputText);
    setInputText("");
  };

  const handleSuggestedClick = (prompt: string) => {
    sendCopilotMessage(prompt);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-black tracking-[3px] uppercase px-2 py-0.5 rounded font-mono"
              style={{
                background: "rgba(255, 46, 109, 0.15)",
                color: "var(--sq-pink)",
                border: "1px solid rgba(255, 46, 109, 0.3)",
              }}
            >
              ● COPILOT TACTICAL AI
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            ECO AI HANDLER
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Terse, tactical sustainability-domain advisor. Query municipal routing algorithms, landfill suppression metrics, or upcycling protocols.
          </p>
        </div>

        {/* Live Copilot Status Pill */}
        <div
          className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 shrink-0"
          style={{ borderColor: "var(--sq-pink)" }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          <div className="text-left font-mono">
            <div className="text-[9px] uppercase text-gray-400">Node Status</div>
            <div className="text-xs font-bold text-pink-400">STAGE 1 ENFORCER ACTIVE</div>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
          Suggested Directive Directives:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSuggestedClick(prompt)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-[1.02] text-left border"
              style={{
                background: "rgba(255, 46, 109, 0.08)",
                borderColor: "rgba(255, 46, 109, 0.25)",
                color: "var(--sq-pink)",
              }}
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Terminal Box */}
      <div
        className="glass-panel rounded-xl overflow-hidden flex flex-col h-[520px] border"
        style={{
          borderColor: "rgba(255, 46, 109, 0.3)",
          background: "rgba(10, 14, 12, 0.85)",
        }}
      >
        {/* Terminal Header */}
        <div
          className="px-4 py-2.5 border-b flex items-center justify-between font-mono text-[11px]"
          style={{
            borderColor: "rgba(255, 46, 109, 0.2)",
            background: "rgba(0, 0, 0, 0.4)",
            color: "var(--sq-pink)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span>TERMINAL // CITY_GUARDIAN_COPILOT_v2.0</span>
          </div>
          <span className="text-gray-500 text-[10px]">
            USER: CG-00456 • {points} PTS • {badgeTier.toUpperCase()}
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {copilotMessages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 font-mono"
                    style={{
                      background: "rgba(255, 46, 109, 0.2)",
                      color: "var(--sq-pink)",
                      border: "1px solid rgba(255, 46, 109, 0.4)",
                    }}
                  >
                    △
                  </div>
                )}

                <div
                  className={`max-w-lg rounded-xl p-3.5 space-y-2 ${
                    isUser
                      ? "bg-emerald-950/40 border border-emerald-500/30 text-gray-200"
                      : "bg-black/60 border border-pink-900/40 text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] font-mono">
                    <span
                      style={{
                        color: isUser ? "var(--sq-green)" : "var(--sq-pink)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {isUser ? "CONTESTANT 456" : "COPILOT ADVISOR"}
                    </span>
                    <span className="text-gray-500">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs leading-relaxed">{msg.text}</p>

                  {/* Tactical tags */}
                  {msg.tags && msg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {msg.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider"
                          style={{
                            background: "rgba(255, 46, 109, 0.15)",
                            color: "var(--sq-pink)",
                            border: "1px solid rgba(255, 46, 109, 0.3)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 font-mono"
                    style={{
                      background: "rgba(57, 255, 136, 0.2)",
                      color: "var(--sq-green)",
                      border: "1px solid rgba(57, 255, 136, 0.4)",
                    }}
                  >
                    ○
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-pink-950/60 bg-black/50 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter command or query (e.g., 'What is best recycler for HDPE bottles?')..."
            className="flex-1 bg-black/60 border border-pink-950/80 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all hover:scale-105"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, rgba(255, 46, 109, 0.3), rgba(255, 46, 109, 0.1))",
              color: "var(--sq-pink)",
              border: "1px solid var(--sq-pink)",
            }}
          >
            TRANSMIT
          </button>
        </form>
      </div>
    </div>
  );
}
