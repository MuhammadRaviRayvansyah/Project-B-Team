"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getKategori, api } from "@/lib/api";

export default function TambahBarangPage() {
  const router = useRouter();
  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await getKategori();
        setKategoriList(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      }
    };
    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      nama_barang: formData.get("nama_barang"),
      id_kategori: Number(formData.get("id_kategori")),
      ukuran: formData.get("ukuran"),
      stok: Number(formData.get("stok")),
      harga_sewa: Number(formData.get("harga_sewa")),
      gambar: formData.get("gambar"),
      deskripsi: formData.get("deskripsi"),
    };

    try {
      await api.post("/barang", payload);
      router.push("/manajemen-barang");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || error.message || "Gagal menyimpan data barang.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 space-y-6">
      {/* Header Halaman */}
      <div>
        <Link
          href="/manajemen-barang"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Manajemen Barang
        </Link>
        <span className="block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider w-fit mb-2">
          Admin • Tambah Barang
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Tambah Barang Baru
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lengkapi formulir di bawah untuk menambahkan item pakaian atau perlengkapan ke katalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Nama Barang
          </label>
          <input
            type="text"
            name="nama_barang"
            required
            placeholder="Contoh: Jas Almamater Reguler"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Kategori
            </label>
            <select
              name="id_kategori"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 cursor-pointer"
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriList.map((kat) => (
                <option key={kat.id_kategori || kat.id} value={kat.id_kategori || kat.id}>
                  {kat.nama_kategori || kat.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Ukuran
            </label>
            <input
              type="text"
              name="ukuran"
              required
              placeholder="Contoh: S, M, L, XL, atau All Size"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Stok Tersedia
            </label>
            <input
              type="number"
              name="stok"
              min="0"
              required
              placeholder="Contoh: 10"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Harga Sewa per Transaksi / Hari (Rp)
            </label>
            <input
              type="number"
              name="harga_sewa"
              min="0"
              required
              placeholder="Contoh: 50000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Link URL Gambar
          </label>
          <input
            type="url"
            name="gambar"
            required
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Deskripsi Barang
          </label>
          <textarea
            name="deskripsi"
            rows="3"
            required
            placeholder="Kondisi barang, kelengkapan aksesoris, atau syarat khusus peminjaman..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          ></textarea>
        </div>

        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100">
          <Link
            href="/manajemen-barang"
            className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold py-3 rounded-xl text-center transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-2/3 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-60 text-xs sm:text-sm font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan Data...</span>
              </>
            ) : (
              <span>Simpan Barang ke Server</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}