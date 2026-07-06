import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collab Editor",
  description: "Local First Collaborative Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 antialiased">{children}</body>
    </html>
  );
}
