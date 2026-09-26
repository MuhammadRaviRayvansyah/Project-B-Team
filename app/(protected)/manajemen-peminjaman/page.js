"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPeminjaman, getBarang, getUsers, api } from "@/lib/api";
import StatusBadge from "../components/StatusBadge";

export default function ManajemenPeminjamanPage() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const fetchData = async () => {
    try {
      const [pemRes, barRes, userRes] = await Promise.all([
        getPeminjaman(),
        getBarang(),
        getUsers(),
      ]);

      setPeminjaman(Array.isArray(pemRes) ? pemRes.slice().reverse() : []);
      setBarangList(Array.isArray(barRes) ? barRes : []);

      const uMap = {};
      (Array.isArray(userRes) ? userRes : []).forEach((u) => {
        const id = u.id_user || u.id;
        if (id) {
          uMap[id] = {
            nama: u.nama || u.nama_user || u.name,
            email: u.email,
            no_hp: u.no_hp,
          };
        }
      });
      setUserMap(uMap);
    } catch (error) {
      console.error("Gagal memuat data peminjaman:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm(
      "Yakin ingin menghapus data peminjaman ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (!konfirmasi) return;

    try {
      await api.delete(`/peminjaman/${id}`);
      setFeedback("Data peminjaman berhasil dihapus.");
      setTimeout(() => setFeedback(""), 3000);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus data peminjaman.");
    }
  };

  const getNamaBarang = (idBarang) => {
    const barang = barangList.find(
      (b) => String(b.id_barang || b.id) === String(idBarang)
    );
    return barang ? barang.nama_barang || barang.nama : "Barang Tidak Ditemukan";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 space-y-6">
      {/* Header Halaman Konsisten */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Peminjaman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola persetujuan, peminjaman aktif, dan riwayat transaksi pengembalian pakaian.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {feedback}
        </div>
      )}

      {/* Tabel Card Standar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-xl">assignment</span>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Transaksi Peminjaman
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Total: {peminjaman.length} Pengajuan
          </span>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4 font-bold">ID Transaksi</th>
                <th className="px-5 py-4 font-bold">Informasi Barang</th>
                <th className="px-5 py-4 font-bold">Nama Peminjam</th>
                <th className="px-5 py-4 font-bold">Periode Pinjam</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                      <span>Memuat data peminjaman...</span>
                    </div>
                  </td>
                </tr>
              ) : peminjaman.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-slate-300">inbox</span>
                      <p className="font-semibold text-slate-700">Belum ada pengajuan peminjaman.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                peminjaman.map((item) => {
                  const itemId = item.id_peminjaman || item.id;
                  const peminjamNama =
                    item.user_nama ||
                    userMap[item.id_user]?.nama ||
                    `Pengguna (ID: ${item.id_user})`;
                  const peminjamEmail = userMap[item.id_user]?.email || "";

                  const statusStr = String(item.status || "").toLowerCase();
                  const isPending = statusStr === "pending" || statusStr === "menunggu persetujuan";
                  const isActive = ["disetujui", "dipinjam"].includes(statusStr);

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        #{itemId}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">
                            {item.nama_barang || getNamaBarang(item.id_barang)}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5">
                            Jumlah: {item.jumlah || 1} Unit • Total: Rp {Number(item.total_harga || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">
                            {peminjamNama}
                          </span>
                          {peminjamEmail && (
                            <span className="text-[10px] text-slate-500 mt-0.5">
                              {peminjamEmail}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col text-slate-600">
                          <span className="font-medium text-slate-900">{item.tanggal_peminjaman || "-"}</span>
                          <span className="text-[10px] text-slate-400">s.d {item.tanggal_pengembalian || "-"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/manajemen-peminjaman/${itemId}`}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                            title="Edit Data Peminjaman"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(itemId, "dipinjam")}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs transition-colors"
                                title="Setujui dan ubah ke Dipinjam"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(itemId, "ditolak")}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-xs transition-colors"
                                title="Tolak Pengajuan"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          {isActive && (
                            <button
                              onClick={() => handleUpdateStatus(itemId, "selesai")}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs transition-colors"
                              title="Tandai Selesai / Dikembalikan"
                            >
                              Selesai
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(itemId)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                            title="Hapus Data Peminjaman"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
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