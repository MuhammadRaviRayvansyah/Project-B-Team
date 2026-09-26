"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPeminjaman, getBarang, getKategori } from "@/lib/api";
import { useUser } from "@/components/UserContexts";
import { getUserProfile, getToken } from "@/lib/token";
import Header from "@/components/share-main/header";

// Helper pencari ID/Identifier User secara mendalam
const findUserIdentifiers = (obj) => {
  if (!obj || typeof obj !== "object") return [];

  const ids = new Set();

  const addVal = (val) => {
    if (val !== undefined && val !== null && val !== "") {
      ids.add(String(val).trim());
    }
  };

  // Cek berbagai properti ID yang umum digunakan API
  addVal(obj.id_user);
  addVal(obj.user_id);
  addVal(obj.id_anggota);
  addVal(obj.id);
  addVal(obj.nim);
  addVal(obj.email);

  // Jika ada object 'user' atau 'anggota' di dalam object utama (misal: item.user.id)
  if (obj.user && typeof obj.user === "object") {
    addVal(obj.user.id_user);
    addVal(obj.user.user_id);
    addVal(obj.user.id);
    addVal(obj.user.email);
  }

  if (obj.anggota && typeof obj.anggota === "object") {
    addVal(obj.anggota.id_anggota);
    addVal(obj.anggota.id);
  }

  return Array.from(ids);
};

const getUserIdFromToken = () => {
  try {
    const token = getToken();
    if (!token || !token.includes(".")) return [];
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return findUserIdentifiers(decoded);
  } catch {
    return [];
  }
};

