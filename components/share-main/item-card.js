
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Star,
} from "lucide-react";

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
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"
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
      className="group rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden hover:border-amber-400/50 hover:bg-slate-900/80 transition-all duration-300 flex flex-col h-full backdrop-blur-md"
    >
      {/* ================= GAMBAR ================= */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">

        <img
          src={imgSrc}
          alt={nama_barang}
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"
            )
          }
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent pointer-events-none" />

        {/* Badge Ketersediaan */}
        {isAvailable ? (
          <span className="absolute top-3 left-3 bg-emerald-400 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md">
            Tersedia
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md">
            Stok Habis
          </span>
        )}

        {/* Ukuran */}
        <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 text-[11px] px-2.5 py-1 rounded-md">
          Ukuran: {ukuran && ukuran !== "-" ? ukuran : "All Size"}
        </span>
      </div>

      {/* ================= KONTEN ================= */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

        {/* Kategori & Nama */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              {nama_kategori || "Pakaian"}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {nama_barang}
          </h3>
        </div>

        {/* ================= INFORMASI ================= */}
        <div className="pt-3 border-t border-white/5">

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 block">
              Sewa / Hari
            </span>

            <span className="text-[10px] text-slate-400">
              Sisa {stok || 0} unit
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">

            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-amber-400">
                Rp {Number(harga_sewa || 0).toLocaleString("id-ID")}
              </span>

              <span className="text-[10px] text-slate-400">
                / hari
              </span>
            </div>

            {hasReviews ? (
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{avgRating}</span>

                <span className="text-slate-500 font-normal text-[10px]">
                  ({ulasan.length})
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-500">
                Belum ada review
              </span>
            )}
          </div>
        </div>

        {/* ================= TOMBOL ================= */}
        <div>
          <div className="w-full px-3 py-2.5 rounded-xl bg-white/5 hover:bg-amber-400 border border-white/10 hover:border-amber-400 text-white hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5">
            <span>Lihat Detail & Pinjam</span>

            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </Link>
  );
}

