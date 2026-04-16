"use client";

export default function OrderFilters({ setFilter }: any) {
  return (
    <div className="flex gap-3 mb-4">
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("pending")}>Pending</button>
      <button onClick={() => setFilter("confirmed")}>Confirmed</button>
      <button onClick={() => setFilter("shipped")}>Shipped</button>
      <button onClick={() => setFilter("delivered")}>Delivered</button>
    </div>
  );
}