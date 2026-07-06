"use client";

import api from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { FileText, Clock3, Settings, Home } from "react-icons/fa6";
import {
  FaFileLines,
  FaClock,
  FaGear,
  FaHouse,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: FaHouse,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FaFileLines,
  },
  {
    title: "History",
    href: "/history",
    icon: FaClock,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: FaGear,
  },
];

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // Express logout API
    } catch (error) {
      console.error(error);
    } finally {
      logout(); // Clear Zustand state
      router.replace("/login");
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold">Collab Editor</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-slate-800"
          >
            <menu.icon className="text-lg" />
            <span>{menu.title}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-800 p-4">
        <button
          className="flex w-full items-center gap-3 rounded-lg bg-red-600 px-4 py-3 font-medium transition hover:bg-red-700"
          onClick={handleLogout}
        >
          <FaArrowRightFromBracket className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
