"use client"
import React, { useState } from 'react';

const INITIAL_HISTORY = [
  {
    id: "#RW-2025-0891",
    barang: "Kebaya Kartini",
    tglPinjam: "15 Sep 2025",
    tglKembali: "19 Sep 2025",
    status: "Dikembalikan",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop"
  },
  {
    id: "#RW-2025-0742",
    barang: "Jas Formal Pria",
    tglPinjam: "02 Agu 2025",
    tglKembali: "05 Agu 2025",
    status: "Dikembalikan",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&auto=format&fit=crop"
  },
  {
    id: "#RW-2025-0618",
    barang: "Sepatu Heels Formal",
    tglPinjam: "12 Jun 2025",
    tglKembali: "16 Jun 2025",
    status: "Ditolak",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&auto=format&fit=crop"
  },
  {
    id: "#RW-2025-0504",
    barang: "Toga Wisuda",
    tglPinjam: "20 Mei 2025",
    tglKembali: "23 Mei 2025",
    status: "Dikembalikan",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop"
  }
];

export default function RiwayatSayaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");

  const totalRiwayat = INITIAL_HISTORY.length;
  const dikembalikanCount = INITIAL_HISTORY.filter(i => i.status === "Dikembalikan").length;
  const ditolakCount = INITIAL_HISTORY.filter(i => i.status === "Ditolak").length;

  const filteredData = INITIAL_HISTORY.filter((item) => {
    const matchSearch = item.barang.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "Semua" || item.status === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="pt-20 w-full bg-[#f8fafc] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              RIWAYAT PEMINJAMAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#181c20] mt-0.5">
              Riwayat Saya
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Daftar arsip peminjaman yang telah selesai atau dibatalkan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full md:w-auto px-4 py-2.5 md:py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Cetak Rekap
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Riwayat</p>
              <p className="text-xl font-bold text-[#181c20] mt-1">{totalRiwayat}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <span className="material-symbols-outlined text-xl">folder_open</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Selesai / Dikembalikan</p>
              <p className="text-xl font-bold text-[#181c20] mt-1">{dikembalikanCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Ditolak / Dibatalkan</p>
              <p className="text-xl font-bold text-[#181c20] mt-1">{ditolakCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <span className="material-symbols-outlined text-xl">cancel</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari riwayat peminjaman..."
              className="w-full bg-[#f1f5f9]/70 text-xs text-gray-800 placeholder-gray-400 pl-9 pr-4 py-2.5 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#2f3a4a]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#f1f5f9]/70 p-1 rounded-lg w-full lg:w-auto overflow-x-auto">
            {["Semua", "Dikembalikan", "Ditolak"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 lg:flex-none whitespace-nowrap px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-[#1e293b] text-white shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#f1f5f9]/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-4">Barang</th>
                  <th className="py-3 px-4">Tanggal Pinjam</th>
                  <th className="py-3 px-4">Tanggal Kembali</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredData.length > 0 ? (
                  filteredData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.img}
                            alt={row.barang}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#181c20] text-xs">{row.barang}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">ID: {row.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {row.tglPinjam}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {row.tglKembali}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            row.status === "Dikembalikan"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "Dikembalikan" ? "bg-gray-500" : "bg-rose-500"
                          }`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert(`Detail riwayat: ${row.id}`)}
                          className="text-xs font-semibold text-gray-700 hover:text-black transition-colors"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400">
                      Tidak ada riwayat peminjaman ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>
              Menampilkan {filteredData.length} dari {totalRiwayat} arsip peminjaman
            </p>
            <div className="flex items-center gap-1">
              <button disabled className="px-3 py-1.5 rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                Sebelumnya
              </button>
              <button className="w-8 h-8 rounded-md bg-[#1e293b] text-white font-semibold flex items-center justify-center">
                1
              </button>
              <button disabled className="px-3 py-1.5 rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#f1f5f9]/70 rounded-xl p-4 border border-gray-200/60 flex items-start gap-3">
          <span className="material-symbols-outlined text-gray-500 text-lg shrink-0 mt-0.5">
            info
          </span>
          <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-800">Informasi Penyimpanan Data:</strong> Riwayat transaksi peminjaman sarana dan prasarana kampus disimpan selama masa studi aktif mahasiswa. Bukti pengembalian resmi dapat diunduh melalui rincian tiap transaksi.
          </p>
        </div>

      </div>
    </div>
  );
}