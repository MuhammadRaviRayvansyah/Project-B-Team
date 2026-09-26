"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBarang, api } from "@/lib/api";
export default function ManajemenBarangPage() {
  const [barang, setBarang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getBarang();
      setBarang(Array.isArray(res) ? res : []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus barang ini secara permanen?")) return;
    try {
      await api.delete(`/barang/${id}`);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus data barang");
    }
  };

  return (
    <div className="grid grid-cols-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 gap-6">

      <div className="w-full min-w-0 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Daftar Barang Server</h2>
          <Link 
            href="/manajemen-barang/tambah" 
            className="w-full sm:w-auto bg-[#1a2234] text-white hover:bg-slate-800 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Barang
          </Link>
        </div>

        <div className="w-full overflow-x-auto block">
          <table className="w-full text-left border-collapse min-w-[750px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-4 sm:px-6 py-4 font-bold">Gambar</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Nama Barang</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Kategori & Ukuran</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Stok</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Harga Sewa</th>
                <th className="px-4 sm:px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Memuat data...</td></tr>
              ) : barang.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Katalog kosong. Silakan tambah barang.</td></tr>
              ) : (
                barang.map((item) => (
                  <tr key={item.id_barang || item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img 
                          src={item.gambar || "/placeholder.png"} 
                          alt="Barang" 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "/placeholder.png"; }}
                        />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-800">
                      {item.nama_barang || item.nama}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">{item.nama_kategori || item.kategori_id || "Umum"}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Ukuran: {item.ukuran || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-700">
                      {item.stok} Unit
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-emerald-600">
                      Rp {(item.harga_sewa || item.hargaPerHari || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link 
                          href={`/manajemen-barang/edit/${item.id_barang || item.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                          title="Edit Barang"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id_barang || item.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                          title="Hapus Barang"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}