"use client";

import { useState } from "react";
import Link from "next/link";
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://hmif.if.unram.ac.id/api/v3"}/${process.env.NEXT_PUBLIC_PROJECT_ID || "pepac"}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "pk_pepac_95a8363fde15d4a6",
        },
        body: JSON.stringify({ nama, email, no_hp, password }),
      });

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
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9ff] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Daftar Akun Baru</h1>
        <p className="text-xs text-slate-500 mb-6">Lengkapi data diri Anda untuk mengakses sistem peminjaman.</p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              required
              placeholder="Masukkan nama lengkap"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Kampus</label>
            <input
              type="email"
              name="email"
              required
              placeholder="nama@student.unram.ac.id"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Handphone / WhatsApp</label>
            <input
              type="tel"
              name="no_hp"
              required
              placeholder="081234567890"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-3 rounded-xl transition-colors shadow-sm mt-2 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-slate-900 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}