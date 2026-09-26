"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getPeminjaman, getBarang, getKategori } from "@/lib/api";
import Header from "@/components/share-main/header";

export default function PeminjamanSayaPage() {
  const [riwayatAktif, setRiwayatAktif] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pemRes, barRes, katRes] = await Promise.all([
          getPeminjaman(),
          getBarang(),
          getKategori(),
        ]);

        const rawPeminjaman = Array.isArray(pemRes) ? pemRes : [];
        const rawBarang = Array.isArray(barRes) ? barRes : [];
        const rawKategori = Array.isArray(katRes) ? katRes : [];

        const kategoriMap = {};

        rawKategori.forEach((k) => {
          const id = k.id_kategori || k.id;

          if (id) {
            kategoriMap[id] = k.nama_kategori || k.nama;
          }
        });

        const barangMap = {};

        rawBarang.forEach((b) => {
          const id = b.id_barang || b.id;
          const catId = b.id_kategori || b.kategori_id;

          if (id) {
            barangMap[id] = {
              nama: b.nama_barang || b.nama,
              kategori: kategoriMap[catId] || "Umum",
              gambar: b.gambar || b.img || "",
              ukuran: b.ukuran || "-",
            };
          }
        });

        const aktif = rawPeminjaman
          .filter(
            (p) =>
              !["Dikembalikan", "Dibatalkan", "Ditolak"].includes(p.status),
          )
          .map((p) => {
            const bId = p.id_barang || p.barang_id;
            const detailBarang = barangMap[bId] || {};

            return {
              ...p,
              nama_barang: detailBarang.nama || "Barang",
              nama_kategori: detailBarang.kategori || "Umum",
              gambar: detailBarang.gambar || "",
              ukuran: detailBarang.ukuran || "-",
            };
          });

        setRiwayatAktif(aktif);
      } catch (error) {
        console.error("Gagal memuat riwayat peminjaman:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          category="Peminjaman"
          title="Peminjaman Saya"
          description="Pantau status dan informasi peminjaman barang yang sedang Anda
              ajukan."
        />

        {/* Daftar Peminjaman */}
        <section className="pt-8">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-900">
              Peminjaman Aktif
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Daftar peminjaman yang masih dalam proses atau sedang digunakan.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0" />

                    <div className="flex-1 space-y-3">
                      <div className="h-3 bg-slate-100 rounded w-24" />
                      <div className="h-4 bg-slate-100 rounded w-48" />
                      <div className="h-6 bg-slate-100 rounded w-20" />
                    </div>

                    <div className="hidden md:block space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-24" />
                      <div className="h-4 bg-slate-100 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
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
          ) : riwayatAktif.length > 0 ? (
            <div className="space-y-4">
              {riwayatAktif.map((item) => {
                const itemId = item.id_peminjaman || item.id;

                const isApproved = item.status === "Disetujui";

                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      {/* Informasi Barang */}
                      <div className="flex items-center gap-4 min-w-0">
                        {item.gambar ? (
                          <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden relative shrink-0">
                            <Image
                              src={item.gambar}
                              alt={item.nama_barang}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-2xl text-slate-400">
                              inventory_2
                            </span>
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                            ID Peminjaman #{itemId}
                          </p>

                          <h3 className="mt-1 text-base md:text-lg font-extrabold text-slate-900 truncate">
                            {item.nama_barang}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {item.nama_kategori}
                            </span>

                            {item.ukuran && item.ukuran !== "-" && (
                              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                Ukuran {item.ukuran}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="md:min-w-[150px] md:text-right border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                          Status Peminjaman
                        </p>

                        <span
                          className={`inline-flex items-center mt-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              isApproved ? "bg-emerald-500" : "bg-blue-500"
                            }`}
                          />
                          {item.status || "Menunggu Persetujuan"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-slate-200 bg-slate-50 rounded-2xl py-16 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-slate-400">
                  assignment
                </span>
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                Belum Ada Peminjaman
              </h3>

              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Saat ini Anda belum memiliki peminjaman yang sedang aktif.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
