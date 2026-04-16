import { useEffect, useState } from "react";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(async (res) => {
        if (!res.ok) throw new Error("API error");

        const text = await res.text();

        // ✅ safe parse
        return text ? JSON.parse(text) : [];
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Orders fetch error:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  return { orders, loading };
};