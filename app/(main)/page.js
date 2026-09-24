"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { getKategori, getBarang } from "@/lib/api";

export default function BerandaPage() {
  const [kategoriList, setKategoriList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({});
  const [kategoriCounts, setKategoriCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [katRes, barRes] = await Promise.all([getKategori(), getBarang()]);

        const rawKat = Array.isArray(katRes) ? katRes : [];
        const rawBar = Array.isArray(barRes) ? barRes : [];

        setKategoriList(rawKat);
        setBarangList(rawBar.slice(0, 4));

        // Mapping ID kategori ke nama kategori
        const kMap = {};
        rawKat.forEach((k) => {
          const id = k.id_kategori || k.id;
          if (id) kMap[id] = k.nama_kategori || "Umum";
        });
        setKategoriMap(kMap);

        // Hitung jumlah total pakaian per kategori dari seluruh data barang API
        const kCounts = {};
        rawBar.forEach((b) => {
          const catId = b.id_kategori || b.kategori_id;
          if (catId) {
            kCounts[catId] = (kCounts[catId] || 0) + 1;
          }
        });
        setKategoriCounts(kCounts);

      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased font-sans">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">

        {/* ================= HERO SECTION ================= */}
        <section className="relative rounded-[32px] overflow-hidden min-h-[500px] lg:min-h-[540px] flex items-center mb-12 shadow-2xl">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/bg-beranda.jpg')" }}
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/20" />

          {/* Hero Content Grid */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Side Kiri: Title, Subtitle, & CTA Button */}
            <div className="lg:col-span-7 space-y-5">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-amber-300 uppercase">
                PEPAC - PEMINJAMAN PAKAIAN CUZ
              </p>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                Tampil Rapi & Percaya Diri di Setiap <span className="text-amber-400">Acara Kampus</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
                Temukan dan pinjam batik, jas, sepatu, serta perlengkapan acara kampus secara praktis, cepat, dan terintegrasi.
              </p>

              <div className="pt-2">
                <Link
                  href="/barang"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Mulai Cari Barang</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ================= KATEGORI SECTION (LANGSUNG DI PAGE) ================= */}
        <section className="py-6 mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900 bg-amber-400 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-sm">
              Kategori Pakaian
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pilihan Kategori Busana
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Temukan berbagai pilihan pakaian berdasarkan kategori kebutuhan acara Anda
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kategoriList.map((cat) => {
                const catId = cat.id_kategori || cat.id;
                const totalPakaian = kategoriCounts[catId] || 0;
                const namaKategori = cat.nama_kategori || "Umum";

                return (
                  <Link
                    key={catId}
                    href={`/barang?kategori=${catId}`}
                    className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Nama Kategori & Total Pakaian */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          Pakaian {namaKategori}
                        </h3>
                        <span className="shrink-0 bg-amber-100 text-slate-900 font-bold text-[11px] px-3 py-1 rounded-full border border-amber-200">
                          {totalPakaian} Pakaian
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        Koleksi pakaian kategori {namaKategori.toLowerCase()} yang siap dipinjam untuk melengkapi acara Anda.
                      </p>
                    </div>

                    {/* Bottom Link Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                      <span>Lihat Semua</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= KATALOG BARANG SECTION ================= */}
        <section className="py-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Katalog Pilihan</h2>
              <p className="text-xs text-slate-500 mt-1">Koleksi busana dan perlengkapan siap sewa</p>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/barang" 
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </Link>
              <Link 
                href="/barang" 
                className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-600 text-xs">Gagal memuat katalog barang.</div>
          ) : barangList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {barangList.map((b) => {
                const bId = b.id_barang || b.id;
                const catId = b.id_kategori || b.kategori_id;
                return (
                  <ItemCard
                    key={bId}
                    id_barang={bId}
                    nama_barang={b.nama_barang || b.nama}
                    nama_kategori={kategoriMap[catId] || "Umum"}
                    ukuran={b.ukuran}
                    stok={b.stok}
                    harga_sewa={b.harga_sewa || b.hargaPerHari}
                    gambar={b.gambar || b.img}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-slate-50 rounded-2xl text-slate-400 text-center text-xs">
              Belum ada barang tersedia saat ini.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}