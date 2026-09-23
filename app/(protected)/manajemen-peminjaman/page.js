"use client";

import { useState, useEffect } from "react";
import { getPeminjaman, getBarang, api } from "@/lib/api";
import Hero from "@/components/Hero";

export default function ManajemenPeminjamanPage() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pemRes, barRes] = await Promise.all([getPeminjaman(), getBarang()]);
      setPeminjaman(Array.isArray(pemRes) ? pemRes.slice().reverse() : []);
      setBarangList(Array.isArray(barRes) ? barRes : []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/peminjaman/${id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert("Gagal memperbarui status.");
    }
  };

  const getNamaBarang = (idBarang) => {
    const barang = barangList.find(b => String(b.id_barang || b.id) === String(idBarang));
    return barang ? (barang.nama_barang || barang.nama) : "Barang Tidak Ditemukan";
  };

  return (
    <div className="grid grid-cols-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 gap-6">
      <Hero
        category="ADMINISTRASI"
        title="Manajemen Peminjaman"
        description="Pantau, setujui, tolak, atau selesaikan transaksi penyewaan barang yang diajukan oleh pengguna."
      />

      <div className="w-full min-w-0 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between w-full">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Daftar Pengajuan Masuk</h2>
        </div>
        
        <div className="w-full overflow-x-auto block">
          <table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-4 sm:px-6 py-4 font-bold">ID Transaksi</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Informasi Barang</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Data User</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Periode Pinjam</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Memuat data...</td></tr>
              ) : peminjaman.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Belum ada pengajuan peminjaman.</td></tr>
              ) : (
                peminjaman.map((item) => (
                  <tr key={item.id_peminjaman || item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900">
                      #{item.id_peminjaman || item.id}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{getNamaBarang(item.id_barang)}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Jumlah: {item.jumlah || 1} Unit</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                      User ID: {item.id_user}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col text-slate-600">
                        <span className="font-medium">{item.tanggal_peminjaman || "-"}</span>
                        <span className="text-[10px] text-slate-400">s.d {item.tanggal_pengembalian || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide
                        ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          ['disetujui', 'dipinjam'].includes(item.status) ? 'bg-blue-100 text-blue-700' : 
                          ['selesai', 'dikembalikan'].includes(item.status) ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-rose-100 text-rose-700'}`}
                      >
                        {item.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(item.id_peminjaman || item.id, 'dipinjam')}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-[10px] sm:text-xs transition-colors"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item.id_peminjaman || item.id, 'ditolak')}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-bold text-[10px] sm:text-xs transition-colors"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        {['disetujui', 'dipinjam'].includes(item.status) && (
                          <button
                            onClick={() => handleUpdateStatus(item.id_peminjaman || item.id, 'selesai')}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-[10px] sm:text-xs transition-colors"
                          >
                            Selesai
                          </button>
                        )}
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