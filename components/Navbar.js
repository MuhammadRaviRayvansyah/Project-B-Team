"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e3e8]">
      <div className="h-16 max-w-300 mx-auto px-4 md:px-8 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/logo.jpeg" // Sesuaikan path lokasi file gambar di folder public/
              alt="RentWear Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-[14px]  font-semibold text-[#181c20] tracking-tight">
              RentWear
            </span>

            <span className="text-[11px]  tracking-[0.02em] font-semibold text-[#44474c] mt-1">
              Sistem Peminjaman 
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4">

            <Link
              href="/"
              className={`py-2 text-[14px] ${
                pathname === "/"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/barang"
              className={`py-2 text-[14px] ${
                pathname === "/barang"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Barang
            </Link>

            <Link
              href="/peminjaman"
              className={`py-2 text-[14px] ${
                pathname === "/peminjaman"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Peminjaman
            </Link>

            <Link
              href="/riwayat"
              className={`py-2 text-[14px] ${
                pathname === "/riwayat"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Riwayat
            </Link>

            <div className="h-4 w-px bg-[#e0e3e8] mx-1 hidden sm:block" />

            <Link
              href="/login"
              className="text-[14px] text-[#44474c] hover:text-[#ba1a1a] transition-colors py-2"
            >
              Logout
            </Link>

          </nav>

          <div className="w-8 h-8 rounded-full bg-[#192434] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">
              person
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}