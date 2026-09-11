"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleRegister = () => {
    console.log("Daftar submit — backend belum terhubung");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-[#F8F9FA] text-[#212529]">
      <Header subtitle="Sistem Inventaris & Peminjaman Busana Kampus" />

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
              <h2 className="text-lg font-semibold text-[#212529]">Buat Akun Baru</h2>
              <p className="text-sm text-[#6C757D] mt-1">Daftar untuk mulai meminjam perlengkapan.</p>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold text-[#212529] mb-1.5 uppercase tracking-wide">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                required
                placeholder="Masukkan nama lengkap"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#212529] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2F3A4A] focus:ring-1 focus:ring-[#2F3A4A] transition-colors duration-150"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#212529] mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="nama@gmail.com"
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
                  placeholder="Buat password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#212529] mb-1.5 uppercase tracking-wide">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Ulangi password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#212529] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2F3A4A] focus:ring-1 focus:ring-[#2F3A4A] transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6C757D] hover:text-[#212529] focus:outline-none"
                  aria-label="Lihat konfirmasi password"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={() => setAgree((prev) => !prev)}
                required
                className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#2F3A4A] focus:ring-[#2F3A4A] focus:ring-offset-0 cursor-pointer accent-[#2F3A4A]"
              />
              <span className="text-xs text-[#6C757D]">
                Saya menyetujui{" "}
                <Link href="#" className="font-semibold text-[#2F3A4A] hover:underline">Ketentuan Penggunaan</Link>{" "}
                dan{" "}
                <Link href="#" className="font-semibold text-[#2F3A4A] hover:underline">Kebijakan Peminjaman</Link>
              </span>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#2F3A4A] hover:bg-[#242D3A] active:bg-[#1E2530] text-white text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center tracking-wider uppercase"
              >
                DAFTAR
              </button>
            </div>

            <div className="text-center pt-3 text-xs text-[#6C757D]">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="font-semibold text-[#2F3A4A] hover:underline ml-1">
                Masuk
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer
        variant="auth"
        copyright="© 2026 RentWear Services."
        links={[
          { label: "Ketentuan Penggunaan", href: "#" },
          { label: "Kebijakan Peminjaman", href: "#" },
          { label: "Bantuan", href: "#" },
        ]}
      />
    </div>
  );
}