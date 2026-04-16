import { useState } from "react";

export const useOtp = () => {
  const [loading, setLoading] = useState(false);

  const sendOtp = async (phone: string) => {
    setLoading(true);
    await fetch("/api/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    setLoading(false);
  };

  const verifyOtp = async (phone: string, otp: string) => {
    setLoading(true);
    await fetch("/api/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
    setLoading(false);
  };

  return { sendOtp, verifyOtp, loading };
};