"use client";

import React, { useState } from "react";
import { usePlayerStore, type WasteCategory } from "@/store/usePlayerStore";

const CATEGORIES: { id: WasteCategory; label: string; icon: string; desc: string; sampleWaste: string }[] = [
  {
    id: "plastic",
    label: "Plastic / Polymers",
    icon: "🥤",
    desc: "Single-use PET bottles, HDPE jugs, packaging wrappers",
    sampleWaste: "Single-use PET bottles, sachets & bubblewrap",
  },
  {
    id: "electronic",
    label: "Electronic / Rare Metals",
    icon: "🔌",
    desc: "Circuit boards, batteries, phone/laptop scrap, cables",
    sampleWaste: "Scrap PCB boards, battery packs & damaged cords",
  },
  {
    id: "organic",
    label: "Organic / Food Waste",
    icon: "🥬",
    desc: "Kitchen wet waste, market surplus, horticultural cuttings",
    sampleWaste: "Rotten market greens & canteen food surplus",
  },
  {
    id: "industrial",
    label: "Industrial / Construction Scrap",
    icon: "🏗️",
    desc: "Demolition debris, metal cuttings, fly ash, pipes",
    sampleWaste: "Concrete blocks, dry drywall & aluminium pipes",
  },
  {
    id: "paper",
    label: "Paper / Corrugated Cardboard",
    icon: "📦",
    desc: "Shipping boxes, shredded paper, newsprint bales",
    sampleWaste: "Discarded delivery carton boxes & paper piles",
  },
  {
    id: "hazardous",
    label: "Hazardous / Chemical Waste",
    icon: "☣️",
    desc: "Paints, solvents, medical sharps, pesticide containers",
    sampleWaste: "Unlabelled solvent canisters & chemical residue",
  },
];

const SAMPLE_HOTSPOTS = [
  { name: "Sector 14 Central Plaza, Ward 14", lat: 28.6139, lng: 77.2090 },
  { name: "Cyber Green Corridor 3, Tech Park", lat: 28.6189, lng: 77.2145 },
  { name: "Old Mandi Wholesale Market Gate 2", lat: 28.6050, lng: 77.2210 },
  { name: "Yamuna Riverfront Canal Outflow 4", lat: 28.6250, lng: 77.2300 },
];

