"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBarang, getReview, api } from "@/lib/api";
import { getUserProfile } from "@/lib/token";
import { useUser } from "@/components/UserContexts";
import Header from "@/components/share-main/header";
import RatingStars from "@/components/RatingStars";

export default function ReviewPage() {
  const { user } = useUser();
  const activeUser = user || getUserProfile();
  const currentUserId = activeUser?.id_user || activeUser?.id;

  const [barangList, setBarangList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");

  const fetchData = async () => {
    try {
      const [barRes, revRes] = await Promise.all([getBarang(), getReview()]);
      setBarangList(Array.isArray(barRes) ? barRes : []);
      setReviewList(Array.isArray(revRes) ? revRes : []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!activeUser || !currentUserId) {
      setErrorMsg("Anda harus masuk (login) terlebih dahulu untuk mengirimkan ulasan.");
      return;
    }

    if (!selectedId) {
      setErrorMsg("Silakan pilih barang yang ingin Anda ulas.");
      return;
    }

    if (!komentar.trim()) {
      setErrorMsg("Isi ulasan atau komentar tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);

    const today = new Date().toISOString().split("T")[0];
    const payload = {
      id_user: Number(currentUserId),
      id_barang: Number(selectedId),
      rating: Number(rating),
      komentar: komentar.trim(),
      tanggal_review: today,
    };

    try {
      await api.post("/review", payload);
      setSuccessMsg("Ulasan Anda berhasil dikirim! Terima kasih atas penilaian Anda.");
      setKomentar("");
      setRating(5);
      setSelectedId("");
      fetchData();
    } catch (error) {
      setErrorMsg(error.message || "Gagal mengirim ulasan. Silakan coba beberapa saat lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNamaBarang = (idBarang) => {
    const barang = barangList.find(
      (b) => String(b.id_barang || b.id) === String(idBarang),
    );
    return barang
      ? barang.nama_barang || barang.nama
      : "Barang Tidak Ditemukan";
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <Header
          category="Review Barang"
          title="Review & Penilaian"
          description="Berikan ulasan untuk barang yang pernah Anda gunakan dan pantau testimoni dari pengguna lain."
        />

        {isLoading ? (
          <div className="text-center py-20 font-medium text-slate-500">
            <div className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
              <span>Memuat data ulasan...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Form Ulasan */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Tulis Ulasan Baru
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeUser ? `Mengulas sebagai ${activeUser.nama || activeUser.nama_user}` : "Silakan login untuk mengirim ulasan"}
                  </p>
                </div>
              </div>

              {!activeUser ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">lock</span>
                  <p className="text-sm font-semibold text-slate-700">Login Diperlukan</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Untuk menjamin keaslian testimoni, hanya pengguna terdaftar yang dapat memberikan ulasan pakaian acara.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">login</span>
                    Masuk ke Akun Anda
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                        Pilih Barang
                      </label>
                      <select
                        value={selectedId}
                        onChange={(e) => {
                          setSelectedId(e.target.value);
                          setErrorMsg("");
                        }}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 cursor-pointer"
                      >
                        <option value="">-- Silakan Pilih Barang --</option>
                        {barangList.map((item) => (
                          <option
                            key={item.id_barang || item.id}
                            value={item.id_barang || item.id}
                          >
                            {item.nama_barang || item.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                        Bintang Penilaian
                      </label>
                      <div className="flex gap-3 sm:gap-4 items-center h-[46px] px-4 bg-slate-50 border border-slate-200 rounded-xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <label
                            key={star}
                            className="flex items-center gap-1 cursor-pointer select-none"
                          >
                            <input
                              type="radio"
                              name="rating"
                              value={star}
                              checked={rating === star}
                              onChange={() => setRating(star)}
                              className="w-3.5 h-3.5 text-amber-500 focus:ring-amber-400"
                            />
                            <span className="text-xs font-bold text-slate-700">
                              {star}
                            </span>
                            <span className="material-symbols-outlined text-[16px] text-amber-400">
                              star
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                      Komentar / Pengalaman Anda
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={komentar}
                      onChange={(e) => setKomentar(e.target.value)}
                      placeholder="Ceritakan pengalaman Anda mengenai kualitas bahan, ukuran, dan kenyamanan pakaian..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <span>Kirim Ulasan</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Daftar Ulasan */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Daftar Ulasan Pengguna
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Testimoni dan review dari mahasiswa peminjam
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                  {reviewList.length} Ulasan
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4 font-bold">Barang</th>
                      <th className="px-5 py-4 font-bold">Pereview & Tanggal</th>
                      <th className="px-5 py-4 font-bold">Rating</th>
                      <th className="px-5 py-4 font-bold w-1/2">Komentar</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                    {reviewList.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-16 text-slate-500"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-slate-300">rate_review</span>
                            <p className="font-semibold text-slate-700">Belum ada ulasan yang terdaftar.</p>
                            <p className="text-xs text-slate-400">Jadilah yang pertama menulis ulasan untuk pakaian acara di atas!</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      reviewList
                        .slice()
                        .reverse()
                        .map((rev, index) => (
                          <tr
                            key={rev.id_review || rev.id || index}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-5 py-4 font-bold text-slate-900">
                              {getNamaBarang(rev.id_barang)}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="text-slate-900 font-semibold">
                                  {rev.nama_user || rev.nama || `User #${rev.id_user}`}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">
                                  {rev.tanggal_review || "Baru saja"}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <RatingStars rating={rev.rating} size={15} />
                                <span className="text-xs font-black text-slate-700">
                                  {rev.rating}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-slate-600 text-xs leading-relaxed">
                              {rev.komentar || rev.ulasan || "-"}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
