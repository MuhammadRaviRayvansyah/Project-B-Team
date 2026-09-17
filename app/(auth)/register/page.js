"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleRegister = () => {
    console.log("Daftar submit — backend belum terhubung");
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
      {/* Header Form */}
      <div className="text-center mb-3.5">
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
          RentWear
        </h1>
        <p className="text-[11px] font-medium text-slate-500">
          Sistem Peminjaman Barang
        </p>

        <div className="mt-3 pt-2 border-t border-slate-100">
          <h2 className="text-xs font-semibold text-slate-900">
            Buat Akun Baru
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Daftar untuk mulai meminjam perlengkapan.
          </p>
        </div>
      </div>

      {/* Form Input */}
      <form
        className="space-y-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        {/* Nama Lengkap */}
        <div>
          <label
            htmlFor="fullname"
            className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            required
            placeholder="Masukkan nama lengkap"
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="nama@gmail.com"
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
          />
        </div>

        {/* Password */}
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
              placeholder="Buat password"
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

        {/* Konfirmasi Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-[10px] font-semibold text-slate-700 mb-1 uppercase tracking-wider"
          >
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Ulangi password"
              className="w-full px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
              aria-label="Lihat konfirmasi password"
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

        {/* Checkbox Syarat & Ketentuan */}
        <label className="flex items-start gap-1.5 cursor-pointer select-none pt-0.5">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={() => setAgree((prev) => !prev)}
            required
            className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0 cursor-pointer accent-slate-900"
          />
          <span className="text-[11px] text-slate-500 leading-tight">
            Saya menyetujui{" "}
            <Link href="#" className="font-semibold text-slate-900 hover:underline">
              Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="#" className="font-semibold text-slate-900 hover:underline">
              Kebijakan
            </Link>
          </span>
        </label>

        {/* Tombol Submit */}
        <div className="pt-1">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center tracking-wider uppercase shadow-xs"
          >
            DAFTAR
          </button>
        </div>

        {/* Link Ke Halaman Login */}
        <div className="text-center pt-1 text-[11px] text-slate-500">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 hover:underline ml-0.5"
          >
            Masuk
          </Link>
        </div>
      </form>
    </div>
  );
}