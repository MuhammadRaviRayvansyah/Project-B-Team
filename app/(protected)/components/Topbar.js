"use client";

import { useState, useEffect } from "react";
import { clearToken, getUserProfile } from "@/lib/token";

export default function Topbar({ onMenuClick }) {
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      const name = profile.nama || profile.name || profile.username || "Admin";
      setAdminName(name);
    }
  }, []);

  const handleLogout = () => {
    clearToken();
    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm shrink-0 w-full min-w-0">
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger menggunakan SVG asli agar selalu muncul 100% */}
        <button
          onClick={onMenuClick}
          className="block lg:hidden p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
          aria-label="Buka Menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="26" 
            height="26" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Dasbor Admin</h1>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{adminName}</span>
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
            Admin Aktif
          </span>
        </div>
        
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1a2234] text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
          {adminName.charAt(0).toUpperCase()}
        </div>
        
        <div className="w-px h-6 bg-slate-200 mx-0.5 sm:mx-1 shrink-0"></div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-rose-600 hover:bg-rose-50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm font-bold shrink-0"
          title="Keluar dari sistem"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}