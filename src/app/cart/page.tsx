"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, total } = useCart();

  if (!cart?.length) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f0e0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>❧</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#2E1E0F", marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Add some books to get started!</p>
          <Link href="/#books">
            <button style={{ background: "#2E1E0F", color: "white", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Browse Books
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f0e0", padding: "7rem 1rem 4rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#2E1E0F", marginBottom: 24 }}>Your Cart</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* Cart Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.map((item: any) => (
              <div
                key={item.id}
                style={{ background: "#fdfaf3", border: "1px solid #e5d9c5", borderRadius: 12, padding: 16, display: "flex", gap: 16, alignItems: "center" }}
              >
                {/* Book cover */}
                <div style={{ width: 60, height: 72, background: "#2E1E0F", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#9A7230", fontSize: 24 }}>❧</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, fontSize: 15, color: "#2E1E0F", marginBottom: 4 }}>{item.name}</h3>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#9A7230" }}>₹ {(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #d8cab5", background: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #d8cab5", background: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 18, padding: 4 }}
                  title="Remove"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ background: "#fdfaf3", border: "1px solid #e5d9c5", borderRadius: 12, padding: 20, position: "sticky", top: 100 }}>
            <h2 style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {cart.map((item: any) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666" }}>
                  <span>{item.name} × {item.qty}</span>
                  <span>₹ {(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #e5d9c5", paddingTop: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 8 }}>
                <span>Delivery</span>
                <span style={{ color: "#16a34a", fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "#2E1E0F" }}>
                <span>Total</span>
                <span>₹ {total?.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <Link href="/checkout">
              <button style={{
                width: "100%", background: "#2E1E0F", color: "white",
                border: "none", padding: "14px", borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}>
                Proceed to Checkout →
              </button>
            </Link>

            <Link href="/#books">
              <button style={{ width: "100%", background: "none", border: "none", color: "#9A7230", fontSize: 13, cursor: "pointer", marginTop: 12, textDecoration: "underline" }}>
                ← Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
