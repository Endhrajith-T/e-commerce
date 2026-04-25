"use client";

import { useState } from "react";
import CheckoutStepper from "@/components/CheckoutStepper";
import CheckoutForm from "@/components/CheckoutForm";
import OtpInput from "@/components/OtpInput";
import OtpResendTimer from "@/components/OtpResendTimer";
import PaymentSelect from "@/components/PaymentSelect";
import OrdersSummary from "@/components/OrdersSummary";
import LoadingButton from "@/components/LoadingButton";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "" });
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState("cod");

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
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to send OTP");
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
      const res = await fetch("/api/otp/verify", {
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
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        address: form.address,
        pincode: form.pincode,
        cart,
        total,
        payment_method: paymentMethod,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Order failed");
    // Save order summary for success page
    const orderSummary = cart.map((item: any) => ({
      book_title: item.title,
      quantity: item.qty,
      total_amount: item.price * item.qty,
      payment_method: paymentMethod,
    }));
    localStorage.setItem("last_order", JSON.stringify(orderSummary));
    localStorage.setItem("last_phone", form.phone);
    clearCart();
    router.push("/order-success");
  };

  const placeOrder = async () => {
    setError("");
    try {
      setLoading(true);

      if (method === "razorpay") {
        const orderRes = await fetch("/api/payment/create-order", {
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
          image: "https://i.imgur.com/n5tjHFD.png",
          theme: { color: "#2E1E0F" },
          config: {
            display: {
              blocks: {
                upi: { name: "UPI / QR Code", instruments: [{ method: "upi" }] },
                card: { name: "Cards", instruments: [{ method: "card" }] },
                nb: { name: "Net Banking", instruments: [{ method: "netbanking" }] },
              },
              sequence: ["block.upi", "block.card", "block.nb"],
              preferences: { show_default_blocks: false },
            },
          },
          prefill: { contact: form.phone },
          handler: async (response: any) => {
            const verifyRes = await fetch("/api/payment/verify", {
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
          modal: { ondismiss: () => { setLoading(false); router.push("/payment-failed"); } },
        });
        rzp.open();
        return;
      }

      await saveOrder("cod");
    } catch (err: any) {
      setError(err.message);
      router.push("/payment-failed");
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
                  <OtpInput otp={otp} setOtp={setOtp} />
                  <div style={{ marginTop: 16 }}>
                    <OtpResendTimer onResend={sendOtp} />
                  </div>
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
                  <PaymentSelect method={method} setMethod={setMethod} />

                  {/* Razorpay QR Code option */}
                  {method === "razorpay" && (
                    <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:16, marginTop:4 }}>
                      <p style={{ fontSize:13, color:"#1e40af", fontWeight:600, marginBottom:12 }}>
                        💡 Two ways to pay via Razorpay:
                      </p>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                        {/* Option 1 — Razorpay Popup */}
                        <div style={{ background:"white", border:"2px solid #2E1E0F", borderRadius:10, padding:12, textAlign:"center" }}>
                          <div style={{ fontSize:24, marginBottom:6 }}>💳</div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#2E1E0F", marginBottom:4 }}>Pay via Popup</div>
                          <div style={{ fontSize:11, color:"#888" }}>UPI · Cards · NetBanking</div>
                        </div>
                        {/* Option 2 — QR Code */}
                        <div style={{ background:"white", border:"1px solid #e5d9c5", borderRadius:10, padding:12, textAlign:"center" }}>
                          <div style={{ fontSize:24, marginBottom:6 }}>📱</div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#2E1E0F", marginBottom:4 }}>Scan QR Code</div>
                          <div style={{ fontSize:11, color:"#888" }}>Generated after click</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <LoadingButton loading={loading} onClick={placeOrder}>
                    {method === "razorpay"
                      ? `Pay ₹${total?.toLocaleString("en-IN")} via Razorpay`
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
  );
}
