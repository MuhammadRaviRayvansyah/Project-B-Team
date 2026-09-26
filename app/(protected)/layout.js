"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function ProtectedLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f7f9ff] overflow-hidden w-full relative">
      {/* Sidebar menerima props isOpen */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 w-full">
        {/* Mobile Topbar agar sidebar bisa dibuka di layar kecil */}
        <header className="lg:hidden h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              title="Buka Menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">RentWear Admin</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wider">
            Admin Panel
          </span>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Overlay Gelap saat Sidebar Terbuka (Hanya di Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-[40] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}