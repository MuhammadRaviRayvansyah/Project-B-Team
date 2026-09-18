"use client";

import { useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import { kategori, barang } from "@/app/data";

export default function BerandaPage() {
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const barangTampil =
    kategoriAktif === "Semua"
      ? barang
      : barang.filter((b) => b.kategori === kategoriAktif);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          
          <div className="py-10 md:py-12">
            <Hero
              category="Sistem Informasi Penyewaan Perlengkapan Acara"
              title="Selamat Datang"
              description="Temukan barang untuk kebutuhan acara Anda."
            />
          </div>

          <section className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                  Kategori
                </h2>
                <p className="text-[11px] md:text-xs text-slate-600 tracking-wide mt-0.5">
                  Pilih perlengkapan sesuai jenis acara
                </p>
              </div>
              
              <button
                onClick={() => setKategoriAktif("Semua")}
                className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                  kategoriAktif === "Semua" ? "text-blue-600 font-bold" : "text-slate-700 hover:underline"
                }`}
              >
                Semua Kategori
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {kategori.map((k) => (
                <div
                  key={k.nama}
                  onClick={() => setKategoriAktif(k.nama)}
                  className={`cursor-pointer transition-all duration-200 rounded-2xl ${
                    kategoriAktif === k.nama
                      ? "ring-2 ring-[#2f3a4a] shadow-md scale-[1.02]"
                      : "hover:scale-[1.02] opacity-90 hover:opacity-100"
                  }`}
                >
                  <CategoryCard
                    icon={k.icon}
                    nama={k.nama}
                    jumlah={k.jumlah}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2 sm:gap-0">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
                  {kategoriAktif === "Semua" ? "Barang Tersedia" : `Kategori: ${kategoriAktif}`}
                </h2>
                <p className="text-[11px] md:text-xs text-slate-600 tracking-wide mt-0.5">
                  Daftar perlengkapan yang tersedia minggu ini
                </p>
              </div>
              <Link
                href="/barang"
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                Lihat Katalog Penuh
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {barangTampil.length > 0 ? (
                barangTampil.map((b) => (
                  <ItemCard
                    key={b.id || b.nama}
                    id={b.id}
                    nama={b.nama}
                    kategori={b.kategori}
                    ukuran={b.ukuran}
                    stok={b.stok}
                    hargaPerHari={b.hargaPerHari}
                    img={b.img}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inventory_2</span>
                  <p className="text-sm text-gray-500 font-medium">Belum ada barang untuk kategori ini.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}