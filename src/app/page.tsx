"use client";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <aside
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image/bgImage.jpg')" }}
    >
      <main className="flex min-h-screen items-center justify-center bg-slate-100" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
        <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-xl">
          <h1 className="text-center text-4xl font-bold">
            Local-First Collaborative Editor
          </h1>

          <p className="mt-4 text-center text-gray-500">
            Offline First • Real-time Collaboration • Version History
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => router.push("/login")}>Login</Button>

            <Button
              variant="secondary"
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </main>
    </aside>
  );
}
