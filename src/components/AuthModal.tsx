"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { signInWithEmail, signUp, type UserRole } from "@/lib/auth";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("Contestant 456");
  const [role, setRole] = useState<UserRole>("player");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = mode === "login"
      ? await signInWithEmail(email, password)
      : await signUp(email, password, role, name);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.user) {
      onSuccess(result.user.role);
    }
  };

  const handleDemoMode = (demoRole: UserRole) => {
    onSuccess(demoRole);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.92)", backdropFilter: "blur(12px)" }}
    >
      {/* Floating ○△□ */}
      <div className="absolute top-[15%] left-[10%] text-[120px] opacity-[0.04] text-pink-500 pointer-events-none select-none">○</div>
      <div className="absolute bottom-[15%] right-[12%] text-[100px] opacity-[0.04] text-emerald-400 pointer-events-none select-none">△</div>
      <div className="absolute top-[50%] right-[25%] text-[80px] opacity-[0.03] text-amber-300 pointer-events-none select-none">□</div>

      <div
        className="glass-panel p-8 max-w-md w-full rounded-2xl border space-y-6 relative bg-black/95"
        style={{
          borderColor: "var(--sq-pink)",
          boxShadow: "0 0 60px rgba(255, 46, 109, 0.2)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="text-xs font-black tracking-[4px] uppercase text-pink-400 font-mono mb-2">
            ○ △ □ CITY GUARDIAN
          </div>
          <h2
            className="text-xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            {mode === "login" ? "ENTER THE ARENA" : "JOIN THE GAME"}
          </h2>
        </div>

        {/* Demo Mode Quick Entry */}
        <div className="space-y-2">
          <div className="text-[10px] text-center text-gray-400 font-mono uppercase tracking-wider">
            QUICK DEMO ACCESS (NO ACCOUNT NEEDED)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoMode("player")}
              className="py-3 rounded-xl text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgba(57, 255, 136, 0.2), rgba(57, 255, 136, 0.05))",
                color: "var(--sq-green)",
                border: "1px solid rgba(57, 255, 136, 0.4)",
              }}
            >
              ● ENTER AS PLAYER
            </button>
            <button
              type="button"
              onClick={() => handleDemoMode("frontman")}
              className="py-3 rounded-xl text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 46, 109, 0.2), rgba(255, 46, 109, 0.05))",
                color: "var(--sq-pink)",
                border: "1px solid rgba(255, 46, 109, 0.4)",
              }}
            >
              ▲ ENTER AS FRONT MAN
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-[10px] text-gray-500 font-mono">OR AUTHENTICATE</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Contestant Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contestant@cityguardian.in"
              className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
              Access Code
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Role Assignment
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              >
                <option value="player">● Player (Citizen)</option>
                <option value="frontman">▲ Front Man (Authority)</option>
              </select>
            </div>
          )}

          {error && (
            <div className="p-2 rounded bg-pink-500/10 border border-pink-500/30 text-xs text-pink-400 font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.01] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, rgba(255, 46, 109, 0.35), rgba(255, 46, 109, 0.1))",
              color: "var(--sq-pink)",
              border: "1px solid var(--sq-pink)",
            }}
          >
            {loading ? "AUTHENTICATING..." : mode === "login" ? "AUTHENTICATE" : "CREATE IDENTITY"}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            {mode === "login" ? "No identity? Create account →" : "Already registered? Sign in →"}
          </button>
        </div>
      </div>
    </div>
  );
}
