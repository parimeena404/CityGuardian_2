"use client";

import React, { useState } from "react";
import { usePlayerStore, type FoodListing } from "@/store/usePlayerStore";

export default function RestaurantPartnerView() {
  const {
    restaurantPartners,
    foodListings,
    registerRestaurant,
    createFoodListing,
  } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<"dashboard" | "onboard" | "post">("dashboard");

  // Onboarding Form State
  const [bizName, setBizName] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizContact, setBizContact] = useState("");
  const [fssai, setFssai] = useState("");
  const [bizType, setBizType] = useState("Banquet & Events");

  // Post Surplus Form State
  const [selectedPartnerId, setSelectedPartnerId] = useState(restaurantPartners[0]?.id || "");
  const [itemTitle, setItemTitle] = useState("");
  const [category, setCategory] = useState("Banquet Meals");
  const [originalPrice, setOriginalPrice] = useState(600);
  const [discountPercent, setDiscountPercent] = useState(50);
  const [isDonation, setIsDonation] = useState(false);
  const [quantity, setQuantity] = useState("25 Portions");
  const [description, setDescription] = useState("");
  const [hoursValid, setHoursValid] = useState(3);
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=60"
  );

  const discountPrice = isDonation ? 0 : Math.round(originalPrice * (1 - discountPercent / 100));

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !bizContact) return;

    registerRestaurant({
      name: bizName,
      address: bizAddress || "Ward 14 Commercial Zone",
      geoLat: 28.6139,
      geoLng: 77.2090,
      contact: bizContact,
      fssaiLicense: fssai || `FSSAI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      businessType: bizType,
    });

    setBizName("");
    setBizAddress("");
    setBizContact("");
    setFssai("");
    setActiveTab("dashboard");
  };

  const handlePostSurplus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle) return;

    const partner = restaurantPartners.find((p) => p.id === selectedPartnerId) || restaurantPartners[0];

    createFoodListing({
      restaurantId: partner?.id || "rest-1",
      restaurantName: partner?.name || "The Grand Imperial Banquets",
      item: itemTitle,
      description: description || `Freshly logged surplus batch. Certified hygienic packaging.`,
      category,
      originalPrice: isDonation ? 0 : originalPrice,
      discountPrice,
      discountPercent: isDonation ? 100 : discountPercent,
      isDonation,
      quantity,
      expiresAt: new Date(Date.now() + hoursValid * 3600000).toISOString(),
      photoUrl,
    });

    setItemTitle("");
    setDescription("");
    setActiveTab("dashboard");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-[3px] uppercase text-pink-400 font-mono">
              ○ △ □ COMMERCIAL SURPLUS LOGISTICS
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-black tracking-wider uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--sq-text)" }}
          >
            RESTAURANT & KITCHEN PARTNER DESK
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Commercial portal for registered food businesses. Monetize excess kitchen inventory with default 50% discount or route directly to hunger-relief NGOs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 shrink-0 border border-pink-950 font-mono text-xs">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
              activeTab === "dashboard"
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📋 Partner Console
          </button>
          <button
            onClick={() => setActiveTab("post")}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
              activeTab === "post"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            + Post Surplus
          </button>
          <button
            onClick={() => setActiveTab("onboard")}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
              activeTab === "onboard"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🏢 Onboard Kitchen
          </button>
        </div>
      </div>

      {/* 1. Dashboard View */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Registered Kitchens Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurantPartners.map((p) => (
              <div
                key={p.id}
                className="glass-panel p-4 rounded-xl border border-pink-950/80 bg-black/60 space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">✓ FSSAI VERIFIED</span>
                  <span className="text-gray-500">{p.businessType}</span>
                </div>
                <h3
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {p.name}
                </h3>
                <div className="text-xs text-gray-400 font-mono truncate">📍 {p.address}</div>
                <div className="text-[11px] text-pink-400 font-mono">Lic: {p.fssaiLicense}</div>
              </div>
            ))}
          </div>

          {/* Active Listings Table */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-pink-950/80 bg-black/60">
            <div className="px-6 py-4 border-b border-pink-950/60 flex items-center justify-between">
              <span
                className="text-xs font-black tracking-wider uppercase font-mono text-pink-400"
                style={{ fontFamily: "var(--font-display)" }}
              >
                YOUR ACTIVE SURPLUS LOTS
              </span>
              <button
                onClick={() => setActiveTab("post")}
                className="text-xs text-emerald-400 font-mono hover:underline"
              >
                + Log New Batch
              </button>
            </div>

            <div className="divide-y divide-gray-900">
              {foodListings.map((item) => (
                <div
                  key={item.id}
                  className="p-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-pink-950/10"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.photoUrl}
                      alt={item.item}
                      className="w-14 h-14 rounded-lg object-cover border border-pink-950 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{item.item}</span>
                        {item.isDonation ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold uppercase">
                            NGO DONATION
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[9px] font-mono font-bold uppercase">
                            {item.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {item.restaurantName} • {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">PRICE / YIELD</div>
                      <div className="text-white font-bold">
                        {item.isDonation ? "FREE (Relief)" : `₹${item.discountPrice} (was ₹${item.originalPrice})`}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">STATUS</div>
                      <span
                        className="font-bold uppercase"
                        style={{
                          color: item.status === "available" ? "var(--sq-green)" : "var(--sq-gold)",
                        }}
                      >
                        ● {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Post Surplus Listing Form */}
      {activeTab === "post" && (
        <div className="max-w-2xl mx-auto glass-panel p-6 md:p-8 rounded-2xl border border-pink-950/80 bg-black/60 space-y-6">
          <div className="flex items-center justify-between border-b border-pink-950/60 pb-3">
            <h2
              className="text-base font-black tracking-wider uppercase text-pink-400"
              style={{ fontFamily: "var(--font-display)" }}
            >
              POST SURPLUS FOOD LOT
            </h2>
            <span className="text-[10px] font-mono text-gray-400">DEFAULT 50% DISCOUNT APPLIED</span>
          </div>

          <form onSubmit={handlePostSurplus} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Select Kitchen / Establishment
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              >
                {restaurantPartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.businessType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Surplus Food Item Title
              </label>
              <input
                type="text"
                required
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="e.g. Sourdough Focaccia & Croissant Box (12 Assorted)"
                className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Donation Toggle or Discount Slider */}
            <div className="p-4 rounded-xl bg-black/80 border border-pink-950/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">
                  🎁 Routing Mode:
                </span>
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                  <input
                    type="checkbox"
                    checked={isDonation}
                    onChange={(e) => setIsDonation(e.target.checked)}
                    className="accent-pink-500"
                  />
                  <span className={isDonation ? "text-emerald-400 font-bold" : "text-gray-400"}>
                    Donate to NGO (Free Relief Pickup)
                  </span>
                </label>
              </div>

              {!isDonation && (
                <div className="space-y-3 pt-2 border-t border-gray-900">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        min="50"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                        className="w-full bg-black/60 border border-pink-950 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                        Discount % (Default: 50%)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="90"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        className="w-full bg-black/60 border border-pink-950 rounded-lg p-2 text-xs text-pink-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono pt-1 text-gray-300">
                    <span>Discounted Citizen Price:</span>
                    <span className="text-pink-400 font-bold text-sm">₹{discountPrice}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Quantity / Portions
                </label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 25 Portions / 10 kg"
                  className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Pickup Expiry Window (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hoursValid}
                  onChange={(e) => setHoursValid(Number(e.target.value))}
                  className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Description & Handling Instructions
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State dietary details (e.g. Vegetarian, contains dairy), temperature packaging..."
                className="w-full bg-black/80 border border-pink-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 46, 109, 0.35), rgba(255, 46, 109, 0.1))",
                color: "var(--sq-pink)",
                border: "1px solid var(--sq-pink)",
              }}
            >
              PUBLISH SURPLUS LOT // CLAIM +40 PTS
            </button>
          </form>
        </div>
      )}

      {/* 3. Onboarding View */}
      {activeTab === "onboard" && (
        <div className="max-w-2xl mx-auto glass-panel p-6 md:p-8 rounded-2xl border border-amber-500/40 bg-black/60 space-y-6">
          <div className="flex items-center justify-between border-b border-amber-950/60 pb-3">
            <h2
              className="text-base font-black tracking-wider uppercase text-amber-300"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ONBOARD COMMERCIAL FOOD ESTABLISHMENT
            </h2>
            <span className="text-[10px] font-mono text-gray-400">INSTANT +100 PTS</span>
          </div>

          <form onSubmit={handleOnboard} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Establishment / Brand Name
              </label>
              <input
                type="text"
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="e.g. Oberoi Banquet & Catering Hub"
                className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  Business Category
                </label>
                <select
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="Banquet & Events">Banquet & Events</option>
                  <option value="Bakery & Cafe">Bakery & Cafe</option>
                  <option value="Hotel Commercial Kitchen">Hotel Kitchen</option>
                  <option value="Catering & Institutional">Catering & Institutional</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                  FSSAI Food License #
                </label>
                <input
                  type="text"
                  value={fssai}
                  onChange={(e) => setFssai(e.target.value)}
                  placeholder="14-digit FSSAI License"
                  className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Physical Ward Address / Landmark
              </label>
              <input
                type="text"
                required
                value={bizAddress}
                onChange={(e) => setBizAddress(e.target.value)}
                placeholder="e.g. Sector 14 Central Boulevard, Ward 14"
                className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                Dispatch Desk Contact / Phone
              </label>
              <input
                type="text"
                required
                value={bizContact}
                onChange={(e) => setBizContact(e.target.value)}
                placeholder="e.g. +91 98110 44556 / ops@oberoihub.in"
                className="w-full bg-black/80 border border-amber-950 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-black tracking-widest uppercase font-mono transition-all hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 209, 102, 0.35), rgba(255, 209, 102, 0.1))",
                color: "var(--sq-gold)",
                border: "1px solid var(--sq-gold)",
              }}
            >
              COMPLETE VERIFICATION // CLAIM +100 PTS
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
