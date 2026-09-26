"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPeminjaman, getUser, api } from "@/lib/api";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export default function EditPeminjamanModalPage() {
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
        const found = dataList.find(
          (item) => String(item.id_peminjaman || item.id) === String(id)
        );

        if (found) {
          setData(found);
          if (found.id_user) {
            try {
              const u = await getUser(found.id_user);
              if (u) setBorrower(u);
            } catch (e) {
              console.warn("Gagal memuat detail pengguna:", e);
            }
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

  const handleClose = () => {
    router.push("/manajemen-peminjaman");
  };

  const updateStatusDirectly = async (newStatus) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await api.put(`/peminjaman/${id}`, { status: newStatus });
      setSuccessMsg(`Status berhasil diperbarui menjadi ${newStatus}.`);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat menyimpan data.");
      setIsSubmitting(false);
    }
  };

  const borrowerName =
    data?.user_nama || borrower?.nama || `User #${data?.id_user}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      {/* Container Modal */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              Kelola Peminjaman
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Detail & Persetujuan Status
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Tutup Modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                <span className="text-xs font-medium">Memuat data transaksi...</span>
              </div>
            </div>
          ) : !data ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                Data peminjaman tidak ditemukan.
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Kembali
              </button>
            </div>
          ) : (
            <>
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

              {/* Ringkasan Peminjam & Barang */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                    Peminjam
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{borrowerName}</p>
                  <p className="text-slate-500 text-[11px]">
                    ID: #{data.id_user} {borrower?.email ? `• ${borrower.email}` : ""}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                    Barang
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {data.nama_barang || `ID Barang #${data.id_barang}`}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {data.jumlah || 1} Unit • Total: Rp {Number(data.total_harga || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Informasi Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    Tanggal Pinjam
                  </label>
                  <input
                    type="date"
                    readOnly
                    defaultValue={formatDateForInput(data.tanggal_peminjaman)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    Tanggal Kembali
                  </label>
                  <input
                    type="date"
                    readOnly
                    defaultValue={formatDateForInput(data.tanggal_pengembalian)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer (Aksi Persetujuan di Paling Bawah) */}
        {data && !isLoading && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pilih Aksi Persetujuan Status
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => updateStatusDirectly("Disetujui")}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Setujui</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => updateStatusDirectly("Ditolak")}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
                <span>Tolak</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => updateStatusDirectly("Dikembalikan")}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">assignment_return</span>
                <span>Dikembalikan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}