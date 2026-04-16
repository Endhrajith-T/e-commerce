"use client";

import Link from "next/link";

export default function MobileMenu({ open }: any) {
  if (!open) return null;

  return (
    <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4">
      <Link href="/" className="block py-2">Home</Link>
      <Link href="/cart" className="block py-2">Cart</Link>
    </div>
  );
}