"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    console.log("Login submit — backend belum terhubung");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-[#F8F9FA] text-[#212529]">

      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-[430px] bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-7 sm:p-9 transition-all">
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F1F4F9] text-[#2F3A4A] mb-3.5 border border-[#E2E8F0]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4a2 2 0 0 1 2 2c0 1.05-.7 1.94-1.68 2.16L20 13a1 1 0 0 1-.5 1.87H4.5A1 1 0 0 1 4 13l7.68-4.84A2.002 2.002 0 0 1 12 4z" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#212529] tracking-tight">RentWear</h1>
            <p className="text-xs font-medium text-[#6C757D] mt-0.5">Sistem Peminjaman Barang</p>

            <div className="mt-6 pt-5 border-t border-[#F1F4F9]">
              <h2 className="text-lg font-semibold text-[#212529]">Selamat Datang</h2>
              <p className="text-sm text-[#6C757D] mt-1">Silakan masuk untuk melanjutkan.</p>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-[#212529] mb-1.5 uppercase tracking-wide">
                Email / Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Masukkan email atau username"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#212529] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2F3A4A] focus:ring-1 focus:ring-[#2F3A4A] transition-colors duration-150"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#212529] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#212529] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2F3A4A] focus:ring-1 focus:ring-[#2F3A4A] transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6C757D] hover:text-[#212529] focus:outline-none"
                  aria-label="Lihat password"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#2F3A4A] focus:ring-[#2F3A4A] focus:ring-offset-0 cursor-pointer accent-[#2F3A4A]"
                />
                <span className="text-xs text-[#6C757D]">Ingat saya</span>
              </label>
              <Link href="#" className="text-xs font-medium text-[#2F3A4A] hover:underline focus:outline-none focus:ring-1 focus:ring-[#2F3A4A] rounded px-1">
                Lupa password?
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#2F3A4A] hover:bg-[#242D3A] active:bg-[#1E2530] text-white text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center tracking-wider uppercase"
              >
                MASUK
              </button>
            </div>

            <div className="text-center pt-3 text-xs text-[#6C757D]">
              Belum memiliki akun?{" "}
              <Link href="/register" className="font-semibold text-[#2F3A4A] hover:underline ml-1">
                Daftar
              </Link>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#F1F4F9] flex items-center justify-center gap-1.5 text-[11px] text-[#6C757D]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#6C757D]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" clipRule="evenodd" />
            </svg>
            <span>Sistem Informasi Penyewaan Perlengkapan Acara</span>
          </div>
        </div>
      </main>
    </div>
  );
}