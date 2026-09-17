"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import { kategori, barang } from "@/app/data";

export default function BerandaPage() {
  const handleDetail = (nama) => {
    console.log("Lihat detail:", nama);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <div className="py-10">
            <Hero
              category="Sistem Informasi Penyewaan Perlengkapan Acara"
              title="Selamat Datang"
              description="Temukan barang untuk kebutuhan acara Anda."
            />
          </div>

          {/* Kategori */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Kategori
                </h2>
                <p className="text-xs text-slate-600 tracking-wide mt-0.5">
                  Pilih perlengkapan sesuai jenis acara
                </p>
              </div>
              <Link
                href="#"
                className="text-xs font-medium text-slate-700 hover:underline flex items-center gap-1 transition-colors"
              >
                Semua Kategori{" "}
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {kategori.map((k) => (
                <CategoryCard
                  key={k.nama}
                  icon={k.icon}
                  nama={k.nama}
                  jumlah={k.jumlah}
                />
              ))}
            </div>
          </section>

          {/* Barang Tersedia */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Barang Tersedia
                </h2>
                <p className="text-xs text-slate-600 tracking-wide mt-0.5">
                  Daftar perlengkapan yang tersedia minggu ini
                </p>
              </div>
              <Link
                href="#"
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                Lihat Katalog Penuh{" "}
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {barang.map((b) => (
                <ItemCard
                  key={b.nama}
                  nama={b.nama}
                  ukuran={b.ukuran}
                  stok={b.stok}
                  hargaPerHari={b.hargaPerHari}
                  img={b.img}
                  onDetail={() => handleDetail(b.nama)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
