import AuthProvider from "@/providers/AuthProvider";
import SyncProvider from "@/providers/SyncProvider";
import AppLayout from "@/components/layout/AppLayout";
import SocketProvider from "@/providers/SocketProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketProvider>
        <SyncProvider>
          <AppLayout>{children}</AppLayout>
        </SyncProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
