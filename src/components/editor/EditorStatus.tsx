"use client";

interface SaveStatusProps {
  status: "typing" | "saving" | "saved" | "syncing" | "synced" | "offline";
}

export default function SaveStatus({ status }: SaveStatusProps) {
  const config = {
    typing: {
      text: "Typing...",
      color: "text-gray-500",
    },
    saving: {
      text: "Saving...",
      color: "text-orange-500",
    },
    saved: {
      text: "Saved locally",
      color: "text-green-600",
    },
    syncing: {
      text: "Syncing...",
      color: "text-blue-600",
    },
    synced: {
      text: "Synced",
      color: "text-green-600",
    },
    offline: {
      text: "Offline",
      color: "text-red-500",
    },
  };

  return (
    <div className={`text-sm font-medium ${config[status].color}`}>
      {config[status].text}
    </div>
  );
}
