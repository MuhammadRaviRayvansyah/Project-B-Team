"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPeminjaman, getUser, api } from "@/lib/api";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export default function EditPeminjamanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [borrower, setBorrower] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getPeminjaman();
        const dataList = Array.isArray(res) ? res : [];
        const found = dataList.find((item) => String(item.id_peminjaman || item.id) === String(id));
        if (found) {
          setData(found);
          if (found.id_user) {
            try {
              const u = await getUser(found.id_user);
              if (u) setBorrower(u);
            } catch (e) {}
          }
        }
      } catch (error) {
        setErrorMsg("Gagal mengambil data peminjaman.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      status: formData.get("status"),
    };

    try {
      await api.put(`/peminjaman/${id}`, payload);
      setSuccessMsg("Status peminjaman berhasil diperbarui.");
      setTimeout(() => router.push("/manajemen-peminjaman"), 1200);
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat menyimpan data.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
            <span>Memuat data transaksi...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800">Transaksi Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mt-1">Data transaksi ini tidak ditemukan pada server.</p>
          <Link
            href="/manajemen-peminjaman"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Manajemen Peminjaman
          </Link>
        </div>
      </div>
    );
  }

  const borrowerName = data.user_nama || borrower?.nama || `User #${data.id_user}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 space-y-6">
      {/* Header Halaman Konsisten */}
      <div>
        <Link
          href="/manajemen-peminjaman"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Daftar Transaksi
        </Link>
        <span className="block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider w-fit mb-2">
          Admin • Edit Transaksi
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Ubah Data Peminjaman
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Informasi transaksi hanya dapat dilihat. Silakan perbarui status peminjaman.
        </p>
      </div>

      {/* Ringkasan Informasi Peminjam & Barang */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Nama Peminjam
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{borrowerName}</p>
          <p className="text-xs text-slate-500">ID User: #{data.id_user} {borrower?.email ? `• ${borrower.email}` : ""}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Barang Dipinjam
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{data.nama_barang || `ID Barang #${data.id_barang}`}</p>
          <p className="text-xs text-slate-500">Harga Sewa: Rp {Number(data.harga_sewa || 0).toLocaleString("id-ID")} / unit</p>
        </div>
      </div>

      {/* Form Edit Konsisten — hanya Status yang dapat diubah */}
      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {successMsg}
          </div>
        )}

        {/* Informasi Hanya-Baca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Jumlah Unit
            </label>
            <input
              type="text"
              readOnly
              value={`${data.jumlah || 1} Unit`}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Total Biaya Sewa (Rp)
            </label>
            <input
              type="text"
              readOnly
              value={`Rp ${Number(data.total_harga || 0).toLocaleString("id-ID")}`}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Tanggal Pinjam
            </label>
            <input
              type="date"
              readOnly
              defaultValue={formatDateForInput(data.tanggal_peminjaman)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Tanggal Kembali
            </label>
            <input
              type="date"
              readOnly
              defaultValue={formatDateForInput(data.tanggal_pengembalian)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Status Peminjaman <span className="text-amber-600">*(dapat diubah)</span>
          </label>
          <select
            name="status"
            required
            defaultValue={data.status}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          >
            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Dipinjam">Dipinjam (Sedang Digunakan)</option>
            <option value="Dikembalikan">Dikembalikan (Selesai)</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100">
          <Link
            href="/manajemen-peminjaman"
            className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold py-3 rounded-xl text-center transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-2/3 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-60 text-xs sm:text-sm font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}