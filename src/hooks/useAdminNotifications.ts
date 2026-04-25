"use client";

import { useEffect, useRef, useCallback } from "react";

const POLL_INTERVAL_MS = 30_000; // check every 30s

export function useAdminNotifications() {
  const lastCountRef = useRef<number | null>(null);
  const permissionRef = useRef<NotificationPermission>("default");

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      permissionRef.current = "granted";
      return;
    }
    if (Notification.permission !== "denied") {
      const result = await Notification.requestPermission();
      permissionRef.current = result;
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

  const checkForNewOrders = useCallback(async () => {
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
          `NareshBookStore — ${diff} new order${diff > 1 ? "s" : ""} need${diff === 1 ? "s" : ""} your attention.`
        );
      }
    } catch {
      // Silent fail — don't break admin if polling fails
    }
  }, [showNotification]);

  useEffect(() => {
    requestPermission();
    checkForNewOrders();
    const id = setInterval(checkForNewOrders, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [requestPermission, checkForNewOrders]);
}
