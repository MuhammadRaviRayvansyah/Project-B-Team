"use client";

export default function ItemFilter({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  selectedSize, 
  onSizeChange,
  selectedStock,
  onStockChange,
  selectedSort,
  onSortChange,
  categoryOptions = [],
  sizeOptions = [],
  onReset
}) {
  const hasActiveFilter = 
    Boolean(searchQuery) || 
    (selectedCategory && selectedCategory !== "Semua") || 
    (selectedSize && selectedSize !== "Semua") ||
    (selectedStock && selectedStock !== "Semua") ||
    (selectedSort && selectedSort !== "Semua");

  return (
    <div className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
      {/* Search Input */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari berdasarkan nama pakaian atau perlengkapan..."
          className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 pl-11 pr-10 py-3 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <span className="material-symbols-outlined text-[18px]">cancel</span>
          </button>
        )}
      </div>

      {/* Filter Row: Kategori, Ukuran, Ketersediaan Stok, Urutan Harga */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Kategori */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Kategori
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            {categoryOptions.map((cat, idx) => {
              const val = typeof cat === "object" ? (cat.id_kategori || cat.id) : cat;
              const label = typeof cat === "object" ? (cat.nama_kategori || cat.nama) : cat;
              return (
                <option key={idx} value={val}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Ukuran */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Ukuran
          </label>
          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
          >
            <option value="Semua">Semua Ukuran</option>
            {sizeOptions.map((sz, idx) => (
              <option key={idx} value={sz}>
                Ukuran: {sz}
              </option>
            ))}
          </select>
        </div>

        {/* Ketersediaan Stok */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Ketersediaan Stok
          </label>
          <select
            value={selectedStock}
            onChange={(e) => onStockChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="tersedia">Hanya Tersedia (Stok &gt; 0)</option>
            <option value="habis">Stok Habis (Stok = 0)</option>
          </select>
        </div>

        {/* Urutan Harga Sewa */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Urutan Harga
          </label>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
          >
            <option value="Semua">Urutan Default</option>
            <option value="termurah">Harga: Termurah</option>
            <option value="termahal">Harga: Termahal</option>
          </select>
        </div>
      </div>

      {/* Reset Filter Button if any filter active */}
      {hasActiveFilter && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
}