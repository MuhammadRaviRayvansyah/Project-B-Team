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
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
      <label className="block text-sm font-bold text-slate-900 mb-3">
        Pilih Barang yang Ingin Direview
      </label>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 mb-6"
      >
        <option value="">-- Silakan Pilih Barang --</option>
        {barangList.map((item) => (
          <option key={item.id_barang || item.id} value={item.id_barang || item.id}>
            {item.nama_barang || item.nama}
          </option>
        ))}
      </select>

      {selectedId ? (
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Daftar Ulasan Barang Ini
          </h3>
          <ReviewList 
            id_barang={selectedId} 
            ulasan={filteredReviews} 
            onAddUlasan={createReviewAction} 
          />
        </div>
      ) : (
        <div className="text-center py-10 border-t border-slate-100 flex flex-col items-center">
          <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">inventory_2</span>
          <p className="text-sm text-slate-500">Pilih barang di atas untuk melihat atau menulis ulasan.</p>
        </div>
      )}
    </div>
  );
}