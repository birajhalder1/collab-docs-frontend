"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <aside
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image/bgImage.jpg')" }}
    >
      {/* Overlay */}
      <main className="flex min-h-screen items-center justify-center bg-black/50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl rounded-2xl bg-white/10 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8 md:p-10">
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Local-First
            <br className="sm:hidden" /> Collaborative Editor
          </h1>

          <p className="mt-4 text-sm text-gray-200 sm:text-base md:text-lg">
            Offline First • Real-time Collaboration
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              className="w-full sm:w-auto"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto"
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
