import React from 'react';

export default function Hero({
  category = "KATALOG INVENTARIS",
  title = "Daftar Barang",
  description = "Pilih perlengkapan resmi, busana seremonial, dan atribut kampus yang tersedia untuk dipinjam secara terpusat dan terverifikasi.",
  showSearch = false,
  searchQuery = "",
  onSearchChange = () => {},
  onSearchSubmit = () => {}
}) {
  return (
    <div className="w-full bg-[#f1f4f9] sm:bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60">
      <span className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">
        {category}
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        {title}
      </h1>

      <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mb-6">
        {description}
      </p>

      {/* Kotak Pencarian Khusus di Hero Beranda */}
      {showSearch && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="flex flex-col sm:flex-row gap-2 bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-sm max-w-xl"
        >
          <div className="flex-1 flex items-center px-3 gap-2">
            <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari barang..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center"
          >
            Cari
          </button>
        </form>
      )}
    </div>
  );
}