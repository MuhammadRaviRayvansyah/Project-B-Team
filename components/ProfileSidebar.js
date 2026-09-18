"use client";

import Link from "next/link";
import { useUser } from "@/components/UserContexts";

const menuUtama = [
  { label: "Profil Saya", icon: "account_circle", type: "edit" },
  { label: "Peminjaman Saya", icon: "assignment", href: "/peminjaman" },
  { label: "Riwayat", icon: "history", href: "/riwayat" },
];

export default function ProfileSidebar({ open, onClose, onEditProfile }) {
  const { user } = useUser();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-slate-200 shadow-xl z-[70] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header user */}
        <div className="p-5 border-b border-slate-200 flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#192434] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[24px]">person</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">{user.nama}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 shrink-0"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Akun
          </p>

          {menuUtama.map((item) =>
            item.type === "edit" ? (
              <button
                key={item.label}
                type="button"
                onClick={onEditProfile}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-all text-left"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 shrink-0">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-rose-600 hover:bg-rose-50 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}