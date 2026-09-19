"use client";

export default function Topbar({ title = "Dashboard", onOpenSidebar }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-3">
        {/* Tombol buka sidebar - khusus mobile */}
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
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 relative"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#192434] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">
              person
            </span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-[#181c20]">
              Admin RentWear
            </span>
            <span className="text-[11px] text-slate-500">Sarpras</span>
          </div>
        </div>
      </div>
    </header>
  );
}
