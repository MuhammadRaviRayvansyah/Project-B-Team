"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
      } catch (error) {}
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
      setErrorMsg(error.message || "Gagal menyimpan data barang.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-12 px-4 sm:px-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Barang</label>
          <input type="text" name="nama_barang" required placeholder="Contoh: Jas Almamater" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
            <select name="id_kategori" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400">
              <option value="">Pilih Kategori</option>
              {kategoriList.map((kat) => (
                <option key={kat.id_kategori || kat.id} value={kat.id_kategori || kat.id}>{kat.nama_kategori || kat.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ukuran</label>
            <input type="text" name="ukuran" required placeholder="Contoh: L, XL, All Size" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Stok Unit</label>
            <input type="number" name="stok" min="0" required placeholder="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Harga Sewa (Rp)</label>
            <input type="number" name="harga_sewa" min="0" required placeholder="15000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Link URL Gambar</label>
          <input type="url" name="gambar" required placeholder="https://example.com/gambar.jpg" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Barang</label>
          <textarea name="deskripsi" rows="3" required placeholder="Deskripsi kondisi atau ketentuan peminjaman barang..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"></textarea>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-xs font-semibold py-3 rounded-xl mt-4">
          {isLoading ? "Menyimpan Data..." : "Simpan Barang ke Server"}
        </button>
      </form>
    </div>
  );
}