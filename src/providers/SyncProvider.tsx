"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { syncDocuments } from "@/services/sync/sync.service";
import { initializeDocuments } from "@/services/sync/init.service";

export default function SyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);

useEffect(() => {
  if (!accessToken) return;

  async function startSync() {
    try {
      // Step 1: Initialize local DB if empty
      await initializeDocuments();

      // Step 2: Push/Pull sync
      await syncDocuments();
    } catch (err) {
      console.error("Initialization failed", err);
    }
  }

  startSync();

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
