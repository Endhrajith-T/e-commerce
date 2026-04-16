"use client";

const books = [
  { name: "Business Studies", sales: 120 },
  { name: "Accountancy", sales: 95 },
  { name: "Economics", sales: 80 },
];

export default function TopBooks() {
  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl shadow-md">
      <h3 className="font-semibold mb-4">Top Selling Books</h3>

      <div className="space-y-3">
        {books.map((book, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{book.name}</span>
              <span className="font-semibold">{book.sales}</span>
            </div>
            <div className="h-2 rounded-full bg-[#eee1ce] overflow-hidden">
              <div
                className="h-full bg-[#9A7230]"
                style={{ width: `${Math.min(100, Math.round((book.sales / 140) * 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}