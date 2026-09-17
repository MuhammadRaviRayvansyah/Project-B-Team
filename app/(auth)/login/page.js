"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    console.log("Login submit — backend belum terhubung");
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-between bg-slate-50 text-slate-900 px-4 py-3 antialiased select-none">
      <main className="flex-1 flex items-center justify-center my-auto py-2">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 overflow-hidden mb-2 shadow-xs">
              <Image
                src="/logo.jpeg"
                alt="RentWear Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Silakan masuk untuk melanjutkan.
            </p>
          </div>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Field Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider"
              >
                Email / Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Masukkan email atau username"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
              />
            </div>

            {/* Field Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
                  aria-label="Lihat password"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0 cursor-pointer accent-slate-900"
                />
                <span className="text-[11px] text-slate-500">Ingat saya</span>
              </label>
              <Link
                href="#"
                className="text-[11px] font-medium text-slate-700 hover:text-slate-900 hover:underline focus:outline-none"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center tracking-wider uppercase shadow-xs"
              >
                MASUK
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-1 text-[11px] text-slate-500">
              Belum memiliki akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-slate-900 hover:underline ml-0.5"
              >
                Daftar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
