"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import StockBadge from "@/components/StockBadge";
import PriceDisplay from "@/components/PriceDisplay";
import Breadcrumb from "@/components/Breadcrumb";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(setBook);
  }, [id]);

  if (!book) return <div className="p-20">Loading...</div>;

  return (
    <div className="container pt-28 pb-16">
      <Breadcrumb title={book.title} />

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        {/* IMAGE */}
        <div className="bg-gray-200 h-96 rounded-xl" />

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-500">{book.author}</p>

          <PriceDisplay price={book.price} />

          <StockBadge stock={book.stock || 10} />

          {/* QTY */}
          <div className="flex gap-4 items-center mt-6">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="px-3 py-1 border"
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() => setQty(q => q + 1)}
              className="px-3 py-1 border"
            >
              +
            </button>
          </div>

          <button
            onClick={() =>
              addToCart({
                id: book.id,
                title: book.title,
                price: book.price,
                qty,
              })
            }
            className="mt-6 bg-black text-white px-6 py-3 rounded w-full"
          >
            Add to Cart
          </button>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
}