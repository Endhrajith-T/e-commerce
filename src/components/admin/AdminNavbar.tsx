"use client";

import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/admin");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[#2E1E0F] text-white border-b border-[#5a3820]">
      <div>
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e2c97e]">NareshBookStore Operations</p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-[#7A5030] px-4 py-1.5 rounded hover:bg-[#9A7230] transition-colors text-sm"
      >
        Logout
      </button>
    </div>
  );
}
