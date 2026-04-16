"use client";

import { useState } from "react";

export default function CheckoutForm({ form, setForm }: any) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  const getLocation = async () => {
    setLocating(true);
    setLocError("");

    if (!navigator.geolocation) {
      setLocError("Geolocation not supported by your browser");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Use free reverse geocoding API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address;

          // Build address string
          const parts = [
            addr.house_number,
            addr.road || addr.street,
            addr.suburb || addr.neighbourhood || addr.quarter,
            addr.city || addr.town || addr.village || addr.county,
            addr.state,
          ].filter(Boolean);

          const addressStr = parts.join(", ");
          const pincode = addr.postcode || "";

          setForm((prev: any) => ({
            ...prev,
            address: addressStr,
            pincode: pincode.replace(/\s/g, "").slice(0, 6),
          }));
        } catch {
          setLocError("Could not fetch address. Please enter manually.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) setLocError("Location access denied. Please enable in browser settings.");
        else setLocError("Could not get location. Please enter manually.");
      },
      { timeout: 10000 }
    );
  };

  const inp = {
    width: "100%",
    border: "1px solid #d8cab5",
    padding: "10px 14px",
    borderRadius: 8,
    background: "white",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  };

  return (
    <div style={{ background: "#fdfaf3", border: "1px solid #e5d9c5", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Delivery Details</h3>

      {/* Name */}
      <div>
        <label style={{ fontSize: 12, color: "#9A7230", textTransform: "uppercase" as const, letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
          Full Name *
        </label>
        <input
          placeholder="Enter your full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inp}
        />
      </div>

      {/* Phone */}
      <div>
        <label style={{ fontSize: 12, color: "#9A7230", textTransform: "uppercase" as const, letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
          Phone Number *
        </label>
        <input
          placeholder="10-digit mobile number"
          value={form.phone}
          maxLength={10}
          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          style={inp}
        />
      </div>

      {/* Address with location button */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: 12, color: "#9A7230", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
            Delivery Address *
          </label>
          <button
            type="button"
            onClick={getLocation}
            disabled={locating}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: locating ? "#e5d9c5" : "#2E1E0F",
              color: "white", border: "none",
              padding: "5px 12px", borderRadius: 6,
              fontSize: 12, cursor: locating ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            {locating ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                  </path>
                </svg>
                Detecting...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
                Use My Location
              </>
            )}
          </button>
        </div>
        {locError && (
          <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 6 }}>{locError}</p>
        )}
        <textarea
          placeholder="House no, Street, Area, City"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          rows={3}
          style={{ ...inp, resize: "none" as const }}
        />
      </div>

      {/* Pincode */}
      <div>
        <label style={{ fontSize: 12, color: "#9A7230", textTransform: "uppercase" as const, letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
          Pincode *
        </label>
        <input
          placeholder="6-digit pincode"
          value={form.pincode}
          maxLength={6}
          onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
          style={inp}
        />
      </div>
    </div>
  );
}