function PeminjamanContent() {
  const searchParams = useSearchParams();
  const showSuccessBanner = searchParams.get("status") === "success";

  const { user } = useUser();

  // Kumpulkan SEMUA identifier user login (id, email, nim, dll)
  const activeUserIdentifiers = useMemo(() => {
    const activeUser = user || getUserProfile();
    const idsFromUser = findUserIdentifiers(activeUser);
    const idsFromToken = getUserIdFromToken();

    // Gabungkan semua ID unik dari token & user context
    return Array.from(new Set([...idsFromUser, ...idsFromToken]));
  }, [user]);

  const [riwayatAktif, setRiwayatAktif] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const [pemRes, barRes, katRes] = await Promise.all([
          getPeminjaman(),
          getBarang(),
          getKategori(),
        ]);

        const rawPeminjaman = Array.isArray(pemRes) ? pemRes : (pemRes?.data || []);
        const rawBarang = Array.isArray(barRes) ? barRes : (barRes?.data || []);
        const rawKategori = Array.isArray(katRes) ? katRes : (katRes?.data || []);

        // SIMPAN DEBUG INFO jika data tidak muncul
        if (rawPeminjaman.length > 0) {
          setDebugInfo({
            activeUserIDs: activeUserIdentifiers,
            samplePeminjamanItem: rawPeminjaman[0],
            sampleItemIDs: findUserIdentifiers(rawPeminjaman[0]),
          });
        }

        // Pemetaan Kategori
        const kategoriMap = {};
        rawKategori.forEach((k) => {
          const id = k.id_kategori || k.id;
          if (id) kategoriMap[String(id)] = k.nama_kategori || k.nama;
        });

        // Pemetaan Barang
        const barangMap = {};
        rawBarang.forEach((b) => {
          const id = b.id_barang || b.id;
          const catId = b.id_kategori || b.kategori_id;
          if (id) {
            barangMap[String(id)] = {
              nama: b.nama_barang || b.nama,
              kategori: kategoriMap[String(catId)] || "Umum",
              gambar: b.gambar || b.img || "",
              ukuran: b.ukuran || "-",
            };
          }
        });

        // FILTER FLEXIBLE TAPI STRICT:
        // Cocokkan apakah ADA SALAH SATU ID/Identifier item yang sama dengan ID User yang login
        const userPeminjaman = rawPeminjaman.filter((item) => {
          if (activeUserIdentifiers.length === 0) return false;

          const itemIdentifiers = findUserIdentifiers(item);

          // Cek apakah ada persirisan (intersection) antara ID User dan ID Peminjaman
          return itemIdentifiers.some((id) => activeUserIdentifiers.includes(id));
        });

        // Status Peminjaman Aktif
        const activeStatuses = [
          "pending",
          "menunggu",
          "menunggu persetujuan",
          "disetujui",
          "dipinjam",
          "sedang dipinjam",
        ];

        const aktif = userPeminjaman
          .filter((p) => {
            const statusStr = String(p.status || "").trim().toLowerCase();
            return statusStr === "" || activeStatuses.includes(statusStr);
          })
          .map((p) => {
            const bId = String(p.id_barang || p.barang_id || "");
            const detailBarang = barangMap[bId] || {};

            return {
              ...p,
              nama_barang: p.nama_barang || detailBarang.nama || "Barang",
              nama_kategori: detailBarang.kategori || "Umum",
              gambar: p.gambar || detailBarang.gambar || "",
              ukuran: p.ukuran || detailBarang.ukuran || "-",
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
  }, [user, activeUserIdentifiers]);

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          category="Peminjaman"
          title="Peminjaman Saya"
          description="Pantau status dan informasi peminjaman barang yang sedang Anda ajukan."
        />

        {showSuccessBanner && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 text-emerald-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600">
                check_circle
              </span>
              <p className="text-sm font-medium">
                Pengajuan peminjaman Anda berhasil dikirim! Silakan tunggu konfirmasi admin.
              </p>
            </div>
          </div>
        )}

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
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
              <h3 className="text-base font-extrabold text-slate-900">
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
                const statusNormalized = String(item.status || "").trim().toLowerCase();

                const isDipinjam = [
                  "disetujui",
                  "dipinjam",
                  "sedang dipinjam",
                ].includes(statusNormalized);

                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      <div className="flex items-center gap-4 min-w-0">
                        {item.gambar ? (
                          <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden relative shrink-0 border border-slate-200/60">
                            <img
                              src={item.gambar}
                              alt={item.nama_barang}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/placeholder.png";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/60">
                            <span className="material-symbols-outlined text-2xl text-slate-400">
                              inventory_2
                            </span>
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                            Peminjaman Aktif
                          </span>

                          <h3 className="text-base md:text-lg font-bold text-slate-900 truncate">
                            {item.nama_barang}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                              {item.nama_kategori}
                            </span>
                            {item.ukuran && item.ukuran !== "-" && (
                              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                Ukuran {item.ukuran}
                              </span>
                            )}
                            <span>• {item.jumlah || 1} Unit</span>
                            {item.total_harga && (
                              <span>
                                • Rp{" "}
                                {Number(item.total_harga).toLocaleString("id-ID")}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-400">
                            Periode: {item.tanggal_peminjaman || "-"} s.d{" "}
                            {item.tanggal_pengembalian || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="md:min-w-[160px] md:text-right border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Status Transaksi
                        </p>

                        <span
                          className={`inline-flex items-center mt-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                            isDipinjam
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              isDipinjam
                                ? "bg-blue-500 animate-pulse"
                                : "bg-amber-500"
                            }`}
                          />
                          {isDipinjam ? "Dipinjam" : "Menunggu Persetujuan"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-slate-200 bg-slate-50 rounded-2xl py-12 px-6 text-center">
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

              {/* TAMPILAN HELPER UNTUK CEK STRUKTUR DATA */}
              {debugInfo && (
                <div className="mt-6 p-4 bg-slate-100 text-left rounded-xl text-xs overflow-x-auto max-w-2xl mx-auto border border-slate-200 font-mono">
                  <p className="font-bold text-slate-700 mb-1">
                    🔍 Diagnosis Filter (Debug Info):
                  </p>
                  <p>
                    <strong>ID User Login Terdeteksi:</strong>{" "}
                    {JSON.stringify(debugInfo.activeUserIDs)}
                  </p>
                  <p className="mt-1">
                    <strong>ID Item di Database:</strong>{" "}
                    {JSON.stringify(debugInfo.sampleItemIDs)}
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 font-sans font-semibold">
                      Lihat Contoh Struktur Data 1 Item dari API
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-900 text-slate-100 rounded text-[11px] overflow-x-auto">
                      {JSON.stringify(debugInfo.samplePeminjamanItem, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              <Link
                href="/barang"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">
                  checkroom
                </span>
                Pinjam Pakaian Sekarang
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function PeminjamanSayaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PeminjamanContent />
    </Suspense>
  );
}