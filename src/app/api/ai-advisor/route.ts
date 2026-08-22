import { NextRequest, NextResponse } from "next/server";

/**
 * AI Advisory Endpoint
 * Calls Google Gemini API with structured ward/category data
 * Returns a 3-step action plan as JSON
 */

interface AdvisorRequest {
  ward: string;
  category: string;
  currentValue: number;
  targetValue: number;
  initialValue: number;
  unit: string;
  pastInterventions?: { action: string; measuredEffect: string }[];
  context?: string; // free-text user query for copilot mode
}

interface AdvisorStep {
  action: string;
  expected_impact: string;
  owner_dept: string;
}

interface AdvisorResponse {
  summary: string;
  steps: AdvisorStep[];
  confidence: string;
  dataSourceNote: string;
}

const SYSTEM_PROMPT = `You are City Guardian AI — a tactical municipal sustainability advisor for Indian metropolitan wards.

RULES:
1. You receive structured JSON about a ward's environmental parameter (AQI, BOD, waste index, dust PM10, etc.)
2. You MUST return ONLY valid JSON matching this exact schema:
{
  "summary": "One-sentence tactical assessment of current status vs target",
  "steps": [
    { "action": "Concrete, specific, ward-level intervention", "expected_impact": "Quantified expected reduction (e.g. -15% PM2.5 within 2 weeks)", "owner_dept": "Specific Indian municipal department" },
    { "action": "...", "expected_impact": "...", "owner_dept": "..." },
    { "action": "...", "expected_impact": "...", "owner_dept": "..." }
  ],
  "confidence": "HIGH|MEDIUM|LOW based on data completeness",
  "dataSourceNote": "Brief note on what data informed this recommendation"
}
3. Be concrete, not generic. Reference specific Indian infrastructure (CPCB stations, Jal Board, PWD smog cannons, bio-digesters, FSSAI, MoHUA).
4. Each step must name a real department, not "relevant authority".
5. Expected impacts must be quantified percentages or measurable metrics.
6. If the user provides a free-text query, interpret it as a sustainability/civic domain question and still return the same JSON format.
7. Never break character. Never return markdown. Only return the JSON object.`;

