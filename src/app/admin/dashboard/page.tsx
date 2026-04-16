"use client";

import { useEffect, useState, useCallback } from "react";
import AdminProtected from "@/components/admin/AdminProtected";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AddBookForm from "@/components/admin/AddBookForm";
import BooksTable from "@/components/admin/BooksTable";
import OrdersTable from "@/components/admin/OrdersTable";

// Stats Card
function StatsCard({ title, value, subtitle, color = "#2E1E0F" }: any) {
  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs tracking-[0.14em] uppercase text-[#9A7230] mb-2">{title}</p>
      <h2 className="text-3xl font-semibold text-[#2E1E0F]" style={{ color }}>{value}</h2>
      {subtitle && <p className="text-xs text-[#8d7657] mt-1">{subtitle}</p>}
    </div>
  );
}

// Mini Bar Chart
function MiniBarChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data, 1);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl">
      <p className="text-xs text-[#9A7230] uppercase tracking-wide mb-4">{label}</p>
      <div className="flex items-end gap-2 h-24">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t transition-all duration-500"
              style={{ height: `${(val / max) * 80}px`, background: "#2E1E0F", minHeight: val > 0 ? 4 : 0 }}
            />
            <span className="text-[10px] text-[#9A7230]">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Status Pie Chart (simple CSS)
function StatusChart({ pending, confirmed, shipped, delivered }: any) {
  const total = pending + confirmed + shipped + delivered || 1;
  const items = [
    { label: "Pending", value: pending, color: "#fbbf24" },
    { label: "Confirmed", value: confirmed, color: "#60a5fa" },
    { label: "Shipped", value: shipped, color: "#a78bfa" },
    { label: "Delivered", value: delivered, color: "#34d399" },
  ];

  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl">
      <p className="text-xs text-[#9A7230] uppercase tracking-wide mb-4">Order Status Breakdown</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#70543a]">{item.label}</span>
              <span className="font-semibold text-[#2E1E0F]">{item.value}</span>
            </div>
            <div className="h-2 bg-[#f0e7da] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(item.value / total) * 100}%`, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0, todayOrders: 0,
    pendingOrders: 0, totalRevenue: 0,
    confirmedOrders: 0, shippedOrders: 0, deliveredOrders: 0,
    weeklyOrders: [0, 0, 0, 0, 0, 0, 0],
    weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
  });
  const [booksRefresh, setBooksRefresh] = useState(0);
  const [ordersRefresh, setOrdersRefresh] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
        setLastUpdated(new Date().toLocaleTimeString("en-IN"));
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return (
    <AdminProtected>
      <div className="min-h-screen bg-[#f7f0e0] text-[#18100A]">
        <AdminNavbar />
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Dashboard</h1>
              {lastUpdated && <p className="text-xs text-[#9A7230] mt-1">Last updated: {lastUpdated}</p>}
            </div>
            <button
              onClick={() => { fetchStats(); setOrdersRefresh(n => n + 1); setBooksRefresh(n => n + 1); }}
              className="border border-[#dac9b0] bg-white px-4 py-2 rounded text-sm hover:bg-[#f5ebdc] flex items-center gap-2"
            >↻ Refresh All</button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Total Orders" value={stats.totalOrders} subtitle="All time" />
            <StatsCard title="Today's Orders" value={stats.todayOrders} subtitle="Last 24 hours" color={stats.todayOrders > 0 ? "#16a34a" : "#2E1E0F"} />
            <StatsCard title="Pending" value={stats.pendingOrders} subtitle="Need action" color={stats.pendingOrders > 0 ? "#d97706" : "#2E1E0F"} />
            <StatsCard title="Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} subtitle="COD + Razorpay" />
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <MiniBarChart data={stats.weeklyOrders} label="Orders — This Week" />
            <StatusChart
              pending={stats.pendingOrders}
              confirmed={stats.confirmedOrders}
              shipped={stats.shippedOrders}
              delivered={stats.deliveredOrders}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#fffdf7] border border-[#e5d9c5] p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-[#60a5fa]">{stats.confirmedOrders}</div>
              <div className="text-xs text-[#9A7230] mt-1 uppercase">Confirmed</div>
            </div>
            <div className="bg-[#fffdf7] border border-[#e5d9c5] p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-[#a78bfa]">{stats.shippedOrders}</div>
              <div className="text-xs text-[#9A7230] mt-1 uppercase">Shipped</div>
            </div>
            <div className="bg-[#fffdf7] border border-[#e5d9c5] p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-[#34d399]">{stats.deliveredOrders}</div>
              <div className="text-xs text-[#9A7230] mt-1 uppercase">Delivered</div>
            </div>
          </div>

          {/* Manage Books */}
          <div className="bg-[#fdfaf3] border border-[#e5d9c5] p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Manage Books</h2>
            <AddBookForm onAdded={() => setBooksRefresh((n) => n + 1)} />
            <BooksTable key={booksRefresh} />
          </div>

          {/* Orders */}
          <div className="bg-[#fdfaf3] border border-[#e5d9c5] p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">All Orders</h2>
            <OrdersTable key={ordersRefresh} onStatusChange={fetchStats} />
          </div>

        </div>
      </div>
    </AdminProtected>
  );
}
