"use client";

import { useState } from "react";
import Hero from "@/components/Hero-section";
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
      selectedCategory === "Semua" ||
      b.kategori === selectedCategory;

    const matchSize =
      selectedSize === "Semua" ||
      b.ukuran === selectedSize;

    return matchSearch && matchCategory && matchSize;
  });

  // Tidak menggunakan : string karena file JSX
  const handleDetail = (nama) => {
    console.log("Detail barang:", nama);
  };

  return (
    <main className="pt-24 px-4 sm:px-8 max-w-7xl mx-auto">

      <div className="mb-6">
        <Hero
          category="KATALOG FASILITAS"
          title="Peminjaman Ruangan"
          description="Cek jadwal dan ketersediaan ruang rapat serta laboratorium di lingkungan kampus."
        />
      </div>

      <Filter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
      />

      <div className="mb-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {filteredBarang.length === 0 && (
        <div className="text-center py-10 text-[#575f67]">
          Tidak ada barang yang sesuai dengan filter.
        </div>
      )}
    </main>
  );
}