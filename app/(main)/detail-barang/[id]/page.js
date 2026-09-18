"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { barang, kategori } from "@/app/data";
import ItemCard from "@/components/ItemCard";

export default function DetailBarangPage() {
  const params = useParams();
  const idBarang = Number(params.id);

  // Cari data barang berdasarkan ID dari data dummy / database
  const item = barang.find((b) => b.id_barang === idBarang) || barang[0];
  const kat = kategori.find((k) => k.id_kategori === item.id_kategori);

  const [selectedImage, setSelectedImage] = useState(item.gambar);
  const [tglPakai, setTglPakai] = useState("");
  const [jumlah, setJumlah] = useState("1 Unit");

  // Contoh barang terkait (rekomendasi)
  const relatedItems = barang.filter((b) => b.id_barang !== item.id_barang).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-16 flex-1">
        
        {/* Breadcrumb Navigasi */}
        <div className="flex items-center gap-2 text-xs text-slate-500 py-6">
          <Link href="/barang" className="hover:underline flex items-center gap-1 text-slate-700">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Katalog
          </Link>
          <span>/</span>
          <span>{kat ? kat.nama_kategori : "Kategori"}</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">{item.nama_barang}</span>
        </div>

        {/* Konten Utama Detail (Grid 2 Kolom) */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* KOLOM KIRI: Galeri Foto */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="w-full h-80 sm:h-96 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-100">
              <span className="absolute top-3 left-3 z-10 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
                ID: BRG-00{item.id_barang}
              </span>
              <Image
                src={selectedImage}
                alt={item.nama_barang}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            {/* Thumbnail Pilihan Gambar */}
            <div className="flex items-center gap-3">
              {[item.gambar, "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&auto=format&fit=crop"].map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(imgSrc)}
                  className={`w-20 h-20 rounded-lg overflow-hidden relative cursor-pointer border-2 transition-all ${
                    selectedImage === imgSrc ? "border-slate-900 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={imgSrc} alt="Thumbnail" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* KOLOM KANAN: Informasi & Form Sewa */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  KATEGORI: {kat ? kat.nama_kategori.toUpperCase() : ""}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-emerald-900 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {item.stok > 0 ? "Tersedia" : "Habis"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                {item.nama_barang}
              </h1>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">Deskripsi Perlengkapan</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.deskripsi || "Perlengkapan resmi berkualitas tinggi yang nyaman dikenakan untuk berbagai kegiatan dan acara kampus secara terpusat."}
                </p>
              </div>

              {/* Kartu Spesifikasi Singkat */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-6">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Ukuran</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{item.ukuran}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Ketersediaan Stok</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{item.stok} Unit Tersedia</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Kondisi Fisik</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-700">Sangat Baik</p>
                </div>
              </div>

              {/* Form Input Peminjaman */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Rencana Tanggal Pakai</label>
                  <input
                    type="date"
                    value={tglPakai}
                    onChange={(e) => setTglPakai(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Jumlah Pinjam</label>
                  <select
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="1 Unit">1 Unit</option>
                    <option value="2 Unit">2 Unit</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tombol Aksi & Ketentuan Pengambilan */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => alert(`Berhasil mengajukan peminjaman untuk ${item.nama_barang}`)}
                className="w-full bg-[#1f293d] text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">shopping_bag</span>
                Sewa Barang
              </button>

              <div className="bg-sky-50/60 rounded-xl p-3.5 border border-sky-100 flex items-start gap-3">
                <span className="material-symbols-outlined text-sky-700 text-lg shrink-0 mt-0.5">info</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Ketentuan Pengambilan:</strong> Peminjaman maksimal 5 hari kerja. Ambil barang di Loket Logistik Rektorat/Sarpras (Gedung Rektorat Lt. 1) dengan menunjukkan KTM aktif.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bagian Bawah: Pelengkap Terkait */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pelengkap Terkait</h2>
              <p className="text-xs text-slate-500">Perlengkapan yang sering dipinjam bersama item ini</p>
            </div>
            <Link href="/barang" className="text-xs font-semibold text-slate-700 hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedItems.map((b) => {
              const relKat = kategori.find((k) => k.id_kategori === b.id_kategori);
              return (
                <ItemCard
                  key={b.id_barang}
                  id_barang={b.id_barang}
                  nama_barang={b.nama_barang}
                  nama_kategori={relKat ? relKat.nama_kategori : ""}
                  ukuran={b.ukuran}
                  stok={b.stok}
                  harga_sewa={b.harga_sewa}
                  gambar={b.gambar}
                />
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}