"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e3e8]">
      <div className="h-16 max-w-[1200px] mx-auto px-[1rem] md:px-[2rem] flex items-center justify-between">
        
        <div className="flex items-center gap-[0.75rem]">
          <div className="w-8 h-8 rounded-lg bg-[#2f3a4a] flex items-center justify-center text-white text-[16px] font-semibold">
            R
          </div>

          <div className="flex flex-col">
            <span className="text-[16px] leading-[24px] font-semibold text-[#181c20] tracking-tight">
              RentWear
            </span>

            <span className="text-[11px] leading-[14px] tracking-[0.02em] font-semibold text-[#44474c] mt-[0.25rem]">
              Sistem Peminjaman Kampus
            </span>
          </div>
        </div>

        <div className="flex items-center gap-[1.5rem]">
          <nav className="flex items-center gap-[1rem]">

            <Link
              href="/"
              className={`py-[0.5rem] text-[14px] ${
                pathname === "/"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/barang"
              className={`py-[0.5rem] text-[14px] ${
                pathname === "/barang"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Barang
            </Link>

            <Link
              href="/peminjaman"
              className={`py-[0.5rem] text-[14px] ${
                pathname === "/peminjaman"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Peminjaman
            </Link>

            <Link
              href="/riwayat"
              className={`py-[0.5rem] text-[14px] ${
                pathname === "/riwayat"
                  ? "text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:text-[#181c20] transition-colors"
              }`}
            >
              Riwayat
            </Link>

            <div className="h-4 w-px bg-[#e0e3e8] mx-[0.25rem] hidden sm:block" />

            <Link
              href="/login"
              className="text-[14px] text-[#44474c] hover:text-[#ba1a1a] transition-colors py-[0.5rem]"
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