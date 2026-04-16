"use client";

import { useState } from "react";

export default function AddBookForm({ onAdded }: { onAdded?: () => void }) {
  const [form, setForm] = useState({
    title: "", author: "", price: "", stock: "",
    image_url: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addBook = async () => {
    if (!form.title || !form.author || !form.price || !form.stock) {
      setError("Title, author, price and stock are required");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          author: form.author,
          price: Number(form.price),
          stock: Number(form.stock),
          image_url: form.image_url || null,
          description: form.description || null,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to add book");

      setForm({ title: "", author: "", price: "", stock: "", image_url: "", description: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onAdded?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = "border border-[#dac9b0] bg-white p-2.5 rounded w-full text-sm focus:outline-none focus:border-[#9A7230]";

  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl mb-4 space-y-4">
      <h3 className="text-sm tracking-[0.24em] uppercase text-[#9A7230] font-medium">Add New Book</h3>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#9A7230] uppercase tracking-wide mb-1 block">Title *</label>
          <input placeholder="Book title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="text-xs text-[#9A7230] uppercase tracking-wide mb-1 block">Author *</label>
          <input placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="text-xs text-[#9A7230] uppercase tracking-wide mb-1 block">Price (₹) *</label>
          <input type="number" placeholder="299" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inp} />
        </div>
        <div>
          <label className="text-xs text-[#9A7230] uppercase tracking-wide mb-1 block">Stock *</label>
          <input type="number" placeholder="50" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inp} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-[#9A7230] uppercase tracking-wide mb-1 block">Image URL</label>
          <input placeholder="https://..." value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inp} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-[#9A7230] uppercase tracking-wide mb-1 block">Description</label>
          <textarea placeholder="Short book description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inp + " resize-none"} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Book added successfully!</p>}

      <button
        onClick={addBook}
        disabled={loading}
        className="bg-[#2E1E0F] text-white px-6 py-2.5 rounded hover:bg-[#5A3820] transition-colors disabled:opacity-60 text-sm font-medium"
      >
        {loading ? "Adding..." : "Add Book"}
      </button>
    </div>
  );
}
