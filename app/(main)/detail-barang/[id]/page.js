"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getDetailBarang, getReview, getBarang, api } from "@/lib/api";
import { useUser } from "@/components/UserContexts";
import { getUserProfile, getToken } from "@/lib/token";
import RatingStars from "@/components/review/rating-stars";

export default function DetailBarangPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [barang, setBarang] = useState(null);
  const [ulasanBarang, setUlasanBarang] = useState([]);
  const [barangLain, setBarangLain] = useState([]);
  const [semuaReview, setSemuaReview] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [jumlah, setJumlah] = useState(1);
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataBarang, dataSemuaReview, dataSemuaBarang] =
          await Promise.all([getDetailBarang(id), getReview(), getBarang()]);

        if (dataBarang) setBarang(dataBarang);

        if (Array.isArray(dataSemuaReview)) {
          setSemuaReview(dataSemuaReview);
          const ulasanSpesifik = dataSemuaReview.filter(
            (rev) => Number(rev.id_barang) === Number(id),
          );
          setUlasanBarang(ulasanSpesifik);
        }

        if (Array.isArray(dataSemuaBarang)) {
          const filterBarang = dataSemuaBarang
            .filter((b) => Number(b.id_barang || b.id) !== Number(id))
            .slice(0, 4);
          setBarangLain(filterBarang);
        }
      } catch (error) {
        setErrorMsg("Gagal memuat detail barang.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const avgRating = useMemo(() => {
    if (!ulasanBarang.length) return 0;
    const total = ulasanBarang.reduce(
      (sum, r) => sum + Number(r.rating || 0),
      0,
    );
    return total / ulasanBarang.length;
  }, [ulasanBarang]);

  const calculateTotal = () => {
    if (!tanggalPinjam || !tanggalKembali || !barang) return 0;

    const start = new Date(tanggalPinjam);
    const end = new Date(tanggalKembali);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const timeDiff = end.getTime() - start.getTime();
    let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 1) daysDiff = 1;

    return Number(jumlah) * Number(barang.harga_sewa || 0) * daysDiff;
  };

  const totalHarga = useMemo(
    () => calculateTotal(),
    [tanggalPinjam, tanggalKembali, jumlah, barang],
  );

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
      setErrorMsg(
        "Sesi Anda tidak ditemukan. Silakan logout dan login kembali untuk melakukan peminjaman.",
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      id_user: Number(userId),
      id_barang: Number(id),
      tanggal_peminjaman: tanggalPinjam,
      tanggal_pengembalian: tanggalKembali,
      jumlah: Number(jumlah),
      harga_sewa: Number(barang.harga_sewa || 0),
      status: "Menunggu Persetujuan",
      total_harga: Number(totalHarga),
    };

    try {
      await api.post("/peminjaman", payload);
      router.push("/peminjaman");
    } catch (error) {
      setErrorMsg(error.message || "Gagal mengajukan peminjaman.");
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-20">Memuat detail barang...</div>;
  if (!barang)
    return (
      <div className="text-center py-20 font-bold text-red-500">
        Barang tidak ditemukan.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        <div className="md:w-1/2 bg-slate-50 flex items-center justify-center p-8 relative border-r border-slate-100">
          <img
            src={barang.gambar || "/placeholder.png"}
            alt={barang.nama_barang || "Barang"}
            className="w-full h-auto max-h-[400px] object-contain rounded-lg"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>

        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
              Stok Tersedia: {barang.stok || 0} Unit
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              {barang.nama_barang}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <RatingStars rating={avgRating} size={18} />
              <span className="text-xs text-slate-500 font-medium">
                {ulasanBarang.length > 0
                  ? `${avgRating.toFixed(1)} (${ulasanBarang.length} Ulasan)`
                  : "Belum ada ulasan"}
              </span>
            </div>

            <div className="flex items-end gap-2 mb-4">
              <span className="text-2xl font-bold text-emerald-600">
                Rp {(barang.harga_sewa || 0).toLocaleString("id-ID")}
              </span>
              <span className="text-sm font-medium text-slate-500 pb-1">
                / hari
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {barang.deskripsi}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Ukuran:</span>
              <span className="px-2.5 py-1 border border-slate-200 rounded text-xs font-bold text-slate-700">
                {barang.ukuran || "-"}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">
              Form Pengajuan Peminjaman
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-600 text-xs font-medium rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jumlah Unit
                </label>
                <input
                  type="number"
                  min="1"
                  max={barang.stok || 1}
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pinjam
                  </label>
                  <input
                    type="date"
                    value={tanggalPinjam}
                    onChange={(e) => setTanggalPinjam(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Kembali
                  </label>
                  <input
                    type="date"
                    value={tanggalKembali}
                    onChange={(e) => setTanggalKembali(e.target.value)}
                    required
                    min={tanggalPinjam}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {totalHarga > 0 && (
                <div className="flex justify-between items-center py-3 border-t border-slate-100 mt-2">
                  <span className="text-sm font-bold text-slate-700">
                    Total Biaya:
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || barang.stok < 1}
                className="w-full mt-2 bg-[#1a2234] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? "Memproses..." : "Ajukan Peminjaman"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {barangLain.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Barang Lainnya</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {barangLain.map((item) => {
              const ulasanItem = semuaReview.filter(
                (r) =>
                  String(r.id_barang) === String(item.id_barang || item.id),
              );
              const itemAvgRating = ulasanItem.length
                ? ulasanItem.reduce(
                    (sum, r) => sum + Number(r.rating || 0),
                    0,
                  ) / ulasanItem.length
                : 0;
              const itemId = item.id_barang || item.id;

              return (
                <Link
                  href={`/detail-barang/${itemId}`}
                  key={itemId}
                  className="bg-white rounded-2xl border border-slate-200/60 p-3 flex flex-row gap-4 hover:shadow-md transition-all group"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-slate-50 rounded-xl overflow-hidden relative shrink-0">
                    <img
                      src={item.gambar || "/placeholder.png"}
                      alt={item.nama_barang || "Barang"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-1 py-1 pr-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {item.nama_kategori || "Umum"}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
                      {item.nama_barang}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <RatingStars rating={itemAvgRating} size={14} />
                      <span className="text-[10px] text-slate-500 font-medium">
                        {ulasanItem.length > 0
                          ? `(${ulasanItem.length})`
                          : "Belum dinilai"}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm font-bold text-emerald-600">
                        Rp {(item.harga_sewa || 0).toLocaleString("id-ID")}
                        <span className="text-[10px] text-slate-500 font-medium">
                          {" "}
                          / hari
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
