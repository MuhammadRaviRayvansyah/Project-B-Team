"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import Image from "next/image";
import { peminjaman, barang, kategori } from "@/app/data";

export default function PeminjamanSayaPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  // Melakukan 'JOIN' data di frontend
  const riwayatAktif = peminjaman
    .filter((p) => p.status !== "Dikembalikan" && p.status !== "Dibatalkan") // Hanya peminjaman aktif
    .map((p) => {
      const detailBarang = barang.find((b) => b.id_barang === p.id_barang) || {};
      const detailKategori = kategori.find((k) => k.id_kategori === detailBarang.id_kategori) || {};
      return {
        ...p,
        nama_barang: detailBarang.nama_barang,
        nama_kategori: detailKategori.nama_kategori,
        gambar: detailBarang.gambar,
        ukuran: detailBarang.ukuran
      };
    });

  const tabs = [
    { label: "Semua", count: riwayatAktif.length },
    { label: "Menunggu Persetujuan", count: riwayatAktif.filter(i => i.status === "Menunggu Persetujuan").length },
    { label: "Disetujui", count: riwayatAktif.filter(i => i.status === "Disetujui").length },
    { label: "Sedang Dipinjam", count: riwayatAktif.filter(i => i.status === "Sedang Dipinjam").length },
    { label: "Ditolak", count: riwayatAktif.filter(i => i.status === "Ditolak").length },
  ];

  const filteredData = riwayatAktif.filter((item) => {
    if (activeTab === "Semua") return true;
    return item.status === activeTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          
          <div className="py-10">
            <Hero category="PEMANTAUAN PEMINJAMAN" title="Peminjaman Saya" description="Pantau status permohonan peminjaman aktif Anda." />
          </div>

          <section className="mb-6">
            <div className="flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 pt-1">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`whitespace-nowrap px-3.5 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === tab.label ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] md:text-xs ${activeTab === tab.label ? "text-slate-300" : "text-slate-400"}`}>({tab.count})</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mb-8 space-y-3 md:space-y-4">
            {filteredData.map((item) => (
              <ItemPeminjamanCard key={item.id_peminjaman} item={item} />
            ))}
            {filteredData.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-sm">
                Tidak ada peminjaman dalam kategori ini.
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

function ItemPeminjamanCard({ item }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Sedang Dipinjam": return { bg: "bg-slate-800", text: "text-white", dot: "bg-sky-400" };
      case "Menunggu Persetujuan": return { bg: "bg-amber-900", text: "text-white", dot: "bg-amber-400" };
      case "Disetujui": return { bg: "bg-emerald-900", text: "text-white", dot: "bg-emerald-400" };
      case "Ditolak": return { bg: "bg-rose-900", text: "text-white", dot: "bg-rose-400" };
      default: return { bg: "bg-slate-800", text: "text-white", dot: "bg-slate-400" };
    }
  };
  const badgeStyle = getStatusBadge(item.status);

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200/60 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100 relative">
          <Image src={item.gambar} alt={item.nama_barang} fill className="object-cover" />
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-500">
            <span className="font-semibold text-slate-700">ID TRX: #{item.id_peminjaman}</span>
            <span className="hidden sm:inline">•</span>
            <span>{item.nama_kategori}</span>
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900">{item.nama_barang}</h3>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] md:text-xs text-slate-600">
            <span className="flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-sm">shopping_bag</span>{item.jumlah} Unit (Size {item.ukuran})</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>Pinjam: <strong className="text-slate-800">{item.tanggal_peminjaman}</strong></span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">event</span>Kembali: <strong className="text-slate-800">{item.tanggal_pengembalian}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-0 border-slate-100 gap-3">
        <div className="text-right hidden lg:block">
          <span className="text-[10px] md:text-xs font-medium text-slate-400 block mb-1.5">Status Pengajuan</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}>
            <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />{item.status}
          </span>
        </div>
        <span className={`lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />{item.status}
        </span>
        <button type="button" onClick={() => alert(`Total Biaya: Rp${item.total_harga}`)} className="text-xs md:text-sm font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1">
          Rincian Biaya <span className="material-symbols-outlined text-sm md:text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}