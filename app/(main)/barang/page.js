"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import ItemCard from "@/components/ItemCard";
import { kategori, barang } from "@/app/data";

export default function BarangPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedSize, setSelectedSize] = useState("Semua");

  const filteredBarang = barang.filter((b) => {
    const namaBarang = b.nama_barang || "";
    const matchSearch = namaBarang.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "Semua" || b.id_kategori === Number(selectedCategory);
    const matchSize = selectedSize === "Semua" || b.ukuran === selectedSize;

    return matchSearch && matchCategory && matchSize;
  });

  const totalSiapPinjam = barang.filter((b) => b.stok > 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          
          {/* Hero Section Katalog dengan Informasi Ringkas */}
          <div className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <Hero
                category="KATALOG INVENTARIS • Perlengkapan & Mahasiswa"
                title="Daftar Barang"
                description="Pilih perlengkapan resmi, busana seremonial, dan atribut kampus yang tersedia untuk dipinjam secara terpusat dan terverifikasi."
              />
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3 shrink-0 self-start md:self-center">
              <span className="material-symbols-outlined text-slate-700 bg-slate-100 p-2 rounded-xl">inventory_2</span>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Total Tersedia</p>
                <p className="text-sm font-bold text-slate-900">{totalSiapPinjam} Barang Siap Dipinjam</p>
              </div>
            </div>
          </div>

          {/* Filter Bar (Pencarian, Kategori, Ukuran) */}
          <section className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama barang atau nomor katalog..."
                className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 flex-1 md:flex-initial">
                <span className="text-xs text-slate-500 whitespace-nowrap">Kategori:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-800 border border-slate-200/60 rounded-xl px-3 py-2 focus:outline-none w-full md:w-auto"
                >
                  <option value="Semua">Semua</option>
                  {kategori.map((k) => (
                    <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 md:flex-initial">
                <span className="text-xs text-slate-500 whitespace-nowrap">Ukuran:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-800 border border-slate-200/60 rounded-xl px-3 py-2 focus:outline-none w-full md:w-auto"
                >
                  <option value="Semua">Semua</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="39">39</option>
                  <option value="42">42</option>
                </select>
              </div>
            </div>
          </section>

          {/* Grid Katalog Barang */}
          <section className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredBarang.length > 0 ? (
                filteredBarang.map((b) => {
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
                })
              ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inventory_2</span>
                  <p className="text-sm text-slate-500 font-medium">Tidak ada barang yang ditemukan.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}