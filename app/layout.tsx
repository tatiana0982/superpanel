import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- THE CRUCIAL CSS IMPORT
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
        <main className=" min-h-screen min-w-screen bg-slate-900">
          <div className="flex w-full max-w-[1400px] mx-auto">
            <Sidebar />
            {/* Sidebar */}

            <div className="mt-12 overflow-x-hidden">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
