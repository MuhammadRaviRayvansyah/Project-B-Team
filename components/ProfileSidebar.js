"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useUser } from "@/components/UserContexts";

export default function ProfileSidebar() {
  const { user, setUser } = useUser();

  useEffect(() => {
    if (!user) {
      try {
        const savedUser = localStorage.getItem("user_profile");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, [user, setUser]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user_profile");
    document.cookie = "user_profile=; path=/; max-age=0;";
    document.cookie = "session_token=; path=/; max-age=0;";
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-500">Anda belum login</span>
        <Link
          href="/login"
          className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-slate-100 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
        <span className="text-slate-600 font-bold text-sm">
          {user.nama ? user.nama.charAt(0).toUpperCase() : (user.nama_user ? user.nama_user.charAt(0).toUpperCase() : "U")}
        </span>
      </div>
      
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 text-sm truncate">
          {user?.nama || user?.nama_user || "Pengguna"}
        </p>
        <p className="text-[10px] text-slate-500 truncate">
          {user?.email || "User Aktif"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        title="Logout"
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
      </button>
    </div>
  );
}