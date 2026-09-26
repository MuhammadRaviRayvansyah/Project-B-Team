"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPeminjaman, getBarang, getUsers, api } from "@/lib/api";
import StatusBadge from "../../components/StatusBadge";

export default function DetailKelolaPeminjamanPage() {
  const params = useParams();
  const router = useRouter();
  const idPeminjaman = params?.id;

  const [peminjamanDetail, setPeminjamanDetail] = useState(null);
  const [barangDetail, setBarangDetail] = useState(null);
  const [userDetail, setUserDetail] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const fetchDataDetail = useCallback(async () => {
    if (!idPeminjaman) return;

    try {
      setIsLoading(true);
      const [pemRes, barRes, userRes] = await Promise.all([
        getPeminjaman(),
        getBarang(),
        getUsers(),
      ]);

      const extractArray = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.data)) return res.data.data;
        return [];
      };

      const rawPeminjaman = extractArray(pemRes);
      const rawBarang = extractArray(barRes);
      const rawUsers = extractArray(userRes);

      // Cari transaksi peminjaman berdasarkan ID
      const targetPeminjaman = rawPeminjaman.find(
        (p) => String(p.id_peminjaman || p.id) === String(idPeminjaman)
      );

      if (!targetPeminjaman) {
        setPeminjamanDetail(null);
        return;
      }

      setPeminjamanDetail(targetPeminjaman);
      setSelectedStatus(targetPeminjaman.status || "Menunggu");

      // Cari detail barang terkait
      const bId = targetPeminjaman.id_barang || targetPeminjaman.barang_id;
      const targetBarang = rawBarang.find(
        (b) => String(b.id_barang || b.id) === String(bId)
      );
      setBarangDetail(targetBarang || targetPeminjaman.barang || null);

      // Cari detail peminjam
      const uId = targetPeminjaman.id_user || targetPeminjaman.user_id;
      const targetUser = rawUsers.find(
        (u) => String(u.id_user || u.id) === String(uId)
      );
      setUserDetail(targetUser || null);

    } catch (error) {
      console.error("Gagal mengambil detail peminjaman:", error);
      setFeedback({
        type: "error",
        message: "Gagal memuat data detail transaksi.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [idPeminjaman]);

  useEffect(() => {
    fetchDataDetail();
  }, [fetchDataDetail]);

  // Fungsi Update Status Peminjaman
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setFeedback({ type: "", message: "" });

      await api.put(`/peminjaman/${idPeminjaman}`, {
        status: selectedStatus,
      });

      setFeedback({
        type: "success",
        message: "Status peminjaman berhasil diperbarui!",
      });

      fetchDataDetail();
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      setFeedback({
        type: "error",
        message: "Gagal memperbarui status peminjaman. Coba lagi.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          <span>Memuat detail transaksi peminjaman...</span>
        </div>
      </div>
    );
  }

  if (!peminjamanDetail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-4xl text-slate-400">
          error
        </span>
        <h2 className="text-lg font-bold text-slate-800 mt-2">
          Data Transaksi Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Transaksi peminjaman dengan ID #{idPeminjaman} tidak tersedia atau telah dihapus.
        </p>
        <Link
          href="/manajemen-peminjaman"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Kembali ke Manajemen Peminjaman
        </Link>
      </div>
    );
  }

  const barangNama =
    peminjamanDetail.nama_barang ||
    barangDetail?.nama_barang ||
    barangDetail?.nama ||
    "Barang Peminjaman";

  const barangGambar =
    peminjamanDetail.gambar ||
    barangDetail?.gambar ||
    barangDetail?.img ||
    "";

  const peminjamNama =
    peminjamanDetail.user_nama ||
    userDetail?.nama ||
    userDetail?.nama_user ||
    `Pengguna (ID: ${peminjamanDetail.id_user})`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 space-y-6">
      {/* Header & Navigasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/manajemen-peminjaman"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali ke Daftar Peminjaman
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kelola Transaksi #{idPeminjaman}
          </h1>
        </div>
        <div>
          <StatusBadge status={peminjamanDetail.status} />
        </div>
      </div>

      {feedback.message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {feedback.type === "success" ? "check_circle" : "error"}
          </span>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Detail Informasi */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Barang */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Informasi Barang & Peminjaman
            </h2>

            <div className="flex gap-4 items-start">
              {barangGambar ? (
                <img
                  src={barangGambar}
                  alt={barangNama}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-400 text-2xl">
                    inventory_2
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {barangNama}
                </h3>
                <p className="text-xs text-slate-500">
                  Jumlah:{" "}
                  <span className="font-semibold text-slate-700">
                    {peminjamanDetail.jumlah || 1} Unit
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  Total Harga:{" "}
                  <span className="font-bold text-slate-900">
                    Rp {Number(peminjamanDetail.total_harga || 0).toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Tanggal Peminjaman</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {peminjamanDetail.tanggal_peminjaman || "-"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Tanggal Pengembalian</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {peminjamanDetail.tanggal_pengembalian || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Card Peminjam */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Informasi Peminjam
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Nama Lengkap</p>
                <p className="font-bold text-slate-900 mt-0.5">{peminjamNama}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Email</p>
                <p className="font-semibold text-slate-700 mt-0.5">
                  {userDetail?.email || peminjamanDetail.email || "-"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">No. Telepon / WA</p>
                <p className="font-semibold text-slate-700 mt-0.5">
                  {userDetail?.no_hp || peminjamanDetail.no_hp || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Kelola Status */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 sticky top-6">
            <h2 className="text-sm font-bold text-slate-900">
              Ubah Status Transaksi
            </h2>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Pilih Status Baru
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                >
                  <option value="Menunggu">Menunggu Persetujuan</option>
                  <option value="Disetujui">Disetujui / Dipinjam</option>
                  <option value="Dikembalikan">Dikembalikan (Selesai)</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}