"use client";

import { useEffect, useState } from "react";
import { FileText, Users, History, Wifi } from "lucide-react";

import { getDashboard } from "@/services/dashboard.service";
import { socket } from "@/services/socket/socket";
import { useConnectionStore } from "@/store/connection.store";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    documents: 0,
    collaborators: 0,
    versions: 0,
    // status: "Offline",
  });
  const status = useConnectionStore((state) => state.status);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    const handleDashboardUpdate = (data: any) => {
      setStats(data);
    };

    socket.on("dashboard:update", handleDashboardUpdate);

    return () => {
      socket.off("dashboard:update", handleDashboardUpdate);
    };
  }, []);

  const cards = [
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
    },
    {
      title: "Collaborators",
      value: stats.collaborators,
      icon: Users,
    },
    {
      title: "Versions",
      value: stats.versions,
      icon: History,
    },
    {
      title: "Status",
      value: status,
      icon: Wifi,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <Icon size={24} className="text-blue-600" />

                <span className="text-sm text-slate-500">{item.title}</span>
              </div>

              <h2 className="text-3xl font-bold">{item.value}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
