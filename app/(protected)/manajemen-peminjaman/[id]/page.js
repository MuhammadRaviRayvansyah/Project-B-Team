"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPeminjaman, api } from "@/lib/api";
import Hero from "@/components/Hero";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export default function EditPeminjamanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getPeminjaman();
        const dataList = Array.isArray(res) ? res : [];
        const found = dataList.find((item) => String(item.id_peminjaman || item.id) === String(id));
        if (found) setData(found);
      } catch (error) {
        setErrorMsg("Gagal mengambil data.");
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

    const formData = new FormData(e.currentTarget);
    const payload = {
      jumlah: Number(formData.get("jumlah")),
      total_harga: Number(formData.get("total_harga")),
      tanggal_peminjaman: formData.get("tanggal_peminjaman"),
      tanggal_pengembalian: formData.get("tanggal_pengembalian"),
      status: formData.get("status"),
    };

    try {
      await api.put(`/peminjaman/${id}`, payload);
      router.push("/manajemen-peminjaman");
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat menyimpan data.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-20">Memuat...</div>;

  if (!data) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Data Tidak Ditemukan</h2>
        <Link href="/manajemen-peminjaman" className="text-blue-600 hover:underline text-sm mt-4 inline-block">Kembali ke Manajemen Peminjaman</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <Hero category="ADMIN • EDIT PEMINJAMAN" title="Ubah Data Transaksi" description="Perbarui informasi tanggal, biaya, atau status peminjaman secara manual." />

      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm space-y-5 sm:space-y-6 w-full">
        {errorMsg && <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl">{errorMsg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Jumlah Unit</label>
            <input type="number" name="jumlah" required min="1" defaultValue={data.jumlah} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Total Biaya Sewa (Rp)</label>
            <input type="number" name="total_harga" required min="0" defaultValue={data.total_harga} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Tanggal Pinjam</label>
            <input type="date" name="tanggal_peminjaman" required defaultValue={formatDateForInput(data.tanggal_peminjaman)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Tanggal Kembali</label>
            <input type="date" name="tanggal_pengembalian" required defaultValue={formatDateForInput(data.tanggal_pengembalian)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Status Peminjaman</label>
          <select name="status" required defaultValue={data.status} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none">
            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Dikembalikan">Dikembalikan (Selesai)</option>
          </select>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-slate-100">
          <Link href="/manajemen-peminjaman" className="w-full sm:w-1/3 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-bold py-3.5 rounded-xl text-center">Batal</Link>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-2/3 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-sm font-bold py-3.5 rounded-xl">
            {isSubmitting ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}