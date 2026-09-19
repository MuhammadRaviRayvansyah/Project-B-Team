"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Judul halaman otomatis berdasarkan path aktif
function getTitleFromPath(pathname) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/manajemen-peminjaman"))
    return "Manajemen Peminjaman";
  return "Admin";
}

export default function ProtectedLayout({ children }) {
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

      {/* Sidebar - versi mobile (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        <Topbar
          title={getTitleFromPath(pathname)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
