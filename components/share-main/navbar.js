"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import { getUserProfile, clearToken } from "@/lib/token";
import { useUser } from "@/components/UserContexts";

export default function Navbar() {
  const pathname = usePathname();
  const { setUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = getUserProfile();

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Barang", path: "/barang" },
    { name: "Peminjaman", path: "/peminjaman" },
    { name: "Riwayat", path: "/riwayat" },
    { name: "Review", path: "/review" },
  ];

  const handleLogout = () => {
    clearToken();
    setUser(null);
    redirect("/login");
  };

  return (
    <nav className="bg-amber-400 sticky top-0 z-50 text-slate-900 shadow-md shadow-amber-900/10 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Image 
                src="/images/logo.jpeg" 
                alt="Logo PEPAC" 
                width={63}
                height={63}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none text-white">
                PEPAC
              </h1>
              <p className="text-[10px] text-white/80 font-medium tracking-wide mt-0.5">
                Peminjaman Pakaian Acara
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-black/10">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md font-bold"
                      : "text-slate-900 hover:text-black hover:bg-black/10"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Action */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Keluar</span>
              </button>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Masuk / Daftar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-900 hover:bg-black/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-amber-400 border-t border-black/10 px-6 py-4 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  isActive 
                    ? "bg-slate-900 text-white font-bold" 
                    : "text-slate-900 hover:bg-black/10"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-2 border-t border-black/10">
            {user ? (
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Keluar</span>
              </button>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="block w-full px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold text-center shadow-md"
              >
                Masuk / Daftar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}