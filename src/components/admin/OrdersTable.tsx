"use client";

import { useEffect, useState, useCallback } from "react";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: "#fef9c3", text: "#854d0e" },
  confirmed: { bg: "#dbeafe", text: "#1e40af" },
  shipped:   { bg: "#ede9fe", text: "#5b21b6" },
  delivered: { bg: "#dcfce7", text: "#166534" },
};

const PAYMENT_COLORS: Record<string, { bg: string; text: string }> = {
  cod:      { bg: "#fef3c7", text: "#92400e" },
  razorpay: { bg: "#d1fae5", text: "#065f46" },
};

export default function OrdersTable({ onStatusChange }: { onStatusChange?: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filter !== "all") params.set("status", filter);

      const res = await fetch(`/api/admin/orders?${params}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      onStatusChange?.();
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-lg">Orders</h2>
          <p className="text-xs text-[#9A7230]">{total} total orders · auto-refreshes every 30s</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="border border-[#dac9b0] bg-white p-2 rounded text-sm"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button
            onClick={fetchOrders}
            className="border border-[#dac9b0] bg-white px-3 py-2 rounded text-sm hover:bg-[#f5ebdc]"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[#9A7230]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-[#9A7230]">
          <p className="text-2xl mb-2">📦</p>
          <p>No orders found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#eadfcf] text-left text-[#8a6a3d] uppercase tracking-[0.1em] text-xs">
                  <th className="py-3 pr-3">Order ID</th>
                  <th className="py-3 pr-3">Customer</th>
                  <th className="py-3 pr-3">Phone</th>
                  <th className="py-3 pr-3">Book</th>
                  <th className="py-3 pr-3">Qty</th>
                  <th className="py-3 pr-3">Amount</th>
                  <th className="py-3 pr-3">Payment</th>
                  <th className="py-3 pr-3">Address</th>
                  <th className="py-3 pr-3">Date</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                  const pc = PAYMENT_COLORS[order.payment_method] || PAYMENT_COLORS.cod;
                  return (
                    <tr key={order.id} className="border-b border-[#f0e7da] hover:bg-[#fdf5e8]">
                      <td className="py-3 pr-3 font-mono text-xs text-[#9A7230]">#{order.id?.slice(0, 8)}</td>
                      <td className="py-3 pr-3 font-medium">{order.customer_name}</td>
                      <td className="py-3 pr-3 text-[#70543a]">{order.phone}</td>
                      <td className="py-3 pr-3 max-w-[140px]">
                        <span className="line-clamp-1 block">{order.books?.title || "—"}</span>
                      </td>
                      <td className="py-3 pr-3 text-center">{order.quantity}</td>
                      <td className="py-3 pr-3 font-semibold">₹ {Number(order.total_amount).toLocaleString("en-IN")}</td>
                      <td className="py-3 pr-3">
                        <span style={{ background: pc.bg, color: pc.text }} className="px-2 py-1 rounded-full text-xs font-medium uppercase">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-xs text-[#70543a] max-w-[160px]">
                        <span className="line-clamp-2 block">{order.address}, {order.pincode}</span>
                      </td>
                      <td className="py-3 pr-3 text-xs whitespace-nowrap text-[#70543a]">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          style={{ background: sc.bg, color: sc.text }}
                          className="px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 rounded border border-[#dac9b0] text-sm disabled:opacity-40">← Prev</button>
              <span className="px-3 py-1 text-sm text-[#9A7230]">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1 rounded border border-[#dac9b0] text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
