"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    clearCart();
    const lastOrder = localStorage.getItem("last_order");
    const lastPhone = localStorage.getItem("last_phone");
    if (lastOrder) {
      setOrders(JSON.parse(lastOrder));
      localStorage.removeItem("last_order");
    }
    if (lastPhone) {
      setPhone(lastPhone);
      localStorage.removeItem("last_phone");
    }
  }, []);

  const totalAmount = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const paymentMethod = orders[0]?.payment_method || "cod";

  return (
    <div style={{ minHeight:"100vh", background:"#f7f0e0", padding:"6rem 1rem 4rem" }}>
      <div style={{ maxWidth:580, margin:"0 auto" }}>

        {/* Success Icon */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:80, height:80, background:"#f0fdf4", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 0 0 12px #dcfce7" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ fontSize:"2rem", fontWeight:700, color:"#2E1E0F", marginBottom:8, fontFamily:"Georgia, serif" }}>
            Order Placed! 🎉
          </h1>
          <p style={{ color:"#888", fontSize:14 }}>
            Thank you! We will contact you shortly to confirm delivery.
          </p>
        </div>

        {/* Order Summary Card */}
        <div style={{ background:"#fdfaf3", border:"1px solid #e5d9c5", borderRadius:16, padding:24, marginBottom:16 }}>
          <p style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#9A7230", marginBottom:16 }}>
            Order Summary
          </p>

          {orders.length > 0 ? orders.map((order: any, i: number) => (
            <div key={i} style={{
              borderBottom: i < orders.length - 1 ? "1px solid #f0e7da" : "none",
              paddingBottom: i < orders.length - 1 ? 14 : 0,
              marginBottom: i < orders.length - 1 ? 14 : 0,
              display:"flex", justifyContent:"space-between", alignItems:"center"
            }}>
              <div>
                <div style={{ fontWeight:600, fontSize:15, color:"#2E1E0F" }}>{order.book_title}</div>
                <div style={{ fontSize:12, color:"#888", marginTop:3 }}>Qty: {order.quantity}</div>
              </div>
              <div style={{ fontWeight:700, fontSize:15, color:"#9A7230" }}>
                ₹ {Number(order.total_amount).toLocaleString("en-IN")}
              </div>
            </div>
          )) : (
            <p style={{ color:"#9A7230", fontSize:14, textAlign:"center" }}>Your order has been placed successfully!</p>
          )}

          {orders.length > 1 && (
            <div style={{ borderTop:"2px solid #e5d9c5", paddingTop:14, marginTop:14, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, color:"#2E1E0F" }}>Total</span>
              <span style={{ fontWeight:800, fontSize:18, color:"#2E1E0F" }}>₹ {totalAmount.toLocaleString("en-IN")}</span>
            </div>
          )}

          {/* Payment Badge */}
          <div style={{ marginTop:16 }}>
            <span style={{
              padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600,
              background: paymentMethod === "razorpay" ? "#d1fae5" : "#fef3c7",
              color: paymentMethod === "razorpay" ? "#065f46" : "#92400e",
            }}>
              {paymentMethod === "razorpay" ? "💳 Paid Online" : "💵 Cash on Delivery"}
            </span>
          </div>
        </div>

        {/* Status */}
        <div style={{ background:"#fef9c3", border:"1px solid #fde68a", borderRadius:12, padding:"14px 18px", marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>⏳</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#854d0e" }}>Status: Pending</div>
            <div style={{ fontSize:12, color:"#92400e", marginTop:2 }}>We will confirm within 24 hours via phone/SMS</div>
          </div>
        </div>

        {/* Delivery */}
        <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"14px 18px", marginBottom:24, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>📦</span>
          <div style={{ fontSize:13, color:"#166534" }}>
            Expected delivery in <strong>3-5 business days</strong>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {/* Track Order */}
          <Link href={`/track-order${phone ? `?phone=${phone}` : ""}`}>
            <button style={{
              width:"100%", background:"white", color:"#2E1E0F",
              border:"2px solid #2E1E0F", padding:"13px",
              borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer",
            }}>
              📦 Track My Order
            </button>
          </Link>

          {/* Continue Shopping */}
          <Link href="/">
            <button style={{
              width:"100%", background:"#2E1E0F", color:"white",
              border:"none", padding:"13px",
              borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer",
            }}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
