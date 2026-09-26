"use client";

import { useState, useEffect } from "react";
import { getBarang, getReview, api } from "@/lib/api";
import { getUserProfile, getToken } from "@/lib/token";
import { useUser } from "@/components/UserContexts";
import Header from "@/components/share-main/header";
import RatingStars from "@/components/RatingStars";

export default function ReviewPage() {
  const { user } = useUser();
  const [barangList, setBarangList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");

  const fetchData = async () => {
    try {
      const [barRes, revRes] = await Promise.all([getBarang(), getReview()]);
      setBarangList(Array.isArray(barRes) ? barRes : []);
      setReviewList(Array.isArray(revRes) ? revRes : []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findUserId = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    if (obj.id_user) return obj.id_user;
    if (obj.id) return obj.id;
    if (obj.user_id) return obj.user_id;

    for (const key in obj) {
      if (typeof obj[key] === "object") {
        const found = findUserId(obj[key]);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedId) {
      setErrorMsg("Pilih barang terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    const currentUser = user || getUserProfile() || {};
    let tokenData = {};

    try {
      const token = getToken();
      if (token && token.includes(".")) {
        const payload = token.split(".")[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        tokenData = JSON.parse(decoded) || {};
      }
    } catch (err) {}

    let userId = findUserId(currentUser) || findUserId(tokenData);

    if (!userId) {
      const fallbackId = window.prompt(
        "Sistem gagal mendeteksi ID dari server. Masukkan ID User Anda secara manual (contoh: 1 atau 2):",
      );
      if (!fallbackId || isNaN(fallbackId)) {
        setErrorMsg("ID User wajib diisi berupa angka untuk mengirim ulasan.");
        setIsSubmitting(false);
        return;
      }
      userId = fallbackId;
    }

    const userName =
      currentUser.nama ||
      currentUser.user?.nama ||
      currentUser.name ||
      `User ${userId}`;
    const today = new Date().toISOString().split("T")[0];

    const payload = {
      id_user: Number(userId),
      id_barang: Number(selectedId),
      rating: Number(rating),
      komentar: komentar,
      tanggal_review: today,
    };

    try {
      await api.post("/review", payload);

      setReviewList((prev) => [
        ...prev,
        {
          ...payload,
          id_review: Date.now(),
          nama_user: userName,
          nama: userName,
        },
      ]);

      setKomentar("");
      setRating(5);
      setSelectedId("");
      alert("Review berhasil dikirim!");
      fetchData();
    } catch (error) {
      setErrorMsg(
        "Gagal mengirim ulasan. Pastikan Anda sudah pernah meminjam barang ini.",
      );
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  flex flex-col gap-8">
        <Header
          category="Review Barang"
          title="Review Saya"
          description="Berikan ulasan untuk barang yang pernah Anda pinjam dan lihat ulasan dari pengguna lain."
        />

        {isLoading ? (
          <div className="text-center py-20 font-medium text-slate-500">
            Memuat data...
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Tulis Ulasan Baru
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs font-medium rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Pilih Barang
                    </label>
                    <select
                      value={selectedId}
                      onChange={(e) => {
                        setSelectedId(e.target.value);
                        setErrorMsg("");
                      }}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
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
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Bintang Penilaian
                    </label>
                    <div className="flex gap-4 items-center h-[46px] px-4 bg-slate-50 border border-slate-200 rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label
                          key={star}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={star}
                            checked={rating === star}
                            onChange={() => setRating(star)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-bold text-slate-700">
                            {star}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-amber-400 fill-current">
                            star
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Komentar / Ulasan
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    placeholder="Ceritakan pengalaman Anda menggunakan barang ini..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 bg-[#1a2234] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition-colors"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Review"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-lg font-bold text-slate-900">
                  Data Ulasan Seluruh Pengguna
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4 font-bold">Barang</th>
                      <th className="px-6 py-4 font-bold">
                        Pereview & Tanggal
                      </th>
                      <th className="px-6 py-4 font-bold">Rating</th>
                      <th className="px-6 py-4 font-bold w-1/2">Komentar</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {reviewList.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-12 text-slate-500"
                        >
                          Belum ada ulasan yang terdaftar.
                        </td>
                      </tr>
                    ) : (
                      reviewList
                        .slice()
                        .reverse()
                        .map((rev, index) => (
                          <tr
                            key={rev.id_review || rev.id || index}
                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-slate-800">
                              {getNamaBarang(rev.id_barang)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-slate-700 font-bold">
                                  {rev.nama_user ||
                                    rev.nama ||
                                    `User ${rev.id_user}`}
                                </span>
                                <span className="text-[11px] text-slate-500 mt-0.5">
                                  {rev.tanggal_review || "Baru saja"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <RatingStars rating={rev.rating} size={16} />
                                <span className="text-xs font-bold text-slate-700">
                                  {rev.rating}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 text-sm leading-relaxed">
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
