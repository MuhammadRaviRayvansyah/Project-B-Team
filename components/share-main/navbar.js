"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getUserProfile, clearToken } from "@/lib/token";
import { useUser } from "@/components/UserContexts";
import EditProfile from "@/components/global/setting";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const activeUser = user || getUserProfile();
  const role = activeUser?.role?.toLowerCase() || "";
  const isAdmin = role === "admin";
  const isUser = Boolean(activeUser && !isAdmin);

  let navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Barang", path: "/barang" },
  ];

  if (isUser) {
    navLinks.push(
      { name: "Peminjaman", path: "/peminjaman" },
      { name: "Riwayat", path: "/riwayat" },
    );
  }

  navLinks.push({ name: "Review", path: "/review" });

  if (isAdmin) {
    navLinks.push({ name: "Panel Admin", path: "/dashboard" });
  }

  // Deteksi nama pengguna dari berbagai kemungkinan properti
  const displayName =
    activeUser?.nama ||
    activeUser?.nama_user ||
    activeUser?.name ||
    activeUser?.username ||
    activeUser?.email?.split("@")[0] ||
    "Pengguna";

  return (
    <>
      {/* Outer Wrapper Sticky & Padding Melayang */}
      <header className="sticky top-0 z-50 w-full pt-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Kontainer Kapsul Navbar Keseluruhan (Seperti Gambar Contoh) */}
          <nav className="relative w-full rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/15 px-6 py-3 shadow-2xl shadow-black/40 flex items-center justify-between transition-all duration-300">
            {/* 1. Logo Brand (Sisi Kiri) */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-full  from-amber-400 to-amber-600 flex items-center justify-center p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Logo PEPAC"
                  width={63}
                  height={63}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-wider text-white flex items-center gap-1.5 leading-none">
                  PEPAC
                </h1>
              </div>
            </Link>

            {/* 2. Menu Navigasi Tengah (dengan Hover Pill Background) */}
            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                        : "text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* 3. Tombol Aksi / Auth (Sisi Kanan) */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {activeUser ? (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all shadow-md active:scale-95 cursor-pointer group"
                  title="Buka Pengaturan Profil"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold max-w-[120px] truncate text-slate-100 group-hover:text-amber-400 transition-colors">
                    {displayName}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-amber-400 group-hover:rotate-45 transition-transform">
                    settings
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full text-xs font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  Masuk / Daftar
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </nav>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 rounded-2xl bg-slate-900/95 border border-white/15 backdrop-blur-xl px-6 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-amber-400 text-slate-950 font-extrabold shadow-md"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-white/10">
                {activeUser ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsEditProfileOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-bold shadow-md cursor-pointer hover:border-amber-400/50"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">
                      {displayName} (Pengaturan Profil)
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold text-center shadow-md hover:bg-amber-300"
                  >
                    Masuk / Daftar
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {isEditProfileOpen && (
        <EditProfile onClose={() => setIsEditProfileOpen(false)} />
      )}
    </>
  );
}
