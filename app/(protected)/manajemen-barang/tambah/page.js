import { getKategori, api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Hero from "@/components/Hero";

async function createBarangAction(formData) {
  "use server";
  const nama_barang = formData.get("nama_barang");
  const id_kategori = formData.get("id_kategori");
  const ukuran = formData.get("ukuran");
  const stok = formData.get("stok");
  const harga_sewa = formData.get("harga_sewa");
  const gambar = formData.get("gambar");
  const deskripsi = formData.get("deskripsi");

  try {
    await api.post("/barang", {
      nama_barang,
      id_kategori: Number(id_kategori),
      ukuran,
      stok: Number(stok),
      harga_sewa: Number(harga_sewa),
      gambar,
      deskripsi,
    });
  } catch (error) {}

  revalidatePath("/manajemen-barang");
  redirect("/manajemen-barang");
}

export default async function TambahBarangPage() {
  const kategoriList = await getKategori();

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-12">
      <Hero
        category="ADMIN • BARANG"
        title="Tambah Barang Baru"
        description="Masukkan data perlengkapan atau pakaian kampus baru ke katalog."
      />

      <form action={createBarangAction} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Barang</label>
          <input
            type="text"
            name="nama_barang"
            required
            placeholder="Contoh: Jas Almamater / Pakaian Adat"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
            <select
              name="id_kategori"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map((kat) => (
                <option key={kat.id_kategori} value={kat.id_kategori}>
                  {kat.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ukuran</label>
            <input
              type="text"
              name="ukuran"
              required
              placeholder="Contoh: L, XL, All Size"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Stok Unit</label>
            <input
              type="number"
              name="stok"
              required
              placeholder="5"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Harga Sewa (Rp)</label>
            <input
              type="number"
              name="harga_sewa"
              required
              placeholder="15000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Link URL Gambar</label>
          <input
            type="url"
            name="gambar"
            required
            placeholder="https://example.com/gambar.jpg"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Barang</label>
          <textarea
            name="deskripsi"
            rows="3"
            required
            placeholder="Deskripsi kondisi atau ketentuan peminjaman barang..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-3 rounded-xl transition-colors shadow-sm mt-4"
        >
          Simpan Barang ke Server
        </button>
      </form>
    </div>
  );
}