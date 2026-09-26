"use client";

import { useState, useEffect } from "react";
import { getBarang, getKategori, api } from "@/lib/api";

export default function ManajemenBarangPage() {
  const [barang, setBarang] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Jika null = Tambah, Jika ada isi = Edit
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- State Form ---
  const [formData, setFormData] = useState({
    nama_barang: "",
    id_kategori: "",
    ukuran: "",
    stok: "",
    harga_sewa: "",
    gambar: "",
    deskripsi: "",
  });

  // Fetch Data Barang & Kategori
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [barRes, katRes] = await Promise.all([getBarang(), getKategori()]);
      setBarang(Array.isArray(barRes) ? barRes : []);
      setKategoriList(Array.isArray(katRes) ? katRes : []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handler Buka Modal (Tambah / Edit) ---
  const handleOpenModal = (item = null) => {
    setErrorMsg("");
    setSelectedItem(item);

    if (item) {
      // Mode Edit: Isikan data item ke form
      setFormData({
        nama_barang: item.nama_barang || item.nama || "",
        id_kategori: item.id_kategori || item.kategori_id || "",
        ukuran: item.ukuran || "",
        stok: item.stok ?? "",
        harga_sewa: item.harga_sewa || item.hargaPerHari || "",
        gambar: item.gambar || "",
        deskripsi: item.deskripsi || "",
      });
    } else {
      // Mode Tambah: Reset form ke kosong
      setFormData({
        nama_barang: "",
        id_kategori: "",
        ukuran: "",
        stok: "",
        harga_sewa: "",
        gambar: "",
        deskripsi: "",
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // --- Handler Change Input ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handler Submit Form (Tambah & Edit) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    const payload = {
      nama_barang: formData.nama_barang,
      id_kategori: Number(formData.id_kategori),
      ukuran: formData.ukuran,
      stok: Number(formData.stok),
      harga_sewa: Number(formData.harga_sewa),
      gambar: formData.gambar,
      deskripsi: formData.deskripsi,
    };

    try {
      if (selectedItem) {
        // Mode Edit: Request PUT
        const itemId = selectedItem.id_barang || selectedItem.id;
        await api.put(`/barang/${itemId}`, payload);
      } else {
        // Mode Tambah: Request POST
        await api.post("/barang", payload);
      }

      handleCloseModal();
      fetchData(); // Refresh data tabel
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Gagal menyimpan data barang. Pastikan data diisi dengan benar."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handler Hapus ---
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus barang ini secara permanen?")) return;
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
            Kelola stok inventaris, kategori, ukuran, dan harga sewa pakaian acara.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Barang</span>
        </button>
      </div>

      {/* Tabel Data Barang */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-700 text-xl">inventory_2</span>
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
                      <span className="material-symbols-outlined text-3xl text-slate-300">inventory</span>
                      <p className="font-semibold text-slate-700">Katalog masih kosong.</p>
                      <button
                        onClick={() => handleOpenModal(null)}
                        className="text-xs text-amber-600 font-bold hover:underline cursor-pointer"
                      >
                        Tambah barang pertama Anda
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                barang.map((item) => {
                  const itemId = item.id_barang || item.id;
                  const isAvailable = Number(item.stok) > 0;
                  const kategoriNama =
                    item.nama_kategori || item.kategori?.nama_kategori || item.kategori_id || "Umum";

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                          <img 
                            src={item.gambar || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"} 
                            alt={item.nama_barang || "Barang"} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500"; }}
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
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isAvailable 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {item.stok} Unit
                        </span>
                      </td>
                      <td className="px-5 py-4 font-black text-slate-900">
                        Rp {(Number(item.harga_sewa || item.hargaPerHari || 0)).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleOpenModal(item)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex cursor-pointer"
                            title="Edit Barang"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(itemId)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex cursor-pointer"
                            title="Hapus Barang"
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

      {/* ========================================== */}
      {/* MODAL COMPONENT (TAMBAH & EDIT BARANG)    */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedItem ? "Edit Barang" : "Tambah Barang Baru"}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedItem
                    ? `Perbarui detail informasi barang #${selectedItem.id_barang || selectedItem.id}`
                    : "Lengkapi data untuk menambahkan barang baru ke katalog."}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Body Form Modal */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Nama Barang
                </label>
                <input
                  type="text"
                  name="nama_barang"
                  value={formData.nama_barang}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Jas Almamater Reguler"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                    Kategori
                  </label>
                  <select
                    name="id_kategori"
                    value={formData.id_kategori}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 cursor-pointer"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                    Ukuran
                  </label>
                  <input
                    type="text"
                    name="ukuran"
                    value={formData.ukuran}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: S, M, L, XL, atau All Size"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                    Stok Tersedia
                  </label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Contoh: 10"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                    Harga Sewa (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga_sewa"
                    value={formData.harga_sewa}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Contoh: 50000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Link URL Gambar
                </label>
                <input
                  type="url"
                  name="gambar"
                  value={formData.gambar}
                  onChange={handleChange}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
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

              {/* Footer Modal */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{selectedItem ? "Simpan Perubahan" : "Tambah Barang"}</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}