"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f0e0", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 480, background: "#fdfaf3", border: "1px solid #e5d9c5", borderRadius: 16, padding: "3rem 2rem" }}>

        {/* Failure icon */}
        <div style={{ width: 80, height: 80, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2E1E0F", marginBottom: 8 }}>
          Payment Failed
        </h1>
        <p style={{ color: "#888", marginBottom: 6 }}>Your order has not been placed.</p>
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 28 }}>
          If any amount was deducted, it will be refunded in 5-7 business days by Razorpay.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "#2E1E0F", color: "white", border: "none",
              padding: "12px 32px", borderRadius: 8, fontSize: 14,
              fontWeight: 600, cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <Link href="/" style={{ color: "#9A7230", fontSize: 13, textDecoration: "underline" }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
