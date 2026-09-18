"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed flex">
      {/* Sidebar - versi desktop (selalu tampil) */}
      <div className="hidden md:block shrink-0">
        <div className="fixed inset-y-0 left-0 w-64">
          <Sidebar />
        </div>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        <div className="md:hidden p-4 bg-white border-b border-slate-200 flex items-center">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        </div>
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
