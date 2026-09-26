"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBarang, getKategori, api } from "@/lib/api";

export default function EditBarangPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [formData, setFormData] = useState({
    nama_barang: "",
    kategori_id: "",
    ukuran: "",
    stok: "",
    harga_sewa: "",
    gambar: "",
    deskripsi: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [barRes, katRes] = await Promise.all([
          getBarang(),
          getKategori(),
        ]);

        const barangList = Array.isArray(barRes) ? barRes : [];
        setKategoriList(Array.isArray(katRes) ? katRes : []);

        const barang = barangList.find(
          (item) => String(item.id_barang || item.id) === String(id)
        );

        if (!barang) {
          setErrorMsg("Barang tidak ditemukan.");
          return;
        }

        setFormData({
          nama_barang: barang.nama_barang || barang.nama || "",
          kategori_id: barang.kategori_id || barang.id_kategori || "",
          ukuran: barang.ukuran || "",
          stok: barang.stok ?? "",
          harga_sewa: barang.harga_sewa || barang.hargaPerHari || "",
          gambar: barang.gambar || "",
          deskripsi: barang.deskripsi || "",
        });
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
        setErrorMsg("Gagal memuat data barang.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setIsSaving(true);

    try {
      const payload = {
        nama_barang: formData.nama_barang,
        id_kategori: Number(formData.kategori_id),
        ukuran: formData.ukuran,
        stok: Number(formData.stok),
        harga_sewa: Number(formData.harga_sewa),
        gambar: formData.gambar,
        deskripsi: formData.deskripsi,
      };

      await api.put(`/barang/${id}`, payload);
      router.push("/manajemen-barang");
    } catch (error) {
      console.error("Gagal mengubah barang:", error);
      setErrorMsg("Gagal menyimpan perubahan barang. Periksa kembali data yang dimasukkan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
            <span>Memuat data barang...</span>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg && !formData.nama_barang) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-rose-500 text-2xl">
              error
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Barang Tidak Ditemukan</h2>
          <p className="mt-1 text-xs text-slate-500">{errorMsg}</p>
          <Link
            href="/manajemen-barang"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali ke Manajemen Barang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 space-y-6">
      {/* Header Halaman */}
      <div>
        <Link
          href="/manajemen-barang"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Daftar Barang
        </Link>
        <span className="block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider w-fit mb-2">
          Admin • Edit Barang
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Edit Barang: {formData.nama_barang}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perbarui informasi katalog, stok, dan harga sewa barang ID #{id}.
        </p>
      </div>

      {/* Form Edit */}
      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nama Barang
            </label>
            <input
              type="text"
              name="nama_barang"
              value={formData.nama_barang}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Kategori
            </label>
            <select
              name="kategori_id"
              value={formData.kategori_id}
              onChange={handleChange}
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
              value={formData.ukuran}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Stok Tersedia
            </label>
            <input
              type="number"
              name="stok"
              value={formData.stok}
              onChange={handleChange}
              min="0"
              required
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
              value={formData.harga_sewa}
              onChange={handleChange}
              min="0"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              URL Gambar
            </label>
            <input
              type="url"
              name="gambar"
              value={formData.gambar}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Deskripsi Barang
            </label>
            <textarea
              name="deskripsi"
              rows="3"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              placeholder="Kondisi barang, kelengkapan aksesoris, atau syarat khusus peminjaman..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            ></textarea>
          </div>
        </div>

        {/* Preview Gambar */}
        {formData.gambar && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 inline-flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200">
              <img
                src={formData.gambar}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500";
                }}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">Pratinjau Gambar Barang</span>
          </div>
        )}

        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100">
          <Link
            href="/manajemen-barang"
            className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold py-3 rounded-xl text-center transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-2/3 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-60 text-xs sm:text-sm font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
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