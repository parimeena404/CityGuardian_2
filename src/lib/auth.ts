/**
 * City Guardian — Supabase Auth Helpers
 * Handles authentication with role claims (player/frontman)
 * Falls back to demo mode when Supabase is not configured
 */

import { supabase, isSupabaseConfigured } from "./supabase";

export type UserRole = "player" | "frontman";

export interface CityGuardianUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  isDemo: boolean;
}

// Demo users for hackathon presentation
const DEMO_PLAYER: CityGuardianUser = {
  id: "demo-player-456",
  email: "contestant456@cityguardian.in",
  role: "player",
  name: "Contestant 456",
  isDemo: true,
};

const DEMO_FRONTMAN: CityGuardianUser = {
  id: "demo-frontman-001",
  email: "frontman@cityguardian.in",
  role: "frontman",
  name: "Front Man",
  isDemo: true,
};

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: CityGuardianUser | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Demo mode — accept any credentials
    const role: UserRole = email.includes("frontman") || email.includes("admin") ? "frontman" : "player";
    return {
      user: role === "frontman" ? DEMO_FRONTMAN : DEMO_PLAYER,
      error: null,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };

  // Fetch role from users table
  const { data: profile } = await supabase
    .from("users")
    .select("role, name")
    .eq("auth_id", data.user.id)
    .single();

  return {
    user: {
      id: data.user.id,
      email: data.user.email || email,
      role: (profile?.role as UserRole) || "player",
      name: profile?.name || "Contestant",
      isDemo: false,
    },
    error: null,
  };
}

/**
 * Sign up with email, password, and role
 */
export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  name: string
): Promise<{ user: CityGuardianUser | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      user: role === "frontman" ? DEMO_FRONTMAN : DEMO_PLAYER,
      error: null,
    };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { user: null, error: error.message };

  // Create profile in users table
  if (data.user) {
    await supabase.from("users").insert({
      auth_id: data.user.id,
      name,
      email,
      role,
      points: 0,
      badge_tier: "none",
    });
  }

  return {
    user: {
      id: data.user?.id || "new-user",
      email,
      role,
      name,
      isDemo: false,
    },
    error: null,
  };
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<CityGuardianUser | null> {
  if (!isSupabaseConfigured()) {
    return null; // Demo mode — controlled by Zustand store role toggle
  }

  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("role, name")
    .eq("auth_id", data.user.id)
    .single();

  return {
    id: data.user.id,
    email: data.user.email || "",
    role: (profile?.role as UserRole) || "player",
    name: profile?.name || "Contestant",
    isDemo: false,
  };
}

/**
 * Get demo user based on role
 */
export function getDemoUser(role: UserRole): CityGuardianUser {
  return role === "frontman" ? DEMO_FRONTMAN : DEMO_PLAYER;
}
