"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import CheckoutStepper from "@/components/CheckoutStepper";
import CheckoutForm from "@/components/CheckoutForm";
import OtpInput from "@/components/OtpInput";
import OtpResendTimer from "@/components/OtpResendTimer";
import PaymentSelect from "@/components/PaymentSelect";
import OrdersSummary from "@/components/OrdersSummary";
import LoadingButton from "@/components/LoadingButton";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

// ── QR Code Modal ──────────────────────────────────────────
function QrModal({
  shortUrl, linkId, amount, expiresAt, onPaid, onCancel,
}: {
  shortUrl: string;
  linkId: string;
  amount: number;
  expiresAt: number;
  onPaid: (paymentId: string) => void;
  onCancel: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus]     = useState<"waiting" | "paid" | "expired">("waiting");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate QR code from the payment link URL
  useEffect(() => {
    QRCode.toDataURL(shortUrl, { width: 220, margin: 1, color: { dark: "#2E1E0F", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [shortUrl]);

  // Countdown timer
  useEffect(() => {
    const tick = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) { clearInterval(tick); setStatus("expired"); }
    }, 1000);
    return () => clearInterval(tick);
  }, [expiresAt]);

  // Poll payment link status every 4 seconds
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/payment/qr-status?link_id=${linkId}`);
        const data = await res.json();
        if (data.paid) {
          clearInterval(pollRef.current!);
          setStatus("paid");
          setTimeout(() => onPaid(data.payment_id), 800);
        }
        if (data.expired) {
          clearInterval(pollRef.current!);
          setStatus("expired");
        }
      } catch { /* ignore */ }
    }, 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [linkId, onPaid]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: 32, maxWidth: 380, width: "100%",
        textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
      }}>

        {status === "paid" ? (
          <>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>
              Payment Received!
            </h3>
            <p style={{ fontSize: 14, color: "#666" }}>Saving your order...</p>
          </>
        ) : status === "expired" ? (
          <>
            <div style={{ fontSize: 56, marginBottom: 12 }}>⏰</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>
              QR Code Expired
            </h3>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>Please try again.</p>
            <button onClick={onCancel} style={{
              background: "#2E1E0F", color: "white", border: "none",
              padding: "10px 28px", borderRadius: 8, cursor: "pointer", fontSize: 14,
            }}>
              Go Back
            </button>
          </>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#9A7230", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                Scan &amp; Pay
              </p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#2E1E0F" }}>
                ₹{amount.toLocaleString("en-IN")}
              </p>
            </div>

            {/* QR Image */}
            <div style={{
              border: "3px solid #2E1E0F", borderRadius: 12, padding: 8,
              display: "inline-block", marginBottom: 16, background: "white",
            }}>
              {qrDataUrl
                ? <img src={qrDataUrl} alt="Scan to Pay" style={{ width: 220, height: 220, display: "block" }} />
                : <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#9A7230" }}>Generating...</div>
              }
            </div>

            {/* Instructions */}
            <p style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
              Open any UPI app → Scan QR → Pay ₹{amount.toLocaleString("en-IN")}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16, fontSize: 20 }}>
              <span title="GPay">G</span>
              <span title="PhonePe">📱</span>
              <span title="Paytm">💰</span>
              <span title="BHIM">🏦</span>
            </div>

            {/* Timer */}
            <div style={{
              background: timeLeft < 60 ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${timeLeft < 60 ? "#fecaca" : "#bbf7d0"}`,
              borderRadius: 8, padding: "8px 16px", marginBottom: 16, fontSize: 13,
              color: timeLeft < 60 ? "#dc2626" : "#166534", fontWeight: 600,
            }}>
              {timeLeft < 60 ? "⚠️" : "⏳"} Expires in {mins}:{secs}
            </div>

            {/* Waiting indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20, color: "#9A7230", fontSize: 13 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#9A7230", animation: "pulse 1.5s infinite" }} />
              Waiting for payment...
            </div>

            <button onClick={onCancel} style={{
              background: "none", border: "1px solid #dac9b0", color: "#9A7230",
              padding: "8px 24px", borderRadius: 8, cursor: "pointer", fontSize: 13,
            }}>
              Cancel
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}

// ── Main Checkout Page ─────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [form, setForm]     = useState({ name: "", phone: "", address: "", pincode: "" });
  const [otp, setOtp]       = useState("");
  const [method, setMethod] = useState("cod");
  const [devOtp, setDevOtp] = useState("");

  // QR state
  const [qrData, setQrData] = useState<{ link_id: string; short_url: string; expires_at: number } | null>(null);

  const { cart, total, clearCart } = useCart();
  const router = useRouter();

  const sendOtp = async () => {
    setError("");
    if (!form.name || !form.phone || !form.address || !form.pincode)
      return setError("Please fill all fields");
    if (!/^\d{10}$/.test(form.phone))
      return setError("Enter valid 10-digit phone number");
    if (!/^\d{6}$/.test(form.pincode))
      return setError("Enter valid 6-digit pincode");

    try {
      setLoading(true);
      const res  = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to send OTP");
      if (data.otp) setDevOtp(data.otp);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    if (otp.length !== 6) return setError("Enter complete 6-digit OTP");
    try {
      setLoading(true);
      const res  = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, otp }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Invalid OTP");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveOrder = async (paymentMethod: string, razorpayOrderId?: string, razorpayPaymentId?: string) => {
    const res  = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, phone: form.phone,
        address: form.address, pincode: form.pincode,
        cart, total, payment_method: paymentMethod,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Order failed");
    const orderSummary = cart.map((item: any) => ({
      book_title: item.title, quantity: item.qty,
      total_amount: item.price * item.qty, payment_method: paymentMethod,
    }));
    localStorage.setItem("last_order", JSON.stringify(orderSummary));
    localStorage.setItem("last_phone", form.phone);
    clearCart();
    router.push("/order-success");
  };

  // ── Razorpay Popup flow ────────────────────────────────
  const payViaPopup = async () => {
    const orderRes  = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total * 100, phone: form.phone }),
    });
    const orderData = await orderRes.json();
    if (!orderData.success) throw new Error("Payment order creation failed");

    const rzp = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.data.amount,
      currency: "INR",
      order_id: orderData.data.id,
      name: "NareshBookStore",
      description: `Book Order — ₹${total}`,
      theme: { color: "#2E1E0F" },
      prefill: { contact: form.phone },
      handler: async (response: any) => {
        const verifyRes  = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) { router.push("/payment-failed"); return; }
        await saveOrder("razorpay", response.razorpay_order_id, response.razorpay_payment_id);
      },
      modal: { ondismiss: () => { setLoading(false); } },
    });
    rzp.open();
  };

  // ── QR Code flow ───────────────────────────────────────
  const payViaQr = async () => {
    const res  = await fetch("/api/payment/create-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total * 100, phone: form.phone }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to generate QR code");
    setQrData({ link_id: data.link_id, short_url: data.short_url, expires_at: data.expires_at });
  };

  const handleQrPaid = async (paymentId: string) => {
    try {
      await saveOrder("razorpay", undefined, paymentId);
    } catch (err: any) {
      setError(err.message);
      setQrData(null);
    }
  };

  const placeOrder = async () => {
    setError("");
    try {
      setLoading(true);
      if (method === "razorpay_qr") {
        await payViaQr();
        return; // QR modal takes over
      }
      if (method === "razorpay") {
        await payViaPopup();
        return;
      }
      await saveOrder("cod");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.length) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f0e0" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#888", marginBottom: 16 }}>Your cart is empty!</p>
          <button onClick={() => router.push("/")} style={{ background: "#2E1E0F", color: "white", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer" }}>
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* QR Modal */}
      {qrData && (
        <QrModal
          shortUrl={qrData.short_url}
          linkId={qrData.link_id}
          amount={total}
          expiresAt={qrData.expires_at}
          onPaid={handleQrPaid}
          onCancel={() => { setQrData(null); setLoading(false); }}
        />
      )}

      <div style={{ minHeight: "100vh", background: "#f7f0e0", padding: "7rem 1rem 4rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <CheckoutStepper step={step} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 24 }}>

              {/* LEFT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
                    {error}
                  </div>
                )}

                {step === 1 && (
                  <>
                    <CheckoutForm form={form} setForm={setForm} />
                    <LoadingButton loading={loading} onClick={sendOtp}>Send OTP</LoadingButton>
                  </>
                )}

                {step === 2 && (
                  <div style={{ background: "#fdfaf3", border: "1px solid #e5d9c5", borderRadius: 12, padding: 24 }}>
                    <p style={{ fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 }}>
                      OTP sent to <strong>+91 {form.phone}</strong>
                    </p>
                    {devOtp && (
                      <div style={{ background: "#fef9c3", border: "2px dashed #f59e0b", borderRadius: 10, padding: "12px 16px", marginBottom: 20, textAlign: "center" }}>
                        <p style={{ fontSize: 11, color: "#92400e", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>🛠 Dev Mode — OTP</p>
                        <p style={{ fontSize: 28, fontWeight: 900, color: "#2E1E0F", letterSpacing: "0.3em" }}>{devOtp}</p>
                        <p style={{ fontSize: 11, color: "#92400e", marginTop: 4 }}>This banner is hidden in production</p>
                      </div>
                    )}
                    <OtpInput otp={otp} setOtp={setOtp} />
                    <div style={{ marginTop: 16 }}><OtpResendTimer onResend={sendOtp} /></div>
                    <div style={{ marginTop: 20 }}>
                      <LoadingButton loading={loading} onClick={verifyOtp}>Verify OTP</LoadingButton>
                    </div>
                    <button onClick={() => setStep(1)} style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "#9A7230", fontSize: 13, cursor: "pointer" }}>
                      ← Edit phone number
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <>
                    {/* Payment method selection */}
                    <div style={{ background: "#fdfaf3", border: "1px solid #e5d9c5", borderRadius: 12, padding: 20 }}>
                      <p style={{ fontSize: 13, color: "#9A7230", fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Choose Payment Method
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                        {/* COD */}
                        <label style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                          border: `2px solid ${method === "cod" ? "#2E1E0F" : "#e5d9c5"}`,
                          borderRadius: 10, cursor: "pointer", background: method === "cod" ? "#fdf5e8" : "white",
                          transition: "all 0.15s",
                        }}>
                          <input type="radio" name="method" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} style={{ accentColor: "#2E1E0F" }} />
                          <span style={{ fontSize: 20 }}>💵</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#2E1E0F" }}>Cash on Delivery</div>
                            <div style={{ fontSize: 11, color: "#888" }}>Pay when book arrives</div>
                          </div>
                        </label>

                        {/* Razorpay Popup */}
                        <label style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                          border: `2px solid ${method === "razorpay" ? "#2E1E0F" : "#e5d9c5"}`,
                          borderRadius: 10, cursor: "pointer", background: method === "razorpay" ? "#fdf5e8" : "white",
                          transition: "all 0.15s",
                        }}>
                          <input type="radio" name="method" value="razorpay" checked={method === "razorpay"} onChange={() => setMethod("razorpay")} style={{ accentColor: "#2E1E0F" }} />
                          <span style={{ fontSize: 20 }}>💳</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#2E1E0F" }}>UPI / Card / NetBanking</div>
                            <div style={{ fontSize: 11, color: "#888" }}>Razorpay secure checkout</div>
                          </div>
                        </label>

                        {/* Razorpay QR */}
                        <label style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                          border: `2px solid ${method === "razorpay_qr" ? "#2E1E0F" : "#e5d9c5"}`,
                          borderRadius: 10, cursor: "pointer", background: method === "razorpay_qr" ? "#fdf5e8" : "white",
                          transition: "all 0.15s",
                        }}>
                          <input type="radio" name="method" value="razorpay_qr" checked={method === "razorpay_qr"} onChange={() => setMethod("razorpay_qr")} style={{ accentColor: "#2E1E0F" }} />
                          <span style={{ fontSize: 20 }}>📲</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#2E1E0F" }}>Scan QR Code</div>
                            <div style={{ fontSize: 11, color: "#888" }}>GPay · PhonePe · Paytm · BHIM UPI</div>
                          </div>
                        </label>

                      </div>
                    </div>

                    <LoadingButton loading={loading} onClick={placeOrder}>
                      {method === "razorpay"
                        ? `Pay ₹${total?.toLocaleString("en-IN")} via Razorpay`
                        : method === "razorpay_qr"
                        ? `Generate QR — ₹${total?.toLocaleString("en-IN")}`
                        : `Place Order — ₹${total?.toLocaleString("en-IN")} (COD)`}
                    </LoadingButton>
                  </>
                )}
              </div>

              {/* RIGHT */}
              <div>
                <OrdersSummary cart={cart} total={total} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
