"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  AlertCircle,
  RotateCcw,
  Package,
} from "lucide-react";
import { api, getBarang } from "@/lib/api";
import Header from "@/components/share-main/header";
import Image from "next/image";

// Variasi Animasi
const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchReviewsAndBarang = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Fetch data review & barang secara bersamaan
      const [reviewRes, barangRes] = await Promise.all([
        api.get("/review"),
        getBarang().catch(() => []), // Barang tetap opsional jika gagal
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

      // Pemetaan data barang
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
            ""
        );
        const detailBarang = barangMap[bId] || {};

        const reviewerName =
          rev.user?.nama ||
          rev.user?.name ||
          rev.user?.nama_user ||
          rev.nama_user ||
          rev.nama ||
          rev.user_nama ||
          `Pengguna #${rev.id_user || "Anonim"}`;

        const reviewerAvatar =
          rev.user?.foto || rev.user?.avatar || rev.foto_user || "";

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
  }, []);

  useEffect(() => {
    fetchReviewsAndBarang();
  }, [fetchReviewsAndBarang]);

  return (
    <div className="min-h-screen bg-[#06131a] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient Glows */}
      <div className="fixed top-[15%] left-[-10%] w-[120%] h-[500px] pointer-events-none z-0 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/10 to-emerald-500/20 blur-[120px]" />
      <div className="fixed top-[45%] left-[-10%] w-[120%] h-[350px] pointer-events-none z-0 rounded-full bg-gradient-to-r from-indigo-500/10 via-transparent to-emerald-500/10 blur-[140px]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Header
            category="Ulasan & Komentar"
            title="Ulasan Pengguna"
            description="Lihat pengalaman dan penilaian pengguna lain terhadap barang-barang yang pernah dipinjam."
          />

          <section className="pt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-[#091823]/80 border border-slate-800/80 animate-pulse rounded-3xl"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="border border-red-500/20 bg-red-950/10 rounded-3xl py-16 px-6 text-center backdrop-blur-md">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-900/30 border border-red-800/50 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-white">
                  Gagal Memuat Ulasan
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Terjadi kesalahan saat mengambil ulasan dari server. Silakan coba lagi.
                </p>
                <button
                  onClick={fetchReviewsAndBarang}
                  className="mt-6 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer hover:from-amber-300 hover:to-amber-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi</span>
                </button>
              </div>
            ) : reviews.length === 0 ? (
              <div className="border border-slate-800/80 bg-[#091823]/80 rounded-3xl py-16 px-6 text-center backdrop-blur-md">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-white">
                  Belum Ada Ulasan
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Belum ada pengguna yang memberikan ulasan untuk barang-barang di katalog.
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {reviews.map((rev, index) => {
                  const reviewId = rev.id_review || rev.id || index;
                  const ratingNum = Number(rev.rating) || 5;

                  return (
                    <motion.div
                      key={reviewId}
                      variants={fadeInUp}
                      whileHover={{ y: -6 }}
                      className="bg-[#091823]/80 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl hover:border-slate-700/80 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* INFORMASI BARANG */}
                        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800/80">
                          {rev.itemImage ? (
                            <Image
                              src={rev.itemImage}
                              alt={rev.itemName || "Gambar Produk"}
                              width={48}
                              height={48}
                              unoptimized
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-800 shrink-0 bg-slate-900"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 text-slate-500">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                              Barang Diulas
                            </span>
                            <h4 className="font-bold text-sm text-slate-100 truncate">
                              {rev.itemName}
                            </h4>
                          </div>

                          {/* STAR RATING */}
                          <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full shrink-0">
                            <span className="text-xs font-bold text-amber-400">
                              {ratingNum}.0
                            </span>
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          </div>
                        </div>

                        {/* KOMENTAR / ULASAN */}
                        <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal italic">
                          &quot;{rev.komentar || "Tidak ada komentar."}&quot;
                        </p>
                      </div>

                      {/* INFORMASI PEMBERI ULASAN */}
                      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {rev.reviewerAvatar ? (
                            <Image
                              src={rev.reviewerAvatar}
                              alt={rev.reviewerName || "Avatar Penilai"}
                              width={32}
                              height={32}
                              unoptimized
                              className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-800">
                              {rev.reviewerName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-extrabold text-slate-200 leading-tight">
                              {rev.reviewerName}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              Pemberi Ulasan
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-500 font-medium">
                          {formatDate(rev.tanggal_review || rev.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}