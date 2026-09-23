"use client";

import { useState, useEffect } from "react";
import { getReview, getBarang, api } from "@/lib/api";
import Hero from "@/components/Hero";
import RatingStars from "@/components/RatingStars";

export default function ManajemenReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [revRes, barRes] = await Promise.all([getReview(), getBarang()]);
      setReviews(Array.isArray(revRes) ? revRes : []);
      setBarangList(Array.isArray(barRes) ? barRes : []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus ulasan ini?")) return;
    try {
      await api.delete(`/review/${id}`);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus ulasan");
    }
  };

  const getNamaBarang = (idBarang) => {
    const barang = barangList.find(b => String(b.id_barang || b.id) === String(idBarang));
    return barang ? (barang.nama_barang || barang.nama) : "Barang Tidak Ditemukan";
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12 px-4 sm:px-6">
      <Hero
        category="ADMINISTRASI"
        title="Monitoring Review"
        description="Pantau dan kelola ulasan yang diberikan oleh pengguna untuk setiap barang."
      />

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-bold">ID Rev</th>
                <th className="px-6 py-4 font-bold">Barang</th>
                <th className="px-6 py-4 font-bold">Pereview & Tanggal</th>
                <th className="px-6 py-4 font-bold">Rating</th>
                <th className="px-6 py-4 font-bold w-1/3">Komentar</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-10">Memuat data...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Belum ada ulasan</td></tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id_review || rev.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{rev.id_review || rev.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{getNamaBarang(rev.id_barang)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-medium">{rev.nama_user || rev.nama || `User ${rev.id_user}`}</span>
                        <span className="text-[10px] text-slate-400">{rev.tanggal_review || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <RatingStars rating={rev.rating} size={14} />
                        <span className="text-xs font-bold text-slate-700 ml-1">{rev.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs leading-relaxed">
                      {rev.komentar || rev.ulasan || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(rev.id_review || rev.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Ulasan"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}