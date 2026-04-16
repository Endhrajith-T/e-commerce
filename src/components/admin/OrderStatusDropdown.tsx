"use client";

export default function OrderStatusDropdown({ orderId, status }: any) {
  const updateStatus = async (newStatus: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
  };

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      className="border p-1"
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
    </select>
  );
}