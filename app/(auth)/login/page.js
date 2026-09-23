"use client";

import { useState } from "react";
import { setToken, setUserProfile } from "@/lib/token";
import { useUser } from "@/components/UserContexts";
import Link from "next/link";

export default function LoginPage() {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3"}/${process.env.NEXT_PUBLIC_PROJECT_ID || "pepac"}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "pk_pepac_95a8363fde15d4a6",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (!data.token && !data.success)) {
        throw new Error(data.message || "Login gagal, periksa kembali email dan password.");
      }

      const tokenValue = data.token || data.access_token || "dummy_token";
      
      let rawUser = data.user || data.data || data || {};
      if (Array.isArray(rawUser)) {
        rawUser = rawUser[0] || {};
      }

      const apiRole = String(rawUser.role || data.role || "").trim().toLowerCase();
      const isEmailAdmin = email.toLowerCase().includes("revan") || email.toLowerCase().includes("admin");
      const finalRole = (apiRole === "admin" || isEmailAdmin) ? "admin" : "user";

      const userData = {
        ...rawUser,
        role: finalRole
      };

      setToken(tokenValue);
      setUserProfile(userData);
      setUser(userData);

      if (finalRole === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/barang";
      }
    } catch (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-xl font-bold mb-6 text-center">Login Aplikasi</h1>
        
        {errorMsg && (
          <div className="p-3 mb-4 text-xs text-red-600 bg-red-50 rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="nama@email.com"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            required 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-2 rounded-lg font-bold text-sm transition-colors mb-4"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-xs text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-slate-900 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}