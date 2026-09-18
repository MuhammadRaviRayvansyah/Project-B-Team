"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import { kategori, barang } from "@/app/data";

export default function BerandaPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriAktifId, setKategoriAktifId] = useState("Semua");

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/barang?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const barangTampil =
    kategoriAktifId === "Semua"
      ? barang.slice(0, 3) // Tampilkan 3 barang teratas di beranda
      : barang.filter((b) => b.id_kategori === kategoriAktifId);

  const getNamaKategori = (id) => {
    const kat = kategori.find((k) => k.id_kategori === id);
    return kat ? kat.nama_kategori : "Lainnya";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          
          {/* Hero Section dengan Search Bar */}
          <div className="py-8">
            <Hero
              category="PORTAL PEMINJAMAN MAHASISWA"
              title="Selamat Datang"
              description="Temukan barang untuk kebutuhan acara Anda."
              showSearch={true}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>

          {/* Kategori Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Kategori</h2>
                <p className="text-[11px] text-slate-500">Pilih perlengkapan sesuai jenis acara</p>
              </div>
              <Link href="/barang" className="text-xs font-medium text-slate-700 hover:underline flex items-center gap-1">
                Semua Kategori <span className="material-symbols-outlined text-base">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {kategori.map((k) => (
                <div
                  key={k.id_kategori}
                  onClick={() => setKategoriAktifId(k.id_kategori)}
                  className={`cursor-pointer transition-all duration-200 rounded-2xl ${
                    kategoriAktifId === k.id_kategori ? "ring-2 ring-slate-900 shadow-md" : "hover:opacity-100"
                  }`}
                >
                  <CategoryCard
                    icon={k.icon}
                    nama_kategori={k.nama_kategori}
                    jumlah_koleksi={k.jumlah_koleksi}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Barang Tersedia Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">Barang Tersedia</h2>
                <p className="text-[11px] text-slate-500">Daftar perlengkapan yang tersedia minggu ini</p>
              </div>
              <Link href="/barang" className="text-xs font-medium text-slate-700 hover:underline flex items-center gap-1">
                Lihat Katalog Penuh <span className="material-symbols-outlined text-base">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {barangTampil.map((b) => {
                const kat = kategori.find((k) => k.id_kategori === b.id_kategori);
                return (
                  <ItemCard
                    key={b.id_barang}
                    id_barang={b.id_barang}
                    nama_barang={b.nama_barang}
                    nama_kategori={kat ? kat.nama_kategori : ""}
                    ukuran={b.ukuran}
                    stok={b.stok}
                    harga_sewa={b.harga_sewa}
                    gambar={b.gambar}
                  />
                );
              })}
            </div>
          </section>

          {/* Alur / Langkah Peminjaman (Sesuai Gambar Kiri Bawah) */}
          <section className="mb-16 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="flex items-start gap-3 pt-4 md:pt-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center shrink-0 text-xs">1</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Pilih Perlengkapan</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Cari barang yang Anda butuhkan lalu tentukan tanggal kegiatan.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-4 md:pt-0 md:pl-6">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center shrink-0 text-xs">2</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Verifikasi Dokumen</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Unggah surat rekomendasi dan tunggu permohonan disetujui.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-4 md:pt-0 md:pl-6">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center shrink-0 text-xs">3</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Pengambilan di Loket</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Tunjukkan QR kode peminjaman di gedung perlengkapan kampus.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}