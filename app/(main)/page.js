"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import { getKategori, getBarang } from "@/lib/api";

export default function BerandaPage() {
  const [kategoriList, setKategoriList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({});
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

        const kMap = {};
        rawKat.forEach((k) => {
          const id = k.id_kategori || k.id;
          if (id) kMap[id] = k.nama_kategori || "Umum";
        });
        setKategoriMap(kMap);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          <div className="py-10 md:py-12">
            <Hero
              category="PORTAL PEMINJAMAN MAHASISWA"
              title="Selamat Datang"
              description="Temukan barang untuk kebutuhan acara Anda secara dinamis."
            />
          </div>

          <section className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">Kategori</h2>
                <p className="text-[11px] md:text-xs text-slate-600 mt-0.5">Pilih perlengkapan sesuai jenis acara</p>
              </div>
            </div>

            {isLoading ? (
              <div className="text-slate-500 py-4">Memuat kategori...</div>
            ) : isError ? (
              <div className="p-4 bg-rose-50 rounded-xl text-rose-600">Gagal memuat kategori.</div>
            ) : kategoriList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {kategoriList.map((k) => (
                  <CategoryCard
                    key={k.id_kategori || k.id}
                    icon={k.icon || "checkroom"}
                    nama_kategori={k.nama_kategori}
                    jumlah_koleksi={k.jumlah_koleksi || "Tersedia"}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-xl text-slate-500 text-center border">Belum ada kategori.</div>
            )}
          </section>

          <section className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">Barang Tersedia</h2>
              </div>
              <Link href="/barang" className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                Lihat Katalog Penuh <span className="material-symbols-outlined text-base">chevron_right</span>
              </Link>
            </div>

            {isLoading ? (
              <div className="text-slate-500 py-4">Memuat barang...</div>
            ) : isError ? (
              <div className="p-4 bg-rose-50 rounded-xl text-rose-600">Gagal memuat barang.</div>
            ) : barangList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
              <div className="p-10 bg-white rounded-xl text-slate-500 text-center border">Belum ada barang.</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}