"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, total } = useCart();

  if (!cart?.length) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f0e0",
        padding: "2rem 1rem",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>❧</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2E1E0F", marginBottom: 8 }}>
            Your cart is empty
          </h2>
          <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
            Add some books to get started!
          </p>
          <Link href="/#books">
            <button style={{
              background: "#2E1E0F", color: "white", border: "none",
              padding: "12px 32px", borderRadius: 8, fontSize: 14,
              fontWeight: 600, cursor: "pointer",
            }}>
              Browse Books
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Responsive grid styles injected as a style tag */}
      <style>{`
        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 700px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }
          .cart-summary-sticky {
            position: static !important;
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f7f0e0", padding: "7rem 1rem 4rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#2E1E0F" }}>
              Your Cart
            </h1>
            <span style={{
              background: "#2E1E0F", color: "#C9A84C",
              borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600,
            }}>
              {cart.reduce((s: number, i: any) => s + i.qty, 0)} item{cart.reduce((s: number, i: any) => s + i.qty, 0) !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="cart-grid">

            {/* ── Cart Items ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    background: "#fdfaf3",
                    border: "1px solid #e5d9c5",
                    borderRadius: 14,
                    padding: 16,
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* Book cover */}
                  <div style={{
                    width: 56, height: 70,
                    background: "#2E1E0F",
                    borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "2px 3px 8px rgba(0,0,0,0.18)",
                    overflow: "hidden",
                  }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ color: "#9A7230", fontSize: 22 }}>❧</span>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontWeight: 600, fontSize: 15, color: "#2E1E0F",
                      marginBottom: 2, whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {item.title}
                    </h3>
                    {item.author && (
                      <p style={{ fontSize: 12, color: "#9A7230", marginBottom: 4 }}>
                        by {item.author}
                      </p>
                    )}
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#2E1E0F" }}>
                      ₹ {(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{
                        width: 30, height: 30, borderRadius: "50%",
                        border: "1px solid #d8cab5", background: "white",
                        fontSize: 18, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#2E1E0F", fontWeight: 700,
                      }}
                    >−</button>
                    <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center", fontSize: 15 }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{
                        width: 30, height: 30, borderRadius: "50%",
                        border: "1px solid #d8cab5", background: "white",
                        fontSize: 18, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#2E1E0F", fontWeight: 700,
                      }}
                    >+</button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                    style={{
                      width: 30, height: 30, borderRadius: "50%",
                      border: "1px solid #fecaca", background: "#fff5f5",
                      color: "#dc2626", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >✕</button>
                </div>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <div
              className="cart-summary-sticky"
              style={{
                background: "#fdfaf3",
                border: "1px solid #e5d9c5",
                borderRadius: 14,
                padding: 20,
                position: "sticky",
                top: 100,
              }}
            >
              <p style={{
                fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#9A7230", marginBottom: 16,
              }}>
                Order Summary
              </p>

              {/* Line items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {cart.map((item: any) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666" }}>
                    <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title} × {item.qty}
                    </span>
                    <span style={{ fontWeight: 600, color: "#2E1E0F" }}>
                      ₹ {(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery + Total */}
              <div style={{ borderTop: "1px solid #e5d9c5", paddingTop: 14, marginBottom: 20 }}>
                {/* Delivery notice */}
                <div style={{
                  background: "#fffbeb", border: "1px solid #fde68a",
                  borderRadius: 8, padding: "10px 12px", marginBottom: 14,
                  display: "flex", gap: 8, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🚚</span>
                  <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5, margin: 0 }}>
                    Delivery charge depends on your location. We'll notify you via <strong>WhatsApp</strong> after placing your order.
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: "#2E1E0F" }}>
                  <span>Subtotal</span>
                  <span>₹ {total?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* CTA */}
              <Link href="/checkout">
                <button style={{
                  width: "100%", background: "#2E1E0F", color: "white",
                  border: "none", padding: "14px", borderRadius: 10,
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  letterSpacing: "0.02em",
                }}>
                  Proceed to Checkout →
                </button>
              </Link>

              <Link href="/#books">
                <button style={{
                  width: "100%", background: "none", border: "none",
                  color: "#9A7230", fontSize: 13, cursor: "pointer",
                  marginTop: 12, textDecoration: "underline",
                }}>
                  ← Continue Shopping
                </button>
              </Link>

              {/* Trust badges */}
              <div style={{
                marginTop: 20, paddingTop: 16,
                borderTop: "1px solid #f0e7da",
                display: "flex", justifyContent: "center", gap: 20,
              }}>
                {[
                  { icon: "🔒", label: "Secure Pay" },
                  { icon: "📦", label: "3–5 Days" },
                  { icon: "✅", label: "Genuine Books" },
                ].map(b => (
                  <div key={b.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{b.icon}</div>
                    <div style={{ fontSize: 10, color: "#9A7230", marginTop: 2, fontWeight: 600 }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
