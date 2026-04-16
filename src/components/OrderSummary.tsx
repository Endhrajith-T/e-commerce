"use client";

import { useCart } from "@/hooks/useCart";

export default function OrderSummary() {
  const { cart, total } = useCart();

  return (
    <div className="border p-4 rounded-lg bg-white shadow">
      
      <h2 className="font-semibold mb-3">Order Summary</h2>

      {cart.map((item: any) => (
        <div key={item.id} className="flex justify-between mb-2">
          <span>
            {item.title} x {item.quantity}
          </span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <hr className="my-2" />

      <p className="font-bold text-lg">
        Total: ₹{total}
      </p>

    </div>
  );
}