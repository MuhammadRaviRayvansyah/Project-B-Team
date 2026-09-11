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
    <div className="bg-[#f7f9ff] text-[14px] leading-[20px] text-[#181c20] antialiased min-h-screen flex flex-col">
      <main className="w-full max-w-[1200px] mx-auto px-[1rem] md:px-[2rem] pt-16 flex-1">
        <div className="flex flex-col w-full">
          <Hero />

          {/* Kategori */}
          <section className="mb-[2rem]">
            <div className="flex items-center justify-between mb-[1rem]">
              <div>
                <h2 className="text-[24px] leading-[32px] tracking-[-0.015em] font-semibold text-[#181c20]">
                  Kategori
                </h2>
                <p className="text-[13px] leading-[18px] tracking-[0.01em] text-[#44474c]">
                  Pilih perlengkapan sesuai jenis acara
                </p>
              </div>
              <Link
                href="#"
                className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#2f3a4a] hover:underline flex items-center gap-[0.25rem]"
              >
                Semua Kategori{" "}
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1rem]">
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
          <section className="mb-[3rem]">
            <div className="flex items-center justify-between mb-[1rem]">
              <div>
                <h2 className="text-[24px] leading-[32px] tracking-[-0.015em] font-semibold text-[#181c20]">
                  Barang Tersedia
                </h2>
                <p className="text-[13px] leading-[18px] tracking-[0.01em] text-[#44474c]">
                  Daftar perlengkapan yang tersedia minggu ini
                </p>
              </div>
              <Link
                href="#"
                className="text-[12px] leading-[16px] tracking-[0.01em] font-medium text-[#575f67] hover:text-[#181c20] flex items-center gap-[0.25rem]"
              >
                Lihat Katalog Penuh{" "}
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
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
