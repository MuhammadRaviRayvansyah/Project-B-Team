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
      console.error("Gagal memuat barang:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (
      !confirm("Apakah Anda yakin ingin menghapus barang ini secara permanen?")
    )
      return;
    try {
      await api.delete(`/barang/${id}`);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus data barang.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Barang
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola stok inventaris, kategori, ukuran, dan harga sewa pakaian
            acara.
          </p>
        </div>

        <Link
          href="/manajemen-barang/tambah"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Barang</span>
        </Link>
      </div>

      {/* Tabel Data Barang */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-xl">
              inventory_2
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Barang Tersedia
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Total: {barang.length} Barang
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4 font-bold">Gambar</th>
                <th className="px-5 py-4 font-bold">Nama Barang</th>
                <th className="px-5 py-4 font-bold">Kategori & Ukuran</th>
                <th className="px-5 py-4 font-bold">Stok</th>
                <th className="px-5 py-4 font-bold">Harga Sewa</th>
                <th className="px-5 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                      <span>Memuat data barang...</span>
                    </div>
                  </td>
                </tr>
              ) : barang.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-slate-300">
                        inventory
                      </span>
                      <p className="font-semibold text-slate-700">
                        Katalog masih kosong.
                      </p>
                      <Link
                        href="/manajemen-barang/tambah"
                        className="text-xs text-amber-600 font-bold hover:underline"
                      >
                        Tambah barang pertama Anda
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                barang.map((item) => {
                  const itemId = item.id_barang || item.id;
                  const isAvailable = Number(item.stok) > 0;
                  const kategoriNama =
                    item.nama_kategori ||
                    item.kategori?.nama_kategori ||
                    item.kategori_id ||
                    "Umum";

                  return (
                    <tr
                      key={itemId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                          <img
                            src={
                              item.gambar ||
                              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"
                            }
                            alt={item.nama_barang || "Barang"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {item.nama_barang || item.nama}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">
                            {kategoriNama}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Ukuran: {item.ukuran || "All Size"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`}
                          />
                          {item.stok} Unit
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-slate-900">
                        Rp{" "}
                        {Number(
                          item.harga_sewa || item.hargaPerHari || 0,
                        ).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/manajemen-barang/edit/${itemId}`}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                            title="Edit Barang"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </Link>
                          <button
                            onClick={() => handleDelete(itemId)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                            title="Hapus Barang"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
