"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";
import EditProfile from "@/components/EditProfile";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Barang", path: "/barang" },
    { name: "Peminjaman", path: "/peminjaman" },
    { name: "Riwayat", path: "/riwayat" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e3e8]">
      <div className="h-16 max-w-300 mx-auto px-4 md:px-8 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/logo.jpeg"
              alt="RentWear Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
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
          </nav>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-full bg-[#192434] flex items-center justify-center shrink-0"
            aria-label="Menu profil"
          >
            <span className="material-symbols-outlined text-white text-[18px]">
              person
            </span>
          </button>
        </div>

        <div className="flex md:hidden items-center gap-[1rem]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 rounded-full bg-[#192434] flex items-center justify-center shrink-0"
            aria-label="Menu profil"
          >
            <span className="material-symbols-outlined text-white text-[18px]">
              person
            </span>
          </button>
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
        </div>
      )}

      <ProfileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onEditProfile={() => {
          setEditOpen(true);
          setSidebarOpen(false);
        }}
      />
      {editOpen && <EditProfile onClose={() => setEditOpen(false)} />}
    </header>
  );
}