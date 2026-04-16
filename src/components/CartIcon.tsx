"use client";

import { useCart } from "@/hooks/useCart";

export default function CartIcon() {
  const { cart } = useCart();

  return (
    <div className="relative">
      🛒
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded">
          {cart.length}
        </span>
      )}
    </div>
  );
}