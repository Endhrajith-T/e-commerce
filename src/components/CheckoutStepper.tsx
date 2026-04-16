"use client";

export default function CheckoutStepper({ step }: any) {
  const steps = ["Details", "Verify OTP", "Payment"];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14,
              background: step > i + 1 ? "#2E1E0F" : step === i + 1 ? "#9A7230" : "#e5d9c5",
              color: step >= i + 1 ? "white" : "#999",
              transition: "all 0.3s",
            }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 11, fontWeight: step === i + 1 ? 700 : 400,
              color: step === i + 1 ? "#2E1E0F" : step > i + 1 ? "#9A7230" : "#aaa",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 80, height: 2,
              background: step > i + 1 ? "#2E1E0F" : "#e5d9c5",
              margin: "0 8px", marginBottom: 20,
              transition: "background 0.3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
