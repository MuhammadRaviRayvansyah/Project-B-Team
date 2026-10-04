"use client";

import { useState, useEffect } from "react";
import { Search, X, RotateCcw, Filter } from "lucide-react";

export default function ItemFilter({
  searchQuery,
  onSearchChange,
  selectedStock,
  onStockChange,
  selectedSort,
  onSortChange,
  onReset,
}) {
  // State sementara sebelum tombol Filter ditekan
  const [tempSearch, setTempSearch] = useState(searchQuery || "");
  const [tempStock, setTempStock] = useState(selectedStock || "Semua");
  const [tempSort, setTempSort] = useState(selectedSort || "Semua");

  // Sinkronisasi state lokal jika ada perubahan dari luar (misal saat reset)
  useEffect(() => {
    setTempSearch(searchQuery || "");
    setTempStock(selectedStock || "Semua");
    setTempSort(selectedSort || "Semua");
  }, [searchQuery, selectedStock, selectedSort]);

  // Handler saat tombol Filter ditekan
  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();
    onSearchChange(tempSearch);
    onStockChange(tempStock);
    onSortChange(tempSort);
  };

  // Handler saat tombol Reset ditekan
  const handleReset = () => {
    setTempSearch("");
    setTempStock("Semua");
    setTempSort("Semua");
    if (onReset) onReset();
  };

  return (
    <form
      onSubmit={handleApplyFilter}
      className="w-full bg-[#091823]/80 border border-slate-800/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl"
    >
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          placeholder="Cari berdasarkan nama pakaian atau perlengkapan..."
          className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 pl-10 pr-10 py-3 rounded-xl text-xs sm:text-sm font-medium border border-slate-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
        />
        {tempSearch && (
          <button
            type="button"
            onClick={() => setTempSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Options & Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        {/* Ketersediaan Stok */}
        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Ketersediaan Stok
          </label>
          <select
            value={tempStock}
            onChange={(e) => setTempStock(e.target.value)}
            className="w-full bg-slate-900/90 text-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
          >
            <option value="Semua" className="bg-slate-900 text-slate-200">
              Semua Status
            </option>
            <option value="tersedia" className="bg-slate-900 text-slate-200">
              Hanya Tersedia (Stok &gt; 0)
            </option>
            <option value="habis" className="bg-slate-900 text-slate-200">
              Stok Habis (Stok = 0)
            </option>
          </select>
        </div>

        {/* Urutan Harga */}
        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Urutan Harga
          </label>
          <select
            value={tempSort}
            onChange={(e) => setTempSort(e.target.value)}
            className="w-full bg-slate-900/90 text-slate-200 font-semibold px-3 py-2.5 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
          >
            <option value="Semua" className="bg-slate-900 text-slate-200">
              Urutan Default
            </option>
            <option value="termurah" className="bg-slate-900 text-slate-200">
              Harga: Termurah
            </option>
            <option value="termahal" className="bg-slate-900 text-slate-200">
              Harga: Termahal
            </option>
          </select>
        </div>

        {/* Action Buttons (Filter & Reset) */}
        <div className="sm:col-span-4 flex items-center gap-2">
          {/* Tombol Filter */}
          <button
            type="submit"
            className="flex-1 h-[38px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 fill-slate-950" />
            <span>Filter</span>
          </button>

          {/* Tombol Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 h-[38px] bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-bold rounded-xl text-xs border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </form>
  );
}