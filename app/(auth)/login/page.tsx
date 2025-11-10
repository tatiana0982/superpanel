"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { googleLogin } from "@/lib/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-80 text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <button
          disabled={loading}
          onClick={googleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
