# ○ △ □ CITY GUARDIAN — CIVIC SURVIVAL PLATFORM

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Deployment-39ff88?style=for-the-badge&logo=vercel)](https://city-guardian-2-affg.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-CityGuardian__2-ff2e6d?style=for-the-badge&logo=github)](https://github.com/parimeena404/CityGuardian_2.git)

> 🌐 **Live Production URL**: [https://city-guardian-2-affg.vercel.app/](https://city-guardian-2-affg.vercel.app/)

> **"Gamified civic survival where measured environmental outcomes drive real municipal accountability."**

City Guardian turns urban sustainability into an arena of high-stakes citizen engagement and authority oversight. Inspired by the Squid Game aesthetic, the platform splits into two synchronized operational modes: **PLAYER MODE** for citizen action and rewards, and **FRONT MAN MODE** for department scoring and digital ward clocks.

---

## ⚡ LIVE VS. INTEGRATION-READY MATRIX (JUDGE FEASIBILITY BREAKDOWN)

| Capability / Service | Status | Architecture & Implementation |
| :--- | :--- | :--- |
| **Real-Time AQI & Telemetry** | 🟢 **LIVE** | Live Open-Meteo & CPCB CAAQMS station telemetry synchronization with automatic threshold alerts. |
| **Tactical AI Advisory Engine** | 🟢 **LIVE** | Google Gemini 2.0 Flash (`/api/ai-advisor`) returning structured 3-step action plans with department owners & quantified impact. |
| **LinkedIn Share-Intent** | 🟢 **LIVE** | Public share URLs with dynamic Squid Game OG card images generated via `@vercel/og` (no OAuth/impersonation needed). |
| **Web Share API** | 🟢 **LIVE** | Native mobile sharing for WhatsApp, X, and Telegram with automatic clipboard copy fallback. |
| **Outcome-Based Scoring Engine** | 🟢 **LIVE** | Mathematical suppression formula: `((Initial − Current) ÷ Initial) × 100` powering badges for both citizens & departments. |
| **Digital Ward Clocks** | 🟢 **LIVE** | SVG progress rings with time windows, target indices, and departmental outcome scorecards. |
| **EcoFood Rescue Network** | 🟢 **LIVE** | Commercial discount food marketplace (50% OFF) + 100% donation NGO rescue pipeline. |
| **Civic Action Tickets (e-FIR)** | 🟢 **LIVE** | 5-stage accountability pipeline with community voting threshold and before/after verification. |
| **Supabase Postgres & Realtime** | 🟡 **INTEGRATION-READY** | Full SQL migrations (`0001`, `0002`, `0003`) & `seed.sql` provided. Zustand state acts as zero-config local fallback. |
| **CPCB OCEMS / SBM-Urban 2.0** | 🟡 **INTEGRATION-READY** | Pre-built API endpoints (`/api/pipeline/recalculate`) ready to ingest Kafka/InfluxDB streams without UI changes. |

---

## 🏛️ DUAL-MODE OPERATIONAL ARCHITECTURE

```
                          ┌────────────────────────┐
                          │  OPEN-METEO / CPCB API │
                          └───────────┬────────────┘
                                      │ Live Telemetry
                                      ▼
┌─────────────────────────┐    ┌──────────────┐    ┌─────────────────────────┐
│       PLAYER MODE       │◄───┤ API GATEWAY  ├───►│     FRONT MAN MODE      │
│   (Citizen Action)      │    │  (Next.js)   │    │  (Authority Command)    │
├─────────────────────────┤    └──────┬───────┘    ├─────────────────────────┤
│ • Waste Hotspot Reports │           │            │ • Digital Ward Clocks   │
│ • Eco AI Copilot        │           ▼            │ • Department Scorecards │
│ • Survival Challenges   │    ┌──────────────┐    │ • e-FIR & Breach Log    │
│ • EcoFood Marketplace   │    │ GEMINI 2.0   │    │ • Impact Heatmap Matrix │
│ • Rewards Vault (LiFE)  │    │ AI ADVISOR   │    │ • Funding & CSR Tracker │
└─────────────────────────┘    └──────────────┘    └─────────────────────────┘
```

---

## 📐 THE SCORING FORMULA

Both citizens and municipal departments are governed by the same outcome-based mathematical principle:

$$\text{Improvement \%} = \frac{\text{Initial Index} - \text{New Index}}{\text{Initial Index}} \times 100$$

- **🥉 Bronze Tier (10% - 19% reduction)**: 1.2x Point Multiplier / Municipal Commendation
- **🥈 Silver Tier (20% - 29% reduction)**: 1.5x Point Multiplier / Priority Budget Grant
- **🥇 Gold Tier (30%+ reduction)**: 2.0x Point Multiplier / State Excellence Seal

---

## 🚀 QUICK START (DEVELOPMENT & DEMO)

### 1. Clone & Install
```bash
git clone https://github.com/parimeena404/CityGuardian_2.git
cd CityGuardian_2
npm install
```

### 2. Environment Setup (Optional for Demo Mode)
Copy the example environment file:
```bash
cp .env.example .env.local
```
Add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/apikey) to enable live LLM responses. If omitted, the app will smoothly use pre-computed tactical plans.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ CREDITS & COMPLIANCE
- **Styling**: Tailwind CSS v4 with custom CRT scanline overlays and HSL neon palette.
- **Theme**: Squid Game-inspired Pink (`#ff2e6d`), Emerald Green (`#39ff88`), Gold (`#ffd166`), and Deep Obsidian (`#0a0a0a`).
- **Data Privacy**: No municipal account impersonation; all public escalation flows use client-side share intents.
