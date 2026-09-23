"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-900 text-3xl">checkroom</span>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">RentWear</h1>
                <p className="text-[10px] text-slate-500 font-medium leading-none">Sistem Peminjaman Kampus</p>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.path ? "text-slate-900 font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Logout</span>
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
                Masuk
              </Link>
            )}
          </div>
            
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.path ? "bg-slate-50 text-slate-900 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <button 
              onClick={handleLogout}
              className="w-full px-3 py-2 mt-2 rounded-md bg-rose-50 text-rose-600 text-base font-medium text-center flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Logout</span>
            </button>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 mt-2 rounded-md bg-slate-900 text-white text-base font-medium text-center">
              Masuk
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}