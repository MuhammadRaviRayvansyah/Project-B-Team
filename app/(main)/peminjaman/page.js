"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import Image from "next/image";
// Data Dummy Peminjaman
const DATA_PEMINJAMAN = [
  {
    id: "RNT-2025-0891",
    kategori: "Busana Formal",
    nama: "Jas Formal Pria Midnight Navy",
    unitInfo: "1 Unit (Size L)",
    tglAwalLabel: "Ambil:",
    tglAwal: "20 Okt 2025",
    tglAkhirLabel: "Batas Kembali:",
    tglAkhir: "25 Okt 2025",
    status: "Sedang Dipinjam",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&auto=format&fit=crop",
  },
  {
    id: "RNT-2025-0902",
    kategori: "Busana Tradisional",
    nama: "Kebaya Modern Kartini Cream",
    unitInfo: "1 Unit (Size M)",
    tglAwalLabel: "Rencana Pinjam:",
    tglAwal: "24 Okt 2025",
    tglAkhirLabel: "Rencana Kembali:",
    tglAkhir: "28 Okt 2025",
    status: "Menunggu Persetujuan",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop",
  },
  {
    id: "RNT-2025-0844",
    kategori: "Alas Kaki & Aksesori",
    nama: "Sepatu Pantofel Oxford Leather",
    unitInfo: "1 Pasang (Ukuran 42)",
    tglAwalLabel: "Siap Diambil:",
    tglAwal: "22 Okt 2025",
    tglAkhirLabel: "Batas Kembali:",
    tglAkhir: "26 Okt 2025",
    status: "Disetujui",
    img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop",
  },
  {
    id: "RNT-2025-0789",
    kategori: "Perlengkapan Acara",
    nama: "Kamera DSLR Sony Alpha A7 III Kit",
    unitInfo: "1 Paket Lengkap",
    tglAwalLabel: "Diajukan:",
    tglAwal: "15 Okt 2025",
    catatan: "Jadwal bentrok dengan kegiatan fakultas",
    status: "Ditolak",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop",
  },
];

export default function PeminjamanSayaPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  // Opsi Tab Filter
  const tabs = [
    { label: "Semua", count: 4 },
    { label: "Menunggu", count: 1 },
    { label: "Disetujui", count: 1 },
    { label: "Sedang Dipinjam", count: 1 },
    { label: "Ditolak", count: 1 },
  ];

  // Logika Filter Data
  const filteredData = DATA_PEMINJAMAN.filter((item) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Menunggu") return item.status === "Menunggu Persetujuan";
    return item.status === activeTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <div className="py-10">
            <Hero
              category="PEMANTAUAN PEMINJAMAN"
              title="Peminjaman Saya"
              description="Pantau status permohonan peminjaman busana dan perlengkapan aktif Anda."
            />
          </div>

          {/* Tab Filter Button */}
          <section className="mb-6">
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] ${
                        isActive ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* List Card Peminjaman */}
          <section className="mb-8 space-y-3">
            {filteredData.map((item) => (
              <ItemPeminjamanCard key={item.id} item={item} />
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-sm">
                Tidak ada peminjaman dalam kategori ini.
              </div>
            )}
          </section>

          {/* Footer Info Box */}
          <section className="mb-12">
            <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-700 text-xl shrink-0 mt-0.5">
                  verified
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Ketentuan Pengambilan & Pengembalian
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    Tunjukkan Kartu Tanda Mahasiswa (KTM) asli dan bukti
                    persetujuan digital di Loket Sarpras Gedung Rektorat Lt. 1
                    saat jadwal pengambilan.
                  </p>
                </div>
              </div>
              <a
                href="#"
                className="text-xs font-semibold text-slate-800 hover:text-slate-900 flex items-center gap-1 shrink-0 self-end sm:self-center transition-colors"
              >
                Baca SOP Selengkapnya
                <span className="material-symbols-outlined text-sm">
                  open_in_new
                </span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Sub-Component: Item Card Individual
function ItemPeminjamanCard({ item }) {
  // Config Badge Status menggunakan Slate/Color Scale Bawaan
  const getStatusBadge = (status) => {
    switch (status) {
      case "Sedang Dipinjam":
        return { bg: "bg-slate-800", text: "text-white", dot: "bg-sky-400" };
      case "Menunggu Persetujuan":
        return { bg: "bg-amber-900", text: "text-white", dot: "bg-amber-400" };
      case "Disetujui":
        return {
          bg: "bg-emerald-900",
          text: "text-white",
          dot: "bg-emerald-400",
        };
      case "Ditolak":
        return { bg: "bg-rose-900", text: "text-white", dot: "bg-rose-400" };
      default:
        return { bg: "bg-slate-800", text: "text-white", dot: "bg-slate-400" };
    }
  };

  const badgeStyle = getStatusBadge(item.status);

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Gambar Barang */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
          <Image
            src={item.img}
            alt={item.nama}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Informasi Detail */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">ID: {item.id}</span>
            <span>•</span>
            <span>Kategori: {item.kategori}</span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-slate-900">
            {item.nama}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-sm text-slate-500">
                shopping_bag
              </span>
              {item.unitInfo}
            </span>

            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-slate-500">
                calendar_today
              </span>
              {item.tglAwalLabel}{" "}
              <strong className="text-slate-800 font-semibold">
                {item.tglAwal}
              </strong>
            </span>

            {item.tglAkhir && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-slate-500">
                  event
                </span>
                {item.tglAkhirLabel}{" "}
                <strong className="text-slate-800 font-semibold">
                  {item.tglAkhir}
                </strong>
              </span>
            )}

            {item.catatan && (
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <span className="material-symbols-outlined text-sm">info</span>
                {item.catatan}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Status & Tombol Detail */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 gap-3">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-medium text-slate-400 block mb-1">
            Status Pengajuan
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
            {item.status}
          </span>
        </div>

        {/* Badge Tampilan Mobile */}
        <span
          className={`sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
          {item.status}
        </span>

        {/* Tombol Lihat Detail */}
        <button
          type="button"
          onClick={() => alert(`Detail peminjaman: ${item.id}`)}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          Lihat Detail
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
