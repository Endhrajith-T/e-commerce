"use client";

import { Heart } from "lucide-react";

export default function BookCard({ book }: any) {
  return (
    <div className="bg-white border border-[#e5d9c5] p-5 group hover:shadow-lg transition">

      {/* IMAGE */}
      <div className="relative h-60 bg-[#eee] mb-4">
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
          <Heart size={16} />
        </button>
      </div>

      {/* CATEGORY */}
      <p className="text-xs text-[#c8a96a] uppercase tracking-wider">
        {book.category}
      </p>

      {/* TITLE */}
      <h3 className="font-serif text-lg mt-1">
        {book.title}
      </h3>

      {/* AUTHOR */}
      <p className="text-sm text-gray-500">Naresh Kumar</p>

      {/* DESC */}
      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
        {book.description}
      </p>

      {/* PRICE */}
      <p className="mt-4 font-semibold">₹ {book.price}</p>

      {/* BTN */}
      <button className="mt-4 w-full bg-black text-white py-2 text-sm tracking-wide hover:bg-[#3b2a1a]">
        ADD TO CART
      </button>
    </div>
  );
}