"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuthStore } from "@/store/auth.store";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { accessToken, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) return;

    // Already logged in, don't refresh
    console.log("accessToken", accessToken);

    if (accessToken) return;

    const restoreSession = async () => {
      try {
        const { data } = await api.post("/auth/refresh");

        setAuth(data.data.user, data.data.accessToken);
      } catch (error) {
        // logout();
        // router.replace("/login");
        console.log("Session expired", error);
      }
    };

    restoreSession();
  }, [pathname, accessToken, setAuth, logout, router]);

  return <>{children}</>;
}
