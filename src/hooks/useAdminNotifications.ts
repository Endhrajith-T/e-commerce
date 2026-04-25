"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useAdminNotifications() {
  const lastCountRef = useRef<number | null>(null);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      await Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        tag: "nkbooks-new-order",
      });
    }
  }, []);

  const checkCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders?page=1", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;

      const currentCount: number = data.total ?? 0;
      if (lastCountRef.current === null) {
        lastCountRef.current = currentCount;
        return;
      }

      const diff = currentCount - lastCountRef.current;
      if (diff > 0) {
        lastCountRef.current = currentCount;
        showNotification(
          `${diff} New Order${diff > 1 ? "s" : ""}! 📦`,
          `NareshBookStore — ${diff} new order${diff === 1 ? "" : "s"} need${diff === 1 ? "s" : ""} your attention.`
        );
      }
    } catch {
      // Silent fail
    }
  }, [showNotification]);

  useEffect(() => {
    requestPermission();
    checkCount(); // initial count baseline

    // Supabase Realtime — fire on every new order INSERT
    const channel = supabase
      .channel("orders-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        () => { checkCount(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [requestPermission, checkCount]);
}
