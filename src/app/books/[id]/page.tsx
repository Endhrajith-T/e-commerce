"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

/* ── Skeleton loader ──────────────────────────────────────── */
function BookDetailSkeleton() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f0e0", padding: "7rem 1rem 4rem" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0 }
          100% { background-position:  600px 0 }
        }
        .sk {
          background: linear-gradient(90deg, #ede4d0 25%, #f5eedd 50%, #ede4d0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
      `}</style>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Breadcrumb skeleton */}
        <div className="sk" style={{ width: 200, height: 14, marginBottom: 32 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div className="sk" style={{ height: 360, borderRadius: 14 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="sk" style={{ height: 20, width: "60%" }} />
            <div className="sk" style={{ height: 36, width: "90%" }} />
            <div className="sk" style={{ height: 20, width: "40%" }} />
            <div className="sk" style={{ height: 28, width: "30%", marginTop: 8 }} />
            <div className="sk" style={{ height: 52, marginTop: 24 }} />
            <div className="sk" style={{ height: 52 }} />
            <div className="sk" style={{ height: 80, marginTop: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stock badge ──────────────────────────────────────────── */
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#fee2e2", color: "#dc2626" }}>Out of Stock</span>;
  if (stock <= 5)
    return <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#fef3c7", color: "#92400e" }}>Only {stock} left</span>;
  return <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#dcfce7", color: "#166534" }}>In Stock</span>;
}

/* ── Main page ────────────────────────────────────────────── */
export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) { setNotFound(true); }
        else { setBook(data.data); }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  if (loading) return <BookDetailSkeleton />;

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📚</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2E1E0F", marginBottom: 8 }}>Book not found</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>This book may have been removed or is unavailable.</p>
          <button onClick={() => router.push("/")} style={{ background: "#2E1E0F", color: "white", border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  const inStock = (book.stock ?? 1) > 0;

  const handleAddToCart = () => {
    addToCart({ id: book.id, title: book.title, author: book.author, price: book.price, qty, image_url: book.image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <style>{`
        .book-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 640px) {
          .book-detail-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        .qty-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #d8cab5; background: white;
          font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #2E1E0F; font-weight: 700;
          transition: background 0.15s;
        }
        .qty-btn:hover { background: #f7f0e0; }
        .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .add-btn {
          width: 100%; padding: 15px;
          background: #2E1E0F; color: white;
          border: none; border-radius: 10px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          letter-spacing: 0.02em;
        }
        .add-btn:hover:not(:disabled) { background: #3d2a14; transform: translateY(-1px); }
        .add-btn:disabled { background: #9A7230; cursor: not-allowed; }
        .add-btn.success { background: #16a34a; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f7f0e0", padding: "7rem 1rem 4rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav style={{ fontSize: 13, color: "#9A7230", marginBottom: 28, display: "flex", gap: 6, alignItems: "center" }}>
            <Link href="/" style={{ color: "#9A7230", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/#books" style={{ color: "#9A7230", textDecoration: "none" }}>Books</Link>
            <span>›</span>
            <span style={{ color: "#2E1E0F", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
              {book.title}
            </span>
          </nav>

          <div className="book-detail-grid">

            {/* ── Cover Image ── */}
            <div style={{
              background: "#2E1E0F",
              borderRadius: 14,
              overflow: "hidden",
              height: 380,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(46,30,15,0.18)",
            }}>
              {book.image_url
                ? <img src={book.image_url} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 8 }}>❧</div>
                    <div style={{ color: "#9A7230", fontSize: 13, fontStyle: "italic" }}>Cover not available</div>
                  </div>
                )
              }
            </div>

            {/* ── Details ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

              {/* Board / Standard tags */}
              {(book.board || book.standard) && (
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {book.board && (
                    <span style={{ background: "#e8d9c0", color: "#7a5c2e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {book.board}
                    </span>
                  )}
                  {book.standard && (
                    <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Grade {book.standard}
                    </span>
                  )}
                </div>
              )}

              <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#2E1E0F", lineHeight: 1.3, marginBottom: 6, fontFamily: "Georgia, serif" }}>
                {book.title}
              </h1>
              <p style={{ fontSize: 14, color: "#9A7230", marginBottom: 20 }}>by {book.author}</p>

              {/* Price */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#2E1E0F" }}>
                  ₹ {Number(book.price).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Stock */}
              <div style={{ marginBottom: 24 }}>
                <StockBadge stock={book.stock ?? 1} />
              </div>

              {/* Qty */}
              {inStock && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <span style={{ fontSize: 13, color: "#666" }}>Qty</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                    <span style={{ fontWeight: 700, fontSize: 16, minWidth: 20, textAlign: "center" }}>{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => Math.min(book.stock ?? 10, q + 1))} disabled={qty >= (book.stock ?? 10)}>+</button>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                className={`add-btn${added ? " success" : ""}`}
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{ marginBottom: 12 }}
              >
                {!inStock ? "Out of Stock" : added ? "✓ Added to Cart!" : `Add to Cart — ₹ ${(book.price * qty).toLocaleString("en-IN")}`}
              </button>

              {/* Checkout now */}
              {inStock && (
                <Link href="/checkout">
                  <button style={{
                    width: "100%", padding: "13px",
                    background: "white", color: "#2E1E0F",
                    border: "2px solid #2E1E0F", borderRadius: 10,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    marginBottom: 24,
                  }}>
                    Buy Now
                  </button>
                </Link>
              )}

              {/* Description */}
              {book.description && (
                <div style={{ borderTop: "1px solid #e5d9c5", paddingTop: 20 }}>
                  <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A7230", marginBottom: 10 }}>
                    About this book
                  </p>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>
                    {book.description}
                  </p>
                </div>
              )}

              {/* Delivery notice */}
              <div style={{
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: 8, padding: "10px 12px", marginTop: 20,
                display: "flex", gap: 8, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🚚</span>
                <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5, margin: 0 }}>
                  Delivery charge depends on your location. We'll notify you via <strong>WhatsApp</strong> after placing your order.
                </p>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0e7da" }}>
                {[
                  { icon: "📦", text: "3–5 Days" },
                  { icon: "✅", text: "Genuine Book" },
                  { icon: "🔒", text: "Secure Pay" },
                ].map(t => (
                  <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#7a5c2e" }}>
                    <span>{t.icon}</span><span>{t.text}</span>
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
