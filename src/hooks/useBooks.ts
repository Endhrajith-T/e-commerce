"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types";

export default function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.data || []);
        } else {
          setError(data.error || "Failed to load books");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load books");
        setLoading(false);
      });
  }, []);

  return { books, loading, error };
}
