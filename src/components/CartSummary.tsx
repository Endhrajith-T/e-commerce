"use client";

export default function CartSummary({ total }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Summary</h2>

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>
    </div>
  );
}