export default function ReportWasteView() {
  const { addWasteReport } = usePlayerStore();

  const [category, setCategory] = useState<WasteCategory>("plastic");
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60"
  );
  const [customPhotoSelected, setCustomPhotoSelected] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("Sector 14 Central Plaza, Ward 14");
  const [geoLat, setGeoLat] = useState<number>(28.6139);
  const [geoLng, setGeoLng] = useState<number>(77.2090);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Handle Photo File Upload / Capture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
          setCustomPhotoSelected(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Device Geolocation Capture
  const handleCaptureGPS = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLat(Number(pos.coords.latitude.toFixed(4)));
          setGeoLng(Number(pos.coords.longitude.toFixed(4)));
          setLocationName(`GPS Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        () => {
          // Fallback to sample
          setGeoLat(28.6139);
          setGeoLng(77.2090);
          setLocationName("Ward 14 Grid Hotspot (GPS Simulated)");
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addWasteReport({
        photoUrl,
        geoLat,
        geoLng,
        locationName,
        category,
        notes: notes || `Reported unsegregated ${category} waste hotspot.`,
      });

      // Clear custom fields
      setNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-emerald-400 font-mono">
              ○ △ □ SQUID ARENA DISPATCH
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            REPORT WASTE HOTSPOT
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Submit geo-tagged evidence. Earn <span className="text-emerald-400 font-bold">+10 PTS</span> immediately and{" "}
            <span className="text-amber-400 font-bold">+20 PTS</span> once verified by municipal validator node.
          </p>
        </div>

        {/* Live Reward Seal Preview */}
        <div
          className="glass-panel p-3 rounded-xl flex items-center gap-3 shrink-0"
          style={{ borderColor: "var(--sq-green)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{
              background: "rgba(57, 255, 136, 0.15)",
              color: "var(--sq-green)",
              border: "1px solid rgba(57, 255, 136, 0.3)",
              fontFamily: "var(--font-display)",
            }}
          >
            +30
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Total Yield</div>
            <div className="text-xs font-bold text-white font-mono">10 SUBMIT + 20 VERIFIED</div>
          </div>
        </div>
      </div>

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Photo Evidence Capture */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-black tracking-wider uppercase block"
                style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
              >
                1. PHOTO EVIDENCE // EXIF TELEMETRY
              </label>
              {customPhotoSelected && (
                <span className="text-[10px] text-emerald-400 font-mono">CUSTOM IMAGE LOADED</span>
              )}
            </div>

            {/* Photo Preview Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-950 bg-black/50 group">
              <img
                src={photoUrl}
                alt="Waste Hotspot Preview"
                className="w-full h-full object-cover"
              />

              {/* Watermark Overlay in Squid Game theme */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      border: "1px solid var(--sq-green)",
                      color: "var(--sq-green)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    GEO-LOC LOCKED
                  </span>
                  <span className="text-[10px] font-mono text-gray-300 bg-black/60 px-2 py-0.5 rounded">
                    {geoLat.toFixed(4)}, {geoLng.toFixed(4)}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-emerald-400 truncate">
                  📍 {locationName}
                </div>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <label
                htmlFor="photo-upload"
                className="p-3 rounded-lg text-center cursor-pointer text-xs font-bold uppercase tracking-wider transition-all hover:bg-emerald-950/40 flex items-center justify-center gap-2 border border-emerald-900"
                style={{ color: "var(--sq-green)" }}
              >
                <span>📁 Upload Photo</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  // Cycle mock photo
                  const alternates = [
                    "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800&auto=format&fit=crop&q=60",
                    "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60",
                  ];
                  const next = alternates[(alternates.indexOf(photoUrl) + 1) % alternates.length] || alternates[0];
                  setPhotoUrl(next);
                }}
                className="p-3 rounded-lg text-center text-xs font-bold uppercase tracking-wider transition-all hover:bg-emerald-950/40 border border-emerald-900 text-gray-300"
              >
                🔄 Demo Sample
              </button>
            </div>
          </div>

          {/* Right Column: GPS Location & Sector Picker */}
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-black tracking-wider uppercase block"
                style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
              >
                2. LOCATION & GEO-PIN
              </label>
              <button
                type="button"
                onClick={handleCaptureGPS}
                disabled={isLocating}
                className="text-[10px] font-black uppercase text-amber-300 hover:underline flex items-center gap-1"
              >
                {isLocating ? "Acquiring Satellites..." : "🎯 Auto-Detect GPS"}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">
                  Location / Ward Identifier
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                  placeholder="e.g. Sector 14 Central Plaza, Ward 14"
                  className="w-full bg-black/60 border border-emerald-950 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-gray-400 block mb-1 font-mono">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={geoLat}
                    onChange={(e) => setGeoLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-emerald-950 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-400 block mb-1 font-mono">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={geoLng}
                    onChange={(e) => setGeoLng(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-emerald-950 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Quick Select Hotspot Chips */}
              <div>
                <label className="text-[10px] uppercase text-gray-500 block mb-1.5 font-mono">
                  Preset Ward Pins:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_HOTSPOTS.map((spot) => (
                    <button
                      key={spot.name}
                      type="button"
                      onClick={() => {
                        setLocationName(spot.name);
                        setGeoLat(spot.lat);
                        setGeoLng(spot.lng);
                      }}
                      className="px-2 py-1 rounded text-[10px] bg-emerald-950/30 text-gray-300 hover:text-emerald-400 hover:border-emerald-500 border border-transparent transition-all"
                    >
                      {spot.name.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="glass-panel p-5 rounded-xl space-y-3">
          <label
            className="text-xs font-black tracking-wider uppercase block"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
          >
            3. SELECT WASTE CLASSIFICATION
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3.5 rounded-xl text-left transition-all border ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-950/40 shadow-[0_0_15px_rgba(57,255,136,0.15)]"
                      : "border-emerald-950/60 bg-black/40 hover:border-emerald-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{cat.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#39ff88]" />
                    )}
                  </div>
                  <div
                    className="text-xs font-bold uppercase"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: isSelected ? "var(--sq-green)" : "var(--sq-text)",
                    }}
                  >
                    {cat.label}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 leading-tight">
                    {cat.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="glass-panel p-5 rounded-xl space-y-2">
          <label
            className="text-xs font-black tracking-wider uppercase block"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-green)" }}
          >
            4. TACTICAL NOTES & VOLUME ESTIMATE (OPTIONAL)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Approx 40kg PET accumulation blocking street storm drain. Access from back gate."
            className="w-full bg-black/60 border border-emerald-950 rounded-lg p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl text-sm font-black tracking-[4px] uppercase cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-center gap-3"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, rgba(57, 255, 136, 0.3), rgba(57, 255, 136, 0.1))",
            color: "var(--sq-green)",
            border: "2px solid var(--sq-green)",
            boxShadow: "0 0 30px rgba(57, 255, 136, 0.2)",
          }}
        >
          <span>{isSubmitting ? "TRANSMITTING TELEMETRY..." : "TRANSMIT WASTE LOG // CLAIM +10 PTS"}</span>
          <span className="text-lg">⚡</span>
        </button>
      </form>
    </div>
  );
}
