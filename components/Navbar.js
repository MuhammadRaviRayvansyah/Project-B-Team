"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Barang", path: "/barang" },
    { name: "Peminjaman", path: "/peminjaman" },
    { name: "Riwayat", path: "/riwayat" },
    { name: "Review", path: "/review" },
  ];

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
                  pathname === link.path
                    ? "text-slate-900 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-xl">person</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}