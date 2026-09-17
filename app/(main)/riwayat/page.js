"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";

// Data Dummy Riwayat
const INITIAL_HISTORY = [
  {
    id: "#RW-2025-0891",
    barang: "Kebaya Kartini",
    tglPinjam: "15 Sep 2025",
    tglKembali: "19 Sep 2025",
    status: "Dikembalikan",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop",
  },
  {
    id: "#RW-2025-0742",
    barang: "Jas Formal Pria",
    tglPinjam: "02 Agu 2025",
    tglKembali: "05 Agu 2025",
    status: "Dikembalikan",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&auto=format&fit=crop",
  },
  {
    id: "#RW-2025-0618",
    barang: "Sepatu Heels Formal",
    tglPinjam: "12 Jun 2025",
    tglKembali: "16 Jun 2025",
    status: "Ditolak",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&auto=format&fit=crop",
  },
  {
    id: "#RW-2025-0504",
    barang: "Toga Wisuda",
    tglPinjam: "20 Mei 2025",
    tglKembali: "23 Mei 2025",
    status: "Dikembalikan",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop",
  },
];

export default function RiwayatSayaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");

  // Kalkulasi Statistik Ringkasan
  const totalRiwayat = INITIAL_HISTORY.length;
  const dikembalikanCount = INITIAL_HISTORY.filter(
    (i) => i.status === "Dikembalikan"
  ).length;
  const ditolakCount = INITIAL_HISTORY.filter(
    (i) => i.status === "Ditolak"
  ).length;

  // Logika Filter Data
  const filteredData = INITIAL_HISTORY.filter((item) => {
    const matchSearch =
      item.barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "Semua" || item.status === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9ff] text-slate-900 antialiased text-sm leading-relaxed">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 flex-1">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <div className="py-10">
            <Hero
              category="RIWAYAT PEMINJAMAN"
              title="Riwayat Saya"
              description="Daftar arsip peminjaman yang telah selesai atau dibatalkan."
            />
          </div>

          {/* Summary Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Riwayat */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Riwayat</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {totalRiwayat}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined text-xl">
                  folder_open
                </span>
              </div>
            </div>

            {/* Selesai / Dikembalikan */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Selesai / Dikembalikan
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {dikembalikanCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                <span className="material-symbols-outlined text-xl">
                  check_circle
                </span>
              </div>
            </div>

            {/* Ditolak / Dibatalkan */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Ditolak / Dibatalkan
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {ditolakCount}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <span className="material-symbols-outlined text-xl">cancel</span>
              </div>
            </div>
          </section>

          {/* Filter & Search Bar */}
          <section className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari riwayat peminjaman..."
                className="w-full bg-slate-100/80 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
              />
            </div>

            {/* Tab Filter */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg w-full sm:w-auto">
              {["Semua", "Dikembalikan", "Ditolak"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* Tabel Data Riwayat */}
          <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                    <th className="py-3 px-4">Barang</th>
                    <th className="py-3 px-4">Tanggal Pinjam</th>
                    <th className="py-3 px-4">Tanggal Kembali</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Barang */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={row.img}
                              alt={row.barang}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 text-xs">
                                {row.barang}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                ID: {row.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tanggal Pinjam */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {row.tglPinjam}
                        </td>

                        {/* Tanggal Kembali */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {row.tglKembali}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                              row.status === "Dikembalikan"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-rose-900 text-white"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                row.status === "Dikembalikan"
                                  ? "bg-slate-500"
                                  : "bg-rose-400"
                              }`}
                            />
                            {row.status}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => alert(`Detail riwayat: ${row.id}`)}
                            className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400">
                        Tidak ada riwayat peminjaman ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Table & Pagination */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>
                Menampilkan {filteredData.length} dari {totalRiwayat} arsip
                peminjaman
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="px-2 py-1 text-slate-300 cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <button className="w-7 h-7 rounded-md bg-slate-900 text-white font-semibold flex items-center justify-center">
                  1
                </button>
                <button
                  disabled
                  className="px-2 py-1 text-slate-300 cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}