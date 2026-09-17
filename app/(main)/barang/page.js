"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Filter from "@/components/filter";
import ItemCard from "@/components/ItemCard";
import { barang } from "@/app/data";

export default function BarangPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedSize, setSelectedSize] = useState("Semua");

  const filteredBarang = barang.filter((b) => {
    const matchSearch = b.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === "Semua" || b.kategori === selectedCategory;

    const matchSize = selectedSize === "Semua" || b.ukuran === selectedSize;

    return matchSearch && matchCategory && matchSize;
  });

  const handleDetail = (nama) => {
    console.log("Detail barang:", nama);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <div className="py-10">
            <Hero
              category="KATALOG BARANG"
              title="Peminjaman Barang"
              description="Cek barang dan ketersediaannya melalui katalog dibawah ini."
            />
          </div>

          {/* Filter Section */}
          <section className="mb-6">
            <Filter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </section>

          {/* Daftar Barang Grid */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredBarang.map((b) => (
                <ItemCard
                  key={b.nama}
                  nama={b.nama}
                  kategori={b.kategori}
                  ukuran={b.ukuran}
                  stok={b.stok}
                  hargaPerHari={b.hargaPerHari}
                  img={b.img}
                  onDetail={() => handleDetail(b.nama)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredBarang.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-sm mt-4">
                Tidak ada barang yang sesuai dengan filter.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}