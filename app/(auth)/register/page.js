"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const nama = formData.get("nama");
    const email = formData.get("email");
    const no_hp = formData.get("no_hp");
    const password = formData.get("password");

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3"}/${process.env.NEXT_PUBLIC_PROJECT_ID || "pepac"}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-Key":
              process.env.NEXT_PUBLIC_API_KEY || "pk_pepac_95a8363fde15d4a6",
          },
          body: JSON.stringify({ nama, email, no_hp, password }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registrasi gagal, silakan coba lagi.");
      }

      router.push("/login");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-8"
      style={{ backgroundImage: "url('/images/bg-auth.jpg')" }}
    >
      {/* Overlay terang transparan ber-blur (sama persis seperti login sebelumnya) */}
      <div className="absolute inset-0" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60 transition-all duration-300"
      >
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl ">
            <Image
              src="/images/logo.jpeg" 
              alt="Logo Aplikasi"
              width={64}
              height={64}
              className="object-contain w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Daftar Akun Baru
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Lengkapi data diri Anda untuk mengakses sistem peminjaman
          </p>
        </div>

        {/* Pesan Error */}
        {errorMessage && (
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
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Input Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                name="nama"
                required
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 pl-11 bg-white/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Input Email  */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="nama@email.com"
                className="w-full px-4 py-3 pl-11 bg-white/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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

          {/* Input No HP / WA */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nomor Handphone / WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                name="no_hp"
                required
                placeholder="081234567890"
                className="w-full px-4 py-3 pl-11 bg-white/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 bg-white/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 transition-all duration-200 !mt-6 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
              "Daftar Sekarang"
            )}
          </button>
        </div>

        {/* Footer / Login Link */}
        <p className="text-center text-xs text-slate-600 font-medium mt-6">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:text-indigo-600 hover:underline transition-colors"
          >
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
