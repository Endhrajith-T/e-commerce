"use client";

export default function PaymentSelect({ method, setMethod }: any) {
  const options = [
    {
      id: "cod",
      icon: "🚚",
      title: "Cash on Delivery",
      desc: "Pay cash when your order arrives",
    },
    {
      id: "razorpay",
      icon: "💳",
      title: "Cards / NetBanking / Wallets",
      desc: "Pay securely via Razorpay",
    },
    {
      id: "upi",
      icon: "📱",
      title: "UPI / QR Code",
      desc: "Scan QR and pay instantly via any UPI app",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Select Payment Method</h3>

      {options.map((opt) => (
        <div
          key={opt.id}
          onClick={() => setMethod(opt.id)}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 20px", borderRadius: 12, cursor: "pointer",
            border: method === opt.id ? "2px solid #2E1E0F" : "2px solid #e5d9c5",
            background: method === opt.id ? "#fdfaf3" : "#fff",
            transition: "all 0.2s",
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0e8d5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            {opt.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{opt.title}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{opt.desc}</div>
          </div>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${method === opt.id ? "#2E1E0F" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {method === opt.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2E1E0F" }} />}
          </div>
        </div>
      ))}

      {/* Info boxes */}
      {method === "cod" && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#166534" }}>
          Order confirmed after our team contacts you. Pay cash at delivery.
        </div>
      )}
      {method === "razorpay" && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#1e40af" }}>
          Secure payment via Razorpay. Supports Debit/Credit Cards, NetBanking and Wallets.
        </div>
      )}
      {method === "upi" && (
        <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#6b21a8" }}>
          A QR code will be generated after you click Pay. Scan with PhonePe, GPay, Paytm or any UPI app.
        </div>
      )}
    </div>
  );
}
