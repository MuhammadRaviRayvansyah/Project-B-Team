"use client";

import { useEffect, useState } from "react";
import { api, getBarang } from "@/lib/api";
import Header from "@/components/share-main/header";
import Image from "next/image";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchReviewsAndBarang = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Fetch data review & barang secara bersamaan
      const [reviewRes, barangRes] = await Promise.all([
        api.get("/review").catch(() => null),
        getBarang().catch(() => []),
      ]);

      const rawReviews = Array.isArray(reviewRes?.data)
        ? reviewRes.data
        : Array.isArray(reviewRes)
          ? reviewRes
          : [];

      const rawBarang = Array.isArray(barangRes?.data)
        ? barangRes.data
        : Array.isArray(barangRes)
          ? barangRes
          : [];

      // Buat pemetaan (map) data barang untuk melengkapi gambar & nama jika API review tidak mengirim relation
      const barangMap = {};
      rawBarang.forEach((b) => {
        const id = b.id_barang || b.id;
        if (id) {
          barangMap[String(id)] = {
            nama_barang: b.nama_barang || b.nama,
            gambar: b.gambar || b.img || "",
          };
        }
      });

      // Gabungkan data review dengan detail barang & nama user
      const mappedReviews = rawReviews.map((rev) => {
        const bId = String(
          rev.id_barang ||
            rev.barang_id ||
            rev.barang?.id_barang ||
            rev.barang?.id ||
            "",
        );
        const detailBarang = barangMap[bId] || {};

        // Ekstraksi Nama Pemberi Ulasan
        const reviewerName =
          rev.user?.nama ||
          rev.user?.name ||
          rev.user?.nama_user ||
          rev.nama_user ||
          rev.nama ||
          rev.user_nama ||
          `Pengguna #${rev.id_user || "Anonim"}`;

        // Ekstraksi Foto / Avatar Pemberi Ulasan
        const reviewerAvatar =
          rev.user?.foto || rev.user?.avatar || rev.foto_user || "";

        // Ekstraksi Gambar & Nama Barang
        const itemImage =
          rev.barang?.gambar ||
          rev.gambar_barang ||
          rev.gambar ||
          detailBarang.gambar ||
          "";
        const itemName =
          rev.barang?.nama_barang ||
          rev.nama_barang ||
          detailBarang.nama_barang ||
          "Barang";

        return {
          ...rev,
          reviewerName,
          reviewerAvatar,
          itemName,
          itemImage,
        };
      });

      setReviews(mappedReviews);
    } catch (error) {
      console.error("Gagal memuat ulasan:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviewsAndBarang();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          category="Ulasan & Komentar"
          title="Ulasan Pengguna"
          description="Lihat pengalaman dan penilaian pengguna lain terhadap barang-barang yang pernah dipinjam."
        />

        <section className="pt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 bg-slate-200/60 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-700">
              <span className="material-symbols-outlined text-3xl">error</span>
              <p className="mt-2 text-sm font-semibold">
                Gagal memuat ulasan barang.
              </p>
              <button
                onClick={fetchReviewsAndBarang}
                className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Coba Lagi
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300">
                rate_review
              </span>
              <h3 className="mt-3 text-base font-extrabold text-slate-900">
                Belum Ada Ulasan
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Belum ada pengguna yang memberikan ulasan untuk barang.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((rev, index) => {
                const reviewId = rev.id_review || rev.id || index;
                const ratingNum = Number(rev.rating) || 5;

                return (
                  <div
                    key={reviewId}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* INFORMASI BARANG */}
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        {rev.itemImage ? (
                          <Image
                            src={rev.itemImage}
                            alt={rev.itemName || "Gambar Produk"}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <span className="material-symbols-outlined text-slate-400 text-xl">
                              inventory_2
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                            Barang Diulas
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {rev.itemName}
                          </h4>
                        </div>
                        {/* STAR RATING */}
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-xl shrink-0">
                          <span className="text-xs font-bold text-amber-700">
                            {ratingNum}.0
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-amber-400">
                            star
                          </span>
                        </div>
                      </div>

                      {/* KOMENTAR / ULASAN */}
                      <p className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        &quot;{rev.komentar || "Tidak ada komentar."}&quot;
                      </p>
                    </div>

                    {/* INFORMASI PEMBERI ULASAN (NAMA & FOTO USER) */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {rev.reviewerAvatar ? (
                          <Image
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName || "Avatar Penilai"}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                            {rev.reviewerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 leading-tight">
                            {rev.reviewerName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Pemberi Ulasan
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatDate(rev.tanggal_review || rev.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
