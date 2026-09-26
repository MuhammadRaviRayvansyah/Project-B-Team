"use client";

import { useEffect, useState, useMemo } from "react";
import { getPeminjaman, getBarang, api } from "@/lib/api";
import { useUser } from "@/components/UserContexts";
import { getUserProfile, getToken } from "@/lib/token";
import Header from "@/components/share-main/header";

// Fungsi rekursif untuk mengekstrak semua kemungkinan ID dari objek bersarang
const findUserIdentifiers = (obj) => {
  if (!obj || typeof obj !== "object") return [];
  const ids = new Set();

  const extract = (target) => {
    if (!target || typeof target !== "object") return;

    // Kunci-kunci umum ID User & JWT standard ('sub')
    const possibleKeys = [
      "id_user",
      "user_id",
      "id",
      "sub",
      "id_anggota",
      "id_mahasiswa",
      "userId",
      "idUser",
      "nim",
      "email",
    ];

    possibleKeys.forEach((key) => {
      if (target[key] !== undefined && target[key] !== null && target[key] !== "") {
        ids.add(String(target[key]).trim());
      }
    });

    // Cari ke dalam sub-objek seperti .data atau .user
    if (target.data && typeof target.data === "object") extract(target.data);
    if (target.user && typeof target.user === "object") extract(target.user);
    if (target.profile && typeof target.profile === "object") extract(target.profile);
  };

  extract(obj);
  return Array.from(ids);
};

// Dekode Token JWT untuk mengambil Payload
const getDecodedToken = () => {
  try {
    const token = getToken();
    if (!token || !token.includes(".")) return null;
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    return null;
  }
};

const getUserIdFromToken = () => {
  const decoded = getDecodedToken();
  return decoded ? findUserIdentifiers(decoded) : [];
};

