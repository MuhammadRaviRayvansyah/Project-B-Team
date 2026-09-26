"use client";

import { useState, useEffect } from "react";
import { getReview, getBarang, getUsers, api } from "@/lib/api";
import RatingStars from "@/components/review/rating-stars";

export default function ManajemenReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [revRes, barRes, userRes] = await Promise.all([
        getReview(),
        getBarang(),
        getUsers(),
      ]);
      setReviews(Array.isArray(revRes) ? revRes.slice().reverse() : []);
      setBarangList(Array.isArray(barRes) ? barRes : []);

      const uMap = {};
      (Array.isArray(userRes) ? userRes : []).forEach((u) => {
        const uid = u.id_user || u.id;
        if (uid) uMap[uid] = u.nama || u.nama_user || u.name;
      });
      setUserMap(uMap);
    } catch (error) {
      console.error("Gagal memuat ulasan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus ulasan ini secara permanen?")) return;
    try {
      await api.delete(`/review/${id}`);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus ulasan");
    }
  };

  // Helper untuk mendapatkan detail nama & gambar barang
  const getBarangInfo = (rev) => {
    const targetId = String(
      rev.id_barang ||
        rev.barang_id ||
        rev.barang?.id_barang ||
        rev.barang?.id ||
        "",
    );

    const barang = barangList.find(
      (b) => String(b.id_barang || b.id) === targetId,
    );

    return {
      nama:
        rev.barang?.nama_barang ||
        rev.nama_barang ||
        barang?.nama_barang ||
        barang?.nama ||
        "Barang Tidak Ditemukan",
      gambar:
        rev.barang?.gambar ||
        rev.gambar_barang ||
        rev.gambar ||
        barang?.gambar ||
        barang?.img ||
        "",
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Rating & Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau dan moderasi ulasan, testimoni, dan penilaian dari pengguna
            terhadap pakaian acara.
          </p>
        </div>
      </div>

      {/* Tabel Card Standar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-xl">
              star
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Ulasan Masuk
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Total: {reviews.length} Ulasan
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4 font-bold">Barang</th>
                <th className="px-5 py-4 font-bold">Pereview & Tanggal</th>
                <th className="px-5 py-4 font-bold">Rating</th>
                <th className="px-5 py-4 font-bold w-1/3">Komentar</th>
                <th className="px-5 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                      <span>Memuat data ulasan...</span>
                    </div>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-slate-300">
                        rate_review
                      </span>
                      <p className="font-semibold text-slate-700">
                        Belum ada ulasan dari pengguna.
                      </p>
                      <p className="text-xs text-slate-400">
                        Ulasan akan muncul secara otomatis ketika peminjam
                        memberikan review.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => {
                  const revId = rev.id_review || rev.id;
                  const barangInfo = getBarangInfo(rev);
                  const revNama =
                    rev.nama_user ||
                    rev.nama ||
                    userMap[rev.id_user] ||
                    `User #${rev.id_user}`;
                  const revTanggal =
                    rev.tanggal_review || rev.tanggal || rev.created_at || "-";

                  return (
                    <tr
                      key={revId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          {barangInfo.gambar ? (
                            <img
                              src={barangInfo.gambar}
                              alt={barangInfo.nama}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-slate-400 text-lg">
                                inventory_2
                              </span>
                            </div>
                          )}
                          <span className="line-clamp-2 max-w-[220px]">
                            {barangInfo.nama}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold">
                            {revNama}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {revTanggal}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <RatingStars rating={rev.rating} size={15} />
                          <span className="text-xs font-black text-slate-800">
                            {rev.rating}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs leading-relaxed">
                        <p className="line-clamp-2">
                          {rev.komentar || rev.ulasan || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(revId)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                          title="Hapus Ulasan"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
