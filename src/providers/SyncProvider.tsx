"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { syncDocuments } from "@/services/sync/sync.service";

export default function SyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    syncDocuments();
    const onlineHandler = () => {
      syncDocuments();
    };

    window.addEventListener("online", onlineHandler);

    const interval = setInterval(() => {
      syncDocuments();
    }, 10000);

    return () => {
      window.removeEventListener("online", onlineHandler);
      clearInterval(interval);
    };
  }, [accessToken]);

  return <>{children}</>;
}
