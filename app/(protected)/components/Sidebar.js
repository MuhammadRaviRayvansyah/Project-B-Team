"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Menu yang sudah jadi (bisa diklik)
const menuAktif = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  {
    label: "Manajemen Peminjaman",
    href: "/admin/manajemen-peminjaman",
    icon: "assignment_turned_in",
  },
];

// Menu modul lain punya tim (ditampilkan tapi non-aktif dulu)
const menuSegera = [
  { label: "Manajemen Barang", icon: "inventory_2" },
  { label: "Manajemen Pengguna", icon: "group" },
  { label: "Laporan", icon: "summarize" },
];

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r border-slate-200">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
          <Image
            src="/logo.jpeg"
            alt="RentWear Logo"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-[#181c20] tracking-tight">
            RentWear
          </span>
          <span className="text-[11px] tracking-[0.02em] font-semibold text-[#44474c]">
            Admin Panel
          </span>
        </div>
      </div>

      {onNavigate && (
        <button
          type="button"
          onClick={onNavigate}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </p>

        {menuAktif.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        <p className="px-2.5 mt-5 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Modul Lain
        </p>

        {menuSegera.map((item) => (
          <div
            key={item.label}
            title="Sedang dikerjakan tim lain"
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 cursor-not-allowed"
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </span>
            <span className="text-[9px] font-semibold uppercase bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">
              Segera
            </span>
          </div>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div className="p-3 border-t border-slate-200 shrink-0 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">
            storefront
          </span>
          Lihat Situs Utama
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </Link>
      </div>
    </aside>
  );
}
