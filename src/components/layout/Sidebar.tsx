"use client";

import { useState } from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaFileLines,
  FaHouse,
  FaArrowRightFromBracket,
  FaBars,
  FaXmark,
  FaGithub,
  FaLinkedin,
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
];

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      setIsOpen(false);
      router.replace("/login");
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-md bg-slate-900 p-2 text-white shadow-lg md:hidden"
          aria-label="Open menu"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-dvh w-64 flex-col overflow-hidden bg-slate-900 text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 md:hidden">
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded p-1 hover:bg-slate-700"
            aria-label="Close menu"
          >
            <FaXmark size={22} />
          </button>
        </div>

        {/* Logo */}
        <div className="border-b border-slate-800 p-6 text-center text-2xl font-bold">
          Collab Editor
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={() => setIsOpen(false)}
              className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              <menu.icon className="text-lg" />
              <span>{menu.title}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <p className="mb-3 text-center text-xs uppercase tracking-widest text-slate-400">
            Connect
          </p>

          <div className="mb-4 flex justify-center gap-4">
            <a
              href="https://github.com/birajhalder1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-slate-700"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/biraj-halder-871959173"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 transition hover:bg-blue-600"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-red-600 px-4 py-3 font-medium transition hover:bg-red-700"
          >
            <FaArrowRightFromBracket className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
