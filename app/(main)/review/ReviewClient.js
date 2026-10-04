"use client";

import { useState } from "react";
import { createReviewAction } from "@/app/actions/review";
import ReviewList from "@/components/review/review-list";

export default function ReviewClient({ barangList, reviewList }) {
  const [selectedId, setSelectedId] = useState("");

  const filteredReviews = reviewList.filter(
    (r) => String(r.id_barang) === String(selectedId)
  );

  return (
    <div className="bg-[#091823]/80 border border-slate-800/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-xl">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Pilih Barang yang Ingin Direview
      </label>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full bg-slate-900/90 text-slate-200 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all mb-6 cursor-pointer"
      >
        <option value="" className="bg-[#091823] text-slate-400">
          -- Silakan Pilih Barang --
        </option>
        {barangList.map((item) => (
          <option
            key={item.id_barang || item.id}
            value={item.id_barang || item.id}
            className="bg-[#091823] text-slate-200 py-1"
          >
            {item.nama_barang || item.nama}
          </option>
        ))}
      </select>

      {selectedId ? (
        <div className="border-t border-slate-800/80 pt-6">
          <h3 className="text-sm font-bold text-slate-200 mb-4">
            Daftar Ulasan Barang Ini
          </h3>
          <ReviewList
            id_barang={selectedId}
            ulasan={filteredReviews}
            onAddUlasan={createReviewAction}
          />
        </div>
      ) : (
        <div className="text-center py-10 border-t border-slate-800/80 flex flex-col items-center">
          <span className="material-symbols-outlined text-slate-600 text-4xl mb-2">
            inventory_2
          </span>
          <p className="text-xs text-slate-400">
            Pilih barang di atas untuk melihat atau menulis ulasan.
          </p>
        </div>
      )}
    </div>
  );
}