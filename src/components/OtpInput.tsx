"use client";

import { useRef } from "react";

export default function OtpInput({ otp, setOtp }: any) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digits = otp.split("");
    digits[index] = value.slice(-1);
    const newOtp = digits.join("");
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
        Enter the 6-digit OTP sent to your phone
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{
              width: 48, height: 56,
              textAlign: "center", fontSize: 22, fontWeight: 700,
              border: otp[i] ? "2px solid #2E1E0F" : "2px solid #d8cab5",
              borderRadius: 10, background: "#fdfaf3",
              outline: "none", transition: "border 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
