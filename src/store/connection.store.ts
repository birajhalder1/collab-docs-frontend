import { create } from "zustand";

type ConnectionStatus = "Offline" | "Reconnecting" | "Syncing..." | "Online";

interface ConnectionState {
  status: ConnectionStatus;
  setStatus: (status: ConnectionStatus) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: "Offline",
  setStatus: (status) => set({ status }),
}));
