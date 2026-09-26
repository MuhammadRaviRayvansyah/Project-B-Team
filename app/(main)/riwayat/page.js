"use client";

import { useEffect, useState } from "react";
import { getPeminjaman, getBarang } from "@/lib/api";
import { useUser } from "@/components/UserContexts";
import { getUserProfile } from "@/lib/token";
import Header from "@/components/share-main/header";

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
  const currentUserId = activeUser?.id_user || activeUser?.id;

  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pemRes, barRes] = await Promise.all([
          getPeminjaman(),
          getBarang(),
        ]);

        const rawPeminjaman = Array.isArray(pemRes) ? pemRes : [];
        const rawBarang = Array.isArray(barRes) ? barRes : [];

        const barangMap = {};
        rawBarang.forEach((b) => {
          const id = b.id_barang || b.id;
          if (id) {
            barangMap[id] = {
              nama_barang: b.nama_barang || b.nama,
              gambar: b.gambar || b.img || "",
            };
          }
        });

        // Filter KHUSUS transaksi milik user yang sedang login
        const userPeminjaman = currentUserId
          ? rawPeminjaman.filter(
              (p) => Number(p.id_user || p.user_id) === Number(currentUserId),
            )
          : [];

        const completedStatuses = ["dikembalikan", "ditolak", "selesai", "dibatalkan"];

        const completed = userPeminjaman
          .filter((p) =>
            completedStatuses.includes(String(p.status || "").trim().toLowerCase()),
          )
          .map((p) => {
            const bId = p.id_barang || p.barang_id;
            const detailBarang = barangMap[bId] || {
              nama_barang: p.nama_barang || "Barang Tidak Ditemukan",
              gambar: "",
            };

            return {
              ...p,
              nama_barang: p.nama_barang || detailBarang.nama_barang,
              gambar: detailBarang.gambar,
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

    fetchData();
  }, [currentUserId]);

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          category="Riwayat Peminjaman"
          title="Riwayat Saya"
          description="Lihat arsip transaksi peminjaman perlengkapan kampus yang telah
              selesai atau ditolak."
        />

        {/* Riwayat */}
        <section className="pt-8">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-900">
              Arsip Peminjaman
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Daftar transaksi peminjaman yang telah selesai diproses.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Loading */}
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4 animate-pulse">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100" />

                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                      </div>

                      <div className="hidden md:block w-20 h-6 bg-slate-100 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : /* Error */
            isError ? (
              <div className="px-6 py-16 text-center bg-rose-50">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-rose-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-rose-500">
                    error
                  </span>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-slate-900">
                  Gagal Memuat Data
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Riwayat peminjaman tidak dapat dimuat dari server.
                </p>
              </div>
            ) : /* Empty */
            historyData.length === 0 ? (
              <div className="px-6 py-16 text-center bg-slate-50">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-slate-400">
                    history
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                  Belum Ada Riwayat
                </h3>

                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                  Belum terdapat transaksi peminjaman yang selesai dikembalikan atau ditolak.
                </p>

                <a
                  href="/barang"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">checkroom</span>
                  Lihat Katalog Pakaian
                </a>
              </div>
            ) : (
              /* Data */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Barang & Unit
                      </th>

                      <th className="py-4 px-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Tanggal Pinjam
                      </th>

                      <th className="py-4 px-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Tanggal Kembali
                      </th>

                      <th className="py-4 px-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Total Biaya
                      </th>

                      <th className="py-4 px-5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-center">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {historyData.map((row) => {
                      const rowId = row.id_peminjaman || row.id;
                      const stLower = String(row.status || "").trim().toLowerCase();
                      const isReturned = stLower === "dikembalikan" || stLower === "selesai";
                      const displayStatus = isReturned ? "Dikembalikan" : "Ditolak";

                      return (
                        <tr
                          key={rowId}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          {/* Barang */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              {row.gambar ? (
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                                  <img
                                    src={row.gambar}
                                    alt={row.nama_barang}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500";
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                                  <span className="material-symbols-outlined text-xl text-slate-400">
                                    inventory_2
                                  </span>
                                </div>
                              )}

                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {row.nama_barang}
                                </p>

                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Jumlah: {row.jumlah || 1} Unit
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Tanggal Pinjam */}
                          <td className="py-4 px-5">
                            <p className="text-sm font-medium text-slate-600">
                              {formatDate(row.tanggal_peminjaman)}
                            </p>
                          </td>

                          {/* Tanggal Kembali */}
                          <td className="py-4 px-5">
                            <p className="text-sm font-medium text-slate-600">
                              {formatDate(row.tanggal_pengembalian)}
                            </p>
                          </td>

                          {/* Total Biaya */}
                          <td className="py-4 px-5">
                            <p className="text-sm font-bold text-slate-900">
                              Rp {Number(row.total_harga || (Number(row.harga_sewa || 0) * Number(row.jumlah || 1))).toLocaleString("id-ID")}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-5 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold ${
                                isReturned
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                  isReturned ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              />
                              {displayStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Jumlah Data */}
          {!isLoading && !isError && historyData.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-slate-500">
                Menampilkan{" "}
                <span className="font-bold text-slate-700">
                  {historyData.length}
                </span>{" "}
                riwayat peminjaman
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
