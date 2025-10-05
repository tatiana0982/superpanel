import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- THE CRUCIAL CSS IMPORT
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pentora Tool Uploader",
  description: "Upload new tools to the Pentora platform",
};

// --- Example Sidebar ---


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex justify-center min-h-screen w-full bg-slate-900">
          <Sidebar />
          {/* Sidebar */}

          {children}
        </main>
      </body>
    </html>
  );
}
