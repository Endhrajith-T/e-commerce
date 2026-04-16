"use client";

export default function CartItem({ item, updateQty, remove }: any) {
  return (
    <div className="flex justify-between items-center border-b py-4">
      <div>
        <p className="font-semibold">{item.title}</p>
        <p className="text-sm text-gray-500">₹ {item.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
        <span>{item.qty}</span>
        <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
      </div>

      <button onClick={() => remove(item.id)} className="text-red-500">
        Remove
      </button>
    </div>
  );
}