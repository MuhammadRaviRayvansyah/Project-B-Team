"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Manajemen Barang", path: "/manajemen-barang", icon: "inventory_2" },
    { name: "Rating / Review", path: "/manajemen-review", icon: "star" },
    { name: "Manajemen Peminjaman", path: "/manajemen-peminjaman", icon: "assignment" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-900 text-3xl">checkroom</span>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">RentWear</h1>
            <p className="text-[10px] text-slate-500 font-medium leading-none">Admin Panel</p>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              pathname === item.path
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}