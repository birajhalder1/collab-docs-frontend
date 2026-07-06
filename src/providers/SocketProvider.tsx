"use client";

import { useEffect } from "react";
import { socket } from "@/services/socket/socket";
import { useAuthStore } from "@/store/auth.store";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (!token) return;

        socket.auth = {
            token,
        };

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [token]);

    return <>{children}</>;
}
