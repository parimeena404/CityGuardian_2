import { NextResponse } from "next/server";
import { calculateImprovementTier } from "@/store/usePlayerStore";

/**
 * Pipeline Recalculation Endpoint
 * Scheduled-ready Edge Function that recalculates ward clock values,
 * improvement percentages, badge tiers, and leaderboard rankings.
 * 
 * In production: called by Supabase Edge Function cron or external scheduler
 * In demo mode: returns mock recalculated data
 * 
 * Architecture note: This endpoint is structured so that swapping in
 * Kafka/InfluxDB as the data source requires NO UI changes — only
 * this data-fetch layer changes.
 */

interface WardClockReading {
  wardId: string;
  wardName: string;
  category: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  assignedDept: string;
  lastMeasuredAt: string;
}

interface RecalculationResult {
  wardClocks: (WardClockReading & {
    improvementPct: number;
    badgeTier: string;
    targetProgress: number;
    status: "critical" | "warning" | "on_track" | "target_met";
  })[];
  leaderboardUpdated: boolean;
  alertsTriggered: string[];
  recalculatedAt: string;
}

// Mock sensor readings (structured for Kafka/Postgres pipeline swap)
const MOCK_WARD_READINGS: WardClockReading[] = [
  { wardId: "w-14", wardName: "Ward 14 (Cyber Hub)", category: "Air Quality (AQI)", initialValue: 220, currentValue: 142, targetValue: 80, unit: "AQI", assignedDept: "CPCB Air Enforcement Unit 02", lastMeasuredAt: new Date().toISOString() },
  { wardId: "w-14", wardName: "Ward 14 (Cyber Hub)", category: "Sewage & Waste Index", initialValue: 100, currentValue: 68, targetValue: 40, unit: "INDEX", assignedDept: "Municipal Waste Taskforce Zone 4", lastMeasuredAt: new Date().toISOString() },
  { wardId: "w-18", wardName: "Ward 18 (Riverfront)", category: "Water Quality (BOD)", initialValue: 32, currentValue: 18.5, targetValue: 8, unit: "mg/L", assignedDept: "Delhi Jal Board Waterways Taskforce", lastMeasuredAt: new Date().toISOString() },
  { wardId: "w-18", wardName: "Ward 18 (Riverfront)", category: "Dust & Urban Heat", initialValue: 130, currentValue: 84, targetValue: 50, unit: "PM10", assignedDept: "PWD Smog Cannon & Sprinkler Squad", lastMeasuredAt: new Date().toISOString() },
  { wardId: "w-22", wardName: "Ward 22 (Industrial Belt)", category: "Air Quality (AQI)", initialValue: 290, currentValue: 198, targetValue: 110, unit: "AQI", assignedDept: "CPCB Industrial OCEMS Oversight", lastMeasuredAt: new Date().toISOString() },
  { wardId: "w-03", wardName: "Ward 03 (University Campus)", category: "Sewage & Waste Index", initialValue: 80, currentValue: 34, targetValue: 30, unit: "INDEX", assignedDept: "Campus Zero-Waste Taskforce", lastMeasuredAt: new Date().toISOString() },
  { wardId: "w-09", wardName: "Ward 09 (Old City Grid)", category: "Sewage & Waste Index", initialValue: 110, currentValue: 78, targetValue: 50, unit: "INDEX", assignedDept: "Old Delhi Sanitation Operations", lastMeasuredAt: new Date().toISOString() },
];

export async function GET() {
  try {
    const alertsTriggered: string[] = [];

    const recalculated = MOCK_WARD_READINGS.map((reading) => {
      const { pct, tier } = calculateImprovementTier(reading.initialValue, reading.currentValue);
      const totalGap = Math.abs(reading.initialValue - reading.targetValue) || 1;
      const achieved = Math.abs(reading.initialValue - reading.currentValue);
      const targetProgress = Math.min(100, Math.round((achieved / totalGap) * 100));

      let status: "critical" | "warning" | "on_track" | "target_met" = "warning";
      if (reading.currentValue <= reading.targetValue) status = "target_met";
      else if (targetProgress >= 60) status = "on_track";
      else if (targetProgress < 30) status = "critical";

      // Trigger alert if threshold crossed
      if (status === "critical") {
        alertsTriggered.push(
          `ALERT: ${reading.wardName} — ${reading.category} at ${reading.currentValue} ${reading.unit} (target: ${reading.targetValue})`
        );
      }

      return {
        ...reading,
        improvementPct: pct,
        badgeTier: tier,
        targetProgress,
        status,
      };
    });

    const result: RecalculationResult = {
      wardClocks: recalculated,
      leaderboardUpdated: true,
      alertsTriggered,
      recalculatedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Pipeline recalculation failed", details: String(error) },
      { status: 500 }
    );
  }
}