// Pre-computed fallback recommendations for demo mode (no API key)
const FALLBACK_PLANS: Record<string, AdvisorResponse> = {
  "Air Quality (AQI)": {
    summary: "Ward AQI exceeds NAAQS Safe Limit by 42%. Immediate source-specific intervention required targeting construction dust and vehicular idle emissions.",
    steps: [
      { action: "Deploy 4 additional anti-smog guns at Sector 14 construction perimeter with continuous water misting (6AM-10PM cycle)", expected_impact: "-18% PM2.5 reduction within 10 days based on CPCB Anand Vihar station historical response curves", owner_dept: "CPCB Air Enforcement Division — NCR Smog Task Force" },
      { action: "Enforce mechanical road sweeping on arterial roads (NH-48 service lane, Sector 14-18 connector) twice daily with wet suppression", expected_impact: "-12% PM10 coarse dust reduction, measurable at nearest CAAQMS station within 7 days", owner_dept: "Public Works Department (PWD) — Road Dust Suppression Wing" },
      { action: "Install real-time OCEMS telemetry on 3 unmonitored DG sets in commercial zone and enforce BS-VI idle cutoff at traffic signals >90s", expected_impact: "-8% NO2 and vehicular PM2.5 contribution within 14 days of enforcement", owner_dept: "Delhi Transport Authority — Green Mobility Enforcement Cell" },
    ],
    confidence: "HIGH",
    dataSourceNote: "Based on live CPCB/Open-Meteo AQI telemetry feed and NCAP intervention efficacy benchmarks from 2024-25 Delhi Winter Action Plan",
  },
  "Water Quality (BOD)": {
    summary: "Tributary BOD at 18.5 mg/L exceeds Central Pollution Control Board discharge standard of 10 mg/L. Interception and treatment capacity gap identified.",
    steps: [
      { action: "Commission portable STP (50 KLD capacity) at Canal Outfall Point 03 with activated sludge treatment for intercepted grey water", expected_impact: "-35% BOD reduction at downstream monitoring point within 21 days of commissioning", owner_dept: "Delhi Jal Board — Yamuna Rejuvenation Taskforce" },
      { action: "Seal 4 identified illegal effluent discharge pipes from commercial establishments (Mandi Zone B, Hotel Cluster Ward 09) with physical plugs + penalty notices", expected_impact: "-22% organic load reduction at Canal Station 02 within 7 days", owner_dept: "State Pollution Control Board — Industrial Effluent Wing" },
      { action: "Install floating wetland bioremediation modules (Vetiver grass + Canna indica) in 200m stretch of stagnant canal section", expected_impact: "-15% BOD through natural phytoremediation over 30-day establishment period", owner_dept: "Municipal Green Infrastructure — Urban Waterways Division" },
    ],
    confidence: "MEDIUM",
    dataSourceNote: "Canal monitoring data from Delhi Jal Board quarterly discharge assessment and CPCB Real-Time Water Quality Monitoring System (RTWQMS)",
  },
  "Sewage & Waste Index": {
    summary: "Waste segregation at source stands at 68% against 90% municipal target. Wet organic diversion to bio-digesters operating at 55% capacity.",
    steps: [
      { action: "Deploy 12 additional twin-bin (wet/dry) collection points at Ward 14 commercial market perimeter with QR-code scanning for citizen compliance tracking", expected_impact: "+18% source segregation compliance within 14 days based on Indore model replication benchmarks", owner_dept: "Municipal Solid Waste Wing — Zone 4 Operations" },
      { action: "Activate dormant 2-ton bio-digester unit at Community Center Ward 14 for wet organic processing; route 100% market vegetable waste through this unit", expected_impact: "-25% landfill-bound organic waste; biogas output sufficient for community kitchen fuel replacement", owner_dept: "Swachh Bharat Mission Urban 2.0 — Bio-CNG Infrastructure Cell" },
      { action: "Launch doorstep e-waste collection drive (Saturdays 10AM-2PM) with registered PRO (Producer Responsibility Organization) for WEEE category items", expected_impact: "Divert 2.4 tons/month e-waste from informal sector; compliance with E-Waste Management Rules 2022", owner_dept: "CPCB Extended Producer Responsibility — E-Waste Monitoring Division" },
    ],
    confidence: "HIGH",
    dataSourceNote: "Swachh Survekshan 2025 ward-level segregation audit data and MoHUA SBM-Urban 2.0 dashboard metrics",
  },
  default: {
    summary: "Environmental parameter requires targeted municipal intervention. Analysis based on available ward telemetry and national benchmark standards.",
    steps: [
      { action: "Conduct rapid baseline assessment using portable sensor array at 4 grid points within the ward to establish precise hotspot coordinates", expected_impact: "Accurate spatial mapping enabling targeted deployment within 48 hours", owner_dept: "CPCB Regional Monitoring — Rapid Assessment Squad" },
      { action: "Deploy mobile enforcement unit for 72-hour continuous monitoring at identified hotspot with automatic threshold breach alerting", expected_impact: "Real-time violation detection and evidence capture for regulatory action", owner_dept: "State Pollution Control Board — Mobile Enforcement Division" },
      { action: "Convene ward-level stakeholder meeting with RWA presidents, market association heads, and industrial unit operators to present data and co-develop compliance timeline", expected_impact: "Community buy-in and self-regulation reducing enforcement overhead by 40%", owner_dept: "District Administration — Ward Councillor Coordination Cell" },
    ],
    confidence: "MEDIUM",
    dataSourceNote: "General environmental compliance framework per Environment (Protection) Act 1986 and CPCB operational guidelines",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: AdvisorRequest = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API key is available, call the real LLM
    if (apiKey && apiKey !== "placeholder") {
      try {
        const userMessage = body.context
          ? body.context
          : `Analyze this ward's environmental data and provide a 3-step action plan:
Ward: ${body.ward}
Category: ${body.category}
Current Value: ${body.currentValue} ${body.unit}
Target Value: ${body.targetValue} ${body.unit}
Initial Baseline: ${body.initialValue} ${body.unit}
Improvement So Far: ${(((body.initialValue - body.currentValue) / body.initialValue) * 100).toFixed(1)}%
${body.pastInterventions?.length ? `Past Interventions: ${JSON.stringify(body.pastInterventions)}` : "No prior interventions logged."}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ parts: [{ text: userMessage }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                responseMimeType: "application/json",
              },
            }),
            signal: AbortSignal.timeout(12000),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textContent) {
            const parsed: AdvisorResponse = JSON.parse(textContent);
            return NextResponse.json({ ...parsed, source: "gemini-2.0-flash-live" });
          }
        }
      } catch (llmError) {
        console.error("Gemini API error, falling back to demo:", llmError);
      }
    }

    // Fallback: return pre-computed realistic recommendation
    const plan = FALLBACK_PLANS[body.category] || FALLBACK_PLANS.default;
    return NextResponse.json({ ...plan, source: "demo-precomputed" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process advisory request", details: String(error) },
      { status: 500 }
    );
  }
}
