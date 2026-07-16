"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { useConnectionStore } from "@/store/connection.store";

import { socket } from "@/services/socket/socket";
import { syncDocuments } from "@/services/sync/sync.service";
import { initializeDocuments } from "@/services/sync/init.service";
import { toast } from "sonner";

export default function SyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setStatus = useConnectionStore((state) => state.setStatus);

  useEffect(() => {
    if (!accessToken) return;

    async function startSync() {
      try {
        await initializeDocuments();

        setStatus("Syncing...");
        await syncDocuments();
        setStatus("Online");
      } catch (err) {
        console.error("Initialization failed", err);
        setStatus("Offline");
      }
    }

    startSync();

    // Browser goes online
    const onlineHandler = () => {
      setStatus("Reconnecting");

      toast.info("Internet connected. Reconnecting...", {
        id: "reconnect",
      });
      // socket.connect();
    };

    // Browser goes offline
    const offlineHandler = () => {
      setStatus("Offline");

      toast.warning("You are offline. Changes will sync automatically.", {
        id: "offline",
      });
    };

    // Socket connected
    const connectHandler = async () => {
      try {
        setStatus("Syncing...");
        await syncDocuments();
        setStatus("Online");

        toast.success("All changes synced successfully.", {
          id: "sync-success",
        });
      } catch (err) {
        console.error(err);
        setStatus("Reconnecting");
        toast.error("Failed to sync changes.", {
          id: "sync-error",
        });
      }
    };

    // Socket disconnected
    const disconnectHandler = (reason: string) => {
      // setStatus("Offline");
      console.log("Socket disconnected:", reason);

      if (!navigator.onLine) {
        setStatus("Offline");
      } else {
        setStatus("Reconnecting");
      }
    };

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    socket.on("connect", connectHandler);
    socket.on("disconnect", disconnectHandler);

    // Background sync every 10 seconds
    const interval = setInterval(async () => {
      if (!navigator.onLine) return;

      try {
        setStatus("Syncing...");
        await syncDocuments();
        setStatus("Online");
      } catch {
        setStatus("Reconnecting");
      }
    }, 10000);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);

      socket.off("connect", connectHandler);
      socket.off("disconnect", disconnectHandler);

      clearInterval(interval);
    };
  }, [accessToken, setStatus]);

  return <>{children}</>;
}
