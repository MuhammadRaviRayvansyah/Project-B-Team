"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileSidebar from "@/components/ProfileSidebar";
import Image from "next/image";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Manajemen Barang", path: "/manajemen-barang", icon: "inventory_2" },
    { name: "Manajemen Peminjaman", path: "/manajemen-peminjaman", icon: "assignment" },
    { name: "Rating / Review", path: "/manajemen-review", icon: "star" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[50] w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 text-[#1a2234]">
          <Image
            src="/images/logo.jpeg"
            alt="Logo PEPAC"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
          <span className="text-xl font-black tracking-tight">PEPAC</span>
        </div>
        {/* Tombol Tutup Sidebar (Hanya di Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="p-4 space-y-1.5 overflow-y-auto flex-1 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)} // Otomatis menutup sidebar saat menu diklik (di mobile)
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-[#1a2234] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#1a2234]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-slate-100">
        <ProfileSidebar />
      </div>
    </aside>
  );
}