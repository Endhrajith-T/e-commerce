"use client";

import { useEffect, useState, useCallback } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  image_url: string | null;
  description: string | null;
}

export default function BooksTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Book>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/books", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (data.success) setBooks(data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const deleteBook = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        showMsg("Book deleted!");
      } else {
        showMsg(data.error || "Cannot delete", true);
      }
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  };

  const startEdit = (book: Book) => {
    setEditing(book.id);
    setEditForm({ title: book.title, author: book.author, price: book.price, stock: book.stock, image_url: book.image_url || "", description: book.description || "" });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) }),
      });
      const data = await res.json();
      if (data.success) {
        setBooks((prev) => prev.map((b) => b.id === id ? { ...b, ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) } : b));
        setEditing(null);
        showMsg("Book updated!");
      } else {
        showMsg("Update failed", true);
      }
    } finally {
      setSaving(false);
    }
  };

  const showMsg = (msg: string, isError = false) => {
    setMessage(isError ? `❌ ${msg}` : `✅ ${msg}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const inp = "border border-[#dac9b0] bg-white px-2 py-1 rounded text-sm w-full focus:outline-none focus:border-[#9A7230]";
  const filtered = books.filter((b) =>
    b.title?.toLowerCase().includes(query.toLowerCase()) ||
    b.author?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-lg">Books Catalogue</h2>
          <p className="text-xs text-[#9A7230]">{books.length} books in store</p>
        </div>
        <div className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or author..." className="border border-[#dac9b0] bg-white p-2 rounded text-sm md:w-64" />
          <button onClick={fetchBooks} className="border border-[#dac9b0] bg-white px-3 py-2 rounded text-sm hover:bg-[#f5ebdc]">↻</button>
        </div>
      </div>

      {message && (
        <div className={`mb-3 px-4 py-2 rounded text-sm ${message.startsWith("❌") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-[#9A7230]">Loading books...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#eadfcf] text-left text-[#8a6a3d] uppercase tracking-[0.1em] text-xs">
                <th className="py-3 pr-3">Cover</th>
                <th className="py-3 pr-3">Title</th>
                <th className="py-3 pr-3">Author</th>
                <th className="py-3 pr-3">Price</th>
                <th className="py-3 pr-3">Stock</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <>
                  {/* Normal Row */}
                  <tr key={book.id} className="border-b border-[#f0e7da] hover:bg-[#fdf5e8]">
                    <td className="py-3 pr-3">
                      {book.image_url ? (
                        <img src={book.image_url} alt={book.title} className="w-10 h-12 object-cover rounded shadow" />
                      ) : (
                        <div className="w-10 h-12 bg-[#2E1E0F] rounded flex items-center justify-center text-[#9A7230]">❧</div>
                      )}
                    </td>
                    <td className="py-3 pr-3 font-medium max-w-[160px]">
                      <span className="line-clamp-2 block">{book.title}</span>
                    </td>
                    <td className="py-3 pr-3 text-[#70543a]">{book.author}</td>
                    <td className="py-3 pr-3 font-semibold">₹ {Number(book.price).toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.stock <= 0 ? "bg-red-100 text-red-700" : book.stock <= 5 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                        {book.stock <= 0 ? "Out of Stock" : `${book.stock} left`}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        {/* Edit Button */}
                        <button onClick={() => editing === book.id ? setEditing(null) : startEdit(book)}
                          className="text-xs border border-[#9A7230] text-[#9A7230] px-3 py-1 rounded hover:bg-[#fdf5e8]">
                          {editing === book.id ? "Cancel" : "Edit"}
                        </button>
                        {/* Delete Button */}
                        {confirm === book.id ? (
                          <>
                            <button onClick={() => deleteBook(book.id)} disabled={deleting === book.id}
                              className="text-xs bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50">
                              {deleting === book.id ? "..." : "Confirm"}
                            </button>
                            <button onClick={() => setConfirm(null)}
                              className="text-xs border border-[#dac9b0] px-3 py-1 rounded">Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => setConfirm(book.id)}
                            className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Edit Row */}
                  {editing === book.id && (
                    <tr key={`edit-${book.id}`} className="bg-[#fdf5e8] border-b border-[#e5d9c5]">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="text-xs text-[#9A7230] mb-1 block uppercase">Title</label>
                            <input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={inp} />
                          </div>
                          <div>
                            <label className="text-xs text-[#9A7230] mb-1 block uppercase">Author</label>
                            <input value={editForm.author || ""} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} className={inp} />
                          </div>
                          <div>
                            <label className="text-xs text-[#9A7230] mb-1 block uppercase">Price (₹)</label>
                            <input type="number" value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className={inp} />
                          </div>
                          <div>
                            <label className="text-xs text-[#9A7230] mb-1 block uppercase">Stock</label>
                            <input type="number" value={editForm.stock || ""} onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })} className={inp} />
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs text-[#9A7230] mb-1 block uppercase">Image URL</label>
                            <input value={editForm.image_url || ""} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} className={inp} />
                          </div>
                          <div className="col-span-2 md:col-span-3">
                            <label className="text-xs text-[#9A7230] mb-1 block uppercase">Description</label>
                            <textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              rows={2} className={inp + " resize-none"} />
                          </div>
                        </div>
                        <button onClick={() => saveEdit(book.id)} disabled={saving}
                          className="bg-[#2E1E0F] text-white px-5 py-1.5 rounded text-sm hover:bg-[#5A3820] disabled:opacity-50">
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-sm text-[#8f7a5e] mt-4 text-center">No books found.</p>}
        </div>
      )}
    </div>
  );
}
