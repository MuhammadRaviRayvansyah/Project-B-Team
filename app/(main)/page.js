"use client";
import { useState } from "react"; // 1. Import useState dari React
import Link from "next/link";

import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import { kategori, barang } from "@/app/data";

export default function BerandaPage() {
  // 2. Buat state untuk menyimpan kategori yang sedang aktif
  // Nilai awalnya adalah "Semua" agar saat pertama dibuka, semua barang tampil
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  // 3. Buat logika penyaring (filter) data barang
  // Jika kategori "Semua", tampilkan semua. Jika tidak, cocokkan dengan nama kategori
  const barangTampil =
    kategoriAktif === "Semua"
      ? barang
      : barang.filter((b) => b.kategori === kategoriAktif);

  return (
    <div className="bg-[#f7f9ff] text-[14px] leading-[20px] text-[#181c20] antialiased min-h-screen flex flex-col">
      <main className="w-full max-w-[1200px] mx-auto px-[1rem] md:px-[2rem] pt-16 flex-1">
        <div className="flex flex-col w-full">
          <Hero />

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
              
              {/* 4. Ubah Link ini menjadi tombol reset untuk menampilkan "Semua Kategori" */}
              <button
                onClick={() => setKategoriAktif("Semua")}
                className={`text-[12px] leading-[16px] tracking-[0.01em] font-medium flex items-center gap-[0.25rem] ${
                  kategoriAktif === "Semua" ? "text-blue-600 font-bold" : "text-[#2f3a4a] hover:underline"
                }`}
              >
                Semua Kategori{" "}
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>

            {/* 5. Pembaruan Responsif Grid Kategori: 
                Mobile (2 kolom), Tablet/sm (3 kolom), Desktop/lg (4 kolom) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[1rem]">
              {kategori.map((k) => (
                <div
                  key={k.nama}
                  onClick={() => setKategoriAktif(k.nama)}
                  // Berikan efek visual klik dan tanda aktif (border) pada kategori yang dipilih
                  className={`cursor-pointer transition-all duration-200 rounded-xl rounded-2xl ${
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

          <section className="mb-[3rem]">
            <div className="flex items-center justify-between mb-[1rem]">
              <div>
                <h2 className="text-[24px] leading-[32px] tracking-[-0.015em] font-semibold text-[#181c20]">
                  {kategoriAktif === "Semua" ? "Barang Tersedia" : `Kategori: ${kategoriAktif}`}
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

            {/* 6. Pembaruan Responsif Grid Barang: 
                Mobile (1 kolom), Tablet/sm (2 kolom), Desktop/md (3 kolom), Desktop Lebar/lg (4 kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1.5rem]">
              {/* 7. Ubah mapping dari "barang" menjadi "barangTampil" (hasil filter) */}
              {barangTampil.length > 0 ? (
                barangTampil.map((b) => (
                  <ItemCard
                    key={b.id}
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
                // Tampilan jika kategori yang dipilih tidak memiliki barang
                <div className="col-span-full text-center py-10 text-gray-500">
                  Belum ada barang untuk kategori ini.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}