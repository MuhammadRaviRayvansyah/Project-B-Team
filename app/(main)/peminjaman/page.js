"use client"
import React, { useState } from 'react';

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
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&auto=format&fit=crop"
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
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop"
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
    img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop"
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
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop"
  }
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
    <div className="pt-20 w-full bg-[#f8fafc] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div>
          <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
            PEMANTAUAN PEMINJAMAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181c20] mt-0.5">
            Peminjaman Saya
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pantau status permohonan peminjaman busana dan perlengkapan aktif Anda.
          </p>
        </div>

        {/* Tab Filter Button */}
        <div className="flex flex-wrap items-center gap-2 pt-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1e293b] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] ${isActive ? "text-gray-300" : "text-gray-400"}`}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* List Card Peminjaman */}
        <div className="space-y-3">
          {filteredData.map((item) => (
            <ItemPeminjamanCard key={item.id} item={item} />
          ))}
        </div>

        {/* Footer Info Box */}
        <div className="bg-[#f1f5f9]/70 rounded-xl p-4 border border-gray-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-gray-700 text-xl shrink-0 mt-0.5">
              verified
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#181c20]">
                Ketentuan Pengambilan & Pengembalian
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                Tunjukkan Kartu Tanda Mahasiswa (KTM) asli dan bukti persetujuan digital di Loket Sarpras Gedung Rektorat Lt. 1 saat jadwal pengambilan.
              </p>
            </div>
          </div>
          <a
            href="#"
            className="text-xs font-semibold text-gray-800 hover:text-black flex items-center gap-1 shrink-0 self-end sm:self-center"
          >
            Baca SOP Selengkapnya
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>

      </div>
    </div>
  );
}

// Sub-Component: Item Card Individual
function ItemPeminjamanCard({ item }) {
  // Config Badge Status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Sedang Dipinjam":
        return { bg: "bg-[#253245]", text: "text-white", dot: "bg-blue-400" };
      case "Menunggu Persetujuan":
        return { bg: "bg-[#2b1f1d]", text: "text-white", dot: "bg-amber-500" };
      case "Disetujui":
        return { bg: "bg-[#1c2826]", text: "text-white", dot: "bg-emerald-400" };
      case "Ditolak":
        return { bg: "bg-[#881337]", text: "text-white", dot: "bg-rose-400" };
      default:
        return { bg: "bg-gray-800", text: "text-white", dot: "bg-gray-400" };
    }
  };

  const badgeStyle = getStatusBadge(item.status);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Gambar Barang */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f1f5f9] rounded-lg overflow-hidden shrink-0">
          <img
            src={item.img}
            alt={item.nama}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Informasi Detail */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span className="font-semibold text-gray-700">ID: {item.id}</span>
            <span>•</span>
            <span>Kategori: {item.kategori}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#181c20]">
            {item.nama}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-600">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-sm">shopping_bag</span>
              {item.unitInfo}
            </span>

            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {item.tglAwalLabel} <strong className="text-gray-800">{item.tglAwal}</strong>
            </span>

            {item.tglAkhir && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">event</span>
                {item.tglAkhirLabel} <strong className="text-gray-800">{item.tglAkhir}</strong>
              </span>
            )}

            {item.catatan && (
              <span className="flex items-center gap-1 text-rose-600">
                <span className="material-symbols-outlined text-sm">info</span>
                {item.catatan}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Status & Tombol Detail */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 gap-3">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-semibold text-gray-400 block mb-1">
            Status Pengajuan
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
            {item.status}
          </span>
        </div>

        {/* Badge Tampilan Mobile */}
        <span className={`sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
          {item.status}
        </span>

        {/* Tombol Lihat Detail */}
        <button
          type="button"
          onClick={() => alert(`Detail peminjaman: ${item.id}`)}
          className="text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1 transition-colors"
        >
          Lihat Detail
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}