// Pencari ID Angka Khusus untuk dikirim ke Backend
const extractNumericId = (userObj, tokenDecoded) => {
  const candidates = [
    // Dari User Object
    userObj?.id_user,
    userObj?.user_id,
    userObj?.id,
    userObj?.sub,
    userObj?.userId,
    userObj?.data?.id_user,
    userObj?.data?.user_id,
    userObj?.data?.id,
    userObj?.user?.id_user,
    userObj?.user?.user_id,
    userObj?.user?.id,
    // Dari Token JWT
    tokenDecoded?.id_user,
    tokenDecoded?.user_id,
    tokenDecoded?.id,
    tokenDecoded?.sub,
    tokenDecoded?.userId,
    tokenDecoded?.data?.id_user,
    tokenDecoded?.data?.id,
  ];

  for (const val of candidates) {
    if (val !== undefined && val !== null && val !== "") {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return null;
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
  } catch (e) {
    return dateString;
  }
};

export default function RiwayatSayaPage() {
  const { user } = useUser();
  const activeUser = user || getUserProfile();

  
  const activeUserIdentifiers = useMemo(() => {
    const idsFromUser = findUserIdentifiers(activeUser);
    const idsFromToken = getUserIdFromToken();
    return Array.from(new Set([...idsFromUser, ...idsFromToken]));
  }, [user, activeUser]);

  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modal State untuk Review
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const [pemRes, barRes] = await Promise.all([
        getPeminjaman(),
        getBarang(),
      ]);

      const rawPeminjaman = Array.isArray(pemRes) ? pemRes : (pemRes?.data || []);
      const rawBarang = Array.isArray(barRes) ? barRes : (barRes?.data || []);

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

      const userPeminjaman = rawPeminjaman.filter((item) => {
        if (activeUserIdentifiers.length === 0) return false;
        const itemIdentifiers = findUserIdentifiers(item);
        return itemIdentifiers.some((id) => activeUserIdentifiers.includes(id));
      });

      const completedStatuses = [
        "dikembalikan",
        "ditolak",
        "selesai",
        "dibatalkan",
        "sudah dikembalikan",
      ];

      const completed = userPeminjaman
        .filter((p) =>
          completedStatuses.includes(String(p.status || "").trim().toLowerCase())
        )
        .map((p) => {
          const bId = String(
            p.id_barang ||
            p.barang_id ||
            p.idBarang ||
            p.barang?.id_barang ||
            p.barang?.id ||
            ""
          );

          const detailBarang = barangMap[bId] || {
            nama_barang: p.nama_barang || p.barang?.nama_barang || "Barang Tidak Ditemukan",
            gambar: "",
          };

          return {
            ...p,
            id_barang: bId,
            nama_barang: p.nama_barang || detailBarang.nama_barang,
            gambar: p.gambar || detailBarang.gambar,
          };
        });

      setHistoryData(completed);
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [activeUserIdentifiers]);

  // Submit Ulasan dari Modal
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!komentar.trim()) {
      setReviewError("Komentar ulasan tidak boleh kosong.");
      return;
    }

    const decodedToken = getDecodedToken();
    const userId = extractNumericId(activeUser, decodedToken);

    // Dapatkan ID Barang
    const rawBarangId =
      selectedItemForReview?.id_barang ??
      selectedItemForReview?.barang_id ??
      selectedItemForReview?.id ??
      selectedItemForReview?.barang?.id_barang ??
      selectedItemForReview?.barang?.id;

    const barangId = parseInt(rawBarangId, 10);

    // Logging untuk kemudahan debugging jika masih berkendala
    console.log("Debug Penilaian User ID:", { activeUser, decodedToken, userId, barangId });

    if (!userId || isNaN(userId)) {
      setReviewError("ID User tidak ditemukan di sesi login. Silakan login ulang.");
      return;
    }

    if (!barangId || isNaN(barangId)) {
      setReviewError("ID Barang tidak valid.");
      return;
    }

    setIsSubmittingReview(true);

    const payload = {
      id_user: userId,
      id_barang: barangId,
      rating: Number(rating),
      komentar: komentar.trim(),
      tanggal_review: new Date().toISOString().split("T")[0],
    };

    try {
      await api.post("/review", payload);
      setReviewSuccess("Ulasan Anda berhasil dikirim! Terima kasih.");
      setTimeout(() => {
        setSelectedItemForReview(null);
        setKomentar("");
        setRating(5);
        setReviewSuccess("");
      }, 1500);
    } catch (err) {
      setReviewError(err.message || "Gagal mengirimkan ulasan.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          category="Riwayat Peminjaman"
          title="Riwayat Saya"
          description="Lihat arsip transaksi peminjaman yang telah selesai dan berikan ulasan untuk barang yang telah dikembalikan."
        />

        <section className="pt-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : historyData.length === 0 ? (
              <div className="px-6 py-16 text-center bg-slate-50">
                <span className="material-symbols-outlined text-4xl text-slate-300">history</span>
                <h3 className="mt-3 text-base font-extrabold text-slate-900">Belum Ada Riwayat</h3>
                <p className="mt-1 text-xs text-slate-500">Belum ada peminjaman yang selesai atau ditolak.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                      <th className="py-4 px-5">Barang</th>
                      <th className="py-4 px-5">Pinjam</th>
                      <th className="py-4 px-5">Kembali</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {historyData.map((row) => {
                      const rowId = row.id_peminjaman || row.id;
                      const stLower = String(row.status || "").trim().toLowerCase();

                      const isReturned =
                        stLower === "dikembalikan" ||
                        stLower === "selesai" ||
                        stLower === "sudah dikembalikan";

                      return (
                        <tr key={rowId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              {row.gambar ? (
                                <img
                                  src={row.gambar}
                                  alt={row.nama_barang}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-slate-400 text-lg">inventory_2</span>
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-900">{row.nama_barang}</p>
                                <p className="text-[11px] text-slate-400">{row.jumlah || 1} Unit</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5 font-medium text-slate-600">
                            {formatDate(row.tanggal_peminjaman)}
                          </td>
                          <td className="py-4 px-5 font-medium text-slate-600">
                            {formatDate(row.tanggal_pengembalian)}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                isReturned
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {isReturned ? "Dikembalikan" : "Ditolak"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center">
                            {isReturned ? (
                              <button
                                onClick={() => {
                                  setSelectedItemForReview(row);
                                  setRating(5);
                                  setKomentar("");
                                  setReviewError("");
                                  setReviewSuccess("");
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[16px]">rate_review</span>
                                Beri Ulasan
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Tidak tersedia</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL BERI ULASAN */}
      {selectedItemForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Beri Ulasan Barang</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedItemForReview.nama_barang}</p>
              </div>
              <button
                onClick={() => setSelectedItemForReview(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
              {reviewError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                  {reviewError}
                </div>
              )}

              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
                  {reviewSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                  Bintang Penilaian
                </label>
                <div className="flex gap-3 items-center h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={rating === star}
                        onChange={() => setRating(star)}
                        className="w-3.5 h-3.5 text-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-700">{star}</span>
                      <span className="material-symbols-outlined text-[16px] text-amber-400">star</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                  Komentar / Pengalaman
                </label>
                <textarea
                  required
                  rows="3"
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  placeholder="Ceritakan kondisi dan kenyamanan barang yang telah Anda gunakan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForReview(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  {isSubmittingReview ? "Sending..." : "Kirim Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}