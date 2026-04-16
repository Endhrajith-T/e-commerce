"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/context/ToastContext";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  image_url: string | null;
  description: string | null;
}

export default function BooksSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { addToCart, toggleWish, wishlist } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/books", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBooks(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="books" style={{ padding: "4rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9A7230", marginBottom: 8 }}>
            The Collection
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 600, color: "#1a1a1a" }}>
            Books for every learner
          </h2>
        </div>

        {/* Search */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            style={{
              width: "100%", maxWidth: 480, padding: "10px 16px",
              border: "1px solid #d8cab5", borderRadius: 8,
              fontSize: 14, background: "#fdfaf3", outline: "none",
            }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 380, background: "#e5d9c5", borderRadius: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {filtered.map((book) => {
              const wished = wishlist?.some((w: any) => w.id === book.id);
              return (
                <div
                  key={book.id}
                  style={{
                    background: "#fdfaf3", border: "1px solid #e5d9c5",
                    borderRadius: 12, overflow: "hidden",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  {/* Book Cover */}
                  <div style={{ position: "relative", background: "#2E1E0F", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {book.image_url ? (
                      <img
                        src={book.image_url}
                        alt={book.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 48, color: "#9A7230" }}>❧</span>
                    )}
                    {/* Wishlist button */}
                    <button
                      onClick={() => {
                        const added = toggleWish({ id: book.id, name: book.title, price: book.price, image_url: book.image_url });
                        showToast(added ? "Saved to favourites" : "Removed from favourites");
                      }}
                      style={{
                        position: "absolute", top: 10, right: 10,
                        background: "rgba(255,255,255,0.9)", border: "none",
                        borderRadius: "50%", width: 36, height: 36,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "#e53e3e" : "none"} stroke={wished ? "#e53e3e" : "#666"} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                    {/* Stock badge */}
                    {book.stock <= 5 && (
                      <div style={{ position: "absolute", bottom: 8, left: 8, background: "#e53e3e", color: "white", fontSize: 10, padding: "2px 8px", borderRadius: 20 }}>
                        Only {book.stock} left!
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div style={{ padding: "16px" }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9A7230", marginBottom: 4 }}>
                      {book.author}
                    </p>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 6, lineHeight: 1.3 }}>
                      {book.title}
                    </h3>
                    {book.description && (
                      <p style={{ fontSize: 13, color: "#6b6b6b", marginBottom: 12, lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {book.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#2E1E0F" }}>
                        ₹ {book.price.toLocaleString("en-IN")}
                      </span>
                      <button
                        disabled={book.stock === 0}
                        onClick={() => {
                          addToCart({ id: book.id, name: book.title, price: book.price, qty: 1, image_url: book.image_url });
                          showToast(`Added to cart — ${book.title}`);
                        }}
                        style={{
                          background: book.stock === 0 ? "#ccc" : "#2E1E0F",
                          color: "white", border: "none",
                          padding: "8px 16px", borderRadius: 6,
                          fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
                          textTransform: "uppercase", cursor: book.stock === 0 ? "not-allowed" : "pointer",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => book.stock > 0 && ((e.target as HTMLButtonElement).style.background = "#5A3820")}
                        onMouseLeave={(e) => book.stock > 0 && ((e.target as HTMLButtonElement).style.background = "#2E1E0F")}
                      >
                        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#9A7230" }}>
            <p style={{ fontSize: 18 }}>No books found for "{search}"</p>
            <button onClick={() => setSearch("")} style={{ marginTop: 12, background: "none", border: "none", color: "#2E1E0F", textDecoration: "underline", cursor: "pointer" }}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
