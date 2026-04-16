"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

export default function AdminProtected({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check auth by hitting a protected endpoint
    fetch("/api/admin/orders?page=1", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) router.push("/admin");
        else setChecking(false);
      })
      .catch(() => router.push("/admin"));
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f0e0" }}>
        <div style={{ textAlign: "center", color: "#9A7230" }}>Verifying access...</div>
      </div>
    );
  }

  return <>{children}</>;
}
