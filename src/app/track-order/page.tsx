"use client";

import { useState } from "react";
import Link from "next/link";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

const STATUS_INFO: Record<string, { label: string; icon: string; color: string; bg: string; desc: string }> = {
  pending:   { label: "Order Pending",   icon: "⏳", color: "#854d0e", bg: "#fef9c3", desc: "Your order has been received. We will confirm within 24 hours." },
  confirmed: { label: "Order Confirmed", icon: "✅", color: "#1e40af", bg: "#dbeafe", desc: "Your order is confirmed! We are preparing it for shipment." },
  shipped:   { label: "Order Shipped",   icon: "🚚", color: "#5b21b6", bg: "#ede9fe", desc: "Your order is on the way! Expected delivery in 2-3 days." },
  delivered: { label: "Delivered",       icon: "🎉", color: "#166534", bg: "#dcfce7", desc: "Your order has been delivered. Enjoy your book!" },
};

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const trackOrder = async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.data || []);
      setSearched(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f7f0e0", padding:"6rem 1rem 4rem" }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
          <h1 style={{ fontSize:"2rem", fontWeight:700, color:"#2E1E0F", fontFamily:"Georgia, serif", marginBottom:8 }}>
            Track Your Order
          </h1>
          <p style={{ color:"#888", fontSize:14 }}>
            Enter your phone number to track all your orders
          </p>
        </div>

        {/* Search Box */}
        <div style={{ background:"#fdfaf3", border:"1px solid #e5d9c5", borderRadius:16, padding:24, marginBottom:24 }}>
          <label style={{ fontSize:12, color:"#9A7230", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:8 }}>
            Phone Number
          </label>
          <div style={{ display:"flex", gap:10 }}>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onKeyDown={(e) => e.key === "Enter" && trackOrder()}
              style={{
                flex:1, border:"1px solid #d8cab5", padding:"10px 14px",
                borderRadius:8, fontSize:14, background:"white", outline:"none",
              }}
            />
            <button
              onClick={trackOrder}
              disabled={loading}
              style={{
                background: loading ? "#9A7230" : "#2E1E0F",
                color:"white", border:"none", padding:"10px 24px",
                borderRadius:8, fontSize:14, fontWeight:600,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace:"nowrap",
              }}
            >
              {loading ? "Searching..." : "Track →"}
            </button>
          </div>
          {error && (
            <p style={{ color:"#dc2626", fontSize:13, marginTop:8 }}>{error}</p>
          )}
        </div>

        {/* Results */}
        {searched && orders.length === 0 && (
          <div style={{ background:"#fdfaf3", border:"1px solid #e5d9c5", borderRadius:16, padding:32, textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <p style={{ color:"#2E1E0F", fontWeight:600, marginBottom:6 }}>No orders found</p>
            <p style={{ color:"#888", fontSize:13 }}>No orders found for +91 {phone}</p>
          </div>
        )}

        {orders.map((order, idx) => {
          const info = STATUS_INFO[order.status] || STATUS_INFO.pending;
          const stepIndex = STATUS_STEPS.indexOf(order.status);

          return (
            <div key={order.id} style={{
              background:"#fdfaf3", border:"1px solid #e5d9c5",
              borderRadius:16, padding:24, marginBottom:16,
            }}>
              {/* Order Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <p style={{ fontSize:11, color:"#9A7230", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:4 }}>
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p style={{ fontSize:12, color:"#aaa" }}>
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day:"numeric", month:"long", year:"numeric"
                    })}
                  </p>
                </div>
                <span style={{
                  background: info.bg, color: info.color,
                  padding:"4px 12px", borderRadius:20,
                  fontSize:12, fontWeight:600,
                }}>
                  {info.icon} {info.label}
                </span>
              </div>

              {/* Book Info */}
              <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:20, padding:"14px", background:"white", borderRadius:10, border:"1px solid #f0e7da" }}>
                <div style={{ width:52, height:64, borderRadius:6, overflow:"hidden", flexShrink:0, background:"#2E1E0F", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"2px 3px 8px rgba(0,0,0,0.15)" }}>
                  {order.books?.image_url ? (
                    <img src={order.books.image_url} alt={order.books.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  ) : (
                    <span style={{ color:"#9A7230", fontSize:22 }}>❧</span>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:15, color:"#2E1E0F", marginBottom:4 }}>{order.books?.title}</p>
                  <p style={{ fontSize:13, color:"#888", marginBottom:4 }}>by {order.books?.author}</p>
                  <div style={{ display:"flex", gap:12, fontSize:13 }}>
                    <span style={{ color:"#9A7230" }}>Qty: {order.quantity}</span>
                    <span style={{ fontWeight:700, color:"#2E1E0F" }}>₹ {Number(order.total_amount).toLocaleString("en-IN")}</span>
                    <span style={{
                      fontSize:11, fontWeight:600, textTransform:"uppercase",
                      color: order.payment_method === "razorpay" ? "#065f46" : "#92400e",
                    }}>
                      {order.payment_method === "razorpay" ? "Paid Online" : "COD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  {STATUS_STEPS.map((step, i) => {
                    const sInfo = STATUS_INFO[step];
                    const isActive = i <= stepIndex;
                    const isCurrent = i === stepIndex;
                    return (
                      <div key={step} style={{ flex:1, textAlign:"center" }}>
                        <div style={{
                          width:32, height:32, borderRadius:"50%", margin:"0 auto 6px",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          background: isActive ? "#2E1E0F" : "#e5d9c5",
                          color: isActive ? "white" : "#aaa",
                          fontSize:14,
                          boxShadow: isCurrent ? "0 0 0 4px #d8cab5" : "none",
                          transition:"all 0.3s",
                        }}>
                          {isActive ? (i < stepIndex ? "✓" : sInfo.icon) : i + 1}
                        </div>
                        <p style={{ fontSize:10, color: isActive ? "#2E1E0F" : "#aaa", fontWeight: isCurrent ? 700 : 400, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Line */}
                <div style={{ position:"relative", height:4, background:"#e5d9c5", borderRadius:2, margin:"0 16px" }}>
                  <div style={{
                    position:"absolute", top:0, left:0, height:"100%",
                    background:"#2E1E0F", borderRadius:2,
                    width:`${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                    transition:"width 0.5s ease",
                  }} />
                </div>
              </div>

              {/* Status Description */}
              <div style={{ background:info.bg, borderRadius:10, padding:"10px 14px", fontSize:13, color:info.color }}>
                {info.desc}
              </div>

              {/* Delivery Address */}
              <div style={{ marginTop:12, fontSize:12, color:"#888", display:"flex", gap:6, alignItems:"flex-start" }}>
                <span>📍</span>
                <span>{order.address}, {order.pincode}</span>
              </div>
            </div>
          );
        })}

        {/* Back to home */}
        <div style={{ textAlign:"center", marginTop:16 }}>
          <Link href="/" style={{ color:"#9A7230", fontSize:13, textDecoration:"underline" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
