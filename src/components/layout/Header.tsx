"use client";

import { useAuthStore } from "@/store/auth.store";
import { Bell, Search, User } from "lucide-react";

export default function Header() {
   const user = useAuthStore((state) => state.user);
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />

          <input
            type="text"
            placeholder="Search documents..."
            className="w-80 rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        <button className="rounded-full p-2 hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <User size={18} />
          </div>

          <div className="hidden md:block">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
