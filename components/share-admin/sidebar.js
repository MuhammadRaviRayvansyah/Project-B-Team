"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContexts";
import { getUserProfile, clearToken } from "@/lib/token";
import EditProfile from "@/components/global/setting";

export default function ProfileSidebar() {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      try {
        const savedUser = getUserProfile();
        if (savedUser) setUser(savedUser);
      } catch (e) {}
    }
  }, [user, setUser]);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    document.cookie = "user_profile=; path=/; max-age=0;";
    document.cookie = "session_token=; path=/; max-age=0;";
    window.location.href = "/login";
  };

  const activeUser = user || getUserProfile();

  if (!activeUser) {
    return (
      <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-500">
          Anda belum login
        </span>
        <Link
          href="/login"
          className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  const displayName = activeUser?.nama || activeUser?.nama_user || "Pengguna";

  return (
    <>
      <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white">
        <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 border border-amber-300 font-bold text-sm shadow-sm">
          <span>{displayName.charAt(0).toUpperCase()}</span>
        </div>

        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <p className="font-semibold text-slate-900 text-sm truncate hover:text-amber-600 transition-colors">
            {displayName}
          </p>
          <p className="text-[10px] text-slate-500 truncate">
            {activeUser?.email || "User Aktif"}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          title="Edit Profil"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            manage_accounts
          </span>
        </button>

        <button
          onClick={handleLogout}
          title="Logout"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>

      {isEditing && <EditProfile onClose={() => setIsEditing(false)} />}
    </>
  );
}
