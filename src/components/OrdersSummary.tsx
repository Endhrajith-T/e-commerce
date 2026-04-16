"use client";

export default function OrdersSummary({ cart, total }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="font-semibold mb-4 text-lg">Order Summary</h2>
      <div className="space-y-2 text-sm">
        {cart?.map((item: any) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name || item.title} × {item.qty}</span>
            <span>₹ {(item.price * item.qty).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <div className="border-t mt-4 pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span>₹ {total?.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
