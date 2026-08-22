/**
 * Supabase Realtime Subscription Manager
 * Subscribes to ward clock alerts and civic ticket updates
 * Pushes live toast/banner alerts to Front Man dashboards
 */

import { supabase, isSupabaseConfigured } from "./supabase";

export interface RealtimeAlert {
  id: string;
  alertType: "threshold_breach" | "clock_target_met" | "civic_escalation" | "efir_triggered";
  wardId: string;
  wardName: string;
  message: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
}

type AlertCallback = (alert: RealtimeAlert) => void;

let activeChannel: ReturnType<typeof supabase.channel> | null = null;

/**
 * Subscribe to real-time ward clock alerts
 * When a clock crosses a threshold, pushes an alert to subscribers
 */
export function subscribeToAlerts(onAlert: AlertCallback): () => void {
  if (!isSupabaseConfigured()) {
    // Demo mode — simulate periodic alerts
    const interval = setInterval(() => {
      const demoAlerts: RealtimeAlert[] = [
        {
          id: `alert-${Date.now()}`,
          alertType: "threshold_breach",
          wardId: "ward-22",
          wardName: "Ward 22 (Industrial Belt)",
          message: "AQI exceeded 200 threshold — CPCB enforcement dispatched",
          severity: "critical",
          createdAt: new Date().toISOString(),
        },
        {
          id: `alert-${Date.now()}`,
          alertType: "clock_target_met",
          wardId: "ward-03",
          wardName: "Ward 03 (University Campus)",
          message: "Waste Segregation Index met 90% target — Gold Badge earned",
          severity: "info",
          createdAt: new Date().toISOString(),
        },
        {
          id: `alert-${Date.now()}`,
          alertType: "civic_escalation",
          wardId: "ward-14",
          wardName: "Ward 14 (Cyber Hub)",
          message: "Civic ticket CG-TKT-0014 reached verification threshold — Action Ticket auto-generated",
          severity: "warning",
          createdAt: new Date().toISOString(),
        },
      ];

      const randomAlert = demoAlerts[Math.floor(Math.random() * demoAlerts.length)];
      onAlert(randomAlert);
    }, 45000); // Every 45 seconds in demo mode

    return () => clearInterval(interval);
  }

  // Real Supabase Realtime subscription
  activeChannel = supabase
    .channel("ward-clock-alerts")
    .on("broadcast", { event: "alert" }, (payload) => {
      const alert = payload.payload as RealtimeAlert;
      onAlert(alert);
    })
    .subscribe();

  return () => {
    if (activeChannel) {
      supabase.removeChannel(activeChannel);
      activeChannel = null;
    }
  };
}

/**
 * Broadcast an alert (used by recalculation endpoint or admin actions)
 */
export async function broadcastAlert(alert: Omit<RealtimeAlert, "id" | "createdAt">): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const channel = supabase.channel("ward-clock-alerts");
  await channel.send({
    type: "broadcast",
    event: "alert",
    payload: {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    },
  });
}

/**
 * Subscribe to civic ticket status changes
 */
export function subscribeToCivicUpdates(
  onUpdate: (ticketId: string, newStatus: string) => void
): () => void {
  if (!isSupabaseConfigured()) {
    return () => {}; // No-op in demo mode
  }

  const channel = supabase
    .channel("civic-updates")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "civic_action_tickets" },
      (payload) => {
        onUpdate(payload.new.id, payload.new.status);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
