"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Barang", path: "/barang" },
    { name: "Peminjaman", path: "/peminjaman" },
    { name: "Riwayat", path: "/riwayat" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e3e8]">
      <div className="h-16 max-w-[1200px] mx-auto px-[1rem] md:px-[2rem] flex items-center justify-between">
        
        <div className="flex items-center gap-[0.75rem]">
          <div className="w-8 h-8 rounded-lg bg-[#2f3a4a] flex items-center justify-center text-white text-[16px] font-semibold">
            R
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[16px] leading-[24px] font-semibold text-[#181c20] tracking-tight">
              RentWear
            </span>
            <span className="text-[11px] leading-[14px] tracking-[0.02em] font-semibold text-[#44474c] mt-[0.25rem]">
              Sistem Peminjaman Kampus
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-[1.5rem]">
          <nav className="flex items-center gap-[1rem]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`py-[0.5rem] text-[14px] ${
                  pathname === link.path
                    ? "text-[#2f3a4a] font-semibold"
                    : "text-[#44474c] hover:text-[#181c20] transition-colors"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-[#e0e3e8] mx-[0.25rem]" />
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

        <div className="flex md:hidden items-center gap-[1rem]">
          <div className="w-8 h-8 rounded-full bg-[#192434] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">
              person
            </span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#181c20] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e0e3e8] px-[1rem] py-[1rem] flex flex-col gap-[0.5rem] shadow-lg absolute w-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`p-[0.75rem] text-[14px] rounded-lg ${
                pathname === link.path
                  ? "bg-[#ebeef3] text-[#2f3a4a] font-semibold"
                  : "text-[#44474c] hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px w-full bg-[#e0e3e8] my-[0.25rem]" />
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="p-[0.75rem] text-[14px] text-[#44474c] hover:text-[#ba1a1a]"
          >
            Logout
          </Link>
        </div>
      )}
    </header>
  );
}