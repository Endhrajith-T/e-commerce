"use client";

import { useEffect, useState } from "react";

export default function OtpResendTimer({ onResend }: any) {
  const [time, setTime] = useState(60);

  useEffect(() => {
    if (time === 0) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <div style={{ textAlign: "center", marginTop: 12 }}>
      {time > 0 ? (
        <p style={{ fontSize: 13, color: "#888" }}>
          Resend OTP in <span style={{ fontWeight: 700, color: "#2E1E0F" }}>{time}s</span>
        </p>
      ) : (
        <button
          onClick={() => { setTime(60); onResend(); }}
          style={{ background: "none", border: "none", color: "#9A7230", fontWeight: 600, cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}
