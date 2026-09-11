"use client"
import React, { useState } from 'react';

export default function ItemDetailCard({
  id = "BRG-0042",
  kategori = "KEBAYA",
  nama = "Kebaya Modern",
  status = "Tersedia",
  deskripsi = "Kebaya modern dengan sentuhan bordir halus berkualitas premium. Nyaman dikenakan untuk acara wisuda, yudisium, delegasi, dan upacara resmi kampus. Dilengkapi dengan kancing kait tersembunyi dan furing katun adem.",
  ukuran = "M",
  detailUkuran = "Lingkar Dada: 92 cm",
  stok = 3,
  kondisi = "Sangat Baik",
  ketentuan = "Peminjaman maksimal 5 hari kerja. Ambil barang di Loket Logistik Kemahasiswaan (Gedung Rektorat Lt. 1) dengan menunjukkan KTM aktif.",
  img = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", 
  onSubmit
}) {
  const [tanggalPakai, setTanggalPakai] = useState("");
  const [jumlahPinjam, setJumlahPinjam] = useState(1);

  const isTersedia = status === "Tersedia" && stok > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ id, tanggalPakai, jumlahPinjam });
    }
  };

  return (
    <div className="mt-20 w-full  p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: Gambar Produk */}
        <div className="md:col-span-5 relative bg-[#f1f5f9] rounded-xl overflow-hidden aspect-[4/5] flex items-center justify-center">
          {/* Badge ID Barang */}
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#575f67] text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-200">
            ID: {id}
          </span>
          <img
            src={img}
            alt={nama}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Kolom Kanan: Detail Informasi & Form */}
        <div className="md:col-span-7 flex flex-col space-y-5">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                KATEGORI: {kategori}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isTersedia ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}>
                <span className={`w-2 h-2 rounded-full ${isTersedia ? "bg-emerald-500" : "bg-red-500"}`} />
                {status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#181c20]">{nama}</h1>
          </div>

          {/* Deskripsi */}
          <div>
            <h3 className="text-sm font-semibold text-[#181c20] mb-1">Deskripsi Perlengkapan</h3>
            <p className="text-xs text-[#575f67] leading-relaxed">
              {deskripsi}
            </p>
          </div>

          {/* Kotak Spesifikasi (Ukuran, Stok, Kondisi) */}
          <div className="bg-[#f1f5f9] rounded-xl p-4 grid grid-cols-3 gap-2 text-left">
            <div>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                UKURAN
              </span>
              <p className="text-sm font-bold text-[#181c20]">{ukuran}</p>
              {detailUkuran && (
                <p className="text-[11px] text-gray-500">{detailUkuran}</p>
              )}
            </div>

            <div>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                KETERSEDIAAN STOK
              </span>
              <p className="text-sm font-bold text-[#181c20]">{stok} Unit Tersedia</p>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                KONDISI FISIK
              </span>
              <p className="text-sm font-bold text-[#181c20]">{kondisi}</p>
            </div>
          </div>

          {/* Form Pemesanan */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Input Tanggal */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rencana Tanggal Pakai
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tanggalPakai}
                    onChange={(e) => setTanggalPakai(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2f3a4a] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Select Jumlah */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Jumlah Pinjam
                </label>
                <select
                  value={jumlahPinjam}
                  onChange={(e) => setJumlahPinjam(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2f3a4a] focus:border-transparent"
                >
                  {[...Array(stok)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Unit
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Tombol Sewa */}
            <button
              type="submit"
              disabled={!isTersedia}
              className={`w-full py-3 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                isTersedia
                  ? "bg-[#2f3a4a] hover:bg-[#232b37] shadow-sm"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              Sewa Barang
            </button>
          </form>

          {/* Box Ketentuan Pengambilan */}
          <div className="bg-[#f1f5f9]/60 rounded-xl p-3.5 flex items-start gap-3 border border-gray-100">
            <span className="material-symbols-outlined text-gray-500 text-lg shrink-0 mt-0.5">
              info
            </span>
            <div className="text-[11px] text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">Ketentuan Pengambilan: </span>
              {ketentuan}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}