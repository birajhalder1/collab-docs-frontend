export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <aside
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image/bgImage.jpg')" }}
    >
      <main
        className="flex min-h-screen items-center justify-center bg-slate-100 p-6"
        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          {/* <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Collab Editor
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Local First Collaborative Document Editor
          </p>
        </div> */}

          {children}
        </div>
      </main>
    </aside>
  );
}
