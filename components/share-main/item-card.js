"use client";

import Link from "next/link";
import { useState } from "react";

export default function ItemCard({
  id_barang,
  nama_barang,
  nama_kategori,
  ukuran,
  stok,
  harga_sewa,
  gambar,
  ulasan = [],
}) {
  const [imgSrc, setImgSrc] = useState(
    gambar || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"
  );

  const isAvailable = Number(stok) > 0;

  // Hitung rating nyata jika ulasan tersedia
  const hasReviews = Array.isArray(ulasan) && ulasan.length > 0;
  const avgRating = hasReviews
    ? (
        ulasan.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) /
        ulasan.length
      ).toFixed(1)
    : null;

  return (
    <Link 
      href={`/detail-barang/${id_barang}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 p-3.5 hover:border-amber-400 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300"
    >
      {/* 1. BAGIAN ATAS: Gambar & Badge Ketersediaan */}
      <div className="w-full aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden relative mb-3.5 shrink-0">
        <img
          src={imgSrc}
          alt={nama_barang}
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"
            )
          }
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge Status / Ketersediaan */}
        {isAvailable ? (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-700 shadow-sm border border-emerald-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Tersedia
          </span>
        ) : (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-rose-500/95 backdrop-blur-md text-white rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Stok Habis
          </span>
        )}
      </div>

      {/* Konten Card */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        {/* 2. BAGIAN UTAMA: Nama, Kategori, Ukuran */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              {nama_kategori || "Pakaian"}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-500">
              {ukuran && ukuran !== "-" ? `Ukuran ${ukuran}` : "All Size"}
            </span>
          </div>

          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {nama_barang}
          </h3>
        </div>

        {/* 3. BAGIAN INFORMASI: Harga Sewa, Stok, Rating */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Harga Sewa
            </span>
            <span className="text-[11px] font-semibold text-slate-600">
              Sisa {stok || 0} unit
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-slate-900">
                Rp {Number(harga_sewa || 0).toLocaleString("id-ID")}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">/ hari</span>
            </div>

            {hasReviews ? (
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <span className="material-symbols-outlined text-[15px]">star</span>
                <span>{avgRating}</span>
                <span className="text-slate-400 font-normal text-[10px]">({ulasan.length})</span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">Belum ada review</span>
            )}
          </div>
        </div>

        {/* 4. BAGIAN BAWAH: Tombol Aksi Detail */}
        <div className="pt-2">
          <div className="w-full py-2 px-3 rounded-xl bg-slate-900 group-hover:bg-amber-400 text-white group-hover:text-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs">
            <span>Lihat Detail & Pinjam</span>
            <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}