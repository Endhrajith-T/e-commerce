"use client";

import { useState } from "react";

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:   { bg: "#fef9c3", color: "#92400e", border: "#fde68a" },
  confirmed: { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
  shipped:   { bg: "#ede9fe", color: "#5b21b6", border: "#ddd6fe" },
  delivered: { bg: "#dcfce7", color: "#14532d", border: "#bbf7d0" },
};

export default function OrderStatusDropdown({ orderId, status: initialStatus }: { orderId: string; status: string }) {
  const [status, setStatus]   = useState(initialStatus);
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState("");

  const updateStatus = async (newStatus: string) => {
    const prev = status;
    setStatus(newStatus);   // optimistic update
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus(prev);    // rollback on failure
        setError(data.error || "Update failed");
      }
    } catch {
      setStatus(prev);
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.pending;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => updateStatus(e.target.value)}
        style={{
          background: saving ? "#f3f4f6" : colors.bg,
          color: saving ? "#9ca3af" : colors.color,
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          padding: "4px 8px",
          fontSize: 12,
          fontWeight: 600,
          cursor: saving ? "wait" : "pointer",
          minWidth: 110,
          outline: "none",
          transition: "all 0.15s",
        }}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>

      {saving && (
        <span style={{ fontSize: 10, color: "#9A7230" }}>Saving...</span>
      )}
      {error && (
        <span style={{ fontSize: 10, color: "#dc2626" }}>{error}</span>
      )}
    </div>
  );
}
