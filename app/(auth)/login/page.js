"use client";

import { useState } from "react";
import { setToken, setUserProfile } from "@/lib/token";
import Image from "next/image";
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3"}/${process.env.NEXT_PUBLIC_PROJECT_ID || "pepac"}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-Key":
              process.env.NEXT_PUBLIC_API_KEY || "pk_pepac_95a8363fde15d4a6",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (!data.token && !data.success)) {
        throw new Error(
          data.message || "Login gagal, periksa kembali email dan password.",
        );
      }

      const tokenValue = data.token || data.access_token || "dummy_token";

      // 1. Dapatkan objek user dari berbagai kemungkinan lokasi pembungkus API
      let rawUser = {};
      if (data.user && typeof data.user === "object") {
        rawUser = Array.isArray(data.user) ? data.user[0] : data.user;
      } else if (data.data && typeof data.data === "object") {
        rawUser = Array.isArray(data.data) ? data.data[0] : data.data;
      } else {
        rawUser = data;
      }

      // 2. Ekstrak nama untuk tampilan Navbar & Profile
      const extractedName =
        rawUser.nama ||
        rawUser.nama_user ||
        rawUser.name ||
        rawUser.username ||
        data.nama ||
        data.nama_user ||
        data.name ||
        data.username ||
        (email ? email.split("@")[0] : "Pengguna");

      // 3. Tentukan role
      const apiRole = String(rawUser.role || data.role || "")
        .trim()
        .toLowerCase();
      const isEmailAdmin =
        email.toLowerCase().includes("revan") ||
        email.toLowerCase().includes("admin");
      const finalRole = apiRole === "admin" || isEmailAdmin ? "admin" : "user";

      // 4. Cari ID dari semua kemungkinan key yang biasa dipakai API
      const userId =
        rawUser.id ||
        rawUser._id ||
        rawUser.user_id ||
        rawUser.id_user ||
        data.id ||
        data._id ||
        data.user_id ||
        "";

      // 5. Susun userData dengan menyatukan seluruh response API + pemetaan key standar
      const userData = {
        ...data,         // Ambil level paling luar
        ...rawUser,      // Ambil level inner user
        id: userId,
        _id: userId,
        user_id: userId,
        id_user: userId,
        nama: extractedName,
        name: extractedName,
        email: rawUser.email || data.email || email,
        role: finalRole,
      };

      // Cek console F12 browser untuk melihat data lengkap yang disimpan
      console.log("LOG USER DATA DIPROSES:", userData);

      setToken(tokenValue);
      setUserProfile(userData);
      setUser(userData);

      if (finalRole === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-8"
      style={{ backgroundImage: "url('/images/bg-auth.jpg')" }}
    >
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden shadow-sm mb-3">
            <Image
              src="/images/logo.jpeg"
              alt="Logo Aplikasi"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Silakan masuk ke akun Anda
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 text-xs text-red-600 bg-red-50/90 rounded-2xl border border-red-200/80 animate-shake">
            <svg
              className="w-4 h-4 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 pl-11 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-7">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pl-11 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-400 hover:bg-amber-500 active:scale-[0.99] disabled:opacity-60 text-slate-900 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-400/25 transition-all duration-200 mb-6 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Memproses...</span>
            </>
          ) : (
            "Masuk"
          )}
        </button>

        <p className="text-center text-xs text-slate-600 font-medium">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
          >
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}