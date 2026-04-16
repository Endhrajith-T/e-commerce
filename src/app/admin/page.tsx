"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!password) return setError("Enter password");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Incorrect password");

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f0e0] px-4">
      <div className="bg-[#fdfaf3] border border-[#e5d9c5] p-8 rounded-xl shadow-lg w-[380px]">
        <h1 className="text-2xl font-semibold mb-2 text-center">Admin Login</h1>
        <p className="text-xs tracking-[0.24em] uppercase text-center text-[#9A7230] mb-6">
          Bookshelf Control Panel
        </p>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full border border-[#d8cab5] px-4 py-2 rounded mb-4 bg-white"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#2E1E0F] text-white py-2 rounded hover:bg-[#5A3820] transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
