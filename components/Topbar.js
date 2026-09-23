"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContexts";
import { clearToken } from "@/lib/token";

export default function Topbar({ title = "Dashboard", onOpenSidebar }) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const namaAdmin = user?.nama || "Admin RentWear";
  const roleAdmin = user?.role === "admin" ? "Sarpras" : "Staf";

  const handleLogout = () => {
    clearToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <h1 className="text-[15px] md:text-base font-semibold text-[#181c20]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          type="button"
          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors"
        >
          Logout
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#192434] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">
              person
            </span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-[#181c20] truncate max-w-[120px]">
              {namaAdmin}
            </span>
            <span className="text-[11px] text-slate-500">
              {roleAdmin}